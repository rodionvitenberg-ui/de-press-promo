import type { Island } from "./island";

/**
 * About page table expander — exact port of the legacy `About.onExpand`:
 * one-shot `.about-table.is-expanded` + island anchor refresh.
 */
export function initTableExpand(island: Island | null): () => void {
  const button = document.querySelector(".js-table-expand");
  const table = document.querySelector(".about-table");
  if (!button || !table) return () => {};

  const onExpand = () => {
    table.classList.add("is-expanded");
    island?.onResize();
    island?.onScroll();
    button.removeEventListener("click", onExpand);
  };

  button.addEventListener("click", onExpand);
  return () => button.removeEventListener("click", onExpand);
}
