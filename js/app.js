// Arranque de la página, estados de pantalla (cargando, vigente, copia guardada, sin datos) y eventos.
import { CONFIG } from "../config.js";
import { descargarHoja, interpretarNegocio, interpretarProductos } from "./hoja.js";
import { mostrarCatalogo } from "./catalogo.js";
import { IMAGEN_GENERICA, urlFoto } from "./formato.js";

// Textos visibles (fuente: contracts/textos-interfaz.md)
const TEXTOS = {
  cargando: "Cargando el catálogo…",
  mensajeAmable: "No pudimos cargar el catálogo en este momento. Escríbenos por WhatsApp y te atendemos.",
  sinProductos: "Por ahora no hay productos disponibles",
  numeroMal: "No se pueden enviar pedidos por ahora. Avisa al negocio.",
  botonWhatsApp: "Escribir por WhatsApp",
  botonReintentar: "Reintentar",
  mensajePrellenado: "Hola, quiero hacer un pedido.",
  nombreFalta: "Catálogo",
};

const el = {
  encabezado: document.getElementById("encabezado"),
  aviso: document.getElementById("aviso"),
  filtro: document.getElementById("filtro-categorias"),
  productos: document.getElementById("productos"),
};

/** El número de WhatsApp de config.js: solo dígitos y con el código de país 51. */
const numeroValido = /^51[0-9]+$/.test(String(CONFIG.whatsapp ?? ""));

function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

/** Botón "Escribir por WhatsApp": abre el chat del negocio con el mensaje prellenado. */
function crearBotonWhatsApp() {
  const enlace = crear("a", "boton", TEXTOS.botonWhatsApp);
  enlace.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(TEXTOS.mensajePrellenado)}`;
  return enlace;
}

/* ---------- Validación del número ---------- */

function validarNumero() {
  if (numeroValido) return;
  console.error(
    `config.js: "whatsapp" debe tener solo dígitos y empezar con 51 (valor actual: "${CONFIG.whatsapp}"). ` +
    "Se deshabilita el envío de pedidos."
  );
  el.aviso.textContent = TEXTOS.numeroMal;
}

/* ---------- Estados de la pantalla ---------- */

function limpiar() {
  el.filtro.replaceChildren();
  el.productos.replaceChildren();
  el.productos.removeAttribute("aria-busy");
}

/** Cargando: marcadores de carga con el texto "Cargando el catálogo…". */
function mostrarCargando() {
  limpiar();
  el.productos.setAttribute("aria-busy", "true");
  el.productos.append(crear("p", "estado-texto", TEXTOS.cargando));
  for (let i = 0; i < 3; i++) {
    const marcador = crear("div", "marcador");
    marcador.setAttribute("aria-hidden", "true");
    marcador.append(crear("div", "marcador-foto"), crear("div", "marcador-lineas"));
    el.productos.append(marcador);
  }
}

/** Mensaje con botones, para "Sin datos" y "Sin productos". */
function mostrarMensaje(texto, conReintentar) {
  limpiar();
  const caja = crear("div", "mensaje");
  caja.append(crear("p", "mensaje-texto", texto));
  const botones = crear("div", "mensaje-botones");
  if (numeroValido) botones.append(crearBotonWhatsApp());
  if (conReintentar) {
    const reintentar = crear("button", "boton-secundario", TEXTOS.botonReintentar);
    reintentar.type = "button";
    reintentar.addEventListener("click", arrancar);
    botones.append(reintentar);
  }
  if (botones.children.length > 0) caja.append(botones);
  el.productos.append(caja);
}

/** Nombre y logo del negocio arriba. Sin logo (o inválido), solo el nombre. */
function mostrarEncabezado(negocio) {
  const nombre = negocio.nombre || TEXTOS.nombreFalta;
  document.title = nombre;

  const titulo = crear("h1", "encabezado-nombre", nombre);
  const partes = [];

  const direccionLogo = urlFoto(negocio.logo);
  if (negocio.logo !== "" && direccionLogo !== IMAGEN_GENERICA) {
    const logo = document.createElement("img");
    logo.className = "encabezado-logo";
    logo.alt = "";
    logo.width = 48;
    logo.height = 48;
    logo.referrerPolicy = "no-referrer"; // obligatorio para imágenes de Drive (si no, Google responde 429)
    logo.addEventListener("error", () => logo.remove());
    logo.src = direccionLogo;
    partes.push(logo);
  }
  partes.push(titulo);
  el.encabezado.replaceChildren(...partes);
}

/* ---------- Arranque ---------- */

async function arrancar() {
  mostrarCargando();

  let hoja;
  try {
    hoja = await descargarHoja(CONFIG);
  } catch (error) {
    console.error("No se pudo descargar la hoja:", error);
    mostrarEncabezado({ nombre: "", logo: "" }); // sin datos del negocio: "Catálogo"
    mostrarMensaje(TEXTOS.mensajeAmable, true); // Sin datos
    return;
  }

  const negocio = interpretarNegocio(hoja.negocio);
  const productos = interpretarProductos(hoja.productos);
  mostrarEncabezado(negocio);

  if (productos.length === 0) {
    mostrarMensaje(TEXTOS.sinProductos, false); // Sin productos
    return;
  }

  // Vigente
  limpiar();
  mostrarCatalogo(el.filtro, el.productos, productos);
}

validarNumero();
arrancar();
