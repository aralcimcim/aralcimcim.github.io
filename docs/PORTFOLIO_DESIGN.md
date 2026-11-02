# Living Lab Notebook

The portfolio keeps its existing Jekyll generator, URLs, SEO metadata, research copy and project records. The homepage's removed Selected work section and action buttons stay removed. The separate `patho_dash` application is unchanged.

## Direction

**Living Lab Notebook** combines warm paper, an editorial serif and small monospace annotations with lightweight scientific figures. It makes the research areas distinct without presenting an illustration as a research result.

The two other concepts considered were **Scientific Atlas**, a grid of connected research fields, and **Research Instrument**, a more technical interface inspired by scientific software. Living Lab Notebook was chosen for its balance of personality, reading comfort and scientific context.

## Design rationale

| Token          | Light     | Dark      | Purpose                        |
| -------------- | --------- | --------- | ------------------------------ |
| Paper          | `#f7f4ee` | `#191820` | Main canvas                    |
| Figure surface | `#fffcf7` | `#211f29` | Figure plates and project rows |
| Ink            | `#292732` | `#eee9e4` | Primary text                   |
| Muted ink      | `#625d6a` | `#bcb4c3` | Supporting copy and metadata   |
| Geometry       | `#68438a` | `#c7a7ea` | Molecular learning             |
| Pathology      | `#9b4567` | `#eda7c4` | H&E-inspired tissue emphasis   |
| Retrieval      | `#28685b` | `#8bcdbb` | Queries and evidence           |

The two font roles use system fonts, with no font downloads: an Iowan/Palatino/Georgia serif for reading and a system monospace for metadata. Body text is 18 px on desktop and 17 px on mobile; the hero ranges from about 42 to 66 px. Section gaps scale from 48 to 88 px, with smaller 8–32 px gaps and optical adjustments within figures.

The asymmetric hero is followed by three editorial research rows. Scientific figures use the same geometry, pathology and retrieval colors as their labels. Software entries retain their existing text and allowed images, with status labels, metadata chips and a small pointer tilt. No Molescope or dashboard screenshots are restored.

## Interactions and scientific meaning

- The molecular figure shows benzene, pyridine and phenol heavy-atom graphs; hydrogens are omitted. The molecule button beside the name cycles between them without changing the home link.
- Hovering or focusing the figure reduces its illustrative coordinate noise. **Denoise graph** holds the clean structure; **Release structure** releases that hold.
- **Pause motion** stops automatic rotation. Animation also stops off-screen and in hidden tabs. Reduced-motion preference gives a static figure and disables automatic motion.
- The invariant-prediction formula is conceptual. No trained property prediction or molecular simulation is displayed.
- The whole-slide illustration moves from slide to region and cells. Its short hover effect is a schematic zoom, not an actual histology image.
- The retrieval diagram computes the three nearest points to its moving query using Euclidean distance in the illustrated plane. These are illustration coordinates, not a measured embedding or retrieval score.
- A brief heading decode occurs on pointer hover; the original accessible heading stays intact. Reduced motion disables it.
- The theme follows the system unless a visitor chooses a theme. Storage failures fall back to the system preference.
- A small console note is the hidden easter egg. There are no pop-ups, sounds, trackers or external animation libraries.

## Complete source files

The source bundle contains complete files at their repository paths, ready to copy over an existing checkout. It is not a collection of partial snippets.

| Path                                                                                                                | Role                                                                   |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `assets/css/academic.css`                                                                                           | All portfolio design tokens and responsive styles                      |
| `assets/js/lab-notebook.js`                                                                                         | Themes, molecular figure, decode, retrieval and card interactions      |
| `_includes/molecule-figure.liquid`                                                                                  | Accessible molecular SVG and static fallback                           |
| `_includes/lab-figure.liquid`                                                                                       | Three research-area SVG diagrams                                       |
| `_includes/head.liquid`                                                                                             | Existing metadata plus the lightweight portfolio asset path            |
| `_includes/header.liquid`                                                                                           | Sticky navigation, molecule button and theme control                   |
| `_includes/work-preview.liquid`                                                                                     | Existing project content with metadata chips and tilt                  |
| `_layouts/default.liquid`                                                                                           | Small portfolio script bundle; legacy scripts stay available elsewhere |
| `_pages/home.md`                                                                                                    | Hero, research areas and Now note                                      |
| `_pages/research.md`, `_pages/industry.md`, `_pages/about.md`                                                       | Opt in to the shared portfolio presentation                            |
| `_projects/chemprop_diffusion.md`, `_projects/molescope.md`, `_projects/trialtrace.md`, `_projects/pathology-ai.md` | Preserve content and URLs; opt in to the presentation                  |
| `purgecss.config.js`                                                                                                | Preserve dynamic theme and accessibility attribute states              |
| `.al-folio-overrides.yml`                                                                                           | Acknowledged local overrides supported by this personal site           |
| `test/portfolio/lab.spec.js`, `test/portfolio/portfolio.spec.js`                                                    | Interaction and route/accessibility regression checks                  |

The `portfolio: true` front matter flag selects the small asset path on the core portfolio pages. Other template pages keep their existing asset loading and feature behavior. The normal Jekyll build minifies JavaScript; there is no new front-end build step.

## Apply and test locally

Copy the complete changed files into the existing repository, preserving paths. Keep `Gemfile`, `Gemfile.lock`, `_config.yml` and the existing assets in place.

Use the repository's Ruby 3.3 environment and its locked Bundler version, plus Node.js 20 or later and the Python notebook converter already required by the legacy site content:

```bash
bundle install
npm ci
python3 -m pip install nbconvert
JEKYLL_ENV=production bundle exec jekyll build
npm run lint:prettier
npx playwright install chromium
npm run test:portfolio
```

If Chrome is already installed, set `PORTFOLIO_BROWSER_PATH=/path/to/google-chrome` for the browser tests. Tests serve the actual `_site` build, not source templates.

To preview manually:

```bash
bundle exec jekyll serve
```

Open the Local URL printed by Jekyll; the current site has an empty base URL. GitHub Pages still deploys through the existing workflow when `main` is pushed.

Production also runs PurgeCSS. The dynamic `data-theme`, `aria-expanded` and `aria-pressed` states are preserved explicitly using its [documented dynamic-attribute option](https://purgecss.com/configuration#dynamicattributes).

To inspect local override ownership after editing theme overrides:

```bash
bundle exec al-folio upgrade overrides audit
bundle exec al-folio upgrade overrides diff _includes/head.liquid
bundle exec al-folio upgrade overrides accept _includes/head.liquid _includes/header.liquid _layouts/default.liquid
```

The personal-site exception for these overrides is documented in `docs/ARCHITECTURE.md`. No theme gem was modified.

## Assets to supply

None are required. The logo mark and scientific figures are inline SVG; the design does not require photos, stock imagery, web fonts or a colored favicon. Existing project images retain their existing paths and captions.

Optional replacements can be your own scientific figure for the molecular project, a reviewed molecular geometry, or a short factual update to the Now note. Do not label schematic figures as measured results or add publication status without evidence.

## Three optional next steps

1. **Low effort:** maintain a dated, one-sentence Now entry with a real research update.
2. **Medium effort:** add a dedicated, factual reproduction log for the GOW paper with links to your own experiments as they become available.
3. **Higher effort:** add a small scientific explainer backed by a frozen, documented experiment export, keeping illustrative interactions separate from measured outputs.
