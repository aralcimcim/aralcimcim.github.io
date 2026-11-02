const { test, expect } = require("@playwright/test");

test("all portfolio pages share a dark palette under either system preference", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("lab-theme", "light"));
  let reference;
  for (const colorScheme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme });
    for (const route of [
      "./",
      "./research/",
      "./industry/",
      "./about/",
      "./projects/chemprop-diffusion/",
      "./projects/molescope/",
      "./projects/trialtrace/",
      "./projects/patho_dat/",
    ]) {
      await page.goto(route);
      const palette = await page.evaluate(() => {
        const root = getComputedStyle(document.documentElement);
        return {
          scheme: root.colorScheme,
          background: getComputedStyle(document.body).backgroundColor,
          text: getComputedStyle(document.body).color,
          tokens: ["--paper", "--surface", "--ink", "--muted", "--line", "--accent", "--accent-hover"].map((token) =>
            root.getPropertyValue(token).trim()
          ),
          accents: [...document.querySelectorAll(".work-label, .work-chip, .work-links a, .research-kicker, .research-cta")].map(
            (el) => getComputedStyle(el).color
          ),
        };
      });
      expect(palette.scheme).toBe("dark");
      const { accents, ...shared } = palette;
      if (!reference) reference = shared;
      expect(shared).toEqual(reference);
      expect([...new Set(accents)].every((color) => color === "rgb(57, 255, 20)")).toBe(true);
      await expect(page.locator("[data-theme-toggle]")).toHaveCount(0);
    }
  }
});
