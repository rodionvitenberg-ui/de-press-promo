/**
 * Header scroll behavior — port of the legacy `Header` module:
 * sticky + hide/show on scroll direction, forced sticky while the menu is open.
 */
export function initHeader(isMenuOpen: () => boolean): () => void {
  const header = document.querySelector<HTMLElement>(".site-header");
  if (!header) return () => {};

  let previous: number | undefined;

  const onScroll = () => {
    const scrollTop = window.pageYOffset;
    const headerHeight = header.offsetHeight;

    if (isMenuOpen()) {
      document.body.classList.add("header-sticky");
      document.body.classList.remove("header-is-hidden");
      // Legacy early-returns here WITHOUT saving previousScrollTop.
      return;
    }

    if (scrollTop >= headerHeight) {
      document.body.classList.add("header-sticky");
      // Legacy previousScrollTop starts undefined: the first scroll event
      // compares against undefined → no direction, sticky only.
      if (previous !== undefined && scrollTop < previous) {
        document.body.classList.remove("header-is-hidden");
      } else if (previous !== undefined && scrollTop > previous) {
        document.body.classList.add("header-is-hidden");
      }
    } else {
      document.body.classList.remove("header-is-hidden");
      document.body.classList.remove("header-sticky");
    }

    previous = scrollTop;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
