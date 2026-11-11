// Descarga y lectura de los CSV publicados de la hoja; validación de filas de productos y datos del negocio.
import { normalizar, textoACentimos } from "./formato.js";

/** Tiempo máximo de espera por cada pestaña. */
export const TIEMPO_ESPERA_MS = 8000;

/* ---------- Lector de CSV propio (sin librerías) ---------- */

/**
 * Convierte texto CSV en una lista de filas (listas de celdas). Soporta comillas dobles,
 * comas y saltos de línea dentro de una celda, comillas escapadas (""), BOM al inicio y
 * saltos de línea \r\n. Las líneas totalmente vacías se omiten.
 */
export function parsearCsv(texto) {
  const entrada = String(texto ?? "").replace(/^\uFEFF/, "");
  const filas = [];
  let fila = [];
  let celda = "";
  let entreComillas = false;

  const cerrarCelda = () => {
    fila.push(celda);
    celda = "";
  };
  const cerrarFila = () => {
    cerrarCelda();
    if (!(fila.length === 1 && fila[0] === "")) filas.push(fila);
    fila = [];
  };

  for (let i = 0; i < entrada.length; i++) {
    const c = entrada[i];
    if (entreComillas) {
      if (c === '"') {
        if (entrada[i + 1] === '"') {
          celda += '"';
          i++;
        } else {
          entreComillas = false;
        }
      } else {
        celda += c;
      }
    } else if (c === '"') {
      entreComillas = true;
    } else if (c === ",") {
      cerrarCelda();
    } else if (c === "\r") {
      if (entrada[i + 1] === "\n") i++;
      cerrarFila();
    } else if (c === "\n") {
      cerrarFila();
    } else {
      celda += c;
    }
  }
  if (celda !== "" || fila.length > 0) cerrarFila();
  return filas;
}

/**
 * Convierte texto CSV en una lista de objetos, uno por fila, indexados por el **nombre** de
 * la columna (encabezado normalizado: sin tildes, mayúsculas ni espacios sobrantes), no por
 * su posición. Si se pasa `columnas`, se conservan solo esas y las demás se ignoran.
 * Si un encabezado se repite, vale el primero.
 */
export function leerFilas(texto, columnas) {
  const [encabezados, ...datos] = parsearCsv(texto);
  if (!encabezados) return [];
  const nombres = encabezados.map(normalizar);
  const permitidas = columnas ? new Set(columnas.map(normalizar)) : null;

  return datos.map((celdas) => {
    const objeto = Object.create(null);
    nombres.forEach((nombre, i) => {
      if (nombre === "" || nombre in objeto) return;
      if (permitidas && !permitidas.has(nombre)) return;
      objeto[nombre] = celdas[i] ?? "";
    });
    return objeto;
  });
}

/* ---------- Descarga ---------- */

/**
 * Descarga un CSV como UTF-8, sin usar la caché del navegador y con tiempo máximo.
 * Lanza un Error con el motivo si falla (sin conexión, HTTP distinto de 200, tiempo agotado).
 */
