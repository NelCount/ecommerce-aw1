// js/navbar.js
// Navbar + Guardia de rutas: si una página es privada y no hay sesión, manda al login.

import pages from "./pagesData.js"; 

// === 1) Detectar si hay sesión (usa la clave real isAuthenticated) ===
function isLoggedIn() {
  const ls = localStorage, ss = sessionStorage;

  // El auth.js guarda esto:
  const hasIsAuthenticated =
    (ls.getItem("isAuthenticated") === "true") || (ss.getItem("isAuthenticated") === "true");

  // Extras por si en el futuro se guardan otras claves:
  const hasUser =
    !!ls.getItem("user") || !!ss.getItem("user") ||
    !!ls.getItem("currentUser") || !!ss.getItem("currentUser") ||
    !!ls.getItem("usuario") || !!ss.getItem("usuario");

  const hasFlag =
    (ls.getItem("isLoggedIn") === "true") || (ss.getItem("isLoggedIn") === "true");

  return hasIsAuthenticated || hasUser || hasFlag;
}

// === 2) Helpers de navbar ===
function isActive(url) {
  const current = window.location.pathname.replace(/\/+$/, "");
  const target  = url.replace(/\/+$/, "");
  return current === target;
}

function buildLinks() {
  return pages.map(p => {
    const activeClass = isActive(p.url) ? "active" : "";
    return `<a href="${p.url}" class="${activeClass}" data-url="${p.url}">${p.title}</a>`;
  }).join("");
}

// === 3) Guardia al cargar: si estoy parado en una privada sin sesión -> login
function enforceAuthOnPageLoad() {
  const currentPath = window.location.pathname.replace(/\/+$/, "");
  const current = pages.find(p => p.url.replace(/\/+$/, "") === currentPath);
  if (current && current.requiresAuth && !isLoggedIn()) {
    const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/pages/login.html?returnTo=${returnTo}`;
  }
}

// === 4) Interceptor de clics: si el link es privado y no hay sesión -> login
function attachNavGuard() {
  const nav = document.querySelector(".navbar .nav-links");
  if (!nav) return;

  nav.addEventListener("click", (ev) => {
    const a = ev.target.closest("a");
    if (!a) return;

    const targetUrl = a.getAttribute("data-url") || a.getAttribute("href");
    const page = pages.find(p => p.url === targetUrl);
    if (page && page.requiresAuth && !isLoggedIn()) {
      ev.preventDefault();
      const returnTo = encodeURIComponent(targetUrl);
      window.location.href = `/pages/login.html?returnTo=${returnTo}`;
    }
  });
}

// === 5) Montar navbar + logout ===
function mountNavbar() {
  const navLinks = document.querySelector(".navbar .nav-links");
  if (navLinks) {
    navLinks.innerHTML = buildLinks();
  }

  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Limpiar todas las posibles claves de sesión
      ["isAuthenticated","user","currentUser","usuario","isLoggedIn","token","jwt","accessToken"]
        .forEach(k => { localStorage.removeItem(k); sessionStorage.removeItem(k); });

      // Ir al login
      window.location.href = "/pages/login.html";
    });
  }
}

// === 6) Arranque ===
document.addEventListener("DOMContentLoaded", () => {
  enforceAuthOnPageLoad();
  mountNavbar();
  attachNavGuard();
});




