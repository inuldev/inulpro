import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    AUTH_GITHUB_CLIENT_ID: z.string().min(1),
    AUTH_GITHUB_SECRET: z.string().min(1),
    ARCJET_KEY: z.string().min(1),
    // Email server configuration
    EMAIL_SERVER_HOST: z.string().min(1),
    EMAIL_SERVER_PORT: z.string().default("465"),
    EMAIL_SERVER_USER: z.string().email(),
    EMAIL_SERVER_PASSWORD: z.string().min(1),
  },

  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {},
});
