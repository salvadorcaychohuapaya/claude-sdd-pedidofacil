// Arranque de la página, estados de pantalla (cargando, vigente, copia guardada, sin datos) y eventos.
import { CONFIG } from "../config.js";
import { descargarHoja, interpretarNegocio, interpretarProductos } from "./hoja.js";
import { mostrarCatalogo } from "./catalogo.js";
import { centimosATexto, IMAGEN_GENERICA, urlFoto } from "./formato.js";
import { almacenamientoPersistente } from "./almacenamiento.js";
import { alCambiar, calcularResumen, marcarEnviado, obtenerPedido, quitar, revisarPedido } from "./pedido.js";
import { avisosDeCliente, metodosDisponibles, montarFormulario } from "./formulario.js";
import { construirMensaje, enlaceWhatsApp, NOTA_DELIVERY } from "./mensaje.js";

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
  tituloPedido: "Tu pedido",
  pedidoVacio: "Aún no has agregado productos. Toca \"Agregar\" en los que quieras.",
  total: "Total",
  botonQuitar: "Quitar",
  sinAlmacenamiento: "Tu pedido no se guardará si cierras esta página.",
  pedidoVacioEnvio: "Tu pedido está vacío. Agrega al menos un producto.",
  envioBloqueado:
    "No podemos confirmar los precios en este momento. Inténtalo de nuevo cuando tengas conexión o escríbenos por WhatsApp.",
};

const el = {
  encabezado: document.getElementById("encabezado"),
  aviso: document.getElementById("aviso"),
  filtro: document.getElementById("filtro-categorias"),
  productos: document.getElementById("productos"),
  resumen: document.getElementById("resumen-pedido"),
  formulario: document.getElementById("formulario"),
};

/** Productos del catálogo que se está mostrando (para calcular el resumen) y escucha de cambios del pedido. */
let catalogo = null;
let negocioVigente = null;
let dejarDeEscucharPedido = null;

/** Último catálogo mostrado, aunque se haya cambiado de pantalla: sirve para detectar cambios de precio. */
let ultimoCatalogo = null;

/** Avisos: los de la revisión al abrir (arriba) y los del envío (junto al botón "Enviar pedido"). */
let avisosAlAbrir = [];
let avisosEnvio = [];
let envioConBotonWhatsApp = false;

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

/* ---------- Avisos ---------- */

function rellenarAvisos(caja, textos, conBotonWhatsApp = false) {
  const partes = textos.map((texto) => crear("p", undefined, texto));
  if (conBotonWhatsApp && numeroValido) partes.push(crearBotonWhatsApp());
  caja.replaceChildren(...partes);
}

/** Dibuja los avisos. Los del envío van junto al botón; si el formulario no está en pantalla, van arriba. */
function pintarAvisos() {
  const arriba = [];
  if (!numeroValido) arriba.push(TEXTOS.numeroMal);
  arriba.push(...avisosAlAbrir);
  const cajaEnvio = el.formulario.querySelector(".avisos-envio");
  if (cajaEnvio) {
    rellenarAvisos(cajaEnvio, avisosEnvio, envioConBotonWhatsApp);
    rellenarAvisos(el.aviso, arriba);
  } else {
    rellenarAvisos(el.aviso, [...arriba, ...avisosEnvio], envioConBotonWhatsApp);
  }
}

function mostrarAvisosEnvio(textos, conBotonWhatsApp = false) {
  avisosEnvio = textos;
  envioConBotonWhatsApp = conBotonWhatsApp;
  pintarAvisos();
}

/* ---------- Validación del número ---------- */

function validarNumero() {
  if (numeroValido) return;
  console.error(
    `config.js: "whatsapp" debe tener solo dígitos y empezar con 51 (valor actual: "${CONFIG.whatsapp}"). ` +
    "Se deshabilita el envío de pedidos."
  );
  pintarAvisos();
}

/* ---------- Estados de la pantalla ---------- */

