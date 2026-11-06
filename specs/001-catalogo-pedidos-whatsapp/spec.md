# Especificación de la funcionalidad: Catálogo digital con pedidos por WhatsApp (PedidoFácil, versión 1)

**Rama de la funcionalidad**: `001-catalogo-pedidos-whatsapp`

**Creada**: 2026-11-06

**Estado**: Borrador

**Entrada**: Descripción del usuario: "Crea la especificación de la funcionalidad 'catálogo digital con pedidos por WhatsApp' basándote en docs/spec.md. Respeta sus historias de usuario, prioridades, escenarios de aceptación, casos límite, requisitos, criterios de éxito y lo que está fuera de alcance. No agregues tecnologías."

## Resumen

Pequeños negocios de Perú (panaderías, pollerías, menús, juguerías, postres, ropa por Instagram, bodegas con delivery) reciben pedidos por WhatsApp de forma desordenada: envían fotos sueltas, repiten precios en cada chat y cometen errores al sumar. PedidoFácil les da una página pública con su catálogo, donde el cliente arma su pedido y lo envía ya redactado al WhatsApp del negocio.

La versión 1 es el producto mínimo útil: ver el catálogo, armar el pedido, enviarlo por WhatsApp y que el dueño pueda actualizar sus productos sin saber programar.

**Usuarios**:

- **Cliente final**: persona que compra desde su celular, a menudo con datos móviles limitados.
- **Dueño del negocio**: persona con poca experiencia técnica que actualiza productos y precios.

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Ver el catálogo (Prioridad: P1)

Como cliente, quiero ver los productos con foto, nombre, precio y categoría, para decidir qué comprar.

**Por qué esta prioridad**: sin catálogo no hay producto. Por sí sola ya reemplaza el envío de fotos sueltas.

**Prueba independiente**: abrir el enlace del negocio en un celular y ver los productos disponibles.

**Escenarios de aceptación**:

1. **Dado** que el negocio tiene productos activos, **cuando** abro su enlace, **entonces** veo cada producto con foto, nombre, descripción corta, precio en soles (S/) y categoría.
2. **Dado** que un producto está marcado como "agotado", **cuando** veo el catálogo, **entonces** aparece como agotado y no se puede agregar al pedido.
3. **Dado** que hay varias categorías, **cuando** toco una categoría, **entonces** solo veo los productos de esa categoría; y puedo volver a ver todos.
4. **Dado** que abro el catálogo, **cuando** carga, **entonces** veo arriba el nombre y el logo del negocio.

---

### Historia de usuario 2 - Armar el pedido y enviarlo por WhatsApp (Prioridad: P1)

Como cliente, quiero agregar productos con cantidades y enviar el pedido al WhatsApp del negocio con un solo toque.

**Por qué esta prioridad**: es el valor principal: pedidos claros, completos y sin errores de suma.

**Prueba independiente**: agregar 2 productos, completar mis datos, tocar "Enviar pedido" y comprobar que WhatsApp se abre con el mensaje correcto.

**Escenarios de aceptación**:

1. **Dado** que agregué productos, **cuando** cambio cantidades o quito un producto, **entonces** el subtotal de cada producto y el total se actualizan al instante.
2. **Dado** que mi pedido tiene productos y completé mis datos, **cuando** toco "Enviar pedido", **entonces** se abre WhatsApp hacia el número del negocio con un mensaje que incluye: lista de productos, cantidades, precio unitario, subtotales, total, mi nombre, modalidad (recojo o delivery), dirección y referencia si es delivery, método de pago y comentario.
3. **Dado** que el pedido está vacío, **cuando** intento enviarlo, **entonces** no se puede enviar y veo un aviso.
4. **Dado** que elegí "delivery", **cuando** no escribo la dirección, **entonces** no puedo enviar el pedido hasta completarla.
5. **Dado** que elegí "delivery", **cuando** veo el total, **entonces** se indica que el costo del delivery se coordina por WhatsApp y no está incluido en el total.

---

### Historia de usuario 3 - El dueño actualiza sus productos sin saber programar (Prioridad: P1)

Como dueño, quiero agregar productos y cambiar precios, fotos y disponibilidad desde una hoja de cálculo sencilla.

**Por qué esta prioridad**: el catálogo necesita una fuente de productos que el dueño pueda mantener solo.

**Prueba independiente**: cambiar un precio y marcar un producto como agotado en la hoja, recargar el catálogo y ver ambos cambios.

**Escenarios de aceptación**:

1. **Dado** que cambio un precio en la hoja, **cuando** un cliente recarga el catálogo, **entonces** ve el precio nuevo en un máximo de 5 minutos.
2. **Dado** que agrego una fila con un producto nuevo, **cuando** se recarga el catálogo, **entonces** el producto aparece en su categoría.
3. **Dado** que dejo vacía una celda obligatoria (nombre o precio), **cuando** se carga el catálogo, **entonces** ese producto no se muestra y el resto sigue funcionando.

---

### Historia de usuario 4 - Métodos de pago (Prioridad: P2)