export async function descargarCsv(url, tiempoMs = TIEMPO_ESPERA_MS) {
  if (!url) throw new Error("Falta el enlace del CSV.");
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), tiempoMs);
  try {
    const respuesta = await fetch(url, { cache: "no-cache", signal: control.signal });
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    return await respuesta.text();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Tiempo de espera agotado (${tiempoMs / 1000} s).`);
    }
    throw error;
  } finally {
    clearTimeout(temporizador);
  }
}

/**
 * Descarga en paralelo las pestañas "Productos" y "Negocio" y devuelve sus filas crudas
 * por nombre de columna: `{ productos: [...], negocio: [...] }`. Si cualquiera falla,
 * lanza el error (quien llama decide si usa la copia guardada).
 */
export async function descargarHoja(config) {
  const [textoProductos, textoNegocio] = await Promise.all([
    descargarCsv(config.hojaProductosCsv),
    descargarCsv(config.hojaNegocioCsv),
  ]);
  return {
    productos: leerFilas(textoProductos),
    negocio: leerFilas(textoNegocio),
  };
}

/* ---------- Interpretación de la pestaña "Productos" ---------- */

/** Convierte el texto de la columna `orden` en número, o null si falta o no es un número. */
function leerOrden(texto) {
  const limpio = String(texto ?? "").trim().replace(",", ".");
  if (limpio === "") return null;
  const numero = Number(limpio);
  return Number.isFinite(numero) ? numero : null;
}

/**
 * Convierte las filas de la pestaña "Productos" (ya separadas por nombre de columna) en la
 * lista de productos que se muestran, según data-model.md. Una fila inválida se omite con
 * un aviso en la consola y no rompe el resto. Si no queda ningún producto válido devuelve
 * una lista vacía (la pantalla muestra el estado "Sin productos").
 *
 * Cada producto: { id, nombre, descripcion, precioCentimos, categoria, foto, disponible,
 * orden, posicion }. `categoria` queda vacía si la fila no la trae; `posicion` es el lugar
 * de la fila en la hoja (para desempatar el orden).
 */
export function interpretarProductos(filas) {
  const productos = [];
  const idsVistos = new Set();

  filas.forEach((fila, indice) => {
    const numeroFila = indice + 2; // la fila 1 de la hoja son los encabezados
    const nombre = String(fila.nombre ?? "").trim();
    if (nombre === "") {
      console.warn(`Fila ${numeroFila} de "Productos" omitida: falta el nombre.`);
      return;
    }

    const precioCentimos = textoACentimos(fila.precio);
    if (precioCentimos === null) {
      console.warn(`Fila ${numeroFila} de "Productos" omitida ("${nombre}"): el precio no es válido.`);
      return;
    }

    const id = String(fila.id ?? "").trim() || normalizar(nombre);
    if (idsVistos.has(id)) {
      console.warn(`Fila ${numeroFila} de "Productos" omitida ("${nombre}"): el id "${id}" está repetido.`);
      return;
    }
    idsVistos.add(id);

    const estado = normalizar(fila.disponible);
    productos.push({
      id,
      nombre,
      descripcion: String(fila.descripcion ?? "").trim(),
      precioCentimos,
      categoria: String(fila.categoria ?? "").trim(),
      foto: String(fila.foto ?? "").trim(),
      disponible: !(estado === "no" || estado === "agotado"),
      orden: leerOrden(fila.orden),
      posicion: indice,
    });
  });

  return productos;
}

/* ---------- Interpretación de la pestaña "Negocio" ---------- */

const METODOS_DE_PAGO = {
  yape: "Yape",
  plin: "Plin",
  efectivo: "Efectivo",
  transferencia: "Transferencia",
};

/**
 * Convierte las filas de la pestaña "Negocio" (columnas `clave` y `valor`) en los datos del
 * negocio: { nombre, logo, metodosPago, yape: {numero, titular}, plin: {numero, titular} }.
 * `nombre` queda vacío si falta (quien lo muestra usa "Catálogo"). `metodosPago` solo
 * conserva los valores reconocidos. Si una clave se repite vale la primera. El número de
 * WhatsApp NUNCA se lee de la hoja: está en config.js.
 */
export function interpretarNegocio(filas) {
  const datos = Object.create(null);
  for (const fila of filas) {
    const clave = normalizar(fila.clave);
    if (clave !== "" && !(clave in datos)) datos[clave] = String(fila.valor ?? "").trim();
  }

  const metodosPago = [];
  for (const parte of (datos.metodos_pago ?? "").split(",")) {
    const metodo = METODOS_DE_PAGO[normalizar(parte)];
    if (metodo && !metodosPago.includes(metodo)) metodosPago.push(metodo);
  }

  return {
    nombre: datos.nombre ?? "",
    logo: datos.logo ?? "",
    metodosPago,
    yape: { numero: datos.yape_numero ?? "", titular: datos.yape_titular ?? "" },
    plin: { numero: datos.plin_numero ?? "", titular: datos.plin_titular ?? "" },
  };
}
