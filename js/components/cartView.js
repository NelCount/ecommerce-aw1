// js/components/cartView.js
// ======================================
// Vista del carrito: lee localStorage y dibuja las reservas
// ======================================

// Formateador de moneda ARS (por si no está definido acá)
const moneyAR =
  window.moneyAR ||
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

// Renderiza el carrito en el DOM
function renderCart() {
  console.log("[CART VIEW] renderCart ejecutado ✅");

  // 1) Leemos el carrito desde localStorage
  const cartItems = getCart(); // usa el helper de cartStorage.js
  console.log("[CART VIEW] items en carrito:", cartItems);

  // 2) Buscamos los elementos del DOM
  const listEl = document.querySelector("[data-cart-list]");
  const emptyEl = document.querySelector("[data-cart-empty]");
  const totalEl = document.querySelector("[data-cart-total]");

  if (!listEl || !emptyEl || !totalEl) {
    console.warn(
      "[CART VIEW] No se encontraron contenedores de carrito en el DOM"
    );
    return;
  }

  // 3) Si no hay items, mostramos mensaje vacío
  if (!cartItems.length) {
    emptyEl.style.display = "block";
    listEl.innerHTML = "";
    totalEl.textContent = moneyAR.format(0);
    return;
  }

  // 4) Si hay items, ocultamos mensaje vacío y dibujamos la lista
  emptyEl.style.display = "none";

  let total = 0;

  const html = cartItems
    .map((item) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;

      return `
        <article class="cart-item">
            
          <div class="cart-item__media">
            <img src="${item.imagen}" alt="${item.titulo}" class="cart-item__img">
          </div>

          <div class="cart-item__info">
            <h3 class="cart-item__title">${item.titulo}</h3>
            <p class="cart-item__category">${item.categoria}</p>
            <p class="cart-item__qty">Cantidad: ${item.cantidad}</p>
          </div>

          <div class="cart-item__prices">
            <p class="cart-item__price-unit">Precio: ${moneyAR.format(item.precio)}</p>
            <p class="cart-item__price-sub">Subtotal: ${moneyAR.format(item.precio * item.cantidad)}</p>

            <button class="cart-item__delete btn-danger" data-delete-id="${item.id}">
              Eliminar
            </button>
          </div>

        </article>
      `;

    })
    .join("");

  listEl.innerHTML = html;
  totalEl.textContent = moneyAR.format(total);

  // Botones de eliminar
document.querySelectorAll("[data-delete-id]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = Number(btn.dataset.deleteId);

    if (confirm("¿Seguro que deseas eliminar este producto del carrito?")) {
      removeFromCart(id);
      renderCart(); // volvemos a dibujar la vista del carrito
    }
  });
});

}

// 5) Ejecutamos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});


