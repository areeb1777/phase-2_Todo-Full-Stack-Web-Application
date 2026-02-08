import type { NextConfig } from "next";

// Next.js configuration
const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  // Disable experimental Turbopack
  experimental: {
    // Alternative way to disable Turbopack if needed
    // turbo: false,
  },
};

export default nextConfig;
