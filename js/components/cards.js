// js/components/cards.js

// Formateador de moneda ARS
// Intl.NumberFormat nos permite formatear números como moneda en español de Argentina
const moneyAR = new Intl.NumberFormat("es-AR", { 
  style: "currency", 
  currency: "ARS" 
});

/**
 * Crea el HTML de una card a partir de una experiencia/producto
 * @param {Object} exp - Objeto experiencia (viene del JSON)
 * @returns {string} - HTML de la card
 */
function createCard(exp) {
  // Cantidad inicial de personas (usa minPersonas o 1 por defecto)
  const qty = exp.minPersonas ?? 1;
  // Total inicial = precio por persona * cantidad
  const total = exp.precioPorPersona * qty;

  // Clases por categoría para modificar el estilo de la card
  const cardMod =
    exp.categoria === "aventura" ? "card--aventura" :
    exp.categoria === "sabores"  ? "card--sabores"  : "card--ciudad";

  // Devolvemos un string de HTML con toda la estructura de la card
  // Agrego data-* con info útil para los botones + / - / reservar
  return `
  <article 
    class="card ${cardMod}" 
    data-id="${exp.id}"
    data-titulo="${exp.titulo}"
    data-precio="${exp.precioPorPersona}"
    data-min="${exp.minPersonas ?? 1}"
    data-max="${exp.maxPersonas ?? ''}"
  >
    <div class="card__media">
      <img src="${exp.img}" alt="${exp.titulo}" class="card__img">
      <span class="badge ${exp.badgeClass}">
        ${exp.categoria === "aventura" ? "Aventura" : exp.categoria === "sabores" ? "Sabores" : "Ciudad"}
      </span>
    </div>

    <div class="card__body">
      <h3 class="card__title">${exp.titulo}</h3>

      <ul class="card__meta">
        ${exp.ubicacion ? `<li>📍 ${exp.ubicacion}</li>` : ""}
        ${exp.duracion ? `<li>🕒 ${exp.duracion}</li>` : ""}
        ${exp.rating   ? `<li>⭐ ${exp.rating}</li>` : ""}
      </ul>

      <p class="card__desc">${exp.descripcion}</p>

      <div class="card__footer">
        <!-- Izquierda: precio base por persona + control de cantidad -->
        <div class="card__footer-left">
          <span class="price">${moneyAR.format(exp.precioPorPersona)}</span>
          <span class="price-note">/ persona</span>

          <!-- Control de cantidad (personas) -->
          <div class="qty" role="group" aria-label="Cantidad de personas">
            <button 
              class="qty__btn" 
              data-action="dec" 
              aria-label="Disminuir personas"
              ${qty <= (exp.minPersonas ?? 1) ? "disabled" : ""}
            >−</button>

            <output 
              class="qty__value" 
              data-role="qty" 
              aria-live="polite"
            >${qty}</output>

            <button 
              class="qty__btn" 
              data-action="inc" 
              aria-label="Aumentar personas"
              ${exp.maxPersonas && qty >= exp.maxPersonas ? "disabled" : ""}
            >+</button>
          </div>

          <!-- Total dinámico -->
          <span class="total">
            Total: 
            <strong data-role="total">
              ${moneyAR.format(total)}
            </strong>
          </span>
        </div>

        <!-- Derecha: CTA -->
        <button class="btn btn--primary" data-action="reservar">
          Reservar
        </button>
      </div>
    </div>
  </article>`;
}

/**
 * Renderiza una lista de experiencias en el contenedor dado
 * y configura los eventos de + / − / reservar.
 * @param {Array} data - Array de experiencias/ productos
 * @param {HTMLElement} container - Contenedor .cards.container donde se pintan las cards
 */
