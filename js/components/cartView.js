// js/components/cartView.js
// ==========================================
// Lógica para pintar el carrito en carrito.html
// ==========================================

// Formateador de moneda ARS (igual que en cards.js)
const moneyAR = new Intl.NumberFormat("es-AR", { 
  style: "currency", 
  currency: "ARS" 
}); // convierte 12500 en $ 12.500,00

document.addEventListener("DOMContentLoaded", () => {

  // Contenedor donde se pintan los items del carrito
  const container = document.getElementById("cartItems");
  // Elemento donde mostramos el total del carrito
  const cartTotalEl = document.getElementById("cartTotal");

  // Dibuja el carrito en pantalla
  function renderCart() {
    const cart = getCart(); // viene de cartStorage.js (usa localStorage)

    // Si el carrito está vacío
    if (!cart || cart.length === 0) {
      container.innerHTML = `<p class="empty">Tu carrito está vacío.</p>`;
      cartTotalEl.innerHTML = "";
      return;
    }

    // Armamos el HTML de cada ítem del carrito
    container.innerHTML = cart.map(item => `
      <article class="cart-item" data-id="${item.id}">
        <img src="${item.imagen}" class="cart-thumb" alt="${item.titulo}">
        
        <div class="cart-info">
          <h3>${item.titulo}</h3>
          <p>Categoría: ${item.categoria}</p>
          <p>Precio: ${moneyAR.format(item.precio)}</p>
          <p>Cantidad: ${item.cantidad}</p>
        </div>

        <div class="cart-actions">
          <button class="btn btn--danger" data-action="delete">Eliminar</button>
        </div>
      </article>
    `).join("");

    // Calculamos el total del carrito
    const total = cart.reduce((acc, item) => {
      return acc + item.precio * item.cantidad;
    }, 0);

    // Pintamos el total
    cartTotalEl.innerHTML = `
      <h2>Total: ${moneyAR.format(total)}</h2>
    `;
  }

  // Delegación de eventos para eliminar un item del carrito
  container.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-action='delete']");
    if (!btn) return; // si no se hizo click en un botón "Eliminar", no hago nada

    const card = btn.closest(".cart-item");   // contenedor del ítem
    const id = Number(card.dataset.id);       // leemos el id del data-id

    let cart = getCart();                     // carrito actual
    cart = cart.filter(item => item.id !== id); // filtramos el item eliminado
    saveCart(cart);                           // guardamos el carrito actualizado

    renderCart();                             // redibujamos el carrito
  });

  // Render inicial cuando carga la página
  renderCart();
});

