// Optimized rate limiting using Arcjet + custom OTP logic
// Arcjet handles general rate limiting, custom logic for OTP-specific features

import arcjet, { slidingWindow, type ArcjetDecision } from "@arcjet/next";
import { env } from "./env";

interface OTPEntry {
  lastRequest: number;
  attempts: number;
}

// Arcjet instance for OTP rate limiting
const otpArcjet = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["email"],
  rules: [
    slidingWindow({
      mode: "LIVE",
      interval: "15m", // 15 minutes window
      max: 5, // Max 5 OTP requests per window
    }),
  ],
});

class OptimizedRateLimiter {
  private otpStore = new Map<string, OTPEntry>();
  private readonly minInterval: number; // Minimum time between requests

  constructor(minInterval = 60 * 1000) {
    // 1 minute between requests
    this.minInterval = minInterval;

    // Cleanup expired entries every 10 minutes (less frequent)
    setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  // Check if request is allowed using Arcjet + custom logic
  async isAllowed(
    email: string,
    request?: Request
  ): Promise<{
    allowed: boolean;
    retryAfter?: number;
    message?: string;
    arcjetDecision?: ArcjetDecision;
  }> {
    const now = Date.now();

    // First check Arcjet rate limiting
    if (request) {
      const decision = await otpArcjet.protect(request, { email });

      if (decision.isDenied()) {
        return {
          allowed: false,
          retryAfter: 900, // 15 minutes in seconds
          message: "Terlalu banyak permintaan OTP. Coba lagi dalam 15 menit",
          arcjetDecision: decision,
        };
      }
    }

    // Then check minimum interval (custom logic)
    const entry = this.otpStore.get(email);

    if (entry) {
      const timeSinceLastRequest = now - entry.lastRequest;
      if (timeSinceLastRequest < this.minInterval) {
        const retryAfter = Math.ceil(
          (this.minInterval - timeSinceLastRequest) / 1000
        );
        return {
          allowed: false,
          retryAfter,
          message: `Tunggu ${retryAfter} detik sebelum meminta OTP lagi`,
        };
      }
    }

    // Update entry
    this.otpStore.set(email, {
      lastRequest: now,
      attempts: (entry?.attempts || 0) + 1,
    });

    return { allowed: true };
  }

  // Get remaining attempts (simplified for OTP)
  getRemainingAttempts(email: string): number {
    const entry = this.otpStore.get(email);
    if (!entry) {
      return 5; // Max attempts from Arcjet config
    }
    return Math.max(0, 5 - entry.attempts);
  }

  // Get time until next allowed request
  getTimeUntilNextRequest(email: string): number {
    const entry = this.otpStore.get(email);
    if (!entry) {
      return 0;
    }
    const timeSinceLastRequest = Date.now() - entry.lastRequest;
    return Math.max(0, this.minInterval - timeSinceLastRequest);
  }

  // Cleanup expired entries (simplified)
  private cleanup() {
    const now = Date.now();
    const maxAge = 15 * 60 * 1000; // 15 minutes

    for (const [key, entry] of this.otpStore.entries()) {
      if (now - entry.lastRequest > maxAge) {
        this.otpStore.delete(key);
      }
    }
  }

  // Reset rate limit for specific email (useful for testing)
  reset(email: string) {
    this.otpStore.delete(email);
  }

  // Get current stats for email
  getStats(email: string) {
    const entry = this.otpStore.get(email);
    if (!entry) {
      return {
        attempts: 0,
        remaining: 5,
        lastRequest: null,
        nextAllowedRequest: null,
      };
    }

    const nextAllowedTime = entry.lastRequest + this.minInterval;
    const now = Date.now();

    return {
      attempts: entry.attempts,
      remaining: Math.max(0, 5 - entry.attempts),
      lastRequest: new Date(entry.lastRequest),
      nextAllowedRequest:
        now < nextAllowedTime ? new Date(nextAllowedTime) : null,
    };
  }
}

// Export singleton instance
export const otpRateLimiter = new OptimizedRateLimiter();

// Export Arcjet instance for external use
export { otpArcjet };

// Helper function to create rate limit key (kept for backward compatibility)
export function createRateLimitKey(
  email: string,
  type: "otp" | "login" = "otp"
): string {
  return `${type}:${email.toLowerCase()}`;
}

// New helper function for Arcjet-based rate limiting
export async function checkOTPRateLimit(
  email: string,
  request?: Request
): Promise<{
  allowed: boolean;
  retryAfter?: number;
  message?: string;
}> {
  return await otpRateLimiter.isAllowed(email, request);
}