function renderCards(data = [], container) {
  // Si no nos pasan contenedor, buscamos el primero
  const target = container ?? document.querySelector(".cards.container");
  if (!target) {
    console.warn("No se encontró .cards.container para renderizar las cards");
    return;
  }

  // Insertamos todas las cards en el HTML
  target.innerHTML = data.map(createCard).join("");

  // Para evitar agregar múltiples listeners si se llama varias veces,
  // podemos marcar el contenedor cuando ya tiene eventos.
  if (target.dataset.cardsBound === "true") return;
  target.dataset.cardsBound = "true";

  // Delegación de eventos para + / − / reservar
  target.addEventListener("click", (ev) => {
    // Buscamos el botón más cercano con data-action
    const btn = ev.target.closest("[data-action]");
    if (!btn) return;

    // Buscamos la card a la que pertenece el botón
    const card = btn.closest(".card");
    if (!card) return;

    // Leemos los datos de la card desde los data-*
    const titulo = card.dataset.titulo;
    const precio = Number(card.dataset.precio);
    const min = Number(card.dataset.min || 1);
    const max = card.dataset.max ? Number(card.dataset.max) : Infinity;

    // Buscamos los elementos de cantidad y total dentro de la card
    const qtyEl   = card.querySelector("[data-role='qty']");
    const totalEl = card.querySelector("[data-role='total']");
    const decBtn  = card.querySelector("[data-action='dec']");
    const incBtn  = card.querySelector("[data-action='inc']");

    // Cantidad actual leída del output
    let qty = Number(qtyEl.textContent);

    const action = btn.dataset.action;

    // Actualizamos cantidad según la acción
    if (action === "dec") qty = Math.max(min, qty - 1);
    if (action === "inc") qty = Math.min(max, qty + 1);

    // Acción de reservar: mostramos un alert con el detalle
    if (action === "reservar") {
      alert(`Reservaste "${titulo}" para ${qty} persona(s). Total: ${moneyAR.format(precio * qty)}`);
      return;
    }

    // Actualizamos la UI: cantidad y total
    qtyEl.textContent = qty;
    totalEl.textContent = moneyAR.format(precio * qty);

    // Habilitamos / deshabilitamos botones según los límites
    if (decBtn) decBtn.disabled = qty <= min;
    if (incBtn) incBtn.disabled = qty >= max;
  });
}

// --- Inicialización al cargar el DOM ---
document.addEventListener("DOMContentLoaded", () => {
  // Buscamos secciones de categoría (páginas Explora/Vive/Sabores)
  const categorySections = document.querySelectorAll(".cards.container[data-category]");
  // Buscamos secciones de home con 2-3 productos por categoría
  const homeSections = document.querySelectorAll(".cards.container[data-home-category]");

  // Si no hay secciones donde pintar cards, no hacemos nada
  if (categorySections.length === 0 && homeSections.length === 0) {
    console.warn("No se encontraron secciones con data-category o data-home-category");
    return;
  }

  // Detectamos la ruta correcta del JSON según si estamos en /pages o en la raíz
  const DATA_URL = window.location.pathname.includes("/pages/")
    ? "../data/productos.json"  // desde páginas internas
    : "data/productos.json";    // desde index en la raíz

  // Pedimos los datos al JSON usando fetch
  fetch(DATA_URL)
    .then((response) => {
      if (!response.ok) {
        // Si la respuesta no es 200-299, lanzamos error
        throw new Error("No se pudo cargar productos.json");
      }
      // Parseamos el JSON a un array de objetos JS
      return response.json();
    })
    .then((productos) => {
      // ✅ Caso 1: páginas de una sola categoría
      categorySections.forEach((section) => {
        const categoria = section.dataset.category; // "ciudad", "aventura", "sabores"
        const filtrados = productos.filter((exp) => exp.categoria === categoria);
        renderCards(filtrados, section);
      });

      // ✅ Caso 2: home con 2-3 productos por categoría
      homeSections.forEach((section) => {
        const categoria = section.dataset.homeCategory; // "ciudad", "aventura", "sabores"
        const filtrados = productos.filter((exp) => exp.categoria === categoria);
        const limitados = filtrados.slice(0, 3); // nos quedamos solo con 3
        renderCards(limitados, section);
      });
    })
    .catch((error) => {
      // Si hay algún error (ruta, JSON mal formado, etc.), lo mostramos en consola
      console.error("Error cargando los productos:", error);
    });
});



