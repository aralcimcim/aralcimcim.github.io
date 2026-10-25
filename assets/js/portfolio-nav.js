// Initialise directly after parsing; unrelated theme scripts may still be loading.
const menu = document.getElementById("portfolio-menu");
const toggle = document.querySelector('[aria-controls="portfolio-menu"]');
if (menu && toggle) {
  const close = () => {
    const restoreFocus = menu.contains(document.activeElement);
    menu.classList.remove("show");
    toggle.classList.add("collapsed");
    toggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    menu.classList.toggle("show", open);
    toggle.classList.toggle("collapsed", !open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") close();
  });
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) close();
  });
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  window.matchMedia("(min-width: 768px)").addEventListener("change", close);
  // Reveal the toggle only when it works; navigation stays visible without JS.
  document.documentElement.classList.add("portfolio-js");
}
