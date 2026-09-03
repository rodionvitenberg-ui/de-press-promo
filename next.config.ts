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
  // Serve app/global-not-found.tsx (the prerendered full-document 404) directly
  // at the routing level: without the flag unmatched URLs stream an empty error
  // shell and the 404 UI appears only after hydration.
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
