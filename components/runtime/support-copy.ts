/**
 * Support gateways — per-plate interaction: one-click copy of the wallet
 * address and the QR reveal. The full address lives in the DOM as
 * `data-address` on each plate (`.support-wallet`), so the runtime never
 * duplicates it and the clipboard always gets the untruncated string while
 * the plate shows the compact 4+4 form. Clicking the address line copies
 * too; the copy label flips to the localized `data-copied` text for ~2s.
 * Native clipboard API with the legacy textarea fallback (for non-secure
 * previews).
 */

const COPIED_RESET_MS = 2000;

export function initSupportCopy(): () => void {
  const wallets = Array.from(
    document.querySelectorAll<HTMLElement>(".support-wallet"),
  );
  const cleanups: (() => void)[] = [];

  const fallbackCopy = (text: string): boolean => {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  };

  const copyAddress = (address: string, flash: () => void): void => {
    if (!address) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(address)
        .then(flash)
        .catch(() => {
          if (fallbackCopy(address)) flash();
        });
    } else if (fallbackCopy(address)) {
      flash();
    }
  };

  for (const wallet of wallets) {
    const address = wallet.dataset.address?.trim() ?? "";

    // Copy: the button and the (shortened) address line itself.
    const copyButton = wallet.querySelector<HTMLButtonElement>(
      ".js-support-copy",
    );
    const label = copyButton?.querySelector(".support-wallet-copy-label");
    const idle = label?.textContent ?? "";
    const copied = copyButton?.dataset.copied ?? "";
    let timer: number | undefined;

    const flash = () => {
      if (!copyButton) return;
      copyButton.classList.add("is-copied");
      if (label && copied) label.textContent = copied;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        copyButton.classList.remove("is-copied");
        if (label) label.textContent = idle;
      }, COPIED_RESET_MS);
    };

    const onCopy = () => copyAddress(address, flash);
    copyButton?.addEventListener("click", onCopy);
    const addressLine = wallet.querySelector(".support-wallet-address");
    addressLine?.addEventListener("click", onCopy);

    // QR: click toggles the scanner pop; aria-expanded stays in sync.
    const qrButton = wallet.querySelector<HTMLButtonElement>(".js-support-qr");
    const qrPop = wallet.querySelector<HTMLElement>(".support-wallet-qr-pop");
    const onQr = () => {
      if (!qrPop || !qrButton) return;
      const open = qrPop.hidden;
      qrPop.hidden = !open;
      qrButton.setAttribute("aria-expanded", String(open));
    };
    qrButton?.addEventListener("click", onQr);

    cleanups.push(() => {
      copyButton?.removeEventListener("click", onCopy);
      addressLine?.removeEventListener("click", onCopy);
      qrButton?.removeEventListener("click", onQr);
      window.clearTimeout(timer);
    });
  }

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
