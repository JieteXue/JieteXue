import { readFileSync, writeFileSync } from "node:fs";

const articlePath = "data/zhihu-articles.json";
const projectPath = "data/github-projects.json";

const pageConfigs = [
  {
    file: "zhihu.html",
    start: "<!-- ARTICLES:START -->",
    end: "<!-- ARTICLES:END -->",
    render: renderArticles,
  },
  {
    file: "github.html",
    start: "<!-- PROJECTS:START -->",
    end: "<!-- PROJECTS:END -->",
    render: renderProjects,
  },
];

const articles = readJson(articlePath);
const projects = readJson(projectPath);

validateArticles(articles);
validateProjects(projects);

for (const config of pageConfigs) {
  const data = config.file === "zhihu.html" ? articles : projects;
  updateRegion(config.file, config.start, config.end, config.render(data));
}

console.log(`Generated ${articles.length} Zhihu article(s) and ${projects.length} GitHub project(s).`);

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`${path} is not valid JSON: ${error.message}`);
  }
}

function validateArticles(items) {
  if (!Array.isArray(items)) {
    throw new Error(`${articlePath} must contain an array.`);
  }

  items.forEach((item, index) => {
    requireString(item, "title", `${articlePath}[${index}]`);
    requireString(item, "url", `${articlePath}[${index}]`);
    requireString(item, "date", `${articlePath}[${index}]`);
    requireString(item, "summary", `${articlePath}[${index}]`);
    requireArray(item, "tags", `${articlePath}[${index}]`);

    if (!item.url.startsWith("https://www.zhihu.com/")) {
      throw new Error(`${articlePath}[${index}].url must be a Zhihu URL.`);
    }
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

function requireArray(item, key, label) {
  if (!Array.isArray(item?.[key]) || item[key].some((value) => typeof value !== "string" || value.trim() === "")) {
    throw new Error(`${label}.${key} must be an array of non-empty strings.`);
  }
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

function renderArticles(items) {
  return items
    .map((item) => {
      const tags = item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
      return `        <article class="content-card article-card">
          <div class="card-meta">${escapeHtml(item.date)} · Zhihu</div>
          <h2>${escapeHtml(item.title)}</h2>
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
