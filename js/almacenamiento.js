// Lectura y escritura en localStorage con respaldo en memoria si no está disponible.

/** Claves que usa la aplicación (ver data-model.md). */
export const CLAVES = {
  pedido: "pedidofacil:pedido:v1",
  catalogo: "pedidofacil:catalogo:v1",
};

// Respaldo: guarda el texto JSON de lo escrito durante esta visita.
const memoria = new Map();
let persistente = null; // null = aún no se probó

/** Prueba una sola vez si localStorage se puede usar (puede fallar en ventana privada o bloqueado). */
function probar() {
  if (persistente !== null) return persistente;
  try {
    const clavePrueba = "pedidofacil:prueba";
    localStorage.setItem(clavePrueba, "1");
    localStorage.removeItem(clavePrueba);
    persistente = true;
  } catch {
    persistente = false;
  }
  return persistente;
}

/** Indica si lo que se guarda sobrevivirá al cerrar la página. */
export function almacenamientoPersistente() {
  return probar();
}

/** Lee y convierte el JSON guardado en `clave`. Devuelve null si no hay nada o está dañado. */
export function leer(clave) {
  let texto = null;
  if (probar()) {
    try {
      texto = localStorage.getItem(clave);
    } catch {
      texto = null;
    }
  }
  if (texto === null) texto = memoria.get(clave) ?? null;
  if (texto === null) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

/**
 * Guarda `valor` como JSON. Devuelve true si quedó en localStorage y false si solo quedó en
 * memoria (almacenamiento no disponible o lleno).
 */
export function escribir(clave, valor) {
  const texto = JSON.stringify(valor);
  memoria.set(clave, texto);
  if (probar()) {
    try {
      localStorage.setItem(clave, texto);
      return true;
    } catch {
      // Cuota llena o bloqueado de pronto: se sigue en memoria durante esta visita.
      persistente = false;
    }
  }
  return false;
}

/** Borra lo guardado en `clave`. */
export function borrar(clave) {
  memoria.delete(clave);
  if (probar()) {
    try {
      localStorage.removeItem(clave);
    } catch {
      // Sin acceso: no hay nada más que borrar.
    }
  }
}

/* ---------- Copia del catálogo (pedidofacil:catalogo:v1) ---------- */

/** Guarda la copia del catálogo `{ guardadoEn, negocio, productos }`. Devuelve true si quedó en localStorage. */
export function guardarCopiaCatalogo(copia) {
  return escribir(CLAVES.catalogo, copia);
}

/** Lee la copia guardada tal como se escribió (null si no hay). La valida quien la usa (hoja.js). */
export function leerCopiaCatalogo() {
  return leer(CLAVES.catalogo);
}
