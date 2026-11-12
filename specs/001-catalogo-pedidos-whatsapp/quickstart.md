# Guía rápida de validación: Catálogo digital con pedidos por WhatsApp

**Plan**: [plan.md](plan.md) | **Contratos**: [contracts/](contracts/) | **Modelo de datos**: [data-model.md](data-model.md)

Esta guía sirve para comprobar que la funcionalidad cumple los escenarios de aceptación de la [spec](spec.md). No contiene código de la implementación.

**Registro de resultados**: todos los resultados (prueba de concepto, cada historia y los criterios de éxito) se anotan en [checklists/verificacion.md](checklists/verificacion.md), el registro único de verificación. Los textos que debe mostrar la interfaz están en [contracts/textos-interfaz.md](contracts/textos-interfaz.md).

## Requisitos previos

1. Una hoja de Google Sheets de prueba con las pestañas "Productos" y "Negocio" (columnas en [contracts/hoja-de-calculo.md](contracts/hoja-de-calculo.md)), cada una publicada en la web como CSV.
2. `config.js` con el número de WhatsApp de prueba (con `51`) y los dos enlaces CSV ([contracts/config.md](contracts/config.md)).
3. Datos de prueba mínimos: al menos 3 categorías; un producto agotado; un producto sin foto y otro con foto de Drive; una fila sin precio; un nombre con tildes, ñ y emoji; un nombre con coma; Yape con número y titular completos.
4. Un navegador con emulación de celular a **360 px** de ancho y, para las pruebas finales, un Android y un iPhone reales.

## Cómo abrir el sitio en local

**Importante: no abrir `index.html` con doble clic.** La página usa módulos de JavaScript (`<script type="module">`) y los navegadores los bloquean cuando el archivo se abre como `file://`; la pantalla quedaría en blanco o sin datos. Siempre hay que servirla por `http://localhost`.

1. Abrir una terminal en la raíz del repositorio (donde está `index.html`).
2. Iniciar un servidor estático local, con la primera opción que tengas:
   - Python (Windows): `python -m http.server 5500 --bind 127.0.0.1` (solo esta computadora). En algunas computadoras el comando es `py` en vez de `python`.
   - Node.js: `npx serve -l 5500`.
   - Visual Studio Code: extensión "Live Server" → "Go Live" (usa el puerto 5500).
3. Abrir `http://localhost:5500` en el navegador. Para detenerlo: `Ctrl + C` en la terminal.

Son herramientas de desarrollo gratuitas y no forman parte del producto: el sitio publicado sigue siendo solo archivos estáticos, sin compilación.

**Puerto**: se usa el **5500**. El 8080 puede fallar en Windows con `WinError 10013` (puerto reservado por el sistema).

**Probar en un celular real** (misma red Wi-Fi que la computadora):
1. Poner la red de casa como **Privada** en Windows.
2. Iniciar el servidor escuchando en toda la red: `python -m http.server 5500 --bind 0.0.0.0`.
3. Si el Firewall de Windows lo pide, **permitir Python** en redes privadas.
4. Averiguar la IP de la computadora (`ipconfig`, dirección IPv4) y abrir `http://<IP>:5500` en el celular.

Las pruebas finales de WhatsApp, fotos de Drive y rendimiento se repiten con el sitio ya publicado, por `https`.

## Prueba 0 – Verificación de lectura de la hoja (primera tarea)

Abrir la página y comprobar en la consola del navegador que ambas pestañas se descargan y se leen sin error de acceso. Si falla, ver la sección 2 de [research.md](research.md) antes de continuar. Comprobar también que una foto compartida desde Drive carga en Chrome Android y Safari iOS (la etiqueta `<img>` debe llevar `referrerpolicy="no-referrer"`; sin ella Google responde 429). En las herramientas del navegador (pestaña de red), revisar el encabezado `access-control-allow-origin` de la respuesta de Google y anotarlo. Los resultados van en [checklists/verificacion.md](checklists/verificacion.md).

