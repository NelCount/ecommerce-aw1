// js/components/cartStorage.js
// ======================================
// Helpers para manejar el carrito en localStorage
// ======================================

// Clave única donde se guarda el carrito
const CART_KEY = "cart"; 

// Lee el carrito desde localStorage y siempre devuelve un array
function getCart() {
  // Traemos la cadena JSON guardada
  const raw = localStorage.getItem(CART_KEY);

  if (!raw) {
    // Si no hay nada guardado, devuelve un array vacío
    return [];
  }

  try {
    // Intentamos convertir el JSON a objeto/array
    const parsed = JSON.parse(raw);

    // Si por algún motivo no es un array, devolvemos array vacío
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error al parsear el carrito desde localStorage:", error);
    return [];
  }
}

// Guarda el carrito (array de items) en localStorage
function saveCart(cartArray) {
  // Convertimos el array a texto JSON
  const json = JSON.stringify(cartArray);
  localStorage.setItem(CART_KEY, json);
}

// Agrega un producto al carrito
function addToCart(product) {
  console.log("[CART] agregando producto:", product);

  const cart = getCart();

  // 👉 Leemos la cantidad enviada por la card (si no viene, usamos 1)
  const qty = Number(product.cantidad) || 1;

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    // 👉 Sumamos la cantidad real seleccionada, NO 1
    existing.cantidad += qty;
  } else {
    // 👉 Guardamos el producto con la cantidad real
    const newItem = {
      id: product.id,
      titulo: product.titulo,
      precio: product.precio,
      imagen: product.imagen,
      categoria: product.categoria,
      cantidad: qty,  // ← USAMOS qty
    };
    cart.push(newItem);
  }

  saveCart(cart);

  console.log("Carrito actualizado:", cart);
}



// Elimina un producto por ID
function removeFromCart(productId) {
  const cart = getCart();
  const filtered = cart.filter(item => item.id !== productId);
  saveCart(filtered);
  console.log("[CART] item eliminado:", productId);
}
