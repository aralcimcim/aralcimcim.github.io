# Portfolio design

The portfolio uses its existing Jekyll generator, GitHub Pages workflow, URLs, metadata and project records. The homepage contains a text heading and three numbered research areas. It has no illustration, animation or animation controls. Selected work, homepage action buttons, category chips and the Now section remain removed.

## Appearance

All portfolio pages share the same dark background, surfaces, text and neon green accent. Research and Software use identical link and metadata colors, without category-specific accent colors. System preferences and an older stored theme choice do not change the palette. There is no theme switch.

| Token           | Color     |
| --------------- | --------- |
| Background      | `#191820` |
| Surface         | `#211f29` |
| Text            | `#eee9e4` |
| Supporting text | `#bcb4c3` |
| Accent          | `#39ff14` |
| Hover accent    | `#9aff85` |

An 18 px root font size enlarges text consistently, including headings. Body text is about 20 px on desktop and 19 px on mobile; Software metadata labels are at least 13.5 px. System serif fonts serve the main text, with system monospace fonts for navigation and metadata. No web fonts or animation libraries are downloaded. Software listings are static entries with locally embedded tool icons and visible labels, including TrialTrace, Molescope and Pathology Dashboard. Existing project descriptions and links are preserved. The separate `patho_dash` application is unchanged.

## Source and validation

- `_pages/home.md`: homepage content.
- `_data/selected_work.yml`: Software listing data.
- `_data/tools.yml`, `_includes/tools.liquid` and `_includes/tool-icon.liquid`: shared tool names and accessible icon lists.
- `_includes/work-preview.liquid`: project entries.
- `assets/css/academic.css`: shared palette, typography and responsive layout.
- `_includes/head.liquid` and `_includes/header.liquid`: portfolio assets and navigation.
- `test/portfolio/`: browser checks against the real Jekyll build.

Build with the repository's locked Ruby/Bundler environment and existing Node.js and nbconvert dependencies:

```bash
JEKYLL_ENV=production bundle exec jekyll build
npm run lint:prettier
npm run test:portfolio
bundle exec al-folio upgrade overrides audit
bundle exec al-folio upgrade audit
```

Set `PORTFOLIO_BROWSER_PATH` when using an installed Chrome instead of Playwright's bundled browser. Production also runs PurgeCSS. Personal-site template overrides are tracked in `.al-folio-overrides.yml`; see `docs/ARCHITECTURE.md` for ownership details.
