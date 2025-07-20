import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimasi untuk filesystem lambat
  experimental: {
    // Optimasi caching
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "@tabler/icons-react",
    ],
  },

  // Optimasi output
  output: "standalone",

  // Optimasi performance
  swcMinify: true,

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
