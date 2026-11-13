(function () {
  "use strict";
  const page = (name, path, title) => ({
    name,
    path,
    title,
  });

  const routes = [
    page("home", "/", "Code By Lissa | Home"),
    page("about", "/about", "About | Code By Lissa"),
    page("resume", "/resume", "Resume & Expertise | Code By Lissa"),
    page("projects", "/projects", "Projects | Code By Lissa"),
    page("outage", "/outage-template", "Outage Template Demo | Code By Lissa"),
    page("repeat-outage", "/repeat-outage-template", "Repeat Outage Email Demo | Code By Lissa"),
    page("rpg-demo", "/rpg-demo", "RPG Character Maker Demo | Code By Lissa"),
  ];
  const notFound = page("not-found", "*", "Page Not Found | Code By Lissa");

  // ----- Header / footer behavior -----
  document.getElementById("current-year").textContent = new Date().getFullYear();

  const nav = document.getElementById("primary-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = nav.querySelectorAll(".nav-link");

  function setNavOpen(open) {
    nav.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }
  navToggle.addEventListener("click", () => setNavOpen(!nav.classList.contains("open")));
  navLinks.forEach((link) => link.addEventListener("click", () => setNavOpen(false)));

  function markActive(path) {
    navLinks.forEach((link) => {
      const target = link.getAttribute("href").replace(/^#/, "");
      link.classList.toggle("active", target === path);
    });
  }

  createRouter(routes, {
    outlet: document.getElementById("router-outlet"),
    notFound,
    onNavigate: markActive,
  }).start();
})();
