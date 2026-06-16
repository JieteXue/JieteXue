import { renderLayout } from "../layout.mjs";

export function renderIndexPage() {
  return renderLayout({
    active: "home",
    title: "JieteXue · Personal Blog",
    description: "JieteXue 的个人博客入口，连接知乎文章、GitHub 项目和学习笔记。",
    head: `    <link rel="prefetch" href="./zhihu.html" as="document" />
    <link rel="prefetch" href="./github.html" as="document" />`,
    footer: "Built for GitHub Pages · Updated from structured data files.",
    main: `    <main class="site-shell">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <div>
            <p class="eyebrow">Personal dashboard · writing · projects</p>
            <h1 id="hero-title">JieteXue</h1>
            <p class="lead">
              一个面向写作、数学物理兴趣、开源项目和知识整理的个人入口。这里连接知乎文章、GitHub 项目，以及正在打磨的小工具和笔记。
            </p>
          </div>
          <div class="action-row">
            <a class="button primary" href="./zhihu.html">看知乎文章</a>
            <a class="button" href="./github.html">看 GitHub 项目</a>
            <a class="button" href="https://www.zhihu.com/people/7-63-5-13-42" target="_blank" rel="noreferrer">知乎主页</a>
          </div>
        </div>

        <aside class="dashboard" aria-label="Current dashboard">
          <section class="panel">
            <h2>Current Focus</h2>
            <p>把长期兴趣沉淀成可链接、可维护、可继续扩展的公开主页。</p>
          </section>
          <section class="panel">
            <h3>Signal</h3>
            <p>Math + Physics · Notes · Open Source · Writing on Zhihu</p>
          </section>
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
