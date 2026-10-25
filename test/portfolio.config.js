const path = require("node:path");
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: path.join(__dirname, "portfolio"),
  fullyParallel: true,
  workers: 2,
  timeout: 30000,
  use: {
    baseURL: `http://127.0.0.1:4188${process.env.PORTFOLIO_BASE_PATH || ""}/`,
    browserName: "chromium",
    launchOptions: { executablePath: process.env.PORTFOLIO_BROWSER_PATH || undefined },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node test/portfolio/serve.cjs",
    cwd: path.resolve(__dirname, ".."),
    url: `http://127.0.0.1:4188${process.env.PORTFOLIO_BASE_PATH || ""}/`,
    reuseExistingServer: false,
    timeout: 10000,
  },
});
