import { readFileSync, writeFileSync } from "node:fs";

const articlePath = "data/zhihu-articles.json";
const articleCategoryPath = "data/zhihu-categories.json";
const projectPath = "data/github-projects.json";

const pageConfigs = [
  {
    file: "zhihu.html",
    regions: [
      {
        start: "<!-- ARTICLE_SECTIONS:START -->",
        end: "<!-- ARTICLE_SECTIONS:END -->",
        html: () => renderArticleSections(articleCategories, articles),
      },
      {
        start: "<!-- CHAPTER_NAV:START -->",
        end: "<!-- CHAPTER_NAV:END -->",
        html: () => renderChapterNav(articleCategories),
      },
    ],
  },
  {
    file: "github.html",
    regions: [
      {
        start: "<!-- PROJECTS:START -->",
        end: "<!-- PROJECTS:END -->",
        html: () => renderProjects(projects),
      },
    ],
  },
];

const articles = readJson(articlePath);
const articleCategories = readJson(articleCategoryPath);
const projects = readJson(projectPath);
const articleCategoryMap = validateCategoryTree(articleCategories, articleCategoryPath);
const articleCategoryCount = countCategoryNodes(articleCategories);

validateArticles(articles, articleCategoryMap);
validateProjects(projects);

for (const config of pageConfigs) {
  for (const region of config.regions) {
    updateRegion(config.file, region.start, region.end, region.html());
  }
}

console.log(
  `Generated ${articles.length} Zhihu article(s), ${articleCategoryCount} category node(s), and ${projects.length} GitHub project(s).`,
);

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`${path} is not valid JSON: ${error.message}`);
  }
}

function validateCategoryTree(items, path) {
  if (!Array.isArray(items)) {
    throw new Error(`${path} must contain an array.`);
  }

  const ids = new Map();
  visitCategories(items, path, (item, label) => {
    requireId(item, "id", label);
    requireString(item, "label", label);
    requireString(item, "description", label);

    if (item.children !== undefined && !Array.isArray(item.children)) {
      throw new Error(`${label}.children must be an array when present.`);
    }

    if (ids.has(item.id)) {
      throw new Error(`${label}.id duplicates ${ids.get(item.id).source}.`);
    }

    ids.set(item.id, { ...item, source: label });
  });

  return ids;
}

function validateArticles(items, categoryMap) {
  if (!Array.isArray(items)) {
    throw new Error(`${articlePath} must contain an array.`);
  }

  items.forEach((item, index) => {
    requireString(item, "title", `${articlePath}[${index}]`);
    requireString(item, "url", `${articlePath}[${index}]`);
    requireString(item, "date", `${articlePath}[${index}]`);
    requireString(item, "summary", `${articlePath}[${index}]`);
    requireArray(item, "tags", `${articlePath}[${index}]`);
    requireArray(item, "categoryIds", `${articlePath}[${index}]`);

    if (!isZhihuUrl(item.url)) {
      throw new Error(`${articlePath}[${index}].url must be a Zhihu or Zhuanlan URL.`);
    }

    item.categoryIds.forEach((categoryId) => {
      if (!categoryMap.has(categoryId)) {
        throw new Error(`${articlePath}[${index}].categoryIds contains unknown category "${categoryId}".`);
      }
    });
  });
}

function validateProjects(items) {
  if (!Array.isArray(items)) {
    throw new Error(`${projectPath} must contain an array.`);
  }

  items.forEach((item, index) => {
    requireString(item, "name", `${projectPath}[${index}]`);
    requireString(item, "url", `${projectPath}[${index}]`);
    requireString(item, "description", `${projectPath}[${index}]`);
    requireString(item, "status", `${projectPath}[${index}]`);
    requireArray(item, "stack", `${projectPath}[${index}]`);

    if (!item.url.startsWith("https://github.com/")) {
      throw new Error(`${projectPath}[${index}].url must be a GitHub URL.`);
    }
  });
}

function requireString(item, key, label) {
  if (typeof item?.[key] !== "string" || item[key].trim() === "") {
    throw new Error(`${label}.${key} must be a non-empty string.`);
  }
}

function requireId(item, key, label) {
  requireString(item, key, label);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item[key])) {
    throw new Error(`${label}.${key} must be kebab-case lowercase text.`);
  }
}

