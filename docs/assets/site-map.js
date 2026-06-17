const container = document.getElementById("site-map-network");
const dataElement = document.getElementById("site-map-data");
const detail = document.getElementById("site-map-detail");

if (container && dataElement && detail && window.vis) {
  const siteMap = JSON.parse(dataElement.textContent);
  const palette = {
    root: { background: "#1f6feb", border: "#79c0ff" },
    primary: { background: "#0e4429", border: "#3fb950" },
    knowledge: { background: "#1c2d5a", border: "#58a6ff" },
    math: { background: "#2d235f", border: "#a371f7" },
    physics: { background: "#3a2a0b", border: "#d29922" },
    tool: { background: "#123a43", border: "#39c5cf" },
    project: { background: "#2f1b3a", border: "#d2a8ff" },
    future: { background: "#2b3137", border: "#8b949e" },
    profile: { background: "#3b2308", border: "#ffa657" },
  };

  const nodes = new vis.DataSet(
    siteMap.nodes.map((node) => {
      const color = palette[node.type] || palette.future;
      return {
        ...node,
        title: node.description,
        color: {
          background: color.background,
          border: color.border,
          highlight: {
            background: color.background,
            border: "#e6edf3",
          },
        },
        font: {
          color: "#e6edf3",
          face: "Inter, system-ui, sans-serif",
          size: node.type === "root" ? 18 : 15,
          bold: node.type === "root",
        },
        shape: node.type === "root" ? "box" : "dot",
        size: node.type === "root" ? 34 : node.type === "primary" ? 28 : 22,
        fixed: false,
      };
    }),
  );

  const edges = new vis.DataSet(
    siteMap.edges.map((edge) => ({
      ...edge,
      arrows: "to",
      color: {
        color: "rgba(139, 148, 158, 0.64)",
        highlight: "#39c5cf",
      },
      smooth: {
        type: "cubicBezier",
        roundness: 0.22,
      },
    })),
  );

  const network = new vis.Network(
    container,
    { nodes, edges },
    {
      autoResize: true,
      interaction: {
        dragNodes: true,
        dragView: true,
        hover: true,
        multiselect: false,
        navigationButtons: true,
        zoomView: true,
      },
      physics: {
        enabled: false,
        stabilization: false,
      },
      layout: {
        improvedLayout: false,
      },
      nodes: {
        borderWidth: 1.5,
        shadow: {
          enabled: true,
          color: "rgba(0, 0, 0, 0.35)",
          size: 14,
          x: 0,
          y: 8,
        },
      },
      edges: {
        width: 1.2,
        selectionWidth: 2,
      },
    },
  );

  const renderDetail = (nodeId) => {
    const node = siteMap.nodes.find((item) => item.id === nodeId) || siteMap.nodes[0];
    const external = node.href.startsWith("http://") || node.href.startsWith("https://");
    detail.innerHTML = `
      <p class="eyebrow">${escapeHtml(node.type)}</p>
      <h2>${escapeHtml(node.label)}</h2>
      <p>${escapeHtml(node.description)}</p>
      <a href="${escapeAttribute(node.href)}"${external ? ' target="_blank" rel="noreferrer"' : ""}>Open node</a>
    `;
  };

  network.once("afterDrawing", () => {
    network.fit({ animation: { duration: 500, easingFunction: "easeInOutQuad" } });
  });

  network.on("selectNode", (event) => {
    renderDetail(event.nodes[0]);
  });

  network.on("doubleClick", (event) => {
    const nodeId = event.nodes[0];
    const node = siteMap.nodes.find((item) => item.id === nodeId);
    if (node && node.href && node.href !== "#") {
      window.location.href = node.href;
    }
  });

  document.querySelector('[data-map-action="fit"]')?.addEventListener("click", () => {
    network.fit({ animation: { duration: 450, easingFunction: "easeInOutQuad" } });
  });

  document.querySelector('[data-map-action="physics"]')?.addEventListener("click", (event) => {
    const enabled = event.currentTarget.getAttribute("aria-pressed") !== "true";
    event.currentTarget.setAttribute("aria-pressed", String(enabled));
    network.setOptions({
      physics: {
        enabled,
        barnesHut: {
          gravitationalConstant: -3800,
          springLength: 170,
          springConstant: 0.035,
        },
        stabilization: false,
      },
    });
  });

  renderDetail("home");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
