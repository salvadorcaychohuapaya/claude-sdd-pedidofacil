// Datos del cliente y métodos de pago válidos según la hoja del negocio.
import { actualizarCliente, alCambiar, obtenerPedido, vaciarPedido } from "./pedido.js";

// Textos visibles (fuente: contracts/textos-interfaz.md). Las etiquetas de los campos usan las
// mismas palabras del mensaje de WhatsApp, porque el contrato no define etiquetas propias.
export const METODO_COORDINAR = "A coordinar por WhatsApp";

export const AVISOS = {
  nombre: "Escribe tu nombre.",
  modalidad: "Elige si es recojo o delivery.",
  direccion: "Escribe tu dirección para el delivery.",
  referencia: "Escribe una referencia para el delivery.",
  metodoPago: "Elige un método de pago.",
};

const BOTONES = {
  enviar: "Enviar pedido",
  nuevo: "Empezar un pedido nuevo",
  confirmar: "Sí, empezar de nuevo",
  cancelar: "Cancelar",
};

const TEXTOS_NUEVO = {
  confirmacion: "¿Seguro que quieres empezar un pedido nuevo? Se borrará el pedido actual.",
  despuesDeEnviar: "Si ya enviaste tu pedido, toca \"Empezar un pedido nuevo\" para no enviarlo dos veces.",
};

const ETIQUETAS = {
  nombre: "Nombre",
  modalidad: "Modalidad",
  recojo: "Recojo",
  delivery: "Delivery",
  direccion: "Dirección",
  referencia: "Referencia",
  metodoPago: "Método de pago",
  comentario: "Comentario",
};

/**
 * Métodos de pago que se ofrecen: los marcados en la hoja o, si no hay ninguno,
 * solo "A coordinar por WhatsApp". (Filtrar por datos de Yape/Plin queda para la Historia 4.)
 */
export function metodosDisponibles(negocio) {
  const metodos = negocio?.metodosPago ?? [];
  return metodos.length > 0 ? [...metodos] : [METODO_COORDINAR];
}

/**
 * Revisa los datos del cliente y devuelve la lista de avisos de lo que falta, en el orden del
 * formulario (vacía si todo está completo). `metodos` son los métodos válidos mostrados.
 */
export function avisosDeCliente(cliente, metodos) {
  const faltan = [];
  if (cliente.nombre.trim() === "") faltan.push(AVISOS.nombre);
  if (cliente.modalidad !== "recojo" && cliente.modalidad !== "delivery") {
    faltan.push(AVISOS.modalidad);
  } else if (cliente.modalidad === "delivery") {
    if (cliente.direccion.trim() === "") faltan.push(AVISOS.direccion);
    if (cliente.referencia.trim() === "") faltan.push(AVISOS.referencia);
  }
  if (!metodos.includes(cliente.metodoPago)) faltan.push(AVISOS.metodoPago);
  return faltan;
}

/* ---------- Formulario en pantalla ---------- */

function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function campo(id, etiqueta, elemento) {
  const caja = crear("div", "campo");
  const rotulo = crear("label", undefined, etiqueta);
  rotulo.htmlFor = id;
  elemento.id = id;
  caja.append(rotulo, elemento);
  return caja;
}

/** Grupo de opciones (radios) con leyenda. */
function grupoOpciones(nombre, leyenda, opciones, seleccionado, alElegir) {
  const grupo = crear("fieldset", "campo");
  grupo.append(crear("legend", undefined, leyenda));
  for (const { valor, texto } of opciones) {
    const rotulo = crear("label", "opcion");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = nombre;
    radio.value = valor;
    radio.checked = valor === seleccionado;
    radio.addEventListener("change", () => alElegir(valor));
    rotulo.append(radio, document.createTextNode(texto));
    grupo.append(rotulo);
  }
  return grupo;
}

let dejarDeEscucharEnviado = null;

/**
 * Dibuja en `contenedor` los campos del cliente (nombre, modalidad, dirección y referencia solo con
 * delivery, método de pago y comentario), el botón "Enviar pedido" y "Empezar un pedido nuevo".
 * Cada cambio se guarda en el pedido (pedido.js).
 * Opciones: `alEnviar` (función, puede ser asíncrona) se llama al tocar "Enviar pedido";
 * `alVaciar` se llama después de vaciar el pedido; `envioHabilitado` en false deja el botón
 * de envío desactivado (número de WhatsApp mal configurado).
 */
