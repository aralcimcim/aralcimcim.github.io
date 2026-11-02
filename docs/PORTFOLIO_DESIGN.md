# Portfolio design

The portfolio uses its existing Jekyll generator, GitHub Pages workflow, URLs, metadata and project records. The homepage contains a heading, a single molecular illustration and the three research areas. Selected work, homepage action buttons, category chips, extra diagrams and the Now section remain removed.

## Appearance

All portfolio pages use one dark palette, regardless of system preferences or an older stored theme choice. There is no theme switch. System serif fonts serve the main text, with system monospace fonts for small controls and metadata. No web fonts or animation libraries are downloaded.

| Token            | Color     |
| ---------------- | --------- |
| Background       | `#191820` |
| Surface          | `#211f29` |
| Text             | `#eee9e4` |
| Supporting text  | `#bcb4c3` |
| Molecular accent | `#c7a7ea` |
| Pathology accent | `#eda7c4` |
| Retrieval accent | `#8bcdbb` |

The hero becomes a single column on mobile. Research areas are simple numbered text rows. Existing Software project content and permitted images are preserved; Molescope and dashboard screenshots stay removed. The separate `patho_dash` application is unchanged.

## Molecular illustration

Six carbon atoms move from deterministically perturbed coordinates to a benzene ring. A faint target ring and increasing bond opacity make the transition clear. This is a conceptual coordinate interpolation, not a trained diffusion model or molecular simulation; hydrogens are omitted.

The animation plays once and stops. The noise slider lets visitors inspect any intermediate state, using pointer or keyboard input. Replay denoising starts another finite transition. Motion pauses off-screen and in hidden tabs. Reduced-motion users get a static structure and immediate changes. Without JavaScript, the complete static benzene graph remains visible.

## Source and validation

- `_pages/home.md`: homepage content.
- `_includes/molecule-figure.liquid`: accessible SVG, controls and static fallback.
- `assets/js/lab-notebook.js`: finite coordinate denoising and existing Software card interaction.
- `assets/css/academic.css`: dark palette, typography and responsive layout.
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
