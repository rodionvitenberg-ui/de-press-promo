import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "promo-depress — Dogstudio study lab",
    template: "%s",
  },
  description:
    "Local study clone of dogstudio.co + Next.js lab for reverse-engineering.",
  icons: {
    icon: "/app/themes/portfolio-2018/static/assets/images/favicon.png",
  },
};

/**
 * Root layout: minimal shell.
 * Legacy CSS is loaded only in app/(legacy)/layout.tsx
 * so /lab stays a clean Next environment.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
