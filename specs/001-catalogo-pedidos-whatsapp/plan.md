# Plan de implementación: Catálogo digital con pedidos por WhatsApp

**Rama**: `001-catalogo-pedidos-whatsapp` | **Fecha**: 2026-11-06 | **Especificación**: [spec.md](spec.md)

**Entrada**: especificación de la funcionalidad en `specs/001-catalogo-pedidos-whatsapp/spec.md` y decisiones de partida en `docs/decisiones-tecnicas.md`.

## Resumen

PedidoFácil v1 es una página estática de una sola pantalla: el cliente ve el catálogo, arma el pedido y lo envía como mensaje ya redactado a WhatsApp. Los productos y los datos del negocio los edita el dueño en Google Sheets (dos pestañas, "Productos" y "Negocio", publicadas como CSV). No hay servidor ni base de datos: el pedido y la última versión del catálogo viven en el `localStorage` del celular. El número de WhatsApp está en `config.js`.

Enfoque técnico (de `docs/decisiones-tecnicas.md`): HTML, CSS y JavaScript puro, sin librerías ni compilación; precios en céntimos enteros; envío con un enlace `https://wa.me/`; pruebas manuales en vista de 360 px; publicación en GitHub Pages.

## Contexto técnico

**Lenguaje/Versión**: HTML5, CSS3 y JavaScript moderno (ES2020) con módulos nativos del navegador (`<script type="module">`), sin transpilación.

**Dependencias principales**: ninguna (sin frameworks ni librerías externas). El CSV se interpreta con un lector propio de unas 40 líneas.

**Almacenamiento**: `localStorage` del navegador (pedido y última copia del catálogo). Fuente de datos: Google Sheets publicado como CSV. Sin servidor propio.

**Pruebas**: manuales, con los escenarios de aceptación de la spec en vista de celular de 360 px (emulación del navegador y al menos un celular real). Los casos de [quickstart.md](quickstart.md) cubren los cálculos y el mensaje.

**Plataforma de destino**: navegadores móviles actuales (Chrome en Android, Safari en iOS) desde 360 px de ancho; también funciona en escritorio.

**Tipo de proyecto**: sitio web estático de una sola página (solo frontend).

**Metas de rendimiento**: primera carga con productos visibles en menos de 3 s con 4G (CE-003). Presupuesto: HTML + CSS + JS ≤ 60 KB sin comprimir; fotos pedidas a ancho reducido (≈ 400 px) y con carga diferida.

**Restricciones**: costo S/ 0 (CE-005); sin datos de clientes en servidores; funcionar con conexión lenta o sin conexión (modo copia guardada, RF-013); todo en español de Perú; sin dependencias de funciones exclusivas de GitHub, para poder mudar el sitio a otro hosting estático gratuito.

**Escala/Alcance**: un negocio por instalación; menos de 200 productos; 1 pantalla con catálogo, pedido y formulario.

## Verificación de la constitución

*Puerta: debe pasar antes de la investigación (Fase 0). Se vuelve a verificar tras el diseño (Fase 1).*

| Principio | Evaluación inicial | Evaluación tras el diseño |
|-----------|--------------------|---------------------------|
| I. Costo cero | Pasa: Google Sheets, GitHub Pages y `wa.me` son gratuitos; no hay APIs de pago. | Pasa. Las fotos se alojan en Drive del dueño (gratis); ver [research.md](research.md). |
| II. Primero el celular | Pasa: diseño desde 360 px, fotos livianas, carga diferida, copia local del catálogo. | Pasa. Presupuesto de peso y áreas táctiles definidos. |
| III. Simplicidad | Pasa: sin frameworks, sin compilación. | Pasa. Módulos nativos y sin dependencias; ningún elemento de la sección de complejidad. |
| IV. El dueño no programa | Pasa con una excepción ya justificada: el número de WhatsApp está en `config.js` (ver Aclaraciones de la spec; la constitución no se enmienda). | Pasa. Productos, precios, fotos, disponibilidad, nombre, logo y pagos se editan en la hoja. |
| V. Privacidad | Pasa: el pedido solo existe en el celular y en el mensaje de WhatsApp; sin analíticas ni rastreadores. | Pasa. Ningún dato del cliente sale del celular salvo el mensaje que él mismo envía. |
| VI. Español de Perú | Pasa: interfaz, mensajes y documentación en español; soles con formato `S/ 0.00`. | Pasa. |
| VII. Entrega por historias | Pasa: se implementa y prueba una historia a la vez (orden en la sección siguiente). | Pasa. |

No hay violaciones; no se completa la tabla de seguimiento de complejidad.

## Orden de entrega por historias

Cada historia se implementa y se prueba en vista de celular antes de pasar a la siguiente (principio VII):

1. **Historia 1 – Ver el catálogo (P1)**. Incluye la lectura mínima de la hoja (pestañas "Productos" y "Negocio"), el filtro por categoría, los agotados y la imagen genérica. Antes de seguir se verifica con la hoja real que el navegador puede leer el CSV (riesgo principal, ver [research.md](research.md)).
2. **Historia 2 – Armar y enviar el pedido (P1)**. Pedido, cantidades, totales en céntimos, formulario, persistencia, botón "Empezar un pedido nuevo", revisión de productos antes de enviar y mensaje de WhatsApp.
3. **Historia 3 – El dueño actualiza sin programar (P1)**. Validación de filas (celdas obligatorias vacías), refresco máximo de 5 minutos, copia guardada y modo sin conexión (RF-013); guía corta para el dueño.
4. **Historia 4 – Métodos de pago (P2)**. Lista de métodos válidos, datos de Yape/Plin, opción "A coordinar por WhatsApp".

## Estructura del proyecto

### Documentación (esta funcionalidad)

```text
specs/001-catalogo-pedidos-whatsapp/
├── spec.md
├── plan.md              # Este archivo
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md        # Fase 1
├── contracts/           # Fase 1
│   ├── hoja-de-calculo.md
│   ├── config.md
│   └── mensaje-whatsapp.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Fase 2 (lo crea /speckit-tasks, no este comando)
```

### Código fuente (raíz del repositorio)

```text
index.html               # Única página: encabezado, catálogo, pedido, formulario
config.js                # Número de WhatsApp (con 51) y enlaces CSV de la hoja
css/
└── estilos.css          # Estilos desde 360 px hacia arriba
js/
├── app.js               # Arranque, estados de pantalla y eventos
├── hoja.js              # Descarga y lectura del CSV; validación de filas
├── catalogo.js          # Productos, categorías, tarjetas y filtro
├── pedido.js            # Cantidades, subtotales y total (céntimos)
├── formulario.js        # Datos del cliente y métodos de pago válidos
├── mensaje.js           # Texto del pedido y enlace wa.me
├── almacenamiento.js    # localStorage con respaldo en memoria
└── formato.js           # Dinero en soles, URL de fotos, textos
img/
└── generica.svg         # Imagen genérica para fotos que no cargan
docs/
└── guia-del-dueno.md    # Cómo editar la hoja (entregable de la historia 3)
```

**Decisión de estructura**: sitio estático sin carpetas `src/` ni `tests/`; todas las rutas del HTML son relativas, para que el sitio funcione bajo `https://usuario.github.io/repositorio/` y en cualquier otro hosting estático. Las pruebas son manuales y están descritas en [quickstart.md](quickstart.md).

## Seguimiento de complejidad

Sin violaciones de la constitución que justificar.
