import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "./db";
import { env } from "./env";
import { sendOTPEmail } from "./email";
import { otpRateLimiter, createRateLimitKey } from "./rate-limit";

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

// Helper functions for rate limiting
export function getOTPRateLimit(email: string) {
  const rateLimitKey = createRateLimitKey(email);
  return otpRateLimiter.getStats(rateLimitKey);
}

export function checkOTPRateLimit(email: string) {
  const rateLimitKey = createRateLimitKey(email);
  return otpRateLimiter.isAllowed(rateLimitKey);
}

export function resetOTPRateLimit(email: string) {
  const rateLimitKey = createRateLimitKey(email);
  otpRateLimiter.reset(rateLimitKey);
}
