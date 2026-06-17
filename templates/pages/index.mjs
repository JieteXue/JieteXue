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
    main: `    <main class="site-shell">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <div>
            <p class="eyebrow">Learning notes · Math / Physics · Tools</p>
            <h1 id="hero-title">${escapeHtml(profile.name)}</h1>
            <p class="tagline">${escapeHtml(profile.tagline)}</p>
            <p class="lead">${escapeHtml(profile.intro)}</p>
${renderIntroDetails(profile.introDetails)}
          </div>
          <div class="action-row">
${renderPrimaryLinks(profile.primaryLinks)}
          </div>
          <div class="site-note" aria-label="Site maintenance notes">
            <div>
              <span>Structured</span>
              <p>个人信息、文章、系列和项目都从 JSON 生成，方便长期手动维护。</p>
            </div>
            <div>
              <span>Static</span>
              <p>站点发布在 GitHub Pages，没有后台依赖，内容改动可直接审查。</p>
            </div>
          </div>
        </div>

        <aside class="dashboard" aria-label="Current dashboard">
${renderTimeline(profile.timeline)}
${renderProfileBlocks(profile.blocks)}
          <section class="panel status-grid" aria-label="Site metrics">
            <div class="metric">
              <strong>3</strong>
              <span>Pages</span>
            </div>
            <div class="metric">
              <strong>4</strong>
              <span>Data files</span>
            </div>
            <div class="metric">
              <strong>0</strong>
              <span>Build dependencies</span>
            </div>
            <div class="metric">
              <strong>1</strong>
              <span>Static generator</span>
            </div>
          </section>
        </aside>
      </section>

      <section class="section-grid" aria-label="Site sections">
        <a class="route-card" href="./zhihu.html">
          <div>
            <h2>知乎文章</h2>
            <p>集中展示已经发表在知乎上的文章，数据从维护文件自动生成。</p>
          </div>
          <span>Open Zhihu writing</span>
        </a>
        <a class="route-card" href="./github.html">
          <div>
            <h2>GitHub 项目</h2>
            <p>展示精选仓库、项目状态和技术栈，保留清晰的仓库入口。</p>
          </div>
          <span>Open repositories</span>
        </a>
        <a class="route-card" href="https://github.com/JieteXue/JieteXue" target="_blank" rel="noreferrer">
          <div>
            <h2>About / Links</h2>
            <p>回到个人 profile 仓库，查看 README、统计图和更多入口。</p>
          </div>
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
      return `            <a class="${className}" href="${escapeAttribute(item.href)}"${external}>${escapeHtml(item.label)}</a>`;
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
