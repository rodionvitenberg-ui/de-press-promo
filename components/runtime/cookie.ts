/**
 * Cookie bar — exact port of the legacy `Cookie` module.
 */
export function initCookie(): () => void {
  const root = document.querySelector(".js-cookie");
  if (!root) return () => {};

  const accept = root.querySelector(".js-cookie-accept");
  const deny = root.querySelector(".js-cookie-deny");

  if (!localStorage.getItem("acceptedCookie")) {
    root.classList.add("visible");
  }

  const onAccept = () => {
    localStorage.setItem("acceptedCookie", "true");
    root.classList.remove("visible");
  };
  const onDeny = () => {
    localStorage.setItem("acceptedCookie", "false");
    root.classList.remove("visible");
  };

  accept?.addEventListener("click", onAccept);
  deny?.addEventListener("click", onDeny);

  return () => {
    accept?.removeEventListener("click", onAccept);
    deny?.removeEventListener("click", onDeny);
  };
}
