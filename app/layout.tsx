import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "de-press.co — a quiet harbor",
    template: "%s — de-press.co",
  },
  description:
    "A non-commercial, empathic platform for emotional support. Silence instead of likes, stories instead of feeds, control stays with the author.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

/**
 * Root layout: minimal shell.
 * Legacy CSS is loaded only in app/(legacy)/layout.tsx.
 * <html lang> and the metadata default to the fallback locale (en) — real
 * pages sync the active locale through RuntimeBoot and per-route metadata.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
