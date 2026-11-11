// Estado del pedido: cantidades, subtotales y total calculados en céntimos enteros.
// El pedido (items, cliente y enviado) se guarda en el celular en cada cambio y se restaura al abrir la página.
// Los precios NO se guardan: se calculan siempre con el catálogo vigente (data-model.md, sección "Pedido").
import { CLAVES, escribir, leer } from "./almacenamiento.js";
import { centimosATexto } from "./formato.js";

export const CANTIDAD_MIN = 1;
export const CANTIDAD_MAX = 99;

const MODALIDADES = ["recojo", "delivery"];

function clienteVacio() {
  return { nombre: "", modalidad: "", direccion: "", referencia: "", metodoPago: "", comentario: "" };
}

/** Una cantidad válida es un entero entre 1 y 99. */
export function cantidadValida(cantidad) {
  return Number.isInteger(cantidad) && cantidad >= CANTIDAD_MIN && cantidad <= CANTIDAD_MAX;
}

/** Reconstruye el pedido desde lo guardado, descartando lo que no tenga la forma esperada. */
function restaurar(guardado) {
  const pedido = { items: [], cliente: clienteVacio(), enviado: false };
  if (!guardado || typeof guardado !== "object") return pedido;

  if (Array.isArray(guardado.items)) {
    const vistos = new Set();
    for (const item of guardado.items) {
      const id = typeof item?.id === "string" ? item.id : "";
      if (id === "" || vistos.has(id) || !cantidadValida(item.cantidad)) continue;
      vistos.add(id);
      pedido.items.push({ id, cantidad: item.cantidad });
    }
  }

  const cliente = guardado.cliente;
  if (cliente && typeof cliente === "object") {
    for (const campo of Object.keys(pedido.cliente)) {
      if (typeof cliente[campo] === "string") pedido.cliente[campo] = cliente[campo];
    }
    if (!MODALIDADES.includes(pedido.cliente.modalidad)) pedido.cliente.modalidad = "";
  }

  pedido.enviado = guardado.enviado === true;
  return pedido;
}

let estado = restaurar(leer(CLAVES.pedido));
const oyentes = new Set();

/** Guarda el pedido y avisa a quienes lo muestran. Cada `tipo` es "items", "cliente" o "enviado". */
function cambio(...tipos) {
  escribir(CLAVES.pedido, estado);
  for (const tipo of tipos) {
    for (const oyente of [...oyentes]) oyente(tipo);
  }
}

