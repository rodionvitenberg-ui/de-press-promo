/**
 * Contact typewriter — port of the legacy bundled typed.js usage:
 * `.js-sentences` holds a JSON array of strings, `.js-typed` gets them typed
 * character by character with a blinking `span.typed-cursor` after it.
 */
export function initTyped(): () => void {
  const target = document.querySelector(".js-typed");
  const source = document.querySelector(".js-sentences");
  if (!target || !source) return () => {};

  let sentences: string[] = [];
  try {
    const parsed: unknown = JSON.parse(source.textContent ?? "[]");
    if (Array.isArray(parsed)) {
      sentences = parsed.filter((s): s is string => typeof s === "string");
    }
  } catch {
    sentences = [];
  }
  if (sentences.length === 0) return () => {};

  const cursor = document.createElement("span");
  cursor.className = "typed-cursor typed-cursor--blink";
  cursor.setAttribute("aria-hidden", "true");
  cursor.textContent = "|";
  target.appendChild(cursor);

  const TYPE_SPEED_MS = 40;
  const BACK_SPEED_MS = 25;
  const BACK_DELAY_MS = 1800;
  const START_DELAY_MS = 500;

  let sentence = 0;
  let length = 0;
  let deleting = false;
  let timer: number | undefined;
  let cancelled = false;

  const render = () => {
    const textNode = target.firstChild;
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      textNode.textContent = sentences[sentence].slice(0, length);
    } else {
      target.insertBefore(
        document.createTextNode(sentences[sentence].slice(0, length)),
        cursor,
      );
    }
  };

  const step = () => {
    if (cancelled) return;
    const text = sentences[sentence];
    if (!deleting) {
      length += 1;
      render();
      if (length >= text.length) {
        deleting = true;
        timer = window.setTimeout(step, BACK_DELAY_MS);
        return;
      }
      timer = window.setTimeout(step, TYPE_SPEED_MS);
    } else {
      length -= 1;
      render();
      if (length <= 0) {
        deleting = false;
        sentence = (sentence + 1) % sentences.length;
        timer = window.setTimeout(step, TYPE_SPEED_MS * 8);
        return;
      }
      timer = window.setTimeout(step, BACK_SPEED_MS);
    }
  };

  timer = window.setTimeout(step, START_DELAY_MS);

  return () => {
    cancelled = true;
    if (timer) window.clearTimeout(timer);
    cursor.remove();
  };
}
