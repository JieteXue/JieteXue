# Site Structure

This directory is the GitHub Pages site root.

- `index.html`: main entry page.
- `zhihu.html`: generated Zhihu article page.
- `github.html`: generated GitHub projects page.
- `assets/`: site-only CSS and JavaScript.

Structured data lives in `../data/`, and generated sections are updated by `../scripts/build-site.mjs`.

## Data Files

- `../data/zhihu-categories.json`: nested chapter tree. Each node uses `id`, `label`, `description`, optional `order`, `aliases`, `display`, `defaultExpanded`, and `children`.
- `../data/zhihu-series.json`: reading paths that group related articles across categories.
- `../data/zhihu-articles.json`: article records. `tags` are horizontal labels; `categoryIds` place articles into the smallest relevant chapters; `seriesId` optionally connects an article to a reading path.

Run `node ../scripts/build-site.mjs` from this directory's parent after editing data.
