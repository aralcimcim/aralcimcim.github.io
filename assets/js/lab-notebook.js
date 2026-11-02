(() => {
  "use strict";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const figure = document.querySelector("[data-molecule-figure]");

  if (figure) {
    const atoms = [...figure.querySelectorAll(".molecule-atoms > g")];
    const bonds = figure.querySelector(".molecule-bonds");
    const reference = figure.querySelector(".molecule-reference");
    const slider = figure.querySelector("[data-noise-input]");
    const label = figure.querySelector("[data-noise-label]");
    const replay = figure.querySelector("[data-denoise]");
    // One fixed perturbation makes the before/after coordinates comparable.
    const offsets = [
      [51, -64],
      [88, -31],
      [-61, 39],
      [-68, -37],
      [29, -44],
      [-39, 60],
    ];
    const targets = atoms.map((_, i) => {
      const angle = (i * Math.PI) / 3;
      return [240 + 95 * Math.cos(angle), 160 + 95 * Math.sin(angle)];
    });
    let noise = 0;
    let frame = 0;
    let last = 0;
    let visible = false;
    let running = !reducedMotion.matches;
    let elapsed = 0;
    let startNoise = 1;
    const duration = 2600;

    function render(value) {
      noise = value;
      const positions = targets.map(([x, y], i) => [x + offsets[i][0] * noise, y + offsets[i][1] * noise]);
      atoms.forEach((atom, i) => atom.setAttribute("transform", `translate(${positions[i][0].toFixed(2)} ${positions[i][1].toFixed(2)})`));
      const paths = [`M${positions.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}Z`];
      for (const i of [0, 2, 4]) {
        const a = positions[i];
        const b = positions[(i + 1) % 6];
        // Inset alternating bonds toward the ring centre.
        const inset = ([x, y]) => [240 + (x - 240) * 0.83, 160 + (y - 160) * 0.83];
        paths.push(`M${inset(a).join(" ")}L${inset(b).join(" ")}`);
      }
      bonds.children[0].setAttribute("d", paths[0]);
      bonds.children[1].setAttribute("d", paths.slice(1).join(""));
      bonds.setAttribute("opacity", (1 - noise * 0.85).toFixed(3));
      reference.setAttribute("opacity", (noise * 0.3).toFixed(3));
      slider.value = String(Math.round(noise * 100));
      slider.setAttribute("aria-valuetext", `${Math.round(noise * 100)} percent coordinate noise`);
      label.textContent = `Noise ${Math.round(noise * 100)}%`;
    }

    function stopFrame() {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    }
    function tick(now) {
      frame = 0;
      if (!running || !visible || document.hidden) return;
      if (last) elapsed += Math.min(now - last, 64);
      last = now;
      const progress = Math.min(1, elapsed / duration);
      // A smooth finite transition: no perpetual rotation or random jitter.
      const smooth = progress * progress * (3 - 2 * progress);
      render(startNoise * (1 - smooth));
      if (progress === 1) {
        running = false;
        last = 0;
      } else schedule();
    }
    function schedule() {
      if (running && visible && !document.hidden && !frame) frame = requestAnimationFrame(tick);
    }
    function denoise() {
      stopFrame();
      startNoise = noise > 0.01 ? noise : 1;
      elapsed = 0;
      running = !reducedMotion.matches;
      render(running ? startNoise : 0);
      schedule();
    }
    replay.addEventListener("click", denoise);
    slider.addEventListener("input", () => {
      running = false;
      stopFrame();
      render(Number(slider.value) / 100);
    });
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
        else stopFrame();
      },
      { threshold: 0.15 }
    ).observe(figure);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopFrame();
      else schedule();
    });
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) {
        running = false;
        stopFrame();
        render(0);
      }
    });
    render(running ? 1 : 0);
    figure.querySelector("[data-molecule-controls]").hidden = false;
  }

  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    for (const card of document.querySelectorAll("[data-tilt]")) {
      card.addEventListener(
        "pointermove",
        (event) => {
          if (reducedMotion.matches) return;
          const box = card.getBoundingClientRect();
          card.style.setProperty("--tilt-x", `${((0.5 - (event.clientY - box.top) / box.height) * 1.3).toFixed(2)}deg`);
          card.style.setProperty("--tilt-y", `${(((event.clientX - box.left) / box.width - 0.5) * 1.3).toFixed(2)}deg`);
        },
        { passive: true }
      );
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    }
  }
})();
