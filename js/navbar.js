// js/navbar.js
// Navbar + Guardia de rutas: si una página es privada y no hay sesión, manda al login.


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

// === Helpers de autenticación robustos ===

// Intenta parsear JSON sin romper la app
function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Lee de localStorage o sessionStorage (el que tenga el dato)
function readAnyStorage(key) {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key);
}

// Intenta encontrar un usuario guardado con distintos nombres posibles
function getCurrentUser() {
  const candidates = ["user", "currentUser", "authUser", "usuario"];

  for (const key of candidates) {
    const raw = readAnyStorage(key);
    const obj = safeParse(raw);
    if (obj && typeof obj === "object") {
      return obj; // encontramos un usuario válido
    }
  }
  return null; // no hay usuario
}

// Devuelve true/false según haya usuario
function isLoggedIn() {
  return !!getCurrentUser();
}

// --- Guardia: si estoy parado en una privada y no hay sesión, redirige al login ---
function enforceAuthOnPageLoad() {
  // Ej: "/ecommerce-aw1/pages/ExploraCiudad.html"
  const currentPath = window.location.pathname;

  // Me quedo solo con el nombre del archivo: "ExploraCiudad.html"
  const currentFile = currentPath.split("/").pop();

  // Busco en el array pages por coincidencia de nombre de archivo
  const currentPage = pages.find(p => p.url.endsWith(currentFile));

  console.log("[GUARD]", { currentPath, currentFile, currentPage, logged: isLoggedIn() });

  // Si la página existe, requiere login y NO hay usuario -> redirijo
  if (currentPage && currentPage.requiresAuth && !isLoggedIn()) {
    window.location.href = "login.html";
  }
}


// === 6) Arranque ===
document.addEventListener("DOMContentLoaded", () => {
  enforceAuthOnPageLoad();
  mountNavbar();
  attachNavGuard();
});




