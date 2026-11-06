# Contrato: mensaje de pedido y enlace de WhatsApp

**Plan**: [../plan.md](../plan.md) | **Modelo de datos**: [../data-model.md](../data-model.md)

## Enlace

```text
https://wa.me/<whatsapp de config.js>?text=<mensaje codificado con encodeURIComponent>
```

Se abre navegando a ese enlace (no en ventana nueva). El mensaje conserva tildes, ñ, emojis y saltos de línea.

**Enlace del botón de respaldo** ("Escribir por WhatsApp", cuando la hoja falla o el envío está bloqueado): el mismo formato, con el texto prellenado `Hola, quiero hacer un pedido.` definido en [textos-interfaz.md](textos-interfaz.md).

## Plantilla del mensaje

Los asteriscos `*texto*` son negrita de WhatsApp. Las líneas opcionales solo aparecen cuando corresponde.

```text
*Nuevo pedido* 🛒

*Cliente:* Ana Quispe
*Modalidad:* Delivery
*Dirección:* Av. Los Olivos 123
*Referencia:* Frente al parque

*Pedido:*
2 x 1/4 de pollo a la brasa (S/ 18.50) = S/ 37.00
1 x Chicha morada 1 L (S/ 8.00) = S/ 8.00

*Total: S/ 45.00*
_El costo del delivery no está incluido; se coordina por WhatsApp._

*Pago:* Yape
*Comentario:* Sin ají, por favor
```

## Reglas

| Elemento | Regla |
|----------|-------|
| Líneas de producto | `<cantidad> x <nombre> (S/ <precio unitario>) = S/ <subtotal>`; el orden es el del pedido. |
| Dinero | Siempre `S/ 0.00` (dos decimales, punto decimal), calculado desde céntimos enteros. |
| Total | Suma exacta de los subtotales que aparecen en el mensaje (CE-006). |
| Modalidad `recojo` | Se omiten las líneas de dirección y referencia y la nota del delivery. |
| Modalidad `delivery` | Dirección y referencia obligatorias (se incluyen); se agrega la nota de que el delivery no está incluido. |
| Pago `Yape` / `Plin` | Se indica el método y el recordatorio `Enviaré la captura del pago por este chat.` |
| Pago `A coordinar por WhatsApp` | Se escribe `A coordinar por WhatsApp`. |
| Comentario | Solo si el cliente lo escribió. |
| Textos del cliente | Se incluyen tal cual; no se envían datos del cliente a ningún otro lugar. |

## Condiciones para poder enviar

El botón "Enviar pedido" solo actúa si **todas** se cumplen; si no, se muestra un aviso que dice qué falta (redacción en [textos-interfaz.md](textos-interfaz.md)):

1. El pedido tiene al menos un producto (escenario 3 de la Historia 2).
2. Nombre completado.
3. Modalidad elegida; si es delivery, dirección y referencia completas (escenario 4).
4. Método de pago elegido entre los válidos.
5. Datos vigentes confirmados: justo antes de enviar se vuelve a pedir la hoja. Si falla, el envío se bloquea (modo "Copia guardada"). Si la revisión quitó productos agotados o eliminados, o cambió precios, se muestra el aviso y el cliente debe volver a tocar "Enviar pedido".
6. Cantidades enteras entre 1 y 99.

Después de abrir WhatsApp, el pedido **se conserva** y "Empezar un pedido nuevo" se muestra destacado.
