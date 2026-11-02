const { test, expect } = require("@playwright/test");

const prefix = process.env.PORTFOLIO_BASE_PATH || "";

const atomPosition = (page) => page.locator(".molecule-atoms > g").first().getAttribute("transform");

test("theme follows the system and an explicit choice persists between pages", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("./");
  const theme = page.getByRole("button", { name: "Switch to light theme" });
  await expect(theme).toBeVisible();
  expect(await page.locator("html").evaluate((el) => getComputedStyle(el).colorScheme)).toBe("dark");
  await theme.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.goto("./research/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.goto("./");
  await page.screenshot({ path: "output/playwright/lab-home-dark.png", fullPage: true });
});

test("molecule controls denoise, pause, and cycle real heavy-atom graphs", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Denoise graph", exact: true }).click();
  await expect(page.locator("[data-denoise]")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-noise-label]")).toHaveText("σ = 0.00");
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  const paused = await atomPosition(page);
  await page.waitForTimeout(160);
  expect(await atomPosition(page)).toBe(paused);
  await page.getByRole("button", { name: "Change the molecule in Figure 1" }).click();
  await expect(page.locator("[data-molecule-name]")).toHaveText("Pyridine");
  await expect(page.locator(".molecule-atoms text").filter({ hasText: /^N$/ })).toHaveCount(1);
  await page.getByRole("button", { name: "Change the molecule in Figure 1" }).click();
  await expect(page.locator("[data-molecule-name]")).toHaveText("Phenol");
  await expect(page.locator(".molecule-atoms > g")).toHaveCount(7);
  await page.getByRole("button", { name: "Change the molecule in Figure 1" }).click();
  await expect(page.locator("[data-molecule-name]")).toHaveText("Benzene");
  await expect(page.locator(".molecule-atoms > g")).toHaveCount(6);
  await page.getByRole("button", { name: "Resume motion", exact: true }).click();
  await expect.poll(() => atomPosition(page)).not.toBe(await atomPosition(page));
});

test("animation suspends when the molecular figure leaves the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 650 });
  await page.goto("./");
  await page.getByRole("heading", { name: "Now", exact: true }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const hidden = await atomPosition(page);
  await page.waitForTimeout(150);
  expect(await atomPosition(page)).toBe(hidden);
  await page.locator("[data-molecule-figure]").scrollIntoViewIfNeeded();
  await expect.poll(() => atomPosition(page)).not.toBe(hidden);
});

test("reduced motion supplies a static graph and no text scrambling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator("[data-noise-label]")).toHaveText("σ = 0.00");
  await expect(page.getByRole("button", { name: "Motion reduced" })).toBeDisabled();
  const position = await atomPosition(page);
  await page.locator("[data-decode]").hover();
  await page.waitForTimeout(160);
  expect(await atomPosition(page)).toBe(position);
  await expect(page.locator("[data-decode]")).not.toHaveClass(/is-decoding/);
});

test("retrieval illustration links the moving query to its three nearest points", async ({ page }) => {
  await page.goto("./");
  const diagram = page.locator("[data-retrieval]");
  await diagram.scrollIntoViewIfNeeded();
  const box = await diagram.boundingBox();
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.35);
  const geometry = await diagram.evaluate((svg) => {
    const [x, y] = svg
      .querySelector(".query-marker")
      .getAttribute("transform")
      .match(/[\d.]+/g)
      .map(Number);
    const points = [...svg.querySelectorAll("[data-neighbour]")].map((node) => [Number(node.getAttribute("cx")), Number(node.getAttribute("cy"))]);
    const expected = points.sort((a, b) => Math.hypot(a[0] - x, a[1] - y) - Math.hypot(b[0] - x, b[1] - y)).slice(0, 3);
    const actual = [...svg.querySelectorAll(".retrieval-links line")].map((line) => [
      Number(line.getAttribute("x2")),
      Number(line.getAttribute("y2")),
    ]);
    return { expected, actual };
  });
  expect(geometry.actual).toEqual(geometry.expected);
  await diagram.focus();
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowRight");
  await expect(diagram.locator(".query-marker")).toHaveAttribute("transform", "translate(148.0 56.0)");
});

test("static fallback and the portfolio preserve content without external script dependencies", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4188${prefix}/`);
    await expect(page.locator(".molecule-canvas")).toBeVisible();
    await expect(page.locator(".molecule-atoms circle")).toHaveCount(6);
    await expect(page.locator("[data-molecule-controls]")).toBeHidden();
    await expect(page.locator(".home-work")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("View selected work");
    await expect(page.locator("body")).not.toContainText("Reasoning-guided pathology reports");
    await expect(page.locator(".area-card")).toHaveCount(3);
  } finally {
    await context.close();
  }
  let bytes = 0;
  for (const file of ["assets/js/portfolio-nav.js", "assets/js/lab-notebook.js"]) {
    const response = await request.get(`./${file}`);
    expect(response.status()).toBe(200);
    bytes += (await response.body()).length;
  }
  expect(bytes).toBeLessThan(50000);
});
