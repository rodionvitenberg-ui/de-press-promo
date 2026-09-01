/**
 * Page transitions — the same navy curtain as the menu, driven across the
 * full page load (no client router). Leave: an internal link click covers the
 * screen with the curtain (0.8s, the menu panel easing) and only then
 * navigates. Enter: the (legacy) layout inline script marks `dp-nav-in` on
 * <html> from the sessionStorage flag before first paint, so the new page
 * opens already covered; boot keeps it until the loader `completed`, holds
 * briefly, then slides the curtain out to the right.
 */

/** Curtain half-pass — the midpoint of the 1.6s menu panel pass. */
export const CURTAIN_MS = 800;
/** Hold under the cover after the loader `completed` (per the brief: 0.3s). */
export const NAV_HOLD_MS = 300;
/** Navigate just after the cover animation paints its final frame. */
const NAVIGATE_MS = CURTAIN_MS + 50;

const NAV_FLAG = "dp-nav";

/** The only runtime-less page: plain navigation, no curtain, flag dropped. */
function isStaticRoute(pathname: string): boolean {
  return /\/safety\/?$/.test(pathname);
}

/** Intercept internal navigations: cover the screen, then leave the page. */
export function initTransitions(): () => void {
  let pending = false;

  const onClick = (event: MouseEvent) => {
    if (pending || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest?.("a[href]");
    if (!(link instanceof HTMLAnchorElement)) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    if (isStaticRoute(url.pathname)) return;
    // Same-route hash links keep the native jump.
    if (
      url.pathname === location.pathname &&
      url.search === location.search &&
      url.hash
    ) {
      return;
    }

    event.preventDefault();
    pending = true;
    try {
      sessionStorage.setItem(NAV_FLAG, "1");
    } catch {
      /* storage unavailable — the next page just loads plain */
    }
    document.documentElement.classList.add("dp-nav-cover");
    window.setTimeout(() => window.location.assign(url.href), NAVIGATE_MS);
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

/**
 * Enter marker: the layout inline script (runs before first paint) consumed
 * the sessionStorage flag and set `dp-nav-in` on runtime pages only.
 */
export function isNavEnter(): boolean {
  return document.documentElement.classList.contains("dp-nav-in");
}

/**
 * Slide the cover away: after `holdMs` swap `dp-nav-in` → `dp-nav-out`
 * (the 0.8s curtain-out pass), then clean the classes. The timers go into
 * `cleanups`, so a late `destroy()` cannot leave classes behind.
 */
export function startNavExit(
  cleanups: (() => void)[],
  holdMs: number = NAV_HOLD_MS,
): void {
  const root = document.documentElement;
  const holdTimer = window.setTimeout(() => {
    root.classList.remove("dp-nav-in");
    root.classList.add("dp-nav-out");
    const doneTimer = window.setTimeout(
      () => root.classList.remove("dp-nav-out"),
      CURTAIN_MS,
    );
    cleanups.push(() => window.clearTimeout(doneTimer));
  }, holdMs);
  cleanups.push(() => {
    window.clearTimeout(holdTimer);
    root.classList.remove("dp-nav-in", "dp-nav-out");
  });
}
