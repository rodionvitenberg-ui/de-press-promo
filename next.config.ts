import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Large static 3D assets live under public/
  // Avoid interfering with original client runtime paths
  reactStrictMode: false,
  // Match origin URLs: /about/, /values/, …
  trailingSlash: true,
  // Hide the dev-mode indicator ("N" circle, bottom-left): it collided with
  // the cookie banner buttons and looked like page chrome. Dev-only option.
  devIndicators: false,
};

export default nextConfig;
