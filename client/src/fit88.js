function acceptCookies() {
  localStorage.setItem("fit88-cookies", "accepted");
  document.getElementById("cookieBanner")?.classList.remove("show");
}

function declineCookies() {
  localStorage.setItem("fit88-cookies", "declined");
  document.getElementById("cookieBanner")?.classList.remove("show");
}

function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.querySelector('[name="name"]').value;
  const email = form.querySelector('[name="email"]').value;
  const message = form.querySelector('[name="message"]').value;
  const subject = encodeURIComponent(`Kontaktanfrage von ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\n${message}`);
  window.location.href = `mailto:info@fit88.de?subject=${subject}&body=${body}`;
}

const WA_NUMBERS = { ar: "491744888845", de: "491625333817" };

function syncWhatsAppLinks() {
  const german = document.documentElement.getAttribute("lang") === "de";
  const number = german ? WA_NUMBERS.de : WA_NUMBERS.ar;
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((a) => {
    if (a.classList.contains("wa-team")) return;
    a.setAttribute("href", `https://wa.me/${number}`);
  });
}

function applyLang(lang) {
  const german = lang === "de";
  document.body.classList.toggle("lang-de", german);
  document.documentElement.setAttribute("lang", german ? "de" : "ar");
  document.documentElement.setAttribute("dir", german ? "ltr" : "rtl");
  document.documentElement.setAttribute("translate", "no");
  document.documentElement.classList.add("notranslate");
  document.querySelectorAll("[lang=ar], [lang=de]").forEach((element) => {
    element.hidden = element.getAttribute("lang") !== (german ? "de" : "ar");
  });
  localStorage.setItem("fit88-lang", lang);
  syncWhatsAppLinks();
  const button = document.querySelector(".lang-toggle");
  if (button) button.textContent = german ? "العربية" : "Deutsch";
}

function syncCourseToggleLabels() {
  const lang = document.documentElement.getAttribute("lang") || "ar";
  document.querySelectorAll(".course-card").forEach((card) => {
    const btn = card.querySelector(".course-toggle");
    if (!btn) return;
    const open = card.classList.contains("open");
    const key = `${open ? "close" : "open"}${lang === "de" ? "De" : "Ar"}`;
    const label = btn.querySelector(".course-toggle-label");
    if (label && btn.dataset[key]) label.textContent = btn.dataset[key];
    btn.setAttribute("aria-expanded", String(open));
  });
}

function initCourseToggles() {
  document.querySelectorAll(".course-card").forEach((card) => {
    const btn = card.querySelector(".course-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      card.classList.toggle("open");
      syncCourseToggleLabels();
    });
  });
  syncCourseToggleLabels();
}

function keepSitePath(event) {
  const link = event.currentTarget;
  const target = link.getAttribute("href");
  if (!target || target.startsWith("#") || target.startsWith("http")) return;
  event.preventDefault();
  window.location.href = `${window.location.pathname.replace(/[^/]*$/, "")}${target}`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Cookie banner buttons (data-cookie-action) — no inline event handlers,
  // so the CSP can keep script-src free of 'unsafe-inline'.
  document.addEventListener("click", (event) => {
    const trigger = event.target instanceof Element ? event.target.closest("[data-cookie-action]") : null;
    if (!trigger) return;
    if (trigger.getAttribute("data-cookie-action") === "accept") acceptCookies();
    if (trigger.getAttribute("data-cookie-action") === "decline") declineCookies();
  });
  document.querySelector(".contact-form")?.addEventListener("submit", handleContactSubmit);

  applyLang(localStorage.getItem("fit88-lang") || "ar");
  initCourseToggles();
  const banner = document.getElementById("cookieBanner");
  if (banner && !localStorage.getItem("fit88-cookies")) setTimeout(() => banner.classList.add("show"), 700);

  document.querySelector(".lang-toggle")?.addEventListener("click", () => {
    applyLang(document.body.classList.contains("lang-de") ? "ar" : "de");
    syncCourseToggleLabels();
  });
  const navButton = document.querySelector(".nav-toggle-btn");
  const nav = document.querySelector(".main-nav");
  const closeNav = () => {
    nav?.classList.remove("open");
    navButton?.setAttribute("aria-expanded", "false");
  };
  navButton?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    navButton.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
  document.querySelectorAll('a[href$=".html"]').forEach((link) => link.addEventListener("click", keepSitePath));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((link) => {
    if (link.getAttribute("href") === current) link.classList.add("active");
  });
  const header = document.querySelector(".site-header");
  const backToTop = document.getElementById("backToTop");
  const onScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 8);
    backToTop?.classList.toggle("visible", window.scrollY > 420);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  const reveal = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("show"); observer.unobserve(entry.target); }
    }), { threshold: 0.1 });
    reveal.forEach((element) => observer.observe(element));
  } else reveal.forEach((element) => element.classList.add("show"));
});
