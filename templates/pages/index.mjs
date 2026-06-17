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

      <section class="command-center" aria-label="Site command centre">
        <a class="mission-panel" href="./zhihu.html">
          <p class="eyebrow">Primary route</p>
          <h2>知乎文章库</h2>
          <p>按章节、系列和主题整理已经发表在知乎上的文章。这里是站点目前最主要的阅读入口，也是后续知识地图的中心。</p>
          <div class="mission-meta" aria-label="Article archive summary">
            <span>14 articles</span>
            <span>4 category nodes</span>
            <span>5 series</span>
          </div>
          <strong>进入文章库</strong>
        </a>

        <aside class="command-rail" aria-label="Dashboard status">
          <section>
            <p class="eyebrow">Now</p>
            <h2>${escapeHtml(getBlockTitle(profile.blocks, "now", "探索中"))}</h2>
            <p>${escapeHtml(getBlockBody(profile.blocks, "now", "整理数学物理笔记，同时搭建支持写作和知识管理的小工具。"))}</p>
          </section>
          <section>
            <p class="eyebrow">Interests</p>
${renderTagCloud(getBlockItems(profile.blocks, "interests"))}
          </section>
          <section>
            <p class="eyebrow">Build</p>
            <p>首页信息来自 <code>data/profile.json</code>，内容页由 JSON 和模板生成。</p>
          </section>
        </aside>
      </section>

      <section class="route-console" aria-label="Secondary routes">
        <a href="./github.html">
          <span>01</span>
          <div>
            <strong>GitHub 项目</strong>
            <p>精选仓库、工具建设和后续可公开维护的代码项目。</p>
          </div>
        </a>
        <a href="./zhihu.html#tools">
          <span>02</span>
          <div>
            <strong>工具与代码</strong>
            <p>LaTeX / TikZ / Mathematica 相关工具流会逐渐收拢到这里。</p>
          </div>
        </a>
        <a href="https://github.com/JieteXue/JieteXue" target="_blank" rel="noreferrer">
          <span>03</span>
          <div>
            <strong>About / Links</strong>
            <p>回到 profile 仓库，查看 README、统计图和更多公开入口。</p>
          </div>
        </a>
      </section>

      <section class="profile-console" aria-label="Profile notes">
        <div>
          <p class="eyebrow">About</p>
          <h2>${escapeHtml(getBlockTitle(profile.blocks, "about", "学习者"))}</h2>
          <p>${escapeHtml(getBlockBody(profile.blocks, "about", "这里记录我对数学、物理、工具和写作流程的长期整理。"))}</p>
        </div>
        <div>
          <p class="eyebrow">Timeline</p>
${renderTimelinePreview(profile.timeline)}
        </div>
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
