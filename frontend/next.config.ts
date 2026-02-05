import type { NextConfig } from "next";

// Next.js configuration
const nextConfig: NextConfig = {
  // Disable experimental Turbopack
  experimental: {
    // Alternative way to disable Turbopack if needed
    // turbo: false,
  },
};

export default nextConfig;