export function montarFormulario(contenedor, negocio, opciones = {}) {
  const { alEnviar, alVaciar, envioHabilitado = true } = opciones;
  const cliente = obtenerPedido().cliente;

  const nombre = document.createElement("input");
  nombre.type = "text";
  nombre.autocomplete = "name";
  nombre.value = cliente.nombre;
  nombre.addEventListener("input", () => actualizarCliente({ nombre: nombre.value }));

  const direccion = document.createElement("input");
  direccion.type = "text";
  direccion.autocomplete = "street-address";
  direccion.value = cliente.direccion;
  direccion.addEventListener("input", () => actualizarCliente({ direccion: direccion.value }));

  const referencia = document.createElement("input");
  referencia.type = "text";
  referencia.value = cliente.referencia;
  referencia.addEventListener("input", () => actualizarCliente({ referencia: referencia.value }));

  const comentario = document.createElement("textarea");
  comentario.value = cliente.comentario;
  comentario.addEventListener("input", () => actualizarCliente({ comentario: comentario.value }));

  // Dirección y referencia solo se piden con delivery.
  const datosDelivery = crear("div", "datos-delivery");
  datosDelivery.hidden = cliente.modalidad !== "delivery";
  datosDelivery.append(
    campo("campo-direccion", ETIQUETAS.direccion, direccion),
    campo("campo-referencia", ETIQUETAS.referencia, referencia)
  );

  const modalidad = grupoOpciones(
    "modalidad",
    ETIQUETAS.modalidad,
    [
      { valor: "recojo", texto: ETIQUETAS.recojo },
      { valor: "delivery", texto: ETIQUETAS.delivery },
    ],
    cliente.modalidad,
    (valor) => {
      datosDelivery.hidden = valor !== "delivery";
      actualizarCliente({ modalidad: valor });
    }
  );

  const pago = grupoOpciones(
    "metodoPago",
    ETIQUETAS.metodoPago,
    metodosDisponibles(negocio).map((metodo) => ({ valor: metodo, texto: metodo })),
    cliente.metodoPago,
    (valor) => actualizarCliente({ metodoPago: valor })
  );

  // Avisos del envío (qué falta, cambios en el pedido) justo encima del botón.
  const avisosEnvio = crear("div", "avisos-envio");
  avisosEnvio.setAttribute("role", "status");
  avisosEnvio.setAttribute("aria-live", "polite");

  const botonEnviar = crear("button", "boton-enviar", BOTONES.enviar);
  botonEnviar.type = "button";
  botonEnviar.disabled = !envioHabilitado;
  let ocupado = false;
  botonEnviar.addEventListener("click", async () => {
    if (ocupado || !alEnviar) return;
    ocupado = true;
    botonEnviar.disabled = true;
    try {
      await alEnviar();
    } finally {
      ocupado = false;
      botonEnviar.disabled = !envioHabilitado;
    }
  });

  // "Empezar un pedido nuevo", con confirmación; se destaca después de tocar "Enviar pedido".
  const bloqueNuevo = crear("div", "bloque-nuevo");
  const notaEnviado = crear("p", "nota-enviado", TEXTOS_NUEVO.despuesDeEnviar);
  const botonNuevo = crear("button", "boton-nuevo boton-secundario", BOTONES.nuevo);
  botonNuevo.type = "button";
  const confirmacion = crear("div", "confirmacion");
  confirmacion.hidden = true;
  confirmacion.setAttribute("role", "group");
  const botonConfirmar = crear("button", undefined, BOTONES.confirmar);
  botonConfirmar.type = "button";
  const botonCancelar = crear("button", "boton-secundario", BOTONES.cancelar);
  botonCancelar.type = "button";
  const botonesConfirmacion = crear("div", "confirmacion-botones");
  botonesConfirmacion.append(botonConfirmar, botonCancelar);
  confirmacion.append(crear("p", undefined, TEXTOS_NUEVO.confirmacion), botonesConfirmacion);
  bloqueNuevo.append(notaEnviado, botonNuevo, confirmacion);

  botonNuevo.addEventListener("click", () => {
    botonNuevo.hidden = true;
    confirmacion.hidden = false;
    botonCancelar.focus(); // la opción segura queda a mano
  });
  botonCancelar.addEventListener("click", () => {
    confirmacion.hidden = true;
    botonNuevo.hidden = false;
    botonNuevo.focus();
  });
  botonConfirmar.addEventListener("click", () => {
    vaciarPedido();
    alVaciar?.();
    montarFormulario(contenedor, negocio, opciones); // campos en blanco
    contenedor.querySelector("#campo-nombre")?.focus();
  });

  function sincronizarEnviado() {
    const enviado = obtenerPedido().enviado;
    botonNuevo.classList.toggle("destacado", enviado);
    notaEnviado.hidden = !enviado;
  }
  sincronizarEnviado();
  dejarDeEscucharEnviado?.();
  dejarDeEscucharEnviado = alCambiar((tipo) => {
    if (tipo === "enviado" && botonNuevo.isConnected) sincronizarEnviado();
  });

  contenedor.replaceChildren(
    campo("campo-nombre", ETIQUETAS.nombre, nombre),
    modalidad,
    datosDelivery,
    pago,
    campo("campo-comentario", ETIQUETAS.comentario, comentario),
    avisosEnvio,
    botonEnviar,
    bloqueNuevo
  );
}
