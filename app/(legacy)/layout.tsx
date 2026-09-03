import type { ReactNode } from "react";

import { LegacyShell } from "../legacy-shell";

/**
 * Legacy runtime shell (styles, page curtain, boot-state script) — the markup
 * itself lives in app/legacy-shell.tsx so the root 404 (app/not-found.tsx,
 * outside this group) can share it.
 */
export default function LegacyLayout({ children }: { children: ReactNode }) {
  return <LegacyShell>{children}</LegacyShell>;
}
