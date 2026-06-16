import { escapeAttribute, escapeHtml } from "../scripts/lib/html.mjs";

const navItems = [
  { id: "home", label: "Home", href: "./index.html" },
  { id: "zhihu", label: "Zhihu", href: "./zhihu.html" },
  { id: "github", label: "GitHub", href: "./github.html" },
];

export function renderLayout({ active, title, description, head = "", footer, main }) {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttribute(description)}" />
    <link rel="stylesheet" href="./assets/site.css" />
${head}
  </head>
  <body>
    <header class="topbar">
      <div class="site-shell topbar-inner">
        <a class="brand" href="./index.html" aria-label="JieteXue home">
          <span class="mark">JX</span>
          <span>JieteXue</span>
        </a>
        <nav class="nav" aria-label="Primary navigation">
${renderNav(active)}
        </nav>
      </div>
    </header>

${main}

    <footer class="footer">
      <div class="site-shell">${escapeHtml(footer)}</div>
    </footer>
  </body>
</html>
`;
}

function renderNav(active) {
  const internal = navItems
    .map((item) => {
      const current = item.id === active ? ' aria-current="page"' : "";
      return `          <a href="${escapeAttribute(item.href)}"${current}>${escapeHtml(item.label)}</a>`;
    })
    .join("\n");

  const profileHref =
    active === "github" ? "https://github.com/JieteXue" : "https://www.zhihu.com/people/7-63-5-13-42";
  return `${internal}
          <a href="${profileHref}" target="_blank" rel="noreferrer">Profile</a>`;
}
