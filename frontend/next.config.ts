import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack to avoid lightningcss issues on Windows
  // This forces Next.js to use webpack instead of Turbopack
};

export default nextConfig;
