import { visitCategories } from "./category-tree.mjs";

export function validateCategoryTree(items, path) {
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

export function validateArticles(items, categoryMap, articlePath) {
  if (!Array.isArray(items)) {
    throw new Error(`${articlePath} must contain an array.`);
  }

  items.forEach((item, index) => {
    requireString(item, "title", `${articlePath}[${index}]`);
    requireString(item, "url", `${articlePath}[${index}]`);
    requireString(item, "summary", `${articlePath}[${index}]`);
    requireArray(item, "tags", `${articlePath}[${index}]`);
    requireArray(item, "categoryIds", `${articlePath}[${index}]`);

    if (item.date !== undefined && (typeof item.date !== "string" || item.date.trim() === "")) {
      throw new Error(`${articlePath}[${index}].date must be omitted or a non-empty string.`);
    }

    if (item.featured !== undefined && typeof item.featured !== "boolean") {
      throw new Error(`${articlePath}[${index}].featured must be omitted or a boolean.`);
    }

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

export function validateProjects(items, projectPath) {
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
