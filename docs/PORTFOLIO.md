# Portfolio design and verification

The personal site keeps Jekyll, the pinned al-folio gems, and the existing GitHub Pages deployment. The configured `baseurl` is empty. The upstream template instructions about always using `/al-folio` do not describe this personal site's configuration.

## Academic presentation

The layout takes its reading density and restrained hierarchy from [Andreas Geiger's personal page](https://www.cvlibs.net/) and [Moritz Hardt's personal page](https://mrtz.org/), inspected on 29 October 2026. It uses a white background, dark text, blue links, system sans-serif typography, a 960-pixel content column, modest headings, and thin gray dividers. Body copy is 16–17 pixels; secondary text and navigation are 15 pixels. The previous gradient, oversized headings, colored button fills, and text highlights are removed. Pages, content order, navigation destinations, and project images are preserved.

## Source map

- `_pages/home.md`: homepage introduction and selected research. Software projects appear on the Software page.
- `_pages/about.md`: dedicated `/about/` page with biography, reached from the top navigation.
- `profile/vita_en.pdf`: the unmodified personal CV, linked beside View GitHub on the homepage. The profile photo is no longer displayed.
- `_data/socials.yml`: GitHub and the contact email verified from the supplied CV.
- `_data/selected_work.yml`: four curated projects, factual status, metadata, asset paths, and verified project/code links.
- `_includes/work-preview.liquid`: shared homepage and Software project previews.
- `_includes/header.liquid`, `_includes/footer.liquid`: shared navigation and an intentionally empty footer override.
- `_includes/head.liquid`: retains the pinned theme's integrations, loads the local stylesheet last, and applies `relative_url` to its asset links.
- `_layouts/default.liquid`: retains the theme layout, adds the skip-link target, and removes its extra top-margin utility.
- `assets/css/academic.css`: shared academic color, typography, width, spacing, component, and responsive styles. Uses Helvetica/Arial system fonts without an external font service. Project action links retain the requested lack of underlines.
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

The current browser suite has 22 checks: Home, Research, Software, and About at 375, 768, 1024, and 1440 pixels, plus navigation, downloads, contrast, and local link checks. It verifies no horizontal overflow, missing local assets, or console errors; loaded images and heading order; keyboard skip link; mobile menu state and Escape focus; and navigation without JavaScript.

The academic styling was first checked against the latest generated GitHub Pages HTML with the updated stylesheet applied. All 22 checks passed. Desktop and mobile screenshots were inspected for wrapping, spacing, and image treatment. The deployment workflow performs the production Jekyll build and PurgeCSS optimization. The earlier portfolio implementation was also verified at the `/portfolio-check` prefix.

Screenshots are generated under ignored `output/playwright/`. The text-contrast check inspects rendered HTML colors; it is not a complete accessibility audit of image contents or third-party widgets. Browser verification used Chrome; Safari and Firefox were not tested.

`lint:style-contract` belongs to the upstream thin starter and rejects `_includes` and `_layouts` in a personal site. This site already had a footer override before the redesign. Local overrides are supported for personal sites under `docs/ARCHITECTURE.md#local-overrides-your-site-vs-this-repo`; the upstream-only CI jobs are already guarded. The guard is unchanged. The upgrade audit also reports six non-blocking legacy markers in excluded template posts, separate from this redesign.

## Content gaps

The supplied personal CV is linked directly at `/profile/vita_en.pdf`, with the configured base URL applied. The existing template CV data and sample PDFs remain separate and are not promoted. The contact email is verified from the personal CV. No verified LinkedIn URL was supplied, so that link is omitted.

The pathology project has no existing project screenshot or dedicated project page. Its text preview links to the ongoing research section. No publication, performance result, completed degree, or professional history was inferred.