## Historia 1 – Ver el catálogo

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 1 | Abrir el enlace | Se ven productos con foto, nombre, descripción corta, `S/ 0.00` y categoría. |
| 2 | Mirar el producto agotado | Aparece como agotado; no tiene botón para agregar. |
| 3 | Tocar una categoría y luego "Todos" | Primero solo esa categoría; luego todos. |
| 4 | Mirar la parte superior | Nombre y logo del negocio. |
| 5 | Abrir el enlace en un navegador sin iniciar sesión en Google ni instalar nada (RF-011) | El catálogo se ve y se puede usar sin cuenta ni instalación. |
| 6 | Dejar todas las filas de "Productos" inválidas (por ejemplo, sin precio) y recargar | Se muestra "Por ahora no hay productos disponibles" con el botón para escribir directo al WhatsApp del negocio. |

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
| 8 | Marcar un producto del pedido como agotado en la hoja, esperar el refresco y tocar "Enviar pedido" | Se quita con aviso, el total se recalcula, no se abre WhatsApp hasta tocar de nuevo. Repetir cambiando también el precio de otro producto del pedido: aparece el aviso de cambio de precio y también hay que tocar "Enviar pedido" otra vez. |
| 9 | Cerrar la página con un pedido a medias y reabrirla | El pedido se conserva. |
| 10 | Cantidades | Solo enteros entre 1 y 99. |
| 11 | Elegir un método de pago, quitarlo de los aceptados en la hoja (o dejar vacío el titular de Yape) y esperar el refresco | Se limpia la selección, aparece el aviso "El método de pago que elegiste ya no está disponible. Elige otro." y se puede elegir otro. |

**Control de sumas (CE-006)**: con precios como `0.10`, `0.20`, `19.99` y `12,50` y cantidades variadas, comprobar a mano que el total del mensaje es la suma exacta de los subtotales.

## Historia 3 – El dueño actualiza sin programar

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 1 | Cambiar un precio en la hoja y recargar el catálogo | El precio nuevo se ve de forma estable en un máximo de 10 minutos (medido el 2026-11-11: el valor nuevo aparece en segundos, pero alterna con el anterior hasta unos 5 min 30 s). Este valor se informa en la guía del dueño. |
| 2 | Agregar una fila con producto nuevo | Aparece en su categoría. |
| 3 | Dejar vacío el nombre o el precio de una fila | Esa fila no se muestra; el resto funciona. |
| 4 | Poner una foto inexistente | Se ve la imagen genérica. |
| 5 | Despublicar o romper el enlace CSV (sin copia previa) | Mensaje amable con botón para escribir al WhatsApp del negocio; al tocarlo se abre el chat con el mensaje "Hola, quiero hacer un pedido." ya escrito. |
| 6 | Cronometrar a una persona que no programa cambiando un precio con la guía | Menos de 1 minuto (CE-004). |
| 7 | Cortar la conexión y recargar (con copia previa) | Datos guardados con aviso "Mostrando datos guardados, pueden estar desactualizados"; sin envío; botón de WhatsApp visible. |
| 8 | Cargar el catálogo con conexión, armar un pedido válido, cortar la conexión y tocar "Enviar pedido" | El envío queda bloqueado con el aviso "No podemos confirmar los precios en este momento…" y el botón de WhatsApp visible; WhatsApp no se abre (RF-013). |

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
| CE-002 (360 px o más) | Emulación a 360 px: sin desplazamiento horizontal en ninguna pantalla y todos los elementos que se tocan miden al menos 44×44 px. |
| CE-003 (productos en < 3 s con 4G) | Limitación de red "4G" del navegador, con caché vacía. |
| CE-005 (S/ 0) | Revisar que no hay servicios con cobro. |
| CE-006 (0 errores de suma) | Control de sumas de la historia 2. |

## Caracteres especiales

Probar un producto "Ají de gallina 🍗 – Niño" y un nombre de cliente con ñ y tilde: deben verse bien en pantalla y en el mensaje de WhatsApp.
