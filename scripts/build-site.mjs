import { countCategoryNodes } from "./lib/category-tree.mjs";
import { readJson, updateRegion } from "./lib/io.mjs";
import { renderProjects } from "./lib/render-github.mjs";
import { renderArticleSections, renderChapterNav } from "./lib/render-zhihu.mjs";
import { validateArticles, validateCategoryTree, validateProjects } from "./lib/validators.mjs";

const articlePath = "data/zhihu-articles.json";
const articleCategoryPath = "data/zhihu-categories.json";
const projectPath = "data/github-projects.json";

const articles = readJson(articlePath);
const articleCategories = readJson(articleCategoryPath);
const projects = readJson(projectPath);
const articleCategoryMap = validateCategoryTree(articleCategories, articleCategoryPath);
const articleCategoryCount = countCategoryNodes(articleCategories);

validateArticles(articles, articleCategoryMap, articlePath);
validateProjects(projects, projectPath);

const pageConfigs = [
  {
    file: "docs/zhihu.html",
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
    file: "docs/github.html",
    regions: [
      {
        start: "<!-- PROJECTS:START -->",
        end: "<!-- PROJECTS:END -->",
        html: () => renderProjects(projects),
      },
    ],
  },
];

for (const config of pageConfigs) {
  for (const region of config.regions) {
    updateRegion(config.file, region.start, region.end, region.html());
  }
}

console.log(
  `Generated ${articles.length} Zhihu article(s), ${articleCategoryCount} category node(s), and ${projects.length} GitHub project(s).`,
);
