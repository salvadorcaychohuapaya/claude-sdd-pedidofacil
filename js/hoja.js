// Descarga y lectura de los CSV publicados de la hoja; validación de filas de productos y datos del negocio.
import { normalizar } from "./formato.js";

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
    const objeto = {};
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
