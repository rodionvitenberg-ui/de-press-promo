import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Large static 3D assets live under public/
  // Avoid interfering with original client runtime paths
  reactStrictMode: false,
  // Match origin URLs: /studio/, /careers/, …
  trailingSlash: true,
};

export default nextConfig;
