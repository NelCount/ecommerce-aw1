// js/auth.js
console.log("auth.js cargado correctamente ✅");

// =============================
// LOGIN
// =============================
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formLogin");
  if (form) {
    console.log("Login detectado ✅");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = (document.getElementById("email")?.value || "").trim();
      const password = (document.getElementById("password")?.value || "").trim();

      if (!email || !password) {
        alert("Completá email y contraseña.");
        return;
      }

      if (email === "demo@demo.com" && password === "123456") {
        localStorage.setItem("isAuthenticated", "true");
        window.location.href = "../index.html"; 
        return;
      }

      alert("Credenciales incorrectas ❌\nUsá: demo@demo.com / 123456");
    });
  }

// =============================
// LOGOUT
// =============================
  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-logout]");
    if (!btn) return;

    ev.preventDefault(); 
    const confirmar = confirm("¿Querés cerrar sesión?");
    if (!confirmar) return;

    
    localStorage.removeItem("isAuthenticated");

    
    const enPages = location.pathname.includes("/pages/");
    const destino = enPages ? "login.html" : "pages/login.html";
    window.location.href = destino;
  });

  // Log de control
  const iniciales = document.querySelectorAll("[data-logout]").length;
  console.log(`Logout listo (botones al cargar: ${iniciales})`);
});



