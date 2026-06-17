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
      <section class="dashboard-hero" aria-labelledby="hero-title">
        <div class="dashboard-intro">
          <p class="eyebrow">Personal dashboard</p>
          <h1 id="hero-title">${escapeHtml(profile.name)}</h1>
          <p class="tagline">${escapeHtml(profile.tagline)}</p>
          <p class="lead">${escapeHtml(profile.intro)}</p>
        </div>
        <aside class="dashboard-profile" aria-label="Profile summary">
${renderIntroDetails(profile.introDetails)}
        </aside>
      </section>

      <section class="dashboard-grid" aria-label="Site dashboard">
        <a class="dashboard-card dashboard-card-large" href="./zhihu.html">
          <p class="eyebrow">Zhihu</p>
          <h2>知乎文章</h2>
          <p>按章节、系列和主题整理已经发表在知乎上的文章，是当前最主要的内容入口。</p>
          <span>Open writing archive</span>
        </a>
        <a class="dashboard-card" href="./github.html">
          <p class="eyebrow">GitHub</p>
          <h2>项目仓库</h2>
          <p>精选仓库、工具建设和后续可公开维护的代码项目。</p>
          <span>Open projects</span>
        </a>
        <section class="dashboard-card dashboard-card-muted">
          <p class="eyebrow">Now</p>
          <h2>${escapeHtml(getBlockTitle(profile.blocks, "now", "探索中"))}</h2>
          <p>${escapeHtml(getBlockBody(profile.blocks, "now", "整理数学物理笔记，同时搭建支持写作和知识管理的小工具。"))}</p>
        </section>
        <section class="dashboard-card dashboard-card-wide">
          <p class="eyebrow">About</p>
          <h2>${escapeHtml(getBlockTitle(profile.blocks, "about", "学习者"))}</h2>
          <p>${escapeHtml(getBlockBody(profile.blocks, "about", "这里记录我对数学、物理、工具和写作流程的长期整理。"))}</p>
${renderCompactItems(getBlockItems(profile.blocks, "about"))}
        </section>
        <section class="dashboard-card">
          <p class="eyebrow">Interests</p>
          <h2>${escapeHtml(getBlockTitle(profile.blocks, "interests", "长期兴趣"))}</h2>
${renderTagCloud(getBlockItems(profile.blocks, "interests"))}
        </section>
        <section class="dashboard-card">
          <p class="eyebrow">Timeline</p>
          <h2>履历 / 记录</h2>
${renderTimelinePreview(profile.timeline)}
        </section>
        <section class="dashboard-card dashboard-card-muted">
          <p class="eyebrow">Build</p>
          <h2>维护方式</h2>
          <p>首页信息来自 <code>data/profile.json</code>，文章、分类、系列和项目由 JSON 生成。</p>
        </section>
        <a class="dashboard-card" href="https://github.com/JieteXue/JieteXue" target="_blank" rel="noreferrer">
          <p class="eyebrow">Profile</p>
          <h2>About / Links</h2>
          <p>回到 profile 仓库，查看 README、统计图和更多公开入口。</p>
          <span>Open profile repo</span>
        </a>
      </section>
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

function renderCompactItems(items = []) {
  if (items.length === 0) {
    return "";
  }

  return `          <ul class="compact-list">
${items.map((item) => `            <li>${escapeHtml(item)}</li>`).join("\n")}
          </ul>`;
}

function renderTagCloud(items = []) {
  if (items.length === 0) {
    return "";
  }

  return `          <div class="tag-row dashboard-tags">
${items.map((item) => `            <span>${escapeHtml(item)}</span>`).join("\n")}
          </div>`;
}

function renderTimelinePreview(items = []) {
  if (items.length === 0) {
    return "";
  }

  return `          <div class="mini-timeline">
${items
  .slice(0, 3)
  .map((item) => {
    return `            <div>
              <span>${escapeHtml(item.period)}</span>
              <strong>${escapeHtml(item.title)}</strong>
            </div>`;
  })
  .join("\n")}
          </div>`;
}

function getBlock(blocks, id) {
  return blocks.find((block) => block.id === id);
}

function getBlockTitle(blocks, id, fallback) {
  return getBlock(blocks, id)?.title ?? fallback;
}

function getBlockBody(blocks, id, fallback) {
  return getBlock(blocks, id)?.body ?? fallback;
}

function getBlockItems(blocks, id) {
  return getBlock(blocks, id)?.items ?? [];
}

function isExternalHref(href) {
  return href.startsWith("http://") || href.startsWith("https://");
}
