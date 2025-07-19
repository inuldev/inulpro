import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "./db";
import { env } from "./env";
import { sendOTPEmail } from "./email";
import { otpRateLimiter, checkOTPRateLimit } from "./rate-limit";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql" or "sqlite",
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        try {
          await sendOTPEmail(email, otp);
          console.log("OTP email sent successfully to", email);
        } catch (error) {
          console.error("Error sending OTP email:", error);
          throw new Error("Failed to send OTP email");
        }
      },
    }),
    admin(),
  ],
});

// Helper functions for rate limiting (updated for Arcjet integration)
export function getOTPRateLimit(email: string) {
  return otpRateLimiter.getStats(email);
}

export async function checkOTPRateLimitWithRequest(
  email: string,
  request?: Request
) {
  return await checkOTPRateLimit(email, request);
}

export function resetOTPRateLimit(email: string) {
  otpRateLimiter.reset(email);
}

// Backward compatibility - sync version without Arcjet
export function checkOTPRateLimitSync(email: string) {
  // For backward compatibility, just check minimum interval
  const timeUntilNext = otpRateLimiter.getTimeUntilNextRequest(email);
  if (timeUntilNext > 0) {
    return {
      allowed: false,
      retryAfter: Math.ceil(timeUntilNext / 1000),
      message: `Tunggu ${Math.ceil(
        timeUntilNext / 1000
      )} detik sebelum meminta OTP lagi`,
    };
  }
  return { allowed: true };
}
