// Datos del cliente y métodos de pago válidos según la hoja del negocio.
import { actualizarCliente, obtenerPedido } from "./pedido.js";

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

/**
 * Dibuja en `contenedor` los campos del cliente (nombre, modalidad, dirección y referencia solo con
 * delivery, método de pago y comentario). Cada cambio se guarda en el pedido (pedido.js).
 */
export function montarFormulario(contenedor, negocio) {
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

  contenedor.replaceChildren(
    campo("campo-nombre", ETIQUETAS.nombre, nombre),
    modalidad,
    datosDelivery,
    pago,
    campo("campo-comentario", ETIQUETAS.comentario, comentario)
  );
}
