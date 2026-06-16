export function visitCategories(items, path, visitor) {
  items.forEach((item, index) => {
    const label = `${path}[${index}]`;
    visitor(item, label);

    if (Array.isArray(item.children)) {
      visitCategories(item.children, `${label}.children`, visitor);
    }
  });
}

export function countCategoryNodes(items) {
  return items.reduce((count, item) => count + 1 + countCategoryNodes(item.children ?? []), 0);
}

export function flattenCategories(categories, depth = 1) {
  return categories.flatMap((category) => [
    { category, depth },
    ...flattenCategories(category.children ?? [], depth + 1),
  ]);
}
