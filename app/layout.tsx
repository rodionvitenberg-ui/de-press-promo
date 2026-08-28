import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "de-press.co — тихая гавань",
    template: "%s — de-press.co",
  },
  description:
    "Некоммерческая эмпатичная платформа для эмоциональной поддержки. Тишина вместо лайков, истории вместо лент, контроль у автора.",
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
    <html lang="ru" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
