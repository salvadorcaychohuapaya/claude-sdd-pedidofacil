// Arranque de la página, estados de pantalla (cargando, vigente, copia guardada, sin datos) y eventos.
import { CONFIG } from "../config.js";
import { cargarCatalogo, recuperarCopiaCatalogo } from "./hoja.js";
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
  actualizando: "Actualizando precios…",
  copiaGuardada: "Mostrando datos guardados, pueden estar desactualizados",
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

/**
 * Estado del catálogo que se ve: null = vigente (o aún sin catálogo), "actualizando" = se ve la copia
 * guardada mientras se descarga la hoja, "copia" = la descarga falló y se ve la copia guardada.
 * En "actualizando" y en "copia" no se puede enviar el pedido.
 */
let estadoCatalogo = null;

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

function rellenarAvisos(caja, textos, botones = []) {
  const partes = textos.map((texto) => crear("p", undefined, texto));
  if (botones.length > 0) {
    const fila = crear("div", "mensaje-botones");
    fila.append(...botones);
    partes.push(fila);
  }
  caja.replaceChildren(...partes);
}

/** Botones de "Copia guardada": escribir directo al negocio y reintentar la descarga. */
function botonesDeCopia() {
  const reintentar = crear("button", "boton-secundario", TEXTOS.botonReintentar);
  reintentar.type = "button";
  reintentar.addEventListener("click", arrancar);
  return numeroValido ? [crearBotonWhatsApp(), reintentar] : [reintentar];
}

/** Dibuja los avisos. Los del envío van junto al botón; si el formulario no está en pantalla, van arriba. */
function pintarAvisos() {
  const arriba = [];
  if (!numeroValido) arriba.push(TEXTOS.numeroMal);
  if (estadoCatalogo === "actualizando") arriba.push(TEXTOS.actualizando);
  if (estadoCatalogo === "copia") arriba.push(TEXTOS.copiaGuardada);
  arriba.push(...avisosAlAbrir);
  const botonesArriba = estadoCatalogo === "copia" ? botonesDeCopia() : [];
  const botonesEnvio = envioConBotonWhatsApp && numeroValido ? [crearBotonWhatsApp()] : [];

  const cajaEnvio = el.formulario.querySelector(".avisos-envio");
  if (cajaEnvio) {
    rellenarAvisos(cajaEnvio, avisosEnvio, botonesEnvio);
    rellenarAvisos(el.aviso, arriba, botonesArriba);
  } else {
    rellenarAvisos(el.aviso, [...arriba, ...avisosEnvio], [...botonesArriba, ...(botonesArriba.length ? [] : botonesEnvio)]);
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

/** El envío solo se puede con el número bien configurado y con datos vigentes (no con la copia guardada). */
function puedeEnviar() {
  return numeroValido && estadoCatalogo === null;
}

/** Activa o desactiva el botón "Enviar pedido" sin volver a dibujar la pantalla. */
function sincronizarEnvio() {
  const boton = el.formulario.querySelector(".boton-enviar");
  if (boton) boton.disabled = !puedeEnviar();
}

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
    puedeEnviar,
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

  let datos;
  try {
    datos = await cargarCatalogo(CONFIG);
  } catch (error) {
    console.error("No se pudo confirmar la hoja antes de enviar:", error);
    // Pasa al estado "Copia guardada": se bloquea el envío y quedan "Escribir por WhatsApp" y "Reintentar".
    estadoCatalogo = "copia";
    sincronizarEnvio();
    mostrarAvisosEnvio([TEXTOS.envioBloqueado], true);
    return;
  }

  const { negocio, productos } = datos;
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

  // Con copia guardada se ve el catálogo mientras se actualiza; sin copia, marcadores de carga.
  const copia = recuperarCopiaCatalogo();
  if (copia) {
    estadoCatalogo = "actualizando";
    mostrarHoja(copia.productos, copia.negocio);
  } else {
    estadoCatalogo = null;
    mostrarCargando();
  }
  pintarAvisos();

  let datos;
  try {
    datos = await cargarCatalogo(CONFIG);
  } catch (error) {
    console.error("No se pudo descargar la hoja:", error);
    if (copia) {
      estadoCatalogo = "copia"; // Copia guardada: se sigue viendo la copia, sin poder enviar
      sincronizarEnvio();
    } else {
      mostrarEncabezado({ nombre: "", logo: "" }); // sin datos del negocio: "Catálogo"
      mostrarMensaje(TEXTOS.mensajeAmable, true); // Sin datos
    }
    pintarAvisos();
    return;
  }

  estadoCatalogo = null;
  const { negocio, productos } = datos;

  // Revisión del pedido guardado contra el catálogo vigente (si no hay productos válidos no se toca el pedido).
  // El precio y el nombre anteriores salen del último catálogo visto o, al abrir la página, de la copia guardada.
  if (productos.length > 0) {
    const anterior = ultimoCatalogo ?? copia?.productos ?? null;
    avisosAlAbrir = revisarPedido(productos, { anterior, metodos: metodosDisponibles(negocio) }).avisos;
    ultimoCatalogo = productos;
  }
  mostrarHoja(productos, negocio);
  pintarAvisos();
}

validarNumero();
arrancar();
