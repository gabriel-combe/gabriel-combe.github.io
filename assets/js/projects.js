// Shared project data loading + rendering (home highlights, projects grid, project detail page).
let PROJECTS_CACHE = null;

async function loadProjects() {
  if (PROJECTS_CACHE) return PROJECTS_CACHE;
  const base = document.body.dataset.base || "";
  const res = await fetch(`${base}assets/data/projects.json`);
  PROJECTS_CACHE = await res.json();
  return PROJECTS_CACHE;
}

function projectCardHTML(p, lang) {
  const title = p[`title_${lang}`] || p.title_fr;
  const desc = p[`desc_${lang}`] || p.desc_fr;
  const base = document.body.dataset.base || "";
  const aiTag = p.ai_assisted ? `<span class="badge-ai">${t("ai_assisted")}</span>` : "";
  const mediaStyle = p.cover ? ` style="background-image:url('${base}${p.cover}')"` : "";
  return `
    <a class="card" href="${base}projets/projet.html?slug=${p.slug}" style="text-decoration:none;">
      <div class="card-media" data-category="${p.category}"${mediaStyle}></div>
      <div class="card-body">
        <h3>${title}</h3>
        <p>${desc}</p>
        <div class="tags">${p.tech.map((tg) => `<span class="tag">${tg}</span>`).join("")}${aiTag}</div>
      </div>
    </a>`;
}

async function renderHighlights() {
  const grid = document.getElementById("highlight-grid");
  if (!grid) return;
  const projects = await loadProjects();
  const lang = getLang();
  const featured = projects.filter((p) => p.featured);
  grid.innerHTML = featured.map((p) => projectCardHTML(p, lang)).join("");
}

async function renderProjectsGrid() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  const projects = await loadProjects();
  const lang = getLang();
  const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
  const filtered = activeFilter === "all" ? projects : projects.filter((p) => p.category === activeFilter);
  grid.innerHTML = filtered.map((p) => projectCardHTML(p, lang)).join("");
}

function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderProjectsGrid();
    });
  });
}

async function renderProjectDetail() {
  const container = document.getElementById("project-detail");
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const projects = await loadProjects();
  const p = projects.find((pr) => pr.slug === slug);
  const lang = getLang();
  if (!p) {
    container.innerHTML = `<div class="container"><p>Project not found.</p></div>`;
    return;
  }
  document.title = `${p[`title_${lang}`] || p.title_fr} — Gabriel Combe-Ounkham`;
  const d = p.detail || {};
  const links = p.links || {};
  const linkButtons = [];
  if (links.itch) linkButtons.push(`<a class="btn btn-primary" href="${links.itch}" target="_blank" rel="noopener">${t("link_itch")}</a>`);
  if (links.repo) linkButtons.push(`<a class="btn ${links.itch ? "btn-secondary" : "btn-primary"}" href="${links.repo}" target="_blank" rel="noopener">${t("link_repo")}</a>`);
  if (links.demo) linkButtons.push(`<a class="btn btn-secondary" href="${links.demo}" target="_blank" rel="noopener">${t("link_demo")}</a>`);
  if (links.release) linkButtons.push(`<a class="btn btn-secondary" href="${links.release}" target="_blank" rel="noopener">${t("link_release")}</a>`);
  (links.extra || []).forEach((e) => linkButtons.push(`<a class="btn btn-secondary" href="${e.url}" target="_blank" rel="noopener">${e.label}</a>`));

  const base = document.body.dataset.base || "";
  const media = (d.media || [])
    .map((m) =>
      m.type === "video"
        ? `<video controls src="${base}${m.src}"></video>`
        : `<img src="${base}${m.src}" alt="${m.caption || ""}" loading="lazy" />`
    )
    .join("");

  const coverHTML = p.cover
    ? `<div class="project-cover" style="background-image:url('${base}${p.cover}')" data-category="${p.category}"></div>`
    : "";

  const playHTML = p.play_embed
    ? `<section class="project-section">
        <div class="container">
          <h2>${lang === "fr" ? "Jouer" : "Play"}</h2>
          <div class="game-embed-wrapper" id="game-embed-wrapper">
            <button class="game-expand-btn" id="game-expand-btn" title="${lang === "fr" ? "Agrandir" : "Expand"}">⛶</button>
            <iframe src="${base}${p.play_embed}" allow="fullscreen; autoplay" allowfullscreen loading="lazy"></iframe>
          </div>
        </div>
      </section>`
    : "";

  container.innerHTML = `
    ${coverHTML}
    <section class="project-hero">
      <div class="container">
        <p><a href="../projets.html">${t("back_projects")}</a></p>
        <h1>${p[`title_${lang}`] || p.title_fr}</h1>
        <div class="tags">
          ${p.tech.map((tg) => `<span class="tag">${tg}</span>`).join("")}
          ${p.ai_assisted ? `<span class="badge-ai">${t("ai_assisted")}</span>` : ""}
        </div>
        <div class="project-meta">${linkButtons.join("")}</div>
      </div>
    </section>
    ${playHTML}
    <section class="project-section">
      <div class="container">
        <h2>${lang === "fr" ? "Présentation" : "Overview"}</h2>
        <p>${d[`overview_${lang}`] || ""}</p>
      </div>
    </section>
    <section class="project-section">
      <div class="container">
        <h2>${lang === "fr" ? "Stack technique" : "Tech stack"}</h2>
        <p>${d[`stack_${lang}`] || ""}</p>
      </div>
    </section>
    <section class="project-section">
      <div class="container">
        <h2>${lang === "fr" ? "Défis" : "Challenges"}</h2>
        <p>${d[`challenges_${lang}`] || ""}</p>
      </div>
    </section>
    ${media ? `<section class="project-section"><div class="container"><h2>${lang === "fr" ? "Médias" : "Media"}</h2><div class="media-grid">${media}</div></div></section>` : ""}
  `;

  if (p.play_embed) initGameExpand();
}

function initGameExpand() {
  const wrapper = document.getElementById("game-embed-wrapper");
  const btn = document.getElementById("game-expand-btn");
  if (!wrapper || !btn) return;
  const collapse = () => {
    wrapper.classList.remove("expanded");
    document.body.classList.remove("no-scroll");
    btn.textContent = "⛶";
  };
  btn.addEventListener("click", () => {
    const isExpanded = wrapper.classList.toggle("expanded");
    document.body.classList.toggle("no-scroll", isExpanded);
    btn.textContent = isExpanded ? "✕" : "⛶";
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && wrapper.classList.contains("expanded")) collapse();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  renderProjectsGrid();
  renderProjectDetail();
});
document.addEventListener("langchange", () => {
  renderProjectsGrid();
  renderProjectDetail();
});
