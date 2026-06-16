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

    if (item.order !== undefined && !isFiniteNumber(item.order)) {
      throw new Error(`${label}.order must be omitted or a number.`);
    }

    if (item.aliases !== undefined) {
      requireArray(item, "aliases", label);
    }

    if (item.defaultExpanded !== undefined && typeof item.defaultExpanded !== "boolean") {
      throw new Error(`${label}.defaultExpanded must be omitted or a boolean.`);
    }

    if (item.display !== undefined) {
      validateDisplay(item.display, `${label}.display`);
    }

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

export function validateSeries(items, categoryMap, seriesPath) {
  if (!Array.isArray(items)) {
    throw new Error(`${seriesPath} must contain an array.`);
  }

  const ids = new Map();
  items.forEach((item, index) => {
    const label = `${seriesPath}[${index}]`;
    requireId(item, "id", label);
    requireString(item, "label", label);
    requireString(item, "description", label);
    requireArray(item, "categoryIds", label);
    requireArray(item, "tags", label);

    if (item.order !== undefined && !isFiniteNumber(item.order)) {
      throw new Error(`${label}.order must be omitted or a number.`);
    }

    if (item.status !== undefined) {
      requireEnum(item, "status", ["active", "paused", "archived"], label);
    }

    item.categoryIds.forEach((categoryId) => {
      if (!categoryMap.has(categoryId)) {
        throw new Error(`${label}.categoryIds contains unknown category "${categoryId}".`);
      }
    });

    if (ids.has(item.id)) {
      throw new Error(`${label}.id duplicates ${ids.get(item.id).source}.`);
    }

    ids.set(item.id, { ...item, source: label });
  });

  return ids;
}

export function validateArticles(items, categoryMap, seriesMap, articlePath) {
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

    if (item.seriesId !== undefined && !seriesMap.has(item.seriesId)) {
      throw new Error(`${articlePath}[${index}].seriesId contains unknown series "${item.seriesId}".`);
    }

    if (item.status !== undefined) {
      requireEnum(item, "status", ["draft", "published", "archived"], `${articlePath}[${index}]`);
    }

    if (item.source !== undefined) {
      requireEnum(item, "source", ["zhihu", "local", "external"], `${articlePath}[${index}]`);
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

function requireEnum(item, key, values, label) {
  if (!values.includes(item?.[key])) {
    throw new Error(`${label}.${key} must be one of: ${values.join(", ")}.`);
  }
}

function validateDisplay(display, label) {
  if (typeof display !== "object" || display === null || Array.isArray(display)) {
    throw new Error(`${label} must be an object when present.`);
  }

  if (display.tone !== undefined) {
    requireString(display, "tone", label);
  }

  if (display.showInNav !== undefined && typeof display.showInNav !== "boolean") {
    throw new Error(`${label}.showInNav must be omitted or a boolean.`);
  }
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isZhihuUrl(url) {
  return url.startsWith("https://www.zhihu.com/") || url.startsWith("https://zhuanlan.zhihu.com/");
}
