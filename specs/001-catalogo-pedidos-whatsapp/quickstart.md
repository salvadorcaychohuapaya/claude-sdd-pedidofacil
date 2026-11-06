# Guía rápida de validación: Catálogo digital con pedidos por WhatsApp

**Plan**: [plan.md](plan.md) | **Contratos**: [contracts/](contracts/) | **Modelo de datos**: [data-model.md](data-model.md)

Esta guía sirve para comprobar que la funcionalidad cumple los escenarios de aceptación de la [spec](spec.md). No contiene código de la implementación.

## Requisitos previos

1. Una hoja de Google Sheets de prueba con las pestañas "Productos" y "Negocio" (columnas en [contracts/hoja-de-calculo.md](contracts/hoja-de-calculo.md)), cada una publicada en la web como CSV.
2. `config.js` con el número de WhatsApp de prueba (con `51`) y los dos enlaces CSV ([contracts/config.md](contracts/config.md)).
3. Datos de prueba mínimos: al menos 3 categorías; un producto agotado; un producto sin foto y otro con foto de Drive; una fila sin precio; un nombre con tildes, ñ y emoji; un nombre con coma; Yape con número y titular completos.
4. Un navegador con emulación de celular a **360 px** de ancho y, para las pruebas finales, un Android y un iPhone reales.

## Cómo abrir el sitio en local

**Importante: no abrir `index.html` con doble clic.** La página usa módulos de JavaScript (`<script type="module">`) y los navegadores los bloquean cuando el archivo se abre como `file://`; la pantalla quedaría en blanco o sin datos. Siempre hay que servirla por `http://localhost`.

1. Abrir una terminal en la raíz del repositorio (donde está `index.html`).
2. Iniciar un servidor estático local, con la primera opción que tengas:
   - Python (Windows): `py -m http.server 8080` (o `python -m http.server 8080`).
   - Node.js: `npx serve -l 8080`.
   - Visual Studio Code: extensión "Live Server" → "Go Live".
3. Abrir `http://localhost:8080` en el navegador. Para detenerlo: `Ctrl + C` en la terminal.

Son herramientas de desarrollo gratuitas y no forman parte del producto: el sitio publicado sigue siendo solo archivos estáticos, sin compilación.

**Probar en un celular real** (misma red Wi-Fi que la computadora): iniciar el servidor escuchando en toda la red (`py -m http.server 8080 --bind 0.0.0.0`), averiguar la IP de la computadora (`ipconfig`) y abrir `http://<IP>:8080` en el celular; si el firewall de Windows lo pide, permitir el acceso en red privada. Las pruebas finales de WhatsApp, fotos de Drive y rendimiento se repiten con el sitio ya publicado, por `https`.

## Prueba 0 – Verificación de lectura de la hoja (primera tarea)

Abrir la página y comprobar en la consola del navegador que ambas pestañas se descargan y se leen sin error de acceso. Si falla, ver la sección 2 de [research.md](research.md) antes de continuar. Comprobar también que una foto compartida desde Drive carga en Chrome Android y Safari iOS.

## Historia 1 – Ver el catálogo

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 1 | Abrir el enlace | Se ven productos con foto, nombre, descripción corta, `S/ 0.00` y categoría. |
| 2 | Mirar el producto agotado | Aparece como agotado; no tiene botón para agregar. |
| 3 | Tocar una categoría y luego "Todos" | Primero solo esa categoría; luego todos. |
| 4 | Mirar la parte superior | Nombre y logo del negocio. |
| 5 | Cortar la conexión y recargar (con copia previa) | Datos guardados con aviso "Mostrando datos guardados, pueden estar desactualizados"; sin envío; botón de WhatsApp visible. |

## Historia 2 – Armar y enviar el pedido

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 1 | Agregar 2 productos y cambiar cantidades; quitar uno | Subtotales y total cambian al instante. |
| 2 | Completar los datos y tocar "Enviar pedido" | WhatsApp abre con el mensaje de [contracts/mensaje-whatsapp.md](contracts/mensaje-whatsapp.md) y el número del negocio. |
| 3 | Intentar enviar con el pedido vacío | No se envía; aviso. |
| 4 | Elegir "Delivery" sin dirección | No se puede enviar hasta completarla. |
| 5 | Elegir "Delivery" y mirar el total | Indica que el delivery se coordina por WhatsApp y no está incluido. |
| 6 | Volver a la página tras enviar | El pedido sigue ahí; "Empezar un pedido nuevo" aparece destacado. |
| 7 | Tocar "Empezar un pedido nuevo" y confirmar | El pedido queda vacío. |
| 8 | Marcar un producto del pedido como agotado en la hoja, esperar el refresco y tocar "Enviar pedido" | Se quita con aviso, el total se recalcula, no se abre WhatsApp hasta tocar de nuevo. |
| 9 | Cerrar la página con un pedido a medias y reabrirla | El pedido se conserva. |
| 10 | Cantidades | Solo enteros entre 1 y 99. |

**Control de sumas (CE-006)**: con precios como `0.10`, `0.20`, `19.99` y `12,50` y cantidades variadas, comprobar a mano que el total del mensaje es la suma exacta de los subtotales.

## Historia 3 – El dueño actualiza sin programar

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 1 | Cambiar un precio en la hoja y recargar el catálogo | El precio nuevo aparece en un máximo de 5 minutos. |
| 2 | Agregar una fila con producto nuevo | Aparece en su categoría. |
| 3 | Dejar vacío el nombre o el precio de una fila | Esa fila no se muestra; el resto funciona. |
| 4 | Poner una foto inexistente | Se ve la imagen genérica. |
| 5 | Despublicar o romper el enlace CSV (sin copia previa) | Mensaje amable con botón para escribir al WhatsApp del negocio. |
| 6 | Cronometrar a una persona que no programa cambiando un precio con la guía | Menos de 1 minuto (CE-004). |

## Historia 4 – Métodos de pago

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 1 | Abrir las opciones de pago | Solo aparecen los métodos aceptados por el negocio. |
| 2 | Elegir Yape o Plin | Se ven número y titular, y la indicación de enviar la captura por WhatsApp. |
| 3 | Dejar vacío el titular de Yape en la hoja | Yape ya no aparece. |
| 4 | Dejar sin ningún método válido | Solo aparece "A coordinar por WhatsApp". |

## Criterios de éxito (medición)

| Criterio | Cómo se comprueba |
|----------|-------------------|
| CE-001 (pedido de 3 productos en < 2 min) | Cronometrar a una persona nueva. |
| CE-002 (360 px o más) | Emulación a 360 px: sin desplazamiento horizontal; botones táctiles cómodos. |
| CE-003 (productos en < 3 s con 4G) | Limitación de red "4G" del navegador, con caché vacía. |
| CE-005 (S/ 0) | Revisar que no hay servicios con cobro. |
| CE-006 (0 errores de suma) | Control de sumas de la historia 2. |

## Caracteres especiales

Probar un producto "Ají de gallina 🍗 – Niño" y un nombre de cliente con ñ y tilde: deben verse bien en pantalla y en el mensaje de WhatsApp.
