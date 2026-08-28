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

function applyLang(lang) {
  const german = lang === "de";
  document.body.classList.toggle("lang-de", german);
  document.documentElement.setAttribute("lang", german ? "de" : "ar");
  document.documentElement.setAttribute("dir", german ? "ltr" : "rtl");
  localStorage.setItem("fit88-lang", lang);
  const button = document.querySelector(".lang-toggle");
  if (button) button.textContent = german ? "العربية" : "Deutsch";
}

window.acceptCookies = acceptCookies;
window.declineCookies = declineCookies;
window.handleContactSubmit = handleContactSubmit;

document.addEventListener("DOMContentLoaded", () => {
  applyLang(localStorage.getItem("fit88-lang") || "ar");
  const banner = document.getElementById("cookieBanner");
  if (banner && !localStorage.getItem("fit88-cookies")) setTimeout(() => banner.classList.add("show"), 700);

  document.querySelector(".lang-toggle")?.addEventListener("click", () => {
    applyLang(document.body.classList.contains("lang-de") ? "ar" : "de");
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
