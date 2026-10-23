/* A brief, non-interactive celebration on homepage entry. */
(() => {
  "use strict";
  if (window.homeConfettiLoaded || !["/", "/index.html"].includes(window.location.pathname)) return;
  window.homeConfettiLoaded = true;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let stop = () => {};

  const celebrate = () => {
    stop();
    if (reducedMotion.matches || document.hidden) return;
    const canvas = document.createElement("canvas");
    canvas.id = "home-confetti";
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "9999",
    });
    document.body.append(canvas);
    const context = canvas.getContext("2d");
    if (!context) {
      canvas.remove();
      return;
    }

    let width, height, frame;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    const colors = ["#b5472b", "#e6ac39", "#477d9c", "#a46392", "#dc7653"];
    const particles = Array.from({ length: width < 600 ? 75 : 140 }, () => ({
      x: Math.random() * width,
      y: -Math.random() * height * 0.4,
      vx: (Math.random() - 0.5) * 150,
      vy: 140 + Math.random() * 170,
      size: 5 + Math.random() * 6,
      angle: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    const start = performance.now();
    let previous = start;
    const draw = (now) => {
      const elapsed = now - start;
      if (elapsed >= 3000) {
        stop();
        return;
      }
      const delta = Math.min((now - previous) / 1000, 0.04);
      previous = now;
      context.clearRect(0, 0, width, height);
      context.globalAlpha = Math.min(1, (3000 - elapsed) / 800);
      for (const piece of particles) {
        piece.x += piece.vx * delta;
        piece.y += piece.vy * delta;
        piece.vy += 210 * delta;
        piece.angle += piece.spin * delta;
        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.angle);
        context.fillStyle = piece.color;
        context.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.6);
        context.restore();
      }
      frame = requestAnimationFrame(draw);
    };
    stop = () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.remove();
    };
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);
  };

  celebrate();
  window.addEventListener("pagehide", () => stop());
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) celebrate();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) stop();
  });
})();