/** Registra una función que se llama en cada cambio. Devuelve otra función para dejar de escuchar. */
export function alCambiar(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

/** El pedido actual. Quien lo lee no debe modificarlo: los cambios pasan por las funciones de este módulo. */
export function obtenerPedido() {
  return estado;
}

/** Cantidad de un producto en el pedido (0 si no está). */
export function cantidadDe(id) {
  return estado.items.find((item) => item.id === id)?.cantidad ?? 0;
}

/**
 * Pone la cantidad de un producto. Devuelve "ok" si quedó con esa cantidad, "quitado" si bajó de 1
 * y se quitó del pedido, y "rechazado" si la cantidad no es un entero o pasa de 99 (no cambia nada).
 */
export function cambiarCantidad(id, cantidad) {
  if (!Number.isInteger(cantidad) || cantidad > CANTIDAD_MAX) return "rechazado";
  const indice = estado.items.findIndex((item) => item.id === id);

  if (cantidad < CANTIDAD_MIN) {
    if (indice === -1) return "quitado";
    estado.items.splice(indice, 1);
    cambio("items");
    return "quitado";
  }
  if (indice === -1) estado.items.push({ id, cantidad });
  else estado.items[indice].cantidad = cantidad;
  cambio("items");
  return "ok";
}

/** Agrega una unidad del producto. Devuelve false si ya está en el máximo (99). */
export function agregar(id) {
  return cambiarCantidad(id, cantidadDe(id) + 1) === "ok";
}

/** Quita el producto del pedido. */
export function quitar(id) {
  cambiarCantidad(id, 0);
}

/** Actualiza uno o varios datos del cliente (solo los campos conocidos y de tipo texto). */
export function actualizarCliente(parcial) {
  for (const campo of Object.keys(estado.cliente)) {
    if (typeof parcial[campo] !== "string") continue;
    if (campo === "modalidad" && parcial[campo] !== "" && !MODALIDADES.includes(parcial[campo])) continue;
    estado.cliente[campo] = parcial[campo];
  }
  cambio("cliente");
}

/** Marca (o desmarca) el pedido como enviado. No vacía el pedido. */
export function marcarEnviado(enviado = true) {
  estado.enviado = enviado === true;
  cambio("enviado");
}

/**
 * Calcula las líneas, subtotales y el total con el catálogo vigente, todo en céntimos enteros:
 * subtotal = precioCentimos × cantidad; total = suma de los subtotales.
 * Los items que no están en `productos` no se incluyen (la revisión del pedido los quita).
 * Devuelve { lineas: [{ id, nombre, cantidad, precioCentimos, subtotalCentimos }], totalCentimos }.
 */
export function calcularResumen(items, productos) {
  const porId = new Map(productos.map((producto) => [producto.id, producto]));
  const lineas = [];
  let totalCentimos = 0;
  for (const item of items) {
    const producto = porId.get(item.id);
    if (!producto) continue;
    const subtotalCentimos = producto.precioCentimos * item.cantidad;
    totalCentimos += subtotalCentimos;
    lineas.push({
      id: producto.id,
      nombre: producto.nombre,
      cantidad: item.cantidad,
      precioCentimos: producto.precioCentimos,
      subtotalCentimos,
    });
  }
  return { lineas, totalCentimos };
}

/** Vacía el pedido y los datos del cliente ("Empezar un pedido nuevo"). */
export function vaciarPedido() {
  estado.items = [];
  estado.cliente = clienteVacio();
  estado.enviado = false;
  cambio("items", "cliente", "enviado");
}

/* ---------- Revisión del pedido contra el catálogo vigente ---------- */

// Textos visibles (fuente: contracts/textos-interfaz.md, "Avisos de la revisión previa al envío")
const AVISOS_REVISION = {
  agotado: (nombre) => `Quitamos "${nombre}" de tu pedido porque está agotado.`,
  noDisponible: (nombre) => `Quitamos "${nombre}" de tu pedido porque ya no está disponible.`,
  precio: (nombre, antes, ahora) => `El precio de "${nombre}" cambió de ${antes} a ${ahora}.`,
  metodoPago: "El método de pago que elegiste ya no está disponible. Elige otro.",
  cierre: "Revisa tu pedido y toca \"Enviar pedido\" otra vez.",
};

/**
 * Revisa el pedido contra el catálogo vigente (`productos`) y lo corrige:
 * - Los productos agotados o que ya no están en la hoja se quitan, con aviso.
 * - Si el precio de un producto del pedido cambió, se mantiene y se avisa. Como los precios no se
 *   guardan en el pedido, el precio anterior sale de `anterior`: el catálogo que el cliente tenía en
 *   pantalla. Sin `anterior` no se puede detectar un cambio de precio.
 * - Si el método de pago elegido ya no está en `metodos`, se limpia la selección, con aviso.
 * Devuelve { avisos, hayCambios }. Si hay cambios, los avisos terminan con la invitación a volver a
 * tocar "Enviar pedido"; si no, `avisos` está vacío y el envío puede continuar.
 */
export function revisarPedido(productos, { anterior = null, metodos = null } = {}) {
  const vigente = new Map(productos.map((producto) => [producto.id, producto]));
  const previo = new Map((anterior ?? []).map((producto) => [producto.id, producto]));
  const avisos = [];
  const quedan = [];

  for (const item of estado.items) {
    const actual = vigente.get(item.id);
    const nombre = (actual ?? previo.get(item.id))?.nombre ?? item.id;
    if (!actual) {
      avisos.push(AVISOS_REVISION.noDisponible(nombre));
    } else if (!actual.disponible) {
      avisos.push(AVISOS_REVISION.agotado(nombre));
    } else {
      quedan.push(item);
      const antes = previo.get(item.id);
      if (antes && antes.precioCentimos !== actual.precioCentimos) {
        avisos.push(
          AVISOS_REVISION.precio(nombre, centimosATexto(antes.precioCentimos), centimosATexto(actual.precioCentimos))
        );
      }
    }
  }

  const tipos = [];
  if (quedan.length !== estado.items.length) {
    estado.items = quedan;
    tipos.push("items");
  }
  if (metodos && estado.cliente.metodoPago !== "" && !metodos.includes(estado.cliente.metodoPago)) {
    estado.cliente.metodoPago = "";
    avisos.push(AVISOS_REVISION.metodoPago);
    tipos.push("cliente");
  }
  if (tipos.length > 0) cambio(...tipos);

  if (avisos.length > 0) avisos.push(AVISOS_REVISION.cierre);
  return { avisos, hayCambios: avisos.length > 0 };
}
