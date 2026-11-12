// Formato de dinero en soles, URL de fotos de Drive (urlFoto) y utilidades de texto.

/** Imagen que se usa cuando la foto falta, es inválida o no carga. */
export const IMAGEN_GENERICA = "img/generica.svg";

/** Valor que devuelve `textoACentimos` cuando el precio no es válido. */
export const INVALIDO = null;

/* ---------- Dinero (siempre en céntimos enteros, sin decimales flotantes) ---------- */

/**
 * Convierte céntimos enteros a texto `S/ 0.00` usando solo división y resto enteros.
 * Ejemplo: 3249 → "S/ 32.49".
 */
export function centimosATexto(centimos) {
  const total = Math.trunc(Number(centimos)) || 0;
  const signo = total < 0 ? "-" : "";
  const absoluto = Math.abs(total);
  const soles = Math.floor(absoluto / 100);
  const resto = absoluto % 100;
  return `${signo}S/ ${soles}.${resto < 10 ? "0" : ""}${resto}`;
}

/**
 * Convierte el texto de un precio a céntimos enteros, leyendo los dígitos como texto
 * (sin pasar por números decimales). Acepta `12`, `12.5`, `12.50` y `12,50`.
 * Devuelve INVALIDO (null) si está vacío, es cero, negativo o no es un número.
 */
export function textoACentimos(texto) {
  const limpio = String(texto ?? "").trim();
  const partes = /^([0-9]{1,7})(?:[.,]([0-9]{1,2}))?$/.exec(limpio);
  if (!partes) return INVALIDO;
  const soles = parseInt(partes[1], 10);
  const decimales = (partes[2] ?? "").padEnd(2, "0");
  const centimos = soles * 100 + parseInt(decimales || "0", 10);
  return centimos > 0 ? centimos : INVALIDO;
}

/* ---------- Texto ---------- */

/**
 * Normaliza un texto para compararlo: quita espacios al inicio y al final (y reduce los
 * repetidos), ignora mayúsculas y tildes. Ejemplo: " SÍ " → "si".
 */
export function normalizar(texto) {
  return String(texto ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/* ---------- Fotos ---------- */

/**
 * Devuelve la URL que se debe usar en la etiqueta <img> para el texto de la celda `foto`
 * (o `logo`). Quien muestre la imagen debe poner `referrerpolicy="no-referrer"`: sin eso
 * Google responde 429 a las fotos de Drive (ver research.md, sección 1).
 *
 * - Enlace de un archivo de Drive (`/file/d/ID/...` o `...?id=ID`):
 *   `https://lh3.googleusercontent.com/d/ID=w400`.
 * - Enlace de carpeta de Drive: inválido → imagen genérica y aviso en la consola.
 * - Celda vacía → imagen genérica.
 * - Cualquier otro enlace `https://` → se devuelve tal cual.
 * - Cualquier otra cosa (sin https, texto suelto) → imagen genérica y aviso en la consola.
 */
export function urlFoto(enlace) {
  const texto = String(enlace ?? "").trim();
  if (texto === "") return IMAGEN_GENERICA;

  let url;
  try {
    url = new URL(texto);
  } catch {
    console.warn(`Foto ignorada: "${texto}" no es un enlace válido. Se usa la imagen genérica.`);
    return IMAGEN_GENERICA;
  }
  if (url.protocol !== "https:") {
    console.warn(`Foto ignorada: "${texto}" no es un enlace https. Se usa la imagen genérica.`);
    return IMAGEN_GENERICA;
  }

  if (url.hostname === "drive.google.com" || url.hostname === "docs.google.com") {
    if (/\/folders\//.test(url.pathname)) {
      console.warn(
        `Foto ignorada: "${texto}" es un enlace de carpeta de Drive. ` +
        "Hay que copiar el enlace de cada foto, no el de la carpeta. Se usa la imagen genérica."
      );
      return IMAGEN_GENERICA;
    }
    const delArchivo = /\/file\/d\/([A-Za-z0-9_-]+)/.exec(url.pathname);
    const id = delArchivo ? delArchivo[1] : url.searchParams.get("id");
    if (id && /^[A-Za-z0-9_-]+$/.test(id)) {
      return `https://lh3.googleusercontent.com/d/${id}=w400`;
    }
    console.warn(`Foto ignorada: no se encontró el ID del archivo en "${texto}". Se usa la imagen genérica.`);
    return IMAGEN_GENERICA;
  }

  return texto;
}
