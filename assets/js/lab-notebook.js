/* Small, dependency-free interactions for the portfolio. */
(() => {
  "use strict";
  const root = document.documentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const darkPreference = matchMedia("(prefers-color-scheme: dark)");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : darkPreference.matches);
  function updateThemeControl() {
    if (!themeToggle) return;
    const dark = isDark();
    themeToggle.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
    themeToggle.querySelector("[data-theme-label]").textContent = dark ? "Light" : "Dark";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#191820" : "#f7f4ee");
  }
  if (themeToggle) {
    themeToggle.hidden = false;
    themeToggle.addEventListener("click", () => {
      const choice = isDark() ? "light" : "dark";
      root.dataset.theme = choice;
      try {
        localStorage.setItem("lab-theme", choice);
      } catch {
        /* A theme also works without storage. */
      }
      updateThemeControl();
    });
    darkPreference.addEventListener("change", updateThemeControl);
    updateThemeControl();
  }

  const svgNamespace = "http://www.w3.org/2000/svg";
  const svgNode = (name, attributes = {}) => {
    const node = document.createElementNS(svgNamespace, name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    return node;
  };
  const figure = document.querySelector("[data-molecule-figure]");
  if (figure) {
    const svg = figure.querySelector("svg");
    const atomLayer = svg.querySelector(".molecule-atoms");
    const bondLayer = svg.querySelector(".molecule-bonds");
    const noiseLayer = svg.querySelector(".molecule-noise");
    const denoise = figure.querySelector("[data-denoise]");
    const pause = figure.querySelector("[data-pause]");
    const cycle = document.querySelector("[data-cycle-molecule]");
    const ring = Array.from({ length: 6 }, (_, i) => ({
      x: Math.cos((i * Math.PI) / 3) * 102,
      y: Math.sin((i * Math.PI) / 3) * 102,
      z: 0,
      element: "C",
    }));
    const ringBonds = Array.from({ length: 6 }, (_, i) => [i, (i + 1) % 6, i % 2 === 0 ? 2 : 1]);
    const molecules = [
      { name: "Benzene", atoms: ring, bonds: ringBonds },
      { name: "Pyridine", atoms: ring.map((atom, i) => ({ ...atom, element: i === 0 ? "N" : "C" })), bonds: ringBonds },
      { name: "Phenol", atoms: [...ring, { x: 172, y: 0, z: 0, element: "O" }], bonds: [...ringBonds, [0, 6, 1]] },
    ];
    const state = {
      index: 0,
      time: 0,
      noise: reducedMotion.matches ? 0 : 1,
      pinned: false,
      hovered: false,
      focused: false,
      visible: false,
      paused: reducedMotion.matches,
      pointerX: 0,
      pointerY: 0,
      frame: 0,
      last: 0,
    };
    let atomNodes = [],
      bondNodes = [],
      bounds = null;
    for (let i = 0; i < 30; i++) {
      noiseLayer.append(
        svgNode("circle", {
          cx: 42 + ((i * 127 + 49) % 396),
          cy: 38 + ((i * 83 + 17) % 268),
          r: i % 3 === 0 ? 2 : 1.1,
        })
      );
    }
    function rebuild() {
      const molecule = molecules[state.index];
      atomLayer.replaceChildren();
      bondLayer.replaceChildren();
      atomNodes = molecule.atoms.map((atom) => {
        const group = svgNode("g");
        const label = svgNode("text");
        label.textContent = atom.element;
        group.append(svgNode("circle", { r: atom.element === "C" ? 13 : 15 }), label);
        if (atom.element !== "C") group.style.color = "var(--pathology)";
        atomLayer.append(group);
        return group;
      });
      bondNodes = molecule.bonds.map(([a, b, order]) => {
        const lines = Array.from({ length: order }, () => svgNode("line"));
        bondLayer.append(...lines);
        return { a, b, lines };
      });
      figure.querySelector("[data-molecule-name]").textContent = molecule.name;
      figure.querySelector("#molecule-title").textContent = `Illustrative ${molecule.name.toLowerCase()} heavy-atom graph`;
      cycle?.setAttribute("title", `${molecule.name} · change molecule`);
      render();
    }
    function targetNoise() {
      return reducedMotion.matches || state.pinned || state.hovered || state.focused ? 0 : 1;
    }
    function render() {
      const angleY = 0.55 + Math.sin(state.time * 0.23) * 0.4 + state.pointerX * 0.2;
      const angleX = 0.3 + Math.cos(state.time * 0.19) * 0.15 + state.pointerY * 0.15;
      const angleZ = state.time * 0.12 - 0.18;
      const cy = Math.cos(angleY),
        sy = Math.sin(angleY);
      const cx = Math.cos(angleX),
        sx = Math.sin(angleX);
      const cz = Math.cos(angleZ),
        sz = Math.sin(angleZ);
      const points = molecules[state.index].atoms.map((atom, i) => {
        const x = atom.x + Math.sin(i * 2.71 + 0.4) * state.noise * 62;
        const y = atom.y + Math.cos(i * 3.19 + 0.6) * state.noise * 62;
        const z = Math.sin(i * 4.11 + 0.1) * state.noise * 42;
        const xx = x * cy + z * sy,
          zz = -x * sy + z * cy;
        const yy = y * cx - zz * sx,
          depth = y * sx + zz * cx;
        const scale = 530 / (530 + depth);
        return { x: 225 + (xx * cz - yy * sz) * scale, y: 181 + (xx * sz + yy * cz) * scale };
      });
      for (let i = 0; i < points.length; i++)
        atomNodes[i].setAttribute("transform", `translate(${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)})`);
      for (const bond of bondNodes) {
        const a = points[bond.a],
          b = points[bond.b];
        const length = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
        bond.lines.forEach((line, i) => {
          const offset = bond.lines.length === 2 ? (i === 0 ? -3 : 3) : 0;
          const ox = (-(b.y - a.y) / length) * offset,
            oy = ((b.x - a.x) / length) * offset;
          line.setAttribute("x1", (a.x + ox).toFixed(2));
          line.setAttribute("y1", (a.y + oy).toFixed(2));
          line.setAttribute("x2", (b.x + ox).toFixed(2));
          line.setAttribute("y2", (b.y + oy).toFixed(2));
        });
      }
      noiseLayer.style.opacity = (state.noise * 0.8).toFixed(2);
      bondLayer.style.opacity = (1 - state.noise * 0.48).toFixed(2);
      figure.querySelector("[data-noise-label]").textContent = `σ = ${(state.noise * 0.55).toFixed(2)}`;
    }
    function stop() {
      cancelAnimationFrame(state.frame);
      state.frame = 0;
      state.last = 0;
    }
    function start() {
      if (state.frame || !state.visible || state.paused || reducedMotion.matches || document.hidden) return;
      state.frame = requestAnimationFrame(tick);
    }
    function tick(now) {
      state.frame = 0;
      if (!state.visible || state.paused || reducedMotion.matches || document.hidden) return;
      if (!state.last || now - state.last >= 32) {
        const delta = state.last ? Math.min(0.07, (now - state.last) / 1000) : 0.032;
        state.last = now;
        state.time += delta;
        state.noise += (targetNoise() - state.noise) * Math.min(1, delta * 9);
        render();
      }
      state.frame = requestAnimationFrame(tick);
    }
    function settleWhenStatic() {
      if (state.paused || reducedMotion.matches) {
        state.noise = targetNoise();
        render();
      }
    }
    function updatePause() {
      pause.disabled = reducedMotion.matches;
      pause.textContent = reducedMotion.matches ? "Motion reduced" : state.paused ? "Resume motion" : "Pause motion";
      pause.setAttribute("aria-pressed", String(state.paused));
      root.classList.toggle("lab-paused", state.paused);
    }
    figure.addEventListener("pointerenter", () => {
      state.hovered = true;
      bounds = svg.getBoundingClientRect();
      settleWhenStatic();
    });
    figure.addEventListener("pointerleave", () => {
      state.hovered = false;
      state.pointerX = 0;
      state.pointerY = 0;
      settleWhenStatic();
    });
    figure.addEventListener(
      "pointermove",
      (event) => {
        if (reducedMotion.matches || state.paused || !bounds) return;
        state.pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
        state.pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
      },
      { passive: true }
    );
    figure.addEventListener("focusin", () => {
      state.focused = true;
      settleWhenStatic();
    });
    figure.addEventListener("focusout", (event) => {
      state.focused = figure.contains(event.relatedTarget);
      settleWhenStatic();
    });
    denoise.addEventListener("click", () => {
      state.pinned = !state.pinned;
      denoise.setAttribute("aria-pressed", String(state.pinned));
      denoise.textContent = state.pinned ? "Release structure" : "Denoise graph";
      settleWhenStatic();
    });
    pause.addEventListener("click", () => {
      state.paused = !state.paused;
      if (state.paused) stop();
      else start();
      updatePause();
    });
    cycle?.addEventListener("click", () => {
      state.index = (state.index + 1) % molecules.length;
      rebuild();
    });
    reducedMotion.addEventListener("change", () => {
      state.paused = reducedMotion.matches;
      if (state.paused) {
        stop();
        state.noise = 0;
        render();
      } else start();
      updatePause();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          state.visible = entries[0].isIntersecting;
          if (state.visible) start();
          else stop();
        },
        { threshold: 0.05 }
      ).observe(figure);
    } else {
      state.visible = true;
    }
    rebuild();
    updatePause();
    start();
    figure.querySelector("[data-molecule-controls]").hidden = false;
    if (cycle) cycle.hidden = false;
  }

  for (const word of document.querySelectorAll("[data-decode]")) {
    const overlay = word.querySelector(".decode-overlay");
    const text = word.firstElementChild.textContent;
    let decoding = false;
    const decode = () => {
      if (reducedMotion.matches || decoding) return;
      decoding = true;
      word.classList.add("is-decoding");
      const started = performance.now();
      const alphabet = "CNOPSH·";
      const step = (now) => {
        const progress = Math.min(1, (now - started) / 450);
        overlay.textContent = [...text]
          .map((character, i) =>
            character === " " || i < progress * text.length ? character : alphabet[(i + Math.floor(now / 45)) % alphabet.length]
          )
          .join("");
        if (progress < 1 && !reducedMotion.matches) requestAnimationFrame(step);
        else {
          overlay.textContent = "";
          word.classList.remove("is-decoding");
          decoding = false;
        }
      };
      requestAnimationFrame(step);
    };
    word.addEventListener("pointerenter", decode);
  }

  for (const scatter of document.querySelectorAll("[data-retrieval]")) {
    const points = [...scatter.querySelectorAll("[data-neighbour]")].map((node) => ({
      x: Number(node.getAttribute("cx")),
      y: Number(node.getAttribute("cy")),
    }));
    const marker = scatter.querySelector(".query-marker");
    const lines = [...scatter.querySelectorAll(".retrieval-links line")];
    const query = { x: 140, y: 56 };
    const update = (x, y) => {
      query.x = x;
      query.y = y;
      marker.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      const nearest = [...points].sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y)).slice(0, 3);
      lines.forEach((line, i) => {
        for (const [key, value] of Object.entries({ x1: x, y1: y, x2: nearest[i].x, y2: nearest[i].y })) line.setAttribute(key, value.toFixed(1));
      });
    };
    scatter.addEventListener(
      "pointermove",
      (event) => {
        if (reducedMotion.matches) return;
        const box = scatter.getBoundingClientRect();
        update(
          Math.max(20, Math.min(240, ((event.clientX - box.left) / box.width) * 260)),
          Math.max(16, Math.min(104, ((event.clientY - box.top) / box.height) * 120))
        );
      },
      { passive: true }
    );
    scatter.addEventListener("keydown", (event) => {
      const directions = { ArrowLeft: [-8, 0], ArrowRight: [8, 0], ArrowUp: [0, -8], ArrowDown: [0, 8] };
      if (event.key === "Home") {
        event.preventDefault();
        update(140, 56);
      } else if (directions[event.key]) {
        event.preventDefault();
        const [dx, dy] = directions[event.key];
        update(Math.max(20, Math.min(240, query.x + dx)), Math.max(16, Math.min(104, query.y + dy)));
      }
    });
    scatter.addEventListener("pointerleave", () => update(140, 56));
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
  console.info("Lab note #42: change the coordinates; keep the graph. Thanks for looking under the hood.");
})();
