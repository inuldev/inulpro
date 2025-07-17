// Simple in-memory rate limiting for OTP requests
// In production, consider using Redis or database-based solution

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastRequest: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly minInterval: number; // Minimum time between requests

  constructor(
    maxRequests = 5, // Max 5 OTP requests
    windowMs = 15 * 60 * 1000, // 15 minutes window
    minInterval = 60 * 1000 // 1 minute between requests
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.minInterval = minInterval;

    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  // Check if request is allowed
  isAllowed(identifier: string): {
    allowed: boolean;
    retryAfter?: number;
    message?: string;
  } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry) {
      // First request
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
        lastRequest: now,
      });
      return { allowed: true };
    }

    // Check if window has expired
    if (now >= entry.resetTime) {
      // Reset the window
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
        lastRequest: now,
      });
      return { allowed: true };
    }

    // Check minimum interval between requests
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

    // Check if max requests exceeded
    if (entry.count >= this.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return {
        allowed: false,
        retryAfter,
        message: `Terlalu banyak permintaan OTP. Coba lagi dalam ${Math.ceil(
          retryAfter / 60
        )} menit`,
      };
    }

    // Update entry
    entry.count++;
    entry.lastRequest = now;
    this.store.set(identifier, entry);

    return { allowed: true };
  }

  // Get remaining attempts
  getRemainingAttempts(identifier: string): number {
    const entry = this.store.get(identifier);
    if (!entry || Date.now() >= entry.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  // Get time until reset
  getTimeUntilReset(identifier: string): number {
    const entry = this.store.get(identifier);
    if (!entry || Date.now() >= entry.resetTime) {
      return 0;
    }
    return Math.max(0, entry.resetTime - Date.now());
  }

  // Cleanup expired entries
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  // Reset rate limit for specific identifier (useful for testing)
  reset(identifier: string) {
    this.store.delete(identifier);
  }

  // Get current stats for identifier
  getStats(identifier: string) {
    const entry = this.store.get(identifier);
    if (!entry) {
      return {
        requests: 0,
        remaining: this.maxRequests,
        resetTime: null,
        lastRequest: null,
      };
    }

    const now = Date.now();
    if (now >= entry.resetTime) {
      return {
        requests: 0,
        remaining: this.maxRequests,
        resetTime: null,
        lastRequest: null,
      };
    }

    return {
      requests: entry.count,
      remaining: Math.max(0, this.maxRequests - entry.count),
      resetTime: new Date(entry.resetTime),
      lastRequest: new Date(entry.lastRequest),
    };
  }
}

// Export singleton instance
export const otpRateLimiter = new RateLimiter();

// Helper function to create rate limit key
export function createRateLimitKey(
  email: string,
  type: "otp" | "login" = "otp"
): string {
  return `${type}:${email.toLowerCase()}`;
}
