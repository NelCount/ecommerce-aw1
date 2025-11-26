// js/data/homeHero.js
console.log("homeHero.js cargado ✅");

// Esta función revisa si el usuario está logueado
function isLoggedIn() {
  // Tu login guarda esto cuando es correcto:
  // localStorage.setItem("isAuthenticated", "true");
  return localStorage.getItem("isAuthenticated") === "true";
}

// Cuando el DOM está listo:
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded en homeHero ✅");

  // Buscamos el botón del hero en el Home
  const heroBtn = document.querySelector(".home-hero__btn");
  console.log("heroBtn encontrado:", heroBtn);

  // Si no existe (otra página), salimos
  if (!heroBtn) return;

  // Click en el botón "Explorar categorías"
  heroBtn.addEventListener("click", (ev) => {
    ev.preventDefault(); // Evita que use el href por defecto

    if (isLoggedIn()) {
      console.log("Usuario logueado → ir a ExploraCiudad");
      window.location.href = "./pages/ExploraCiudad.html";
    } else {
      console.log("Usuario NO logueado → ir a login");
      window.location.href = "./pages/login.html";
    }
  });
});


