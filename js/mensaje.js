// Texto del pedido y enlace de WhatsApp (wa.me) con el mensaje codificado.
// Formato según contracts/mensaje-whatsapp.md.
import { centimosATexto } from "./formato.js";

/** Nota que se muestra bajo el total y se agrega al mensaje cuando la modalidad es delivery. */
export const NOTA_DELIVERY = "El costo del delivery no está incluido; se coordina por WhatsApp.";

const RECORDATORIO_CAPTURA = "Enviaré la captura del pago por este chat.";

/**
 * Arma el texto del pedido. `resumen` es el resultado de `calcularResumen` (pedido.js) y
 * `cliente` son los datos del formulario. El total es la suma exacta de los subtotales que
 * aparecen en el mensaje (CE-006). Las líneas opcionales solo salen cuando corresponden.
 */
export function construirMensaje(resumen, cliente) {
  const esDelivery = cliente.modalidad === "delivery";
  const totalCentimos = resumen.lineas.reduce((suma, linea) => suma + linea.subtotalCentimos, 0);

  const partes = ["*Nuevo pedido* 🛒", "", `*Cliente:* ${cliente.nombre.trim()}`];
  partes.push(`*Modalidad:* ${esDelivery ? "Delivery" : "Recojo"}`);
  if (esDelivery) {
    partes.push(`*Dirección:* ${cliente.direccion.trim()}`);
    partes.push(`*Referencia:* ${cliente.referencia.trim()}`);
  }

  partes.push("", "*Pedido:*");
  for (const linea of resumen.lineas) {
    partes.push(
      `${linea.cantidad} x ${linea.nombre} (${centimosATexto(linea.precioCentimos)}) = ${centimosATexto(linea.subtotalCentimos)}`
    );
  }

  partes.push("", `*Total: ${centimosATexto(totalCentimos)}*`);
  if (esDelivery) partes.push(`_${NOTA_DELIVERY}_`);

  partes.push("", `*Pago:* ${cliente.metodoPago}`);
  if (cliente.metodoPago === "Yape" || cliente.metodoPago === "Plin") partes.push(RECORDATORIO_CAPTURA);

  const comentario = cliente.comentario.trim();
  if (comentario !== "") partes.push(`*Comentario:* ${comentario}`);

  return partes.join("\n");
}

/** Enlace de WhatsApp con el texto codificado (conserva tildes, ñ, emojis y saltos de línea). */
export function enlaceWhatsApp(numero, texto) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
