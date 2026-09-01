import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Own runtime is StrictMode-safe (RuntimeBoot destroys late boot handles);
  // dev double-mount exercises the destroy path on every boot.
  reactStrictMode: true,
  // Match origin URLs: /about/, /values/, …
  trailingSlash: true,
  // Hide the dev-mode indicator ("N" circle, bottom-left): it collided with
  // the cookie banner buttons and looked like page chrome. Dev-only option.
  devIndicators: false,
};

export default nextConfig;
