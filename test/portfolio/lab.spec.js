const { test, expect } = require("@playwright/test");

const prefix = process.env.PORTFOLIO_BASE_PATH || "";
const atomPosition = (page) => page.locator(".molecule-atoms > g").first().getAttribute("transform");

async function setNoise(page, value) {
  await page.getByRole("slider", { name: "Noise level" }).fill(String(value));
}

test("portfolio stays dark under both system preferences and an old light setting", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("lab-theme", "light"));
  for (const colorScheme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme });
    for (const route of ["./", "./research/", "./industry/", "./about/"]) {
      await page.goto(route);
      expect(await page.locator("html").evaluate((el) => getComputedStyle(el).colorScheme)).toBe("dark");
      await expect(page.locator("[data-theme-toggle]")).toHaveCount(0);
    }
  }
});

test("denoising converges to a stable hexagon and can be replayed", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("[data-noise-label]")).toHaveText("Noise 0%", { timeout: 6000 });
  const clean = await atomPosition(page);
  expect(clean).toBe("translate(335.00 160.00)");
  await page.waitForTimeout(180);
  expect(await atomPosition(page)).toBe(clean);
  await page.getByRole("button", { name: "Replay denoising" }).click();
  await expect.poll(() => atomPosition(page)).not.toBe(clean);
  await expect(page.locator("[data-noise-label]")).toHaveText("Noise 0%", { timeout: 6000 });
  await expect.poll(() => atomPosition(page)).toBe(clean);
  const geometry = await page.locator(".molecule-atoms > g").evaluateAll((nodes) =>
    nodes.map((node) =>
      node
        .getAttribute("transform")
        .match(/-?[\d.]+/g)
        .map(Number)
    )
  );
  for (let i = 0; i < 6; i++) {
    const next = geometry[(i + 1) % 6];
    expect(Math.hypot(geometry[i][0] - next[0], geometry[i][1] - next[1])).toBeCloseTo(95, 1);
  }
});

test("noise slider scrubs coordinates, stops playback and supports the keyboard", async ({ page }) => {
  await page.goto("./");
  await setNoise(page, 100);
  const noisy = await atomPosition(page);
  expect(noisy).toBe("translate(386.00 96.00)");
  await page.waitForTimeout(180);
  expect(await atomPosition(page)).toBe(noisy);
  const slider = page.getByRole("slider", { name: "Noise level" });
  await slider.focus();
  await page.keyboard.press("Home");
  await expect(slider).toHaveValue("0");
  expect(await atomPosition(page)).toBe("translate(335.00 160.00)");
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveValue("1");
  await expect(slider).toHaveAttribute("aria-valuetext", "1 percent coordinate noise");
  await expect(page.locator("[data-noise-label]")).toHaveText("Noise 1%");
});

test("finite animation pauses off-screen and resumes when visible", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.goto("./");
  await setNoise(page, 100);
  await page.getByRole("button", { name: "Replay denoising" }).click();
  await page.getByRole("heading", { name: "Information Retrieval & NLP", exact: true }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const hidden = await atomPosition(page);
  await page.waitForTimeout(300);
  expect(await atomPosition(page)).toBe(hidden);
  await page.locator("[data-molecule-figure]").scrollIntoViewIfNeeded();
  await expect.poll(() => atomPosition(page)).not.toBe(hidden);
});

test("reduced motion starts static and denoises immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator("[data-noise-label]")).toHaveText("Noise 0%");
  const clean = await atomPosition(page);
  await page.waitForTimeout(180);
  expect(await atomPosition(page)).toBe(clean);
  await setNoise(page, 70);
  expect(await atomPosition(page)).not.toBe(clean);
  await page.getByRole("button", { name: "Replay denoising" }).click();
  expect(await atomPosition(page)).toBe(clean);
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
