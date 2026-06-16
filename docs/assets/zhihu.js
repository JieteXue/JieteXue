const navLinks = Array.from(document.querySelectorAll(".chapter-nav a"));
const sections = Array.from(document.querySelectorAll("[data-section]"));
const searchInput = document.querySelector("#article-search");
const tagButtons = Array.from(document.querySelectorAll("[data-tag-filter]"));
const articleCards = Array.from(document.querySelectorAll("[data-article]"));
const emptyState = document.querySelector("[data-filter-empty]");

let activeTag = "all";

if (navLinks.length > 0 && sections.length > 0) {
  const topOffset = 112;

  const activate = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const updateActiveSection = () => {
    const visibleSections = sections.filter((section) => !section.hidden);
    if (visibleSections.length === 0) {
      return;
    }

    const current = visibleSections
      .map((section) => ({
        id: section.id,
        distance: Math.abs(section.getBoundingClientRect().top - topOffset),
      }))
      .sort((a, b) => a.distance - b.distance)[0];

    activate(current.id);
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href").slice(1);
      activate(id);
    });
  });

  updateActiveSection();
  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
}

if (articleCards.length > 0) {
  const applyFilters = () => {
    const query = searchInput?.value.trim().toLowerCase() ?? "";
    let visibleCount = 0;

    articleCards.forEach((card) => {
      const tags = card.dataset.tags.split("|");
      const matchesTag = activeTag === "all" || tags.includes(activeTag);
      const matchesQuery = query === "" || card.dataset.search.includes(query);
      const isVisible = matchesTag && matchesQuery;

      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    sections.forEach((section) => {
      const visibleArticles = Array.from(section.querySelectorAll("[data-article]")).some((card) => !card.hidden);
      section.hidden = !visibleArticles && (query !== "" || activeTag !== "all");
    });

    navLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      link.hidden = Boolean(section?.hidden);
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  };

  searchInput?.addEventListener("input", applyFilters);

  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeTag = button.dataset.tagFilter;
      tagButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      applyFilters();
    });
  });
}
