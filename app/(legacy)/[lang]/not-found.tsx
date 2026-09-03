import NotFoundClient from "@/components/pages/not-found-client";

/**
 * Locale-aware 404 boundary for notFound() thrown inside [lang] routes (bad
 * locale: /ru/…, /xyz/…). Renders inside the (legacy) group layout — the
 * legacy shell (styles, curtain, boot script) comes from the layout above, so
 * only the page content is needed here. The requested URL's locale segment is
 * resolved by the client wrapper (components/pages/not-found-client.tsx).
 */
export default function NotFound() {
  return <NotFoundClient />;
}