Como cliente, quiero saber cómo puedo pagar (Yape, Plin, efectivo o transferencia) antes de enviar mi pedido.

**Por qué esta prioridad**: complementa el pedido con la información de pago, pero el catálogo y el envío del pedido ya aportan valor sin ella.

**Prueba independiente**: elegir Yape al armar el pedido y ver los datos para pagar.

**Escenarios de aceptación**:

1. **Dado** que armo mi pedido, **cuando** elijo el método de pago, **entonces** solo veo los métodos que acepta el negocio.
2. **Dado** que elijo Yape o Plin, **cuando** lo selecciono, **entonces** veo el número y el nombre del titular, y una indicación de enviar la captura del pago por WhatsApp.

---

### Casos límite

- El cliente cierra la página antes de enviar: el pedido se conserva al volver, en el mismo celular.
- Si los precios cambian mientras el cliente arma su pedido, al enviar se usan los precios vigentes.
- Foto que no carga o que no existe: se muestra una imagen genérica.
- Hoja de productos inaccesible: se muestra un mensaje amable con un botón para escribir directo al WhatsApp del negocio.
- Nombres con tildes, ñ y emojis deben verse bien en el catálogo y en el mensaje de WhatsApp.
- El número de WhatsApp del negocio se registra con código de país (51).
- Cantidades: solo números enteros entre 1 y 99.
- Productos con tamaños o presentaciones (por ejemplo, 1/4 o 1/2 pollo; vaso chico o grande): cada presentación se registra como un producto aparte, con su propio precio.

## Requisitos *(obligatorio)*

### Requisitos funcionales

- **RF-001**: El sistema DEBE mostrar el nombre y el logo del negocio.
- **RF-002**: El sistema DEBE mostrar los productos activos con foto, nombre, descripción corta, precio (formato `S/ 0.00`) y categoría.
- **RF-003**: El cliente DEBE poder filtrar los productos por categoría.
- **RF-004**: El sistema DEBE mostrar los productos agotados como no disponibles, sin permitir agregarlos al pedido.
- **RF-005**: El cliente DEBE poder agregar, quitar y cambiar cantidades de productos en el pedido.
- **RF-006**: El sistema DEBE calcular el subtotal por producto y el total del pedido.
- **RF-007**: El sistema DEBE pedir al cliente: nombre (obligatorio), modalidad recojo o delivery (obligatorio), dirección y referencia (obligatorias si es delivery), método de pago (obligatorio) y comentario (opcional).
- **RF-008**: El sistema DEBE generar un mensaje de pedido legible y abrir WhatsApp hacia el número del negocio con ese mensaje.
- **RF-009**: El sistema DEBE mostrar los métodos de pago aceptados y, para Yape o Plin, el número y el nombre del titular.
- **RF-010**: El sistema DEBE leer los productos desde una hoja de cálculo que el dueño puede editar.
- **RF-011**: El sistema DEBE funcionar sin que el cliente cree una cuenta ni instale nada.
- **RF-012**: Toda la interfaz DEBE estar en español de Perú.

### Entidades clave

- **Negocio**: nombre, logo, número de WhatsApp, métodos de pago aceptados, datos de Yape/Plin.
- **Producto**: identificador, nombre, descripción, precio, categoría, foto, disponible (sí/no), orden.
- **Categoría**: nombre, orden.
- **Pedido** (temporal, solo en el celular del cliente): productos y cantidades, datos del cliente, total. No se guarda en ningún servidor.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

- **CE-001**: Un cliente nuevo arma y envía un pedido de 3 productos en menos de 2 minutos.
- **CE-002**: El catálogo se ve correctamente en celulares con pantallas de 360 px de ancho o más.
- **CE-003**: La primera carga muestra los productos en menos de 3 segundos con conexión 4G.
- **CE-004**: El dueño cambia un precio sin ayuda en menos de 1 minuto.
- **CE-005**: El costo mensual de operación es S/ 0.
- **CE-006**: Hay 0 errores de suma en los totales del mensaje de pedido.

## Supuestos

- El negocio tiene WhatsApp (personal o Business) y una cuenta de Google.
- Los pagos y el costo del delivery se coordinan por WhatsApp; el sistema no procesa pagos.
- Un catálogo típico tiene menos de 200 productos.
- La versión 1 se prepara para un solo negocio a la vez.

## Fuera de alcance (versión 1)

- Pagos en línea o pasarelas de pago.
- Facturación o boletas electrónicas (SUNAT).
- Cuentas de usuario, historial de pedidos o panel de administración propio.
- Envío automático de mensajes (API de WhatsApp de pago).
- Control de inventario o stock numérico.
- Búsqueda de productos por nombre.
- Variantes dentro de un mismo producto (se registran como productos aparte).
- Cálculo automático del costo de delivery.

## Ideas para versiones futuras

- Aviso de "cerrado ahora" según el horario de atención.
- Plantilla reutilizable para crear el catálogo de un nuevo negocio en menos de 1 hora.
- Búsqueda por nombre y variantes dentro de un mismo producto.
