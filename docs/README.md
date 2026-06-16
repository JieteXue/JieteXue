# Site Structure

This directory is the GitHub Pages site root.

- `index.html`: main entry page.
- `zhihu.html`: generated Zhihu article page.
- `github.html`: generated GitHub projects page.
- `assets/`: site-only CSS and JavaScript.

Structured data lives in `../data/`, page templates live in `../templates/`, and generated pages are written by `../scripts/build-site.mjs`.

GitHub Pages is expected to publish from the repository `main` branch and `/docs` folder.

## Data Files

- `../data/zhihu-categories.json`: nested chapter tree. Each node uses `id`, `label`, `description`, optional `order`, `aliases`, `display`, `defaultExpanded`, and `children`.
- `../data/zhihu-series.json`: reading paths that group related articles across categories.
- `../data/zhihu-articles.json`: article records. `tags` are horizontal labels; `categoryIds` place articles into the smallest relevant chapters; `seriesId` optionally connects an article to a reading path.
- `../data/github-projects.json`: selected GitHub projects shown on `github.html`.

## Maintenance

- Add a Zhihu article in `../data/zhihu-articles.json`, then run `node scripts/build-site.mjs` from the repository root.
- Add a category in `../data/zhihu-categories.json`; use the smallest relevant category ID in each article's `categoryIds`.
- Add a reading path in `../data/zhihu-series.json`; connect articles with `seriesId`.
- Do not guess article dates. Omit `date` unless the date is known.
- Shared page structure is in `../templates/layout.mjs`; page-specific markup is in `../templates/pages/`.
