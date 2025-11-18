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
// - product debe ser un objeto con al menos: id, titulo, precio, imagen, categoria
function addToCart(product) {
    console.log("[CART] agregando producto:", product);
  // 1) Traemos el carrito actual
  const cart = getCart();

  // 2) Buscamos si el producto ya existe por ID
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    // Si ya estaba en el carrito, solo aumentamos la cantidad
    existing.cantidad += 1;
  } else {
    // Si no estaba, lo agregamos con cantidad 1
    const newItem = {
      id: product.id,
      titulo: product.titulo,
      precio: product.precio,
      imagen: product.imagen,
      categoria: product.categoria,
      cantidad: 1, 
    };
    cart.push(newItem);
  }

  // 3) Guardamos el carrito actualizado
  saveCart(cart);

  // 4) Mensaje de actualización por consola
  console.log("Carrito actualizado:", cart);
}

// Elimina un producto por ID
function removeFromCart(productId) {
  const cart = getCart();
  const filtered = cart.filter(item => item.id !== productId);
  saveCart(filtered);
  console.log("[CART] item eliminado:", productId);
}
