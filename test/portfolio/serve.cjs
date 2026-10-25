// Serve an actual Jekyll build for the portfolio checks, never source templates.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(process.env.PORTFOLIO_SITE_DIR || "_site");
if (!fs.existsSync(root)) throw new Error("Build the Jekyll site before running test:portfolio.");
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};
http
  .createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      let filename = path.resolve(root, "." + pathname);
      if (filename !== root && !filename.startsWith(root + path.sep)) throw new Error("Invalid path");
      if (fs.statSync(filename).isDirectory()) filename = path.join(filename, "index.html");
      response.setHeader("Content-Type", types[path.extname(filename)] || "application/octet-stream");
      fs.createReadStream(filename)
        .on("error", () => response.end())
        .pipe(response);
    } catch {
      response.writeHead(404).end("Not found");
    }
  })
  .listen(4188, "127.0.0.1");
