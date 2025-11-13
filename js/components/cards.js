// js/components/cards.js

// Formateador de moneda ARS
const moneyAR = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

function createCard(exp) {
  const qty = exp.minPersonas ?? 1;
  const total = exp.precioPorPersona * qty;

  // Clases por categoría 
  const cardMod =
    exp.categoria === "aventura" ? "card--aventura" :
    exp.categoria === "sabores"  ? "card--sabores"  : "card--ciudad";

  return `
  <article class="card ${cardMod}" data-id="${exp.id}">
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
            <button class="qty__btn" data-action="dec" aria-label="Disminuir personas" ${qty <= (exp.minPersonas ?? 1) ? "disabled" : ""}>−</button>
            <output class="qty__value" data-role="qty" aria-live="polite">${qty}</output>
            <button class="qty__btn" data-action="inc" aria-label="Aumentar personas" ${exp.maxPersonas && qty >= exp.maxPersonas ? "disabled" : ""}>+</button>
          </div>

          <!-- Total dinámico -->
          <span class="total">Total: <strong data-role="total">${moneyAR.format(total)}</strong></span>
        </div>

        <!-- Derecha: CTA -->
        <button class="btn btn--primary" data-action="reservar">Reservar</button>
      </div>
    </div>
  </article>`;
}

function renderCards(data = []) {
  const container = document.querySelector(".cards.container");
  if (!container) return console.warn("No se encontró .cards.container");

  container.innerHTML = data.map(createCard).join("");

  // Delegación de eventos para + / − / reservar
  container.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-action]");
    if (!btn) return;

    const card = btn.closest(".card");
    const id = card?.dataset?.id;
    const exp = EXPERIENCIAS.find(x => x.id === id);
    if (!exp) return;

    const qtyEl   = card.querySelector("[data-role='qty']");
    const totalEl = card.querySelector("[data-role='total']");
    const decBtn  = card.querySelector("[data-action='dec']");
    const incBtn  = card.querySelector("[data-action='inc']");

    let qty = Number(qtyEl.textContent);
    const min = exp.minPersonas ?? 1;
    const max = exp.maxPersonas ?? Infinity;

    const action = btn.dataset.action;
    if (action === "dec") qty = Math.max(min, qty - 1);
    if (action === "inc") qty = Math.min(max, qty + 1);

    if (action === "reservar") {
      alert(`Reservaste "${exp.titulo}" para ${qty} persona(s). Total: ${moneyAR.format(exp.precioPorPersona * qty)}`);
      return;
    }

    // Actualizamos UI
    qtyEl.textContent = qty;
    totalEl.textContent = moneyAR.format(exp.precioPorPersona * qty);
    if (decBtn) decBtn.disabled = qty <= min;
    if (incBtn) incBtn.disabled = qty >= max;
  });
}

// Init seguro
// --- Inicialización segura al cargar el DOM ---
document.addEventListener("DOMContentLoaded", () => {
  if (typeof EXPERIENCIAS === "undefined") {
    console.error("No se encontró EXPERIENCIAS. ¿Cargaste experiencias.js?");
    return;
  }

  // Detecta en qué página esta el cliente
  const path = window.location.pathname.toLowerCase();
  let categoria = "";

  if (path.includes("exploraciudad")) categoria = "ciudad";
  else if (path.includes("viveaventura")) categoria = "aventura";
  else if (path.includes("saborestradiciones")) categoria = "sabores";

  // Filtra las experiencias según la categoría
  const experienciasFiltradas = EXPERIENCIAS.filter(e => e.categoria === categoria);

  console.log("Página actual:", path);
  console.log("Categoría detectada:", categoria);
  console.log("Experiencias filtradas:", experienciasFiltradas);

  renderCards(experienciasFiltradas);
});


