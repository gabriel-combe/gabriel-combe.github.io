// Renders skill bars (cv.html) and timeline (parcours.html) from JSON data.

function skillRowHTML(name, level) {
  const filled = Math.round(level / 20); // 0-100 -> 0-5 dots
  const dots = Array.from({ length: 5 }, (_, i) => `<span class="skill-dot${i < filled ? " filled" : ""}"></span>`).join("");
  return `
    <div class="skill-row">
      <span class="skill-row-name">${name}</span>
      <div class="skill-dots">${dots}</div>
    </div>`;
}

async function renderCV() {
  const el = document.getElementById("cv-content");
  if (!el) return;
  const res = await fetch(`${document.body.dataset.base || ""}assets/data/cv.json`);
  const data = await res.json();
  const lang = getLang();

  const langGroup = data.skills.languages.map((s) => skillRowHTML(s.name, s.level)).join("");
  const softGroup = data.skills.software.map((s) => skillRowHTML(s.name, s.level)).join("");
  const domainGroup = data.skills.domains.map((s) => skillRowHTML(s[`name_${lang}`] || s.name_fr, s.level)).join("");

  const certs = data.certificates
    .map((c) => {
      const title = c[`title_${lang}`] || c.title || c.title_fr;
      const date = c[`date_${lang}`] || c.date || c.date_fr;
      return `<li><strong>${title}</strong><br /><span class="cert-issuer">${c.issuer} — ${date}</span></li>`;
    })
    .join("");

  const langsSpoken = data.languages_spoken
    .map((l) => `<li>${l[`name_${lang}`] || l.name_fr}</li>`)
    .join("");

  el.innerHTML = `
    <div class="skill-group">
      <h2>${t("cv_skills_lang")}</h2>
      <div class="skill-grid">${langGroup}</div>
    </div>
    <div class="skill-group">
      <h2>${t("cv_skills_soft")}</h2>
      <div class="skill-grid">${softGroup}</div>
    </div>
    <div class="skill-group">
      <h2>${t("cv_skills_domains")}</h2>
      <div class="skill-grid">${domainGroup}</div>
    </div>
    <div class="skill-group">
      <h2>${t("cv_certs")}</h2>
      <ul class="cert-list">${certs}</ul>
    </div>
    <div class="skill-group">
      <h2>${t("cv_languages")}</h2>
      <ul>${langsSpoken}</ul>
    </div>
  `;

  // Re-run the reveal-on-scroll observer for the freshly injected skill rows.
  const revealTargets = el.querySelectorAll(".skill-row");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealTargets.forEach((el2) => observer.observe(el2));
}

function timelineItemHTML(item, lang) {
  return `
    <div class="timeline-item">
      <div class="date">${item.date}</div>
      <h3>${item[`title_${lang}`] || item.title_fr}</h3>
      <p><em>${item[`place_${lang}`] || item.place_fr}</em></p>
      <p>${item[`desc_${lang}`] || item.desc_fr}</p>
    </div>`;
}

async function renderParcours() {
  const eduEl = document.getElementById("timeline-education");
  const expEl = document.getElementById("timeline-experience");
  if (!eduEl && !expEl) return;
  const res = await fetch(`${document.body.dataset.base || ""}assets/data/parcours.json`);
  const data = await res.json();
  const lang = getLang();
  if (eduEl) eduEl.innerHTML = data.education.map((i) => timelineItemHTML(i, lang)).join("");
  if (expEl) expEl.innerHTML = data.experience.map((i) => timelineItemHTML(i, lang)).join("");

  const revealTargets = document.querySelectorAll(".timeline-item");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  renderCV();
  renderParcours();
});
document.addEventListener("langchange", () => {
  renderCV();
  renderParcours();
});
