const navLinks = Array.from(document.querySelectorAll(".chapter-nav a"));
const sections = Array.from(document.querySelectorAll("[data-section]"));

if (navLinks.length > 0 && sections.length > 0) {
  const activate = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        activate(visible.target.id);
      }
    },
    {
      rootMargin: "-25% 0px -55% 0px",
      threshold: [0.2, 0.55],
    },
  );

  sections.forEach((section) => observer.observe(section));
  activate(sections[0].id);
}
