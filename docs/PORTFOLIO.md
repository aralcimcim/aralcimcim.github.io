# Portfolio design and verification

The personal site keeps Jekyll, the pinned al-folio gems, and the existing GitHub Pages deployment. The configured `baseurl` is empty. The upstream template instructions about always using `/al-folio` do not describe this personal site's configuration.

## Source map

- `_pages/home.md`: homepage introduction and selected research. Software projects appear on the Software page.
- `_pages/about.md`: dedicated `/about/` page with biography and contact link, reached from the top navigation.
- `profile/vita_en.pdf`: the unmodified personal CV, linked beside View GitHub on the homepage. The profile photo is no longer displayed.
- `_data/socials.yml`: GitHub and the contact email verified from the supplied CV.
- `_data/selected_work.yml`: four curated projects, factual status, metadata, asset paths, and verified project/code links.
- `_includes/work-preview.liquid`: shared homepage and Software project previews.
- `_includes/header.liquid`, `_includes/footer.liquid`: shared navigation and an intentionally empty footer override.
- `_includes/head.liquid`: retains the pinned theme's integrations, loads the local stylesheet last, and applies `relative_url` to its asset links.
- `_layouts/default.liquid`: retains the theme layout, adds the skip-link target, and removes its extra top-margin utility.
- `assets/css/academic.css`: shared color, typography, width, spacing, component, and responsive styles. A green base supports a soft, static gradient of pastel pink, amber, mint, and lavender behind dark forest text. The decorative layer ignores pointer events and has no shapes or animation. Uses locally hosted Latin Modern Roman for LaTeX-style typography, without text highlights or an external font service. Body copy scales from 20 to 22 pixels, supporting text is at least 16 pixels, and navigation and action links use 18-pixel text. Secondary text uses a darker green for contrast.
- `assets/js/portfolio-nav.js`: menu state, Escape/outside-click handling, focus return, and breakpoint handling. The toggle appears only after its handlers are installed. Navigation stays visible without JavaScript.
- Research previews: the molecular machine learning and pathology entries use text without images. The original method SVG files are retained but are not rendered in the previews. Application previews keep their original screenshots.
- `_pages/research.md`, `_pages/industry.md`: coherent section pages. Software retains the `/industry/` URL for existing inbound links. Detailed `_projects` content, project URLs, original screenshots, and downloads remain intact.
- `_config.yml`: content width, document-flow navigation, and exclusion of test/output directories from deployment.
- `.al-folio-overrides.yml`: the four reviewed theme overrides, with pinned upstream and local hashes for drift checking.

## Build and preview

Use the Ruby/Bundler versions supported by the existing deployment and its locked dependencies:

```sh
bundle install
npm ci
JEKYLL_ENV=production bundle exec jekyll build
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

The normal preview is `http://127.0.0.1:4000/`. Do not add `/al-folio` for this site's root configuration.

## Checks

```sh
npm run lint:prettier
bundle exec al-folio upgrade audit
bundle exec al-folio upgrade overrides audit --fail-on-stale
npm run test:portfolio
```

The dedicated browser suite serves the built `_site` directory. Install Playwright's Chromium if needed, or set `PORTFOLIO_BROWSER_PATH` to an installed Chromium/Chrome executable. It does not require changing the deployment workflow. `PORTFOLIO_SITE_DIR` selects a different build directory and `PORTFOLIO_BASE_PATH` selects a nonempty URL prefix.

Validation performed for this redesign:

- Production Jekyll builds at the configured root and at `/portfolio-check`.
- The same PurgeCSS configuration used by the deployment, followed by the browser suite against both optimized builds.
- 18 browser checks per build: Home, Research, and Software at 375, 768, 1024, and 1440 pixels; no horizontal overflow, missing local assets, or console errors; loaded images and heading order; keyboard skip link; mobile menu state and Escape focus; navigation without JavaScript; original project/download routes; local link and fragment targets; visible HTML text contrast and reduced-motion behavior.
- Desktop and mobile screenshots inspected for composition, wrapping, whitespace, and image treatment. Original screenshots are contained rather than cropped and have full-size links.
- Repository formatting, JavaScript syntax, and whitespace checks.

Screenshots are generated under ignored `output/playwright/`. The text-contrast check inspects rendered HTML colors; it is not a complete accessibility audit of image contents or third-party widgets. Browser verification used Chrome; Safari and Firefox were not tested.

`lint:style-contract` belongs to the upstream thin starter and rejects `_includes` and `_layouts` in a personal site. This site already had a footer override before the redesign. Local overrides are supported for personal sites under `docs/ARCHITECTURE.md#local-overrides-your-site-vs-this-repo`; the upstream-only CI jobs are already guarded. The guard is unchanged. The upgrade audit also reports six non-blocking legacy markers in excluded template posts, separate from this redesign.

## Content gaps

The supplied personal CV is linked directly at `/profile/vita_en.pdf`, with the configured base URL applied. The existing template CV data and sample PDFs remain separate and are not promoted. The contact email is verified from the personal CV. No verified LinkedIn URL was supplied, so that link is omitted.

The pathology project has no existing project screenshot or dedicated project page. Its text preview links to the ongoing research section. No publication, performance result, completed degree, or professional history was inferred.
