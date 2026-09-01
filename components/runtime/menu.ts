import type { Island } from "./island";

/**
 * Fullscreen menu — port of the legacy `Menu` module:
 * click → `button.is-active`, after 800ms `body.menu-open` + scene MENU_STATE;
 * close replays the same curtain pass (−100% → 0 → +100%) and drops
 * `menu-open` at mid-pass — the page is revealed as the curtain slides away.
 * Esc closes.
 */
export type MenuHandle = { destroy: () => void; isOpen: () => boolean };

const OPEN_DELAY_MS = 800;
const RUNNING_MS = 800;

/**
 * The island may still be loading when the menu boots (legacy `Menu` held a
 * singleton reference that was always valid — the accessor is the own-runtime
 * equivalent). A null island (mobile `disable_scene`) skips scene calls.
 */
export function initMenu(getIsland: () => Island | null): MenuHandle {
  const button = document.querySelector<HTMLButtonElement>(
    ".site-header-button",
  );
  if (!button) return { destroy: () => {}, isOpen: () => false };

  let running = false;
  let open = false;
  let timer: number | undefined;

  const doOpen = () => {
    if (running || open) return;
    running = true;
    document.body.classList.add("menu-running");
    button.classList.add("is-active");
    timer = window.setTimeout(() => {
      document.body.classList.add("menu-open");
      button.blur();
      getIsland()?.menu();
      open = true;
      timer = window.setTimeout(() => {
        document.body.classList.remove("menu-running");
        running = false;
      }, RUNNING_MS);
    }, OPEN_DELAY_MS);
  };

  const doClose = () => {
    if (running || !open) return;
    running = true;
    document.body.classList.add("menu-running");
    button.classList.remove("is-active");
    // The curtain replays the same left-to-right pass as on open. The menu
    // stays visible under it while it covers the screen (first half of the
    // 1.6s panel pass), then the page is revealed as the curtain slides away.
    timer = window.setTimeout(() => {
      document.body.classList.remove("menu-open");
      getIsland()?.leaveMenu();
      open = false;
      timer = window.setTimeout(() => {
        document.body.classList.remove("menu-running");
        running = false;
      }, RUNNING_MS);
    }, OPEN_DELAY_MS);
  };

  const onClick = () => (open ? doClose() : doOpen());
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") doClose();
  };

  button.addEventListener("click", onClick);
  window.addEventListener("keydown", onKey);

  return {
    isOpen: () => open,
    destroy() {
      if (timer) window.clearTimeout(timer);
      button.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    },
  };
}
