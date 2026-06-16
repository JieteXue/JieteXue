import { flattenCategories } from "./category-tree.mjs";
import { escapeAttribute, escapeHtml } from "./html.mjs";

export function renderChapterNav(categories) {
  return renderChapterNavItems(categories, 0, { isFirst: true });
}

export function renderTagFilters(items) {
  const tags = [...new Set(items.flatMap((item) => item.tags))].sort((a, b) => a.localeCompare(b));
  return tags
    .map((tag) => {
      return `              <button class="tag-chip" type="button" data-tag-filter="${escapeAttribute(tag)}">${escapeHtml(tag)}</button>`;
    })
    .join("\n");
}

export function renderKnowledgeMap(categories, items) {
  return `          <div class="knowledge-map-grid">
${renderKnowledgeMapItems(categories, items, 0)}
          </div>`;
}

export function renderArticleSections(categories, items) {
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
  const categoryArticles = sortArticles(items.filter((item) => item.categoryIds.includes(category.id)));
  const children = category.children ?? [];
  const headingTag = `h${Math.min(depth + 1, 6)}`;
  const eyebrow = getCategoryLevelLabel(depth);
  const emptyText = depth === 1 ? "这个章节暂时还没有文章。" : "这个主题暂时还没有文章。";
  const childTree = children.length === 0 ? "" : `            <div class="child-tree">
${renderChildLinks(children)}
            </div>
`;
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
${childTree}
${body}
          </section>`;
}

function renderChildLinks(categories) {
  return categories
    .map((category) => {
      return `              <a class="child-link" href="#${escapeAttribute(category.id)}">
                <strong>${escapeHtml(category.label)}</strong>
                <span>${escapeHtml(category.description)}</span>
              </a>`;
    })
    .join("\n");
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
      const searchText = [item.title, item.summary, ...item.tags].join(" ").toLowerCase();
      const metaParts = [item.featured ? "Featured" : "", item.date ? escapeHtml(item.date) : "", "Zhihu Article"].filter(Boolean);
      const meta = metaParts.join(" · ");
      return `              <article class="content-card article-card${item.featured ? " is-featured" : ""}" data-article data-tags="${escapeAttribute(item.tags.join("|"))}" data-search="${escapeAttribute(searchText)}">
                <div class="card-meta">${meta}</div>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.summary)}</p>
                <div class="tag-row">${tags}</div>
                <a class="button-link" href="${escapeAttribute(item.url)}" target="_blank" rel="noreferrer">阅读知乎原文</a>
              </article>`;
    })
    .join("\n");
}

function sortArticles(items) {
  return [...items].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
}

function renderKnowledgeMapItems(categories, items, depth) {
  return categories
    .map((category) => {
      const articleCount = countArticlesInCategoryTree(category, items);
      const children = category.children ?? [];
      const childHtml = children.length === 0 ? "" : `\n                <div class="map-children">\n${renderKnowledgeMapItems(children, items, depth + 1)}\n                </div>`;

      return `              <div class="map-node" style="--depth: ${depth}">
                <a class="map-node-link" href="#${escapeAttribute(category.id)}">
                  <span class="map-node-title">${escapeHtml(category.label)}</span>
                  <span class="map-node-desc">${escapeHtml(category.description)}</span>
                  <span class="map-node-count">${articleCount} article${articleCount === 1 ? "" : "s"}</span>
                </a>${childHtml}
              </div>`;
    })
    .join("\n");
}

function countArticlesInCategoryTree(category, items) {
  const categoryIds = collectCategoryIds(category);
  const urls = new Set(
    items.filter((item) => item.categoryIds.some((categoryId) => categoryIds.has(categoryId))).map((item) => item.url),
  );

  return urls.size;
}

function collectCategoryIds(category) {
  return new Set([category.id, ...(category.children ?? []).flatMap((child) => [...collectCategoryIds(child)])]);
}