function requireArray(item, key, label) {
  if (!Array.isArray(item?.[key]) || item[key].some((value) => typeof value !== "string" || value.trim() === "")) {
    throw new Error(`${label}.${key} must be an array of non-empty strings.`);
  }
}

function isZhihuUrl(url) {
  return url.startsWith("https://www.zhihu.com/") || url.startsWith("https://zhuanlan.zhihu.com/");
}

function visitCategories(items, path, visitor) {
  items.forEach((item, index) => {
    const label = `${path}[${index}]`;
    visitor(item, label);

    if (Array.isArray(item.children)) {
      visitCategories(item.children, `${label}.children`, visitor);
    }
  });
}

function countCategoryNodes(items) {
  return items.reduce((count, item) => count + 1 + countCategoryNodes(item.children ?? []), 0);
}

function updateRegion(file, start, end, html) {
  const source = readFileSync(file, "utf8");
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`${file} is missing ${start} / ${end} markers.`);
  }

  const next =
    source.slice(0, startIndex + start.length) +
    "\n" +
    html +
    "\n" +
    source.slice(endIndex);

  writeFileSync(file, next);
}

function renderChapterNav(categories) {
  return renderChapterNavItems(categories, 0, { isFirst: true });
}

function renderArticleSections(categories, items) {
  return flattenCategories(categories).map((entry) => renderCategorySection(entry.category, items, entry.depth)).join("\n\n");
}

function renderChapterNavItems(categories, depth, state) {
  return categories
    .map((category) => {
      const activeClass = state.isFirst ? " is-active" : "";
      state.isFirst = false;
      const current = `          <a class="chapter-link${activeClass}" style="--depth: ${depth}" href="#${escapeAttribute(category.id)}">${escapeHtml(category.label)}</a>`;
      const children = renderChapterNavItems(category.children ?? [], depth + 1, state);
      return children ? `${current}\n${children}` : current;
    })
    .join("\n");
}

function renderCategorySection(category, items, depth) {
  const categoryArticles = items.filter((item) => item.categoryIds.includes(category.id));
  const headingTag = `h${Math.min(depth + 1, 6)}`;
  const eyebrow = getCategoryLevelLabel(depth);
  const emptyText = depth === 1 ? "这个章节暂时还没有文章。" : "这个主题暂时还没有文章。";
  const body =
    categoryArticles.length === 0
      ? `            <p class="section-empty">${emptyText}</p>`
      : `            <div class="article-grid">
${renderArticleCards(categoryArticles)}
            </div>`;

  return `          <section class="article-section" id="${escapeAttribute(category.id)}" data-section data-depth="${depth}" style="--depth: ${depth - 1}">
            <div class="section-heading">
              <p class="eyebrow">${eyebrow}</p>
              <${headingTag}>${escapeHtml(category.label)}</${headingTag}>
              <p>${escapeHtml(category.description)}</p>
            </div>
${body}
          </section>`;
}

function flattenCategories(categories, depth = 1) {
  return categories.flatMap((category) => [
    { category, depth },
    ...flattenCategories(category.children ?? [], depth + 1),
  ]);
}

function getCategoryLevelLabel(depth) {
  if (depth === 1) {
    return "Section";
  }

  if (depth === 2) {
    return "Subsection";
  }

  return "Topic";
}

function renderArticleCards(items) {
  return items
    .map((item) => {
      const tags = item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
      return `            <article class="content-card article-card">
              <div class="card-meta">${escapeHtml(item.date)} · Zhihu</div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.summary)}</p>
              <div class="tag-row">${tags}</div>
              <a class="button-link" href="${escapeAttribute(item.url)}" target="_blank" rel="noreferrer">阅读知乎原文</a>
            </article>`;
    })
    .join("\n");
}

function renderProjects(items) {
  return items
    .map((item) => {
      const stack = item.stack.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
      return `        <article class="content-card project-card">
          <div class="card-meta">${escapeHtml(item.status)} · GitHub</div>
          <h2>${escapeHtml(item.name)}</h2>
          <p>${escapeHtml(item.description)}</p>
          <div class="tag-row">${stack}</div>
          <a class="button-link" href="${escapeAttribute(item.url)}" target="_blank" rel="noreferrer">打开仓库</a>
        </article>`;
    })
    .join("\n");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
