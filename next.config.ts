import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimasi caching
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "@tabler/icons-react",
    ],
  },

  // Optimasi images
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        port: "",
        protocol: "https",
        hostname: "inulpro.fly.storage.tigris.dev",
      },
    ],
  },
};

export default nextConfig;
