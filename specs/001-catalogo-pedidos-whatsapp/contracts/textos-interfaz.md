# Contrato: textos visibles de la interfaz

**Plan**: [../plan.md](../plan.md) | **Mensaje de WhatsApp**: [mensaje-whatsapp.md](mensaje-whatsapp.md)

Todos los textos que ve el cliente, en español de Perú. Es la única fuente de redacción de avisos y mensajes: las tareas y el código deben usar estos textos tal cual. Las partes entre llaves (`{nombre}`, `{numero}`) se reemplazan con datos reales. Los mensajes que solo van a la consola del navegador (para quien instala el catálogo) no forman parte de este contrato. El texto del mensaje que se envía a WhatsApp está en [mensaje-whatsapp.md](mensaje-whatsapp.md).

## Carga y estado del catálogo

| Situación | Texto | Notas |
|---|---|---|
| Cargando sin copia | `Cargando el catálogo…` | Con marcadores de carga. |
| Cargando con copia | `Actualizando precios…` | Se ve la copia guardada mientras tanto. |
| **Mensaje amable** (hoja inaccesible y sin copia) | `No pudimos cargar el catálogo en este momento. Escríbenos por WhatsApp y te atendemos.` | Con los botones "Escribir por WhatsApp" y "Reintentar". |
| Sin productos válidos (la hoja responde, pero no queda ninguno) | `Por ahora no hay productos disponibles` | Con el botón "Escribir por WhatsApp". |
| Copia guardada (descarga falló y hay copia) | `Mostrando datos guardados, pueden estar desactualizados` | Texto exacto. Con "Reintentar" y "Escribir por WhatsApp". |
| Envío bloqueado por datos no vigentes | `No podemos confirmar los precios en este momento. Inténtalo de nuevo cuando tengas conexión o escríbenos por WhatsApp.` | Sale al tocar "Enviar pedido" si la revisión previa falla. |
| Número de WhatsApp mal configurado | `No se pueden enviar pedidos por ahora. Avisa al negocio.` | El envío queda deshabilitado (ver [config.md](config.md)). |

## Botones

| Botón | Texto |
|---|---|
| Respaldo directo al negocio | `Escribir por WhatsApp` (abre el chat del negocio con el mensaje prellenado `Hola, quiero hacer un pedido.`) |
| Reintentar la descarga | `Reintentar` |
| Agregar un producto | `Agregar` |
| Quitar un producto | `Quitar` |
| Enviar el pedido | `Enviar pedido` |
| Vaciar el pedido | `Empezar un pedido nuevo` |
| Confirmar vaciar | `Sí, empezar de nuevo` |
| Cancelar | `Cancelar` |
| Primer filtro de categorías | `Todos` |

### Mensaje prellenado del botón de respaldo

| Elemento | Texto |
|---|---|
| Mensaje que aparece escrito al abrir el chat desde "Escribir por WhatsApp" | `Hola, quiero hacer un pedido.` |

El enlace es `https://wa.me/<whatsapp de config.js>?text=` seguido de ese texto codificado con `encodeURIComponent`. Se usa en todos los lugares donde aparece el botón: mensaje amable, "Sin productos", "Copia guardada" y envío bloqueado.

## Catálogo

| Elemento | Texto |
|---|---|
| Producto agotado | `Agotado` |
| Producto sin categoría | `Otros` |
| Nombre del negocio si falta | `Catálogo` |

## Pedido y formulario

| Situación | Texto |
|---|---|
| Pedido vacío (resumen) | `Aún no has agregado productos. Toca "Agregar" en los que quieras.` |
| Total | `Total` |
| Delivery: nota bajo el total | `El costo del delivery no está incluido; se coordina por WhatsApp.` |
| Después de tocar "Enviar pedido" (junto al botón destacado) | `Si ya enviaste tu pedido, toca "Empezar un pedido nuevo" para no enviarlo dos veces.` |
| Confirmación de vaciar | `¿Seguro que quieres empezar un pedido nuevo? Se borrará el pedido actual.` |
| **Aviso discreto** (sin almacenamiento en el celular) | `Tu pedido no se guardará si cierras esta página.` |

### Avisos de datos que faltan al enviar

| Falta | Texto |
|---|---|
| Pedido vacío | `Tu pedido está vacío. Agrega al menos un producto.` |
| Nombre | `Escribe tu nombre.` |
| Modalidad | `Elige si es recojo o delivery.` |
| Dirección (delivery) | `Escribe tu dirección para el delivery.` |
| Referencia (delivery) | `Escribe una referencia para el delivery.` |
| Método de pago | `Elige un método de pago.` |

### Avisos de la revisión previa al envío

| Situación | Texto |
|---|---|
| Producto quitado por agotado | `Quitamos "{nombre}" de tu pedido porque está agotado.` |
| Producto quitado por no estar en la hoja | `Quitamos "{nombre}" de tu pedido porque ya no está disponible.` |
| Cambio de precio | `El precio de "{nombre}" cambió de {precio_anterior} a {precio_nuevo}.` |
| Cierre del aviso (cuando algo cambió) | `Revisa tu pedido y toca "Enviar pedido" otra vez.` |
| Método de pago que dejó de ser válido | `El método de pago que elegiste ya no está disponible. Elige otro.` |

Los precios se escriben con el formato `S/ 0.00`.

## Métodos de pago

| Método | Texto |
|---|---|
| Sin métodos válidos | `A coordinar por WhatsApp` |
| Datos de Yape | `Yape al {numero} a nombre de {titular}` |
| Datos de Plin | `Plin al {numero} a nombre de {titular}` |
| Indicación al elegir Yape o Plin | `Después de pagar, envía la captura del pago por WhatsApp.` |
