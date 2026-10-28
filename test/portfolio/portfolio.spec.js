const { test, expect } = require("@playwright/test");
const path = require("node:path");
const prefix = process.env.PORTFOLIO_BASE_PATH || "";

for (const width of [375, 768, 1024, 1440]) {
  for (const route of ["", "research/", "industry/", "about/"]) {
    test(`${route || "home"} at ${width}px: layout, assets, headings and console`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      const errors = [];
      const broken = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("response", (response) => {
        if (response.url().startsWith("http://127.0.0.1:4188") && response.status() >= 400) broken.push(response.url());
      });
      await page.goto(route ? `./${route}` : "./");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toHaveCount(1);
      for (const image of await page.locator("[role=main] img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveJSProperty("complete", true);
        expect(await image.evaluate((img) => img.naturalWidth)).toBeGreaterThan(0);
        expect(await image.getAttribute("alt")).toBeTruthy();
      }
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
      expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
      const headings = await page
        .locator("[role=main] h1,[role=main] h2,[role=main] h3")
        .evaluateAll((items) => items.map((item) => Number(item.tagName.slice(1))));
      headings.forEach((level, i) => {
        if (i) expect(level - headings[i - 1]).toBeLessThanOrEqual(1);
      });
      expect(errors).toEqual([]);
      expect(broken).toEqual([]);
      await page.screenshot({
        path: path.join("output/playwright", `${prefix ? "prefix-" : ""}${route.replace("/", "") || "home"}-${width}.png`),
        fullPage: true,
      });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: path.join("output/playwright", `${prefix ? "prefix-" : ""}${route.replace("/", "") || "home"}-${width}-viewport.png`),
      });
    });
  }
}

test("mobile menu opens, closes with Escape and returns keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto("./");
  const toggle = page.getByRole("button", { name: "Toggle navigation" });
  const menu = page.locator("#portfolio-menu");
  await expect(menu).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await menu.getByRole("link", { name: "Research", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeHidden();
  await toggle.click();
  await menu.getByRole("link", { name: "Research", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/research/$`));
  await expect(page.getByRole("heading", { name: "Reproduced Papers", exact: true, level: 1 })).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(menu.getByRole("link", { name: "Research", exact: true })).toHaveAttribute("aria-current", "page");
  await toggle.click();
  await expect(menu).toBeHidden();
  await toggle.click();
  await menu.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/about/$`));
  await expect(page.getByRole("heading", { name: "About", exact: true })).toBeVisible();
  await toggle.click();
  await expect(menu.getByRole("link", { name: "About", exact: true })).toHaveAttribute("aria-current", "page");
  await toggle.click();
  await expect(menu).toBeHidden();
});

test("skip link and selected work CTA lead to real targets", async ({ page }) => {
  await page.goto("./");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await page.getByRole("link", { name: "View selected work" }).click();
  await expect(page).toHaveURL(/#selected-work$/);
  await expect(page.locator(".home-work .work-row")).toHaveCount(4);
  await expect(page.locator(".hero-secondary").getByRole("link", { name: "View CV (PDF)" })).toHaveAttribute("href", `${prefix}/profile/vita_en.pdf`);
});

test("project routes, images and local downloads remain available", async ({ page, request }) => {
  for (const route of ["projects/chemprop-diffusion/", "projects/moleculizer/", "projects/ragz/"]) {
    const response = await page.goto(`./${route}`);
    expect(response.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  }
  for (const url of [
    "assets/pdf/example_pdf.pdf",
    "assets/img/projects/moleculizer.png",
    "assets/img/projects/ragz-canvas.png",
    "profile/vita_en.pdf",
  ]) {
    expect((await request.get(`./${url}`)).status()).toBe(200);
  }
});

test("mobile navigation remains available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 850 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4188${prefix}/`);
  await expect(page.locator("#portfolio-menu")).toBeVisible();
  await page.locator("#portfolio-menu").getByRole("link", { name: "Software", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Software");
  await context.close();
});

test("text contrast and reduced motion across the main pages", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["./", "./research/", "./industry/", "./about/"]) {
    await page.goto(route);
    const failures = await page.evaluate(() => {
      const rgb = (value) => (value.match(/[\d.]+/g) || []).map(Number);
      const luminance = (color) =>
        color
          .slice(0, 3)
          .map((n) => {
            const c = n / 255;
            return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          })
          .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
      return Array.from(document.querySelectorAll("p,span,a,h1,h2,h3,button"))
        .filter((el) => el.getClientRects().length && Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()))
        .flatMap((el) => {
          const style = getComputedStyle(el);
          let parent = el;
          let backgrounds;
          while (parent) {
            const surface = getComputedStyle(parent);
            // Check every stop of the page gradient, including its darkest green.
            const stops = (surface.backgroundImage.match(/rgba?\([^)]*\)/g) || []).map(rgb);
            if (stops.length) {
              backgrounds = stops;
              break;
            }
            const color = rgb(surface.backgroundColor);
            if (color.length === 3 || color[3] === 1) {
              backgrounds = [color];
              break;
            }
            parent = parent.parentElement;
          }
          if (!backgrounds) backgrounds = [[255, 255, 255]];
          const a = luminance(rgb(style.color));
          const ratio = Math.min(
            ...backgrounds.map((color) => {
              const b = luminance(color);
              return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
            })
          );
          const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && parseInt(style.fontWeight) >= 700);
          return ratio >= (large ? 3 : 4.5) ? [] : [{ text: el.textContent.trim().slice(0, 60), ratio }];
        });
    });
    expect(failures).toEqual([]);
    expect(await page.locator(".portfolio-brand").evaluate((el) => getComputedStyle(el).transitionDuration)).toBe("0s");
  }
});

test("local calls to action and their fragment targets exist", async ({ page, request }) => {
  for (const route of ["./", "./research/", "./industry/", "./about/"]) {
    await page.goto(route);
    const links = await page.locator("a[href]").evaluateAll((items) => [...new Set(items.map((item) => item.href))]);
    for (const href of links.filter((url) => url.startsWith("http://127.0.0.1:4188"))) {
      const url = new URL(href);
      const response = await request.get(url.pathname);
      expect(response.status(), href).toBe(200);
      if (url.hash) expect(await response.text(), href).toContain(`id="${url.hash.slice(1)}"`);
    }
  }
});
