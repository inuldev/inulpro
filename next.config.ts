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

  // Konfigurasi Turbopack (stable)
  turbopack: {
    // Optimasi resolving
    resolveAlias: {
      // Cache resolving untuk performa lebih baik
    },
  },

  // Optimasi output
  output: "standalone",

  // Optimasi images
  images: {
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
