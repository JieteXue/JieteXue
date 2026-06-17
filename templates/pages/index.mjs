import { renderLayout } from "../layout.mjs";
import { escapeAttribute, escapeHtml } from "../../scripts/lib/html.mjs";

export function renderIndexPage(profile) {
  return renderLayout({
    active: "home",
    title: `${profile.name} · Personal Blog`,
    description: profile.intro,
    head: `    <link rel="prefetch" href="./zhihu.html" as="document" />
    <link rel="prefetch" href="./github.html" as="document" />`,
    footer: "Built for GitHub Pages · Updated from structured data files.",
    main: `    <main class="site-shell home-shell">
      <section class="identity-strip" aria-labelledby="hero-title">
        <div class="identity-copy">
          <p class="eyebrow">Personal knowledge console</p>
          <h1 id="hero-title">${escapeHtml(profile.name)}</h1>
          <p class="tagline">${escapeHtml(profile.tagline)}</p>
          <p class="lead">${escapeHtml(profile.intro)}</p>
        </div>
        <div class="identity-actions" aria-label="Primary links">
${renderPrimaryLinks(profile.primaryLinks)}
        </div>
      </section>

      <div class="workspace-layout">
        <section class="workspace-main" aria-label="Profile and activity">
          <div class="feed-head">
            <p class="eyebrow">Workspace</p>
            <h2>学习、写作与工具流</h2>
            <p>这里更像一个公开的工作台：文章、项目、工具和长期兴趣按可维护的数据结构逐步展开。</p>
          </div>
${renderTimeline(profile.timeline)}
${renderProfileBlocks(profile.blocks)}
          <section class="route-list" aria-label="Site sections">
            <a class="route-row" href="./zhihu.html">
              <span>Zhihu</span>
              <strong>知乎文章</strong>
              <p>按章节、系列和主题整理已经发表在知乎上的文章。</p>
            </a>
            <a class="route-row" href="./github.html">
              <span>GitHub</span>
              <strong>GitHub 项目</strong>
              <p>展示精选仓库、项目状态和工具建设记录。</p>
            </a>
            <a class="route-row" href="https://github.com/JieteXue/JieteXue" target="_blank" rel="noreferrer">
              <span>Profile</span>
              <strong>About / Links</strong>
              <p>回到 profile 仓库，查看 README、统计图和公开入口。</p>
            </a>
          </section>
        </section>

        <aside class="context-rail" aria-label="Profile context">
          <section class="rail-panel">
            <p class="eyebrow">Context</p>
            <h2>个人信息</h2>
${renderIntroDetails(profile.introDetails)}
          </section>
          <section class="rail-panel">
            <p class="eyebrow">Map</p>
            <h2>站点入口</h2>
            <nav class="rail-links" aria-label="Home shortcuts">
              <a href="./zhihu.html">知乎文章</a>
              <a href="./github.html">GitHub 项目</a>
              <a href="https://www.zhihu.com/people/7-63-5-13-42" target="_blank" rel="noreferrer">知乎主页</a>
            </nav>
          </section>
          <section class="rail-panel">
            <p class="eyebrow">Build</p>
            <h2>维护方式</h2>
            <ul class="rail-list">
              <li>首页信息来自 <code>data/profile.json</code></li>
              <li>文章、分类、系列和项目由 JSON 生成</li>
              <li>静态发布到 GitHub Pages，无后台依赖</li>
            </ul>
          </section>
        </aside>
      </div>
    </main>`,
  });
}

function renderIntroDetails(items = []) {
  if (items.length === 0) {
    return "";
  }

  return `            <dl class="intro-details">
${items
  .map((item) => {
    return `              <div>
                <dt>${escapeHtml(item.label)}</dt>
                <dd>${escapeHtml(item.value)}</dd>
              </div>`;
  })
  .join("\n")}
            </dl>`;
}

function renderPrimaryLinks(items) {
  return items
    .map((item) => {
      const className = item.style === "primary" ? "button primary" : "button";
      const external = isExternalHref(item.href) ? ' target="_blank" rel="noreferrer"' : "";
      return `              <a class="${className}" href="${escapeAttribute(item.href)}"${external}>${escapeHtml(item.label)}</a>`;
    })
    .join("\n");
}

function renderTimeline(items = []) {
  if (items.length === 0) {
    return "";
  }

  return `          <section class="panel profile-block timeline-block">
            <p class="eyebrow">Timeline</p>
            <h2>履历 / 记录</h2>
            <div class="timeline-list">
${items
  .map((item) => {
    return `              <article class="timeline-item">
                <span>${escapeHtml(item.period)}</span>
                <div>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.description)}</p>
                </div>
              </article>`;
  })
  .join("\n")}
            </div>
          </section>`;
}

function renderProfileBlocks(blocks) {
  return blocks
    .map((block) => {
      const links = block.links?.length ? `\n            <div class="panel-links">\n${renderPanelLinks(block.links)}\n            </div>` : "";
      return `          <section class="panel profile-block" id="${escapeAttribute(block.id)}">
            <p class="eyebrow">${escapeHtml(block.eyebrow)}</p>
            <h2>${escapeHtml(block.title)}</h2>
            <p>${escapeHtml(block.body)}</p>
            <ul class="profile-list">
${renderProfileItems(block.items)}
            </ul>${links}
          </section>`;
    })
    .join("\n");
}

function renderProfileItems(items) {
  return items.map((item) => `              <li>${escapeHtml(item)}</li>`).join("\n");
}

function renderPanelLinks(items) {
  return items
    .map((item) => {
      const external = isExternalHref(item.href) ? ' target="_blank" rel="noreferrer"' : "";
      return `              <a href="${escapeAttribute(item.href)}"${external}>${escapeHtml(item.label)}</a>`;
    })
    .join("\n");
}

function isExternalHref(href) {
  return href.startsWith("http://") || href.startsWith("https://");
}
