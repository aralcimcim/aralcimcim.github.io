/* Send only a homepage-view event. Telegram credentials live on the server. */
(() => {
  "use strict";

  if (window.portfolioVisitNotifierLoaded || !["/", "/index.html"].includes(window.location.pathname)) return;
  const configured = document.currentScript?.dataset.endpoint;
  if (!configured) return;
  let endpoint;
  try {
    endpoint = new URL(configured);
    if (endpoint.protocol !== "https:") return;
  } catch {
    return;
  }

  window.portfolioVisitNotifierLoaded = true;
  const notify = () => {
    fetch(endpoint.href, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "page_view", path: "/" }),
    }).catch(() => {});
  };
  notify();
  // Returning through browser history is another visit; initial pageshow is not.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) notify();
  });
})();
