# Aral Cimcim — portfolio

Personal portfolio for research and software in molecular machine learning, computational pathology, and evidence retrieval.

[Visit the portfolio](https://aralcimcim.github.io/)

## Content

- `_pages/about.md`: homepage and selected work.
- `_pages/research.md`: research, reproduced papers, summer schools, and coursework.
- `_pages/industry.md`: software projects.
- `_projects/`: project descriptions.
- `_data/selected_work.yml`: featured projects.
- `assets/css/academic.css`: portfolio styling.
- `profile/vita_en.pdf`: personal CV.

## Local preview

The site uses Jekyll with pinned al-folio gems. The deployment uses Ruby 3.3.5 and Node.js 20.

```sh
bundle install
npm ci
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

Open `http://127.0.0.1:4000/`. The site uses an empty `baseurl`.

## Validation

```sh
npm run lint:prettier
JEKYLL_ENV=production bundle exec jekyll build
npm run test:portfolio
```

Browser checks require Playwright Chromium or `PORTFOLIO_BROWSER_PATH` pointing to an installed Chrome or Chromium executable. See [portfolio notes](docs/PORTFOLIO.md) for details and theme override checks.

## Deployment

Pushes to `main` run [the deployment workflow](.github/workflows/deploy.yml), which builds the site, removes unused CSS, and publishes `_site` to GitHub Pages.

Built with [al-folio](https://github.com/alshedivat/al-folio). See [LICENSE](LICENSE).