function limpiar() {
  catalogo = null;
  negocioVigente = null;
  dejarDeEscucharPedido?.();
  dejarDeEscucharPedido = null;
  el.resumen.replaceChildren();
  el.formulario.replaceChildren();
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

/* ---------- Resumen del pedido ---------- */

/** "Tu pedido": productos con cantidad, subtotal por producto y total, siempre con el catálogo vigente. */
function pintarResumen() {
  if (!catalogo) return;
  const pedido = obtenerPedido();
  const resumen = calcularResumen(pedido.items, catalogo);

  const titulo = crear("h2", undefined, TEXTOS.tituloPedido);
  titulo.tabIndex = -1;
  const partes = [titulo];

  if (resumen.lineas.length === 0) {
    partes.push(crear("p", "estado-texto", TEXTOS.pedidoVacio));
  } else {
    const lista = crear("ul", "resumen-lista");
    for (const linea of resumen.lineas) {
      const item = crear("li", "resumen-linea");
      const texto = crear("div", "resumen-texto");
      texto.append(
        crear("div", "resumen-nombre", linea.nombre),
        crear(
          "div",
          "resumen-detalle",
          `${linea.cantidad} x ${centimosATexto(linea.precioCentimos)} = ${centimosATexto(linea.subtotalCentimos)}`
        )
      );
      const botonQuitar = crear("button", "boton-secundario", TEXTOS.botonQuitar);
      botonQuitar.type = "button";
      botonQuitar.addEventListener("click", () => {
        quitar(linea.id);
        el.resumen.querySelector("h2")?.focus();
      });
      item.append(texto, botonQuitar);
      lista.append(item);
    }
    partes.push(lista);

    const total = crear("p", "resumen-total");
    total.append(crear("span", undefined, TEXTOS.total), crear("strong", undefined, centimosATexto(resumen.totalCentimos)));
    partes.push(total);
    if (pedido.cliente.modalidad === "delivery") partes.push(crear("p", "resumen-nota", NOTA_DELIVERY));
  }

  // Aviso discreto: sin almacenamiento en el celular el pedido se pierde al cerrar la página.
  if (!almacenamientoPersistente()) partes.push(crear("p", "aviso-discreto", TEXTOS.sinAlmacenamiento));

  el.resumen.replaceChildren(...partes);
}

/* ---------- Pantalla vigente ---------- */

/** Muestra el encabezado y, si hay productos, el catálogo, el formulario y el resumen; si no, "Sin productos". */
function mostrarHoja(productos, negocio) {
  mostrarEncabezado(negocio);
  if (productos.length === 0) {
    mostrarMensaje(TEXTOS.sinProductos, false); // Sin productos
    return;
  }

  // Vigente
  limpiar();
  catalogo = productos;
  negocioVigente = negocio;
  mostrarCatalogo(el.filtro, el.productos, productos);
  montarFormulario(el.formulario, negocio, {
    alEnviar: enviarPedido,
    alVaciar: () => {
      avisosAlAbrir = [];
      mostrarAvisosEnvio([]);
    },
    envioHabilitado: numeroValido,
  });
  pintarResumen();
  dejarDeEscucharPedido = alCambiar((tipo) => {
    if (tipo === "items" || tipo === "cliente") pintarResumen();
  });
}

/* ---------- Envío del pedido ---------- */

/**
 * Flujo de "Enviar pedido": comprueba que no falte nada, vuelve a descargar la hoja y revisa el pedido.
 * Si la revisión cambió algo, solo avisa (el cliente debe tocar el botón otra vez). Si todo está bien,
 * marca el pedido como enviado y abre WhatsApp en esta misma pestaña. El pedido no se vacía.
 * (Las cantidades siempre son enteros de 1 a 99: pedido.js no deja guardar otras.)
 */
async function enviarPedido() {
  if (!numeroValido || !catalogo) return;

  const pedido = obtenerPedido();
  const faltan = [];
  if (calcularResumen(pedido.items, catalogo).lineas.length === 0) faltan.push(TEXTOS.pedidoVacioEnvio);
  faltan.push(...avisosDeCliente(pedido.cliente, metodosDisponibles(negocioVigente)));
  if (faltan.length > 0) {
    mostrarAvisosEnvio(faltan);
    return;
  }
  mostrarAvisosEnvio([]);

  let hoja;
  try {
    hoja = await descargarHoja(CONFIG);
  } catch (error) {
    console.error("No se pudo confirmar la hoja antes de enviar:", error);
    mostrarAvisosEnvio([TEXTOS.envioBloqueado], true); // envío bloqueado + botón para escribir directo
    return;
  }

  const negocio = interpretarNegocio(hoja.negocio);
  const productos = interpretarProductos(hoja.productos);
  if (productos.length === 0) {
    avisosAlAbrir = [];
    mostrarHoja(productos, negocio); // Sin productos
    pintarAvisos();
    return;
  }

  const revision = revisarPedido(productos, { anterior: catalogo, metodos: metodosDisponibles(negocio) });
  ultimoCatalogo = productos;
  if (revision.hayCambios) {
    avisosAlAbrir = [];
    mostrarHoja(productos, negocio);
    mostrarAvisosEnvio(revision.avisos);
    return; // WhatsApp no se abre solo: el cliente toca "Enviar pedido" otra vez
  }

  marcarEnviado(true);
  const enviado = obtenerPedido();
  const mensaje = construirMensaje(calcularResumen(enviado.items, productos), enviado.cliente);
  location.href = enlaceWhatsApp(CONFIG.whatsapp, mensaje);
}

/* ---------- Arranque ---------- */

async function arrancar() {
  avisosAlAbrir = [];
  avisosEnvio = [];
  envioConBotonWhatsApp = false;
  mostrarCargando();

  let hoja;
  try {
    hoja = await descargarHoja(CONFIG);
  } catch (error) {
    console.error("No se pudo descargar la hoja:", error);
    mostrarEncabezado({ nombre: "", logo: "" }); // sin datos del negocio: "Catálogo"
    mostrarMensaje(TEXTOS.mensajeAmable, true); // Sin datos
    pintarAvisos();
    return;
  }

  const negocio = interpretarNegocio(hoja.negocio);
  const productos = interpretarProductos(hoja.productos);

  // Revisión del pedido guardado contra el catálogo vigente (si no hay productos válidos no se toca el pedido).
  if (productos.length > 0) {
    avisosAlAbrir = revisarPedido(productos, { anterior: ultimoCatalogo, metodos: metodosDisponibles(negocio) }).avisos;
    ultimoCatalogo = productos;
  }
  mostrarHoja(productos, negocio);
  pintarAvisos();
}

validarNumero();
arrancar();
