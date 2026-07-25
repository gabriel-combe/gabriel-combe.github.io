// Simple FR/EN dictionary-based i18n. Static text uses data-i18n="key" on elements.
const I18N = {
  fr: {
    nav_projects: "Projets",
    nav_cv: "CV",
    nav_path: "Parcours",
    lang_switch: "EN",
    hero_title: "Gabriel Combe-Ounkham",
    hero_subtitle: "Développeur de jeux vidéo & d'outils — programmation, hardware VR, IA et graphisme temps réel.",
    hero_cta_projects: "Voir mes projets",
    hero_cta_cv: "Voir mon CV",
    home_highlights_title: "Quelques projets phares",
    home_see_all: "Voir tous les projets →",
    filter_all: "Tous",
    filter_programmation: "Programmation",
    filter_outils: "Outils",
    filter_jeux: "Jeux",
    filter_hardware: "Hardware / VR",
    filter_academique: "Projets académiques",
    projects_title: "Projets",
    projects_subtitle: "Une sélection de mes projets personnels, académiques et open-source.",
    link_repo: "Dépôt GitHub",
    link_demo: "Démo",
    link_release: "Version compilée",
    link_itch: "itch.io",
    ai_assisted: "Développé avec l'aide de Claude Code",
    back_projects: "← Retour aux projets",
    cv_title: "CV",
    cv_subtitle: "Compétences, logiciels et certificats.",
    cv_skills_lang: "Langages",
    cv_skills_soft: "Logiciels & outils",
    cv_skills_domains: "Domaines",
    cv_certs: "Certificats",
    cv_languages: "Langues",
    cv_see_path: "Voir mon parcours →",
    path_title: "Parcours",
    path_subtitle: "Expériences et études.",
    path_education: "Études",
    path_experience: "Expériences",
    contact_email: "Email",
  },
  en: {
    nav_projects: "Projects",
    nav_cv: "Resume",
    nav_path: "Timeline",
    lang_switch: "FR",
    hero_title: "Gabriel Combe-Ounkham",
    hero_subtitle: "Game & tools developer — programming, VR hardware, AI and real-time graphics.",
    hero_cta_projects: "See my projects",
    hero_cta_cv: "See my resume",
    home_highlights_title: "A few highlighted projects",
    home_see_all: "See all projects →",
    filter_all: "All",
    filter_programmation: "Programming",
    filter_outils: "Tools",
    filter_jeux: "Games",
    filter_hardware: "Hardware / VR",
    filter_academique: "Academic projects",
    projects_title: "Projects",
    projects_subtitle: "A selection of my personal, academic and open-source projects.",
    link_repo: "GitHub repo",
    link_demo: "Demo",
    link_release: "Compiled build",
    link_itch: "itch.io",
    ai_assisted: "Built with the help of Claude Code",
    back_projects: "← Back to projects",
    cv_title: "Resume",
    cv_subtitle: "Skills, software and certificates.",
    cv_skills_lang: "Languages",
    cv_skills_soft: "Software & tools",
    cv_skills_domains: "Domains",
    cv_certs: "Certificates",
    cv_languages: "Spoken languages",
    cv_see_path: "See my timeline →",
    path_title: "Timeline",
    path_subtitle: "Experience and education.",
    path_education: "Education",
    path_experience: "Experience",
    contact_email: "Email",
  },
};

function getLang() {
  return localStorage.getItem("lang") || "en";
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
  applyI18n();
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

function t(key) {
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || I18N.fr[key] || key;
}

function applyI18n() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyI18n();
  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
});
