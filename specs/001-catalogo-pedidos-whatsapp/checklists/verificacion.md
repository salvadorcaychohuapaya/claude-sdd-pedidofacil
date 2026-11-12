# Registro de verificación: Catálogo digital con pedidos por WhatsApp

**Propósito**: registro único de resultados de la prueba de concepto, de cada historia de usuario y de los criterios de éxito. La constitución exige registrar el resultado antes de dar por terminada una historia (sección "Flujo de Desarrollo y Puertas de Calidad").
**Escenarios**: [spec.md](../spec.md) | **Cómo probar**: [quickstart.md](../quickstart.md) | **Tareas**: [tasks.md](../tasks.md)

**Cómo se llena**: cada resultado lleva fecha, quién probó, dispositivo y navegador, y estado (`Cumple`, `No cumple` o `Pendiente`). Lo que no cumple se anota con el problema y la tarea que lo corrige. Una historia no se da por terminada mientras tenga escenarios en `No cumple` o `Pendiente`.

---

## Prueba de concepto (T007)

- **Fecha / quién**: 2026-11-11, Salvador. Detalle completo en [docs/resultado-poc.md](../../../docs/resultado-poc.md).
- **Hoja publicada como CSV, leída desde el navegador (computadora)**: **Cumple.** Windows, Brave y Chrome: los dos CSV se leen (HTTP 200, `text/csv; charset=utf-8`). Google redirige con 307 desde `pub?gid=...` hacia `doc-*-sheets.googleusercontent.com`. Tildes, ñ, emoji y valores con coma (entre comillas) llegan correctos.
- **Hoja publicada como CSV, leída desde celulares reales (modelo y navegador)**: **Cumple en iPhone 12 (Safari) y en Redmi 15C (Chrome en Android)**, por la red Wi-Fi local: en ambos los dos CSV se leen bien y las fotos cargan con `referrerpolicy="no-referrer"`.
- **Encabezado `access-control-allow-origin` de la respuesta de Google**: `Access-Control-Allow-Origin: *`
- **Foto de Drive: formato que carga** (`lh3.googleusercontent.com/d/ID=w400` o `drive.google.com/thumbnail?id=ID&sz=w400`): **Cumple con `referrerpolicy="no-referrer"`.** Sin esa política, los dos formatos responden `429 Too Many Requests` (`text/html`) dentro de la página, en Brave y en Chrome, aunque abiertos en una pestaña aparte sí cargan. Con `referrerpolicy="no-referrer"` ambos cargan (HTTP 200, `image/jpeg`, 400×267) en Brave, Chrome y Safari de iPhone; en Chrome del Redmi 15C también cargan. **Formato elegido**: `https://lh3.googleusercontent.com/d/ID=w400` (una sola solicitud); `drive.google.com/thumbnail` queda de alternativa (redirige con 302 al mismo `lh3`).
- **Regla obligatoria**: toda imagen que venga de Drive (fotos de productos y logo del negocio) lleva `referrerpolicy="no-referrer"`.
- **Enlaces de carpeta**: un enlace de carpeta de Drive (`drive.google.com/drive/folders/...`) no sirve, porque no contiene el ID de un archivo. `urlFoto()` lo trata como inválido (imagen genérica y aviso en la consola) y la guía del dueño explica que se copia el enlace de cada foto.
- **Servidor local en Windows**: el puerto 8080 falló con `WinError 10013` (reservado por Windows); se usó el 5500, con el comando `python` (no `py`).
- **Riesgo anotado**: Google puede limitar o cambiar el acceso a las fotos de Drive (límites de uso no documentados; ya se vio un 429 por el referer); la imagen genérica `img/generica.svg` sirve de respaldo.
- **Decisión**: se mantiene el plan técnico. No se activa ninguna alternativa de [research.md](../research.md) sección 2.

---

## Historia 1 – Ver el catálogo (T025)

| Escenario / paso de quickstart | Estado | Fecha / quién / dispositivo | Notas |
|---|---|---|---|
| Esc. 1: productos con foto, nombre, descripción corta (máx. 2 líneas), precio y categoría | Cumple | 2026-11-11 · el usuario · Chrome, vista 360 px (Samsung Galaxy A55) | Foto, nombre, descripción, precio y categoría visibles. |
| Esc. 2: producto agotado sin forma de agregarlo | Cumple | 2026-11-11 · el usuario · Chrome, vista 360 px (Samsung Galaxy A55) | Pollo entero y Gaseosa 500 ml muestran "Agotado", sin forma de agregarlos. |
| Esc. 3: filtro por categoría y "Todos" | Cumple | 2026-11-11 · el usuario · Chrome, vista 360 px (Samsung Galaxy A55) | Pollos, Bebidas (3), Postres (1) y Otros (Mate de coca). Los filtros pasan a dos filas. |
| Esc. 4: nombre y logo arriba | Cumple | 2026-11-11 · el usuario · Chrome, vista 360 px (Samsung Galaxy A55) | El logo apareció tras agregarlo en la clave `logo` de "Negocio". |
| RF-011: abrir sin iniciar sesión ni instalar nada | Cumple | 2026-11-11 · el usuario · Chrome, vista 360 px (Samsung Galaxy A55) | Probado en ventana de incógnito, sin sesión ni instalación. |
| Hoja sin productos válidos: "Por ahora no hay productos disponibles" con botón de WhatsApp | Cumple | 2026-11-11 · el usuario · Chrome, vista 360 px (Samsung Galaxy A55) | Aparece el mensaje con el botón "Escribir por WhatsApp"; los dos CSV se descargan con HTTP 200. Los precios se restauraron después. |
| Caracteres especiales (tildes, ñ, emoji) | Cumple | 2026-11-11 · el usuario · Chrome, vista 360 px (Samsung Galaxy A55) | Piña, maracuyá, emoji y nombre con coma. |

**Revisión de principios I–VII (Historia 1)**

| Principio | Cumple | Nota |
|---|---|---|
| I. Costo cero | Cumple |  |
| II. Primero el celular | Cumple | Sin desplazamiento horizontal a 360 px. |
| III. Simplicidad | Cumple |  |
| IV. El dueño no programa | Cumple |  |
| V. Privacidad | Cumple |  |
| VI. Español de Perú | Cumple |  |
| VII. Entrega por historias | Cumple |  |

**Observaciones (Historia 1)**

- Ancho: a 360 px no hay desplazamiento horizontal.
- Consola: solo el error de `favicon.ico` (inofensivo) y los avisos de filas omitidas durante la prueba de hoja sin productos.
- Frescura: la página descarga la hoja en unos 1,2 s. El cambio en la hoja tardó varios minutos en reflejarse por la republicación de Google; no se midió con precisión. La medición formal queda para T042.
- Problemas encontrados: ninguno.

---

## Historia 2 – Armar el pedido y enviarlo por WhatsApp (T036, T037)

| Escenario / paso de quickstart | Estado | Fecha / quién / dispositivo | Notas |
|---|---|---|---|
| Esc. 1: subtotales y total al instante | Cumple | 2026-11-11 · el usuario |  |
| Esc. 2: mensaje de WhatsApp completo y correcto | Cumple | 2026-11-11 · el usuario |  |
| Esc. 3: pedido vacío no se envía | Cumple | 2026-11-11 · el usuario |  |
| Esc. 4: delivery sin dirección no se envía | Cumple | 2026-11-11 · el usuario |  |
| Esc. 5: nota de delivery no incluido | Cumple | 2026-11-11 · el usuario |  |
| Esc. 6: pedido se conserva y "Empezar un pedido nuevo" destacado | Cumple | 2026-11-11 · el usuario |  |
| Esc. 7: "Empezar un pedido nuevo" vacía el pedido | Cumple | 2026-11-11 · el usuario |  |
| Esc. 8: producto agotado o eliminado se quita con aviso | Cumple | 2026-11-11 · el usuario |  |
| Esc. 9: aviso (incluido cambio de precio) y segundo toque en "Enviar pedido" | Cumple | 2026-11-11 · el usuario |  |
| Cierre de la página y reapertura | Cumple | 2026-11-11 · el usuario | Al recargar se conservan el pedido y el nombre. |
| Cantidades solo enteras de 1 a 99 | Cumple | 2026-11-11 · el usuario | Verificado con node en T026–T031. En pantalla la cantidad solo se cambia con + y −. |
| Método de pago deja de ser válido tras actualizar la hoja: se limpia la selección, hay aviso y se elige otro | Cumple | 2026-11-11 · el usuario | Paso 11. Con `metodos_pago` vacío solo se ofrece "A coordinar por WhatsApp". |
| Control de sumas CE-006 (`0.10`, `0.20`, `19.99`, `12,50`) | Cumple | 2026-11-11 · el usuario | Con 0.10 + 0.20 + 19.99 + 12,50 el total en pantalla y en el mensaje es S/ 32.79. |
| Prueba en celular real: WhatsApp abre con el mensaje correcto (Android / iPhone) | Cumple | 2026-11-11 · el usuario · iPhone 12 (Safari) y Redmi 15C (Chrome) | T036: WhatsApp abre con el mensaje correcto, con tildes, ñ y emojis. |
| WhatsApp de escritorio (Windows): el mensaje llega bien, con emojis de producto | Cumple | 2026-11-11 · el usuario · WhatsApp de escritorio (Windows) | Llega bien, incluido el emoji de producto 🍍. Solo el 🛒 decorativo del encabezado llegaba como "�" y se quitó del mensaje. |

**Revisión de principios I–VII (Historia 2)**

| Principio | Cumple | Nota |
|---|---|---|
| I. Costo cero | Cumple | |
| II. Primero el celular | Cumple | |
| III. Simplicidad | Cumple | |
| IV. El dueño no programa | Cumple | |
| V. Privacidad | Cumple | |
| VI. Español de Perú | Cumple | |
| VII. Entrega por historias | Cumple | |

**Observaciones (Historia 2)**

- Retraso de publicación de Google variable: en una prueba el cambio de `metodos_pago` tardó más de 5 minutos en llegar y en otra mucho menos. La página usó en cada caso los datos vigentes que entregó Google. Se medirá en T042.

---

## Historia 3 – El dueño actualiza sus productos sin saber programar (T042, T043, T044)

| Escenario / paso de quickstart | Estado | Fecha / quién / dispositivo | Notas |
|---|---|---|---|
| Esc. 1: precio nuevo visible de forma estable en un máximo de 10 minutos (tiempo medido: 5 min 30 s y 2 min) | Cumple | 2026-11-11 / manual, recargando el catálogo | El valor nuevo aparece por primera vez en segundos, pero alterna con el anterior durante la transición porque Google sirve el CSV desde varias copias. Medición 1 (arroz-leche 6.00 → 6.80): unos 5 min 30 s hasta verse estable; medición 2 (6.80 → 5.80): unos 2 min. Antes, un cambio de `metodos_pago` tardó más de 5 minutos. Superó los 5 minutos: spec, quickstart, research y guía del dueño ajustados a 10 minutos (T042). |
| Esc. 2: producto nuevo aparece en su categoría | Cumple (paso 2) | 2026-11-11 / Salvador / Chrome 360 px (Samsung Galaxy A55) | Además, al cambiarle la categoría a "Combos", la categoría nueva se creó sola. |
| Esc. 3: fila con nombre o precio vacío no se muestra | Cumple (paso 3) | 2026-11-11 / Salvador / Chrome 360 px (Samsung Galaxy A55) | La fila sin precio no se muestra. |
| Esc. 4: sin conexión, con copia guardada: aviso, envío bloqueado, botón de WhatsApp visible | Cumple (paso 7) | 2026-11-11 / Salvador / Chrome 360 px (Samsung Galaxy A55) | Se ve el aviso "Mostrando datos guardados, pueden estar desactualizados", el envío está desactivado, los botones "Escribir por WhatsApp" y "Reintentar" están visibles y el pedido se conserva. Falta de conexión simulada bloqueando las solicitudes a docs.google.com en las herramientas del navegador. |
| Con el catálogo cargado, sin conexión al tocar "Enviar pedido": envío bloqueado con aviso y botón de WhatsApp visible (RF-013) | Cumple (paso 8) | 2026-11-11 / Salvador / Chrome 360 px (Samsung Galaxy A55) | Al tocar "Enviar pedido" sin conexión sale el aviso "No podemos confirmar los precios en este momento…" y el envío queda bloqueado. Falta de conexión simulada bloqueando las solicitudes a docs.google.com en las herramientas del navegador. |
| Foto inexistente muestra la imagen genérica | Cumple (paso 4) | 2026-11-11 / Salvador / Chrome 360 px (Samsung Galaxy A55) | Se muestra la imagen genérica. |
| Sin copia y hoja inaccesible: mensaje amable con botón de WhatsApp que abre el chat con "Hola, quiero hacer un pedido." | Cumple (pasos 5 y 6) | 2026-11-11 / Salvador / Chrome 360 px (Samsung Galaxy A55) | Sin copia y sin conexión: mensaje amable con "Escribir por WhatsApp" y "Reintentar"; el botón de WhatsApp abre el chat con "Hola, quiero hacer un pedido." Falta de conexión simulada bloqueando las solicitudes a docs.google.com en las herramientas del navegador. |
| CE-004: cambiar un precio con la guía en menos de 1 minuto (tiempo: ___ s) | Pendiente | 2026-11-11 / Salvador (instalador) | El instalador leyó `docs/guia-del-dueno.md` desde el punto de vista de una persona no técnica y la encontró clara y fácil de entender (T043). No se cronometró a una persona que no programa: el CE-004 queda Pendiente, para medirlo con el primer dueño real. |

**Revisión de principios I–VII (Historia 3)**

| Principio | Cumple | Nota |
|---|---|---|
| I. Costo cero | Cumple | |
| II. Primero el celular | Cumple | |
| III. Simplicidad | Cumple | |
| IV. El dueño no programa | Cumple | |
| V. Privacidad | Cumple | |
| VI. Español de Perú | Cumple | |
| VII. Entrega por historias | Cumple | |

---

## Historia 4 – Métodos de pago (T048)

| Escenario / paso de quickstart | Estado | Fecha / quién / dispositivo | Notas |
|---|---|---|---|
| Esc. 1: solo métodos aceptados por el negocio | Cumple | 2026-11-11 / Salvador / Chrome 360 px (Samsung Galaxy A55) | Se ofrecen Yape, Plin y Efectivo. La hoja se restauró después de las pruebas. |
| Esc. 2: Yape/Plin muestran número, titular e indicación de captura | Cumple | 2026-11-11 / Salvador / Chrome 360 px (Samsung Galaxy A55) | El recuadro con número, titular e indicación de enviar la captura cambia al cambiar de método y desaparece con Efectivo. |
| Esc. 3: Yape/Plin sin número o titular no aparecen | Cumple | 2026-11-11 / Salvador / Chrome 360 px (Samsung Galaxy A55) | Yape sin titular no aparece. |
| Esc. 4: sin métodos válidos solo "A coordinar por WhatsApp" | Cumple | 2026-11-11 / Salvador / Chrome 360 px (Samsung Galaxy A55) | Sin métodos válidos solo se ofrece "A coordinar por WhatsApp". |
| Línea de pago correcta en el mensaje de WhatsApp | Cumple | 2026-11-11 / Salvador / Chrome 360 px (Samsung Galaxy A55) | Con Plin dice "*Pago:* Plin" y el recordatorio de la captura; con "A coordinar por WhatsApp" no hay recordatorio. |

**Revisión de principios I–VII (Historia 4)**

| Principio | Cumple | Nota |
|---|---|---|
| I. Costo cero | Cumple | |
| II. Primero el celular | Cumple | |
| III. Simplicidad | Cumple | |
| IV. El dueño no programa | Cumple | |
| V. Privacidad | Cumple | |
| VI. Español de Perú | Cumple | |
| VII. Entrega por historias | Cumple | |

---

## Criterios de éxito (T054) y verificación final (T056)

| Criterio | Medida | Resultado | Estado | Fecha / quién |
|---|---|---|---|---|
| CE-001 | Pedido de 3 productos en menos de 2 minutos (cliente nuevo) | | Pendiente | |
| CE-002 | Sin desplazamiento horizontal a 360 px y áreas táctiles de al menos 44×44 px | Revisión de código (T049): todos los botones, campos y opciones tienen al menos 44 px de alto (`--area-tactil`); campos de 1 rem (16 px); los textos largos se parten y las categorías y botones pasan a otra línea, sin desplazamiento horizontal. Falta la medición final en el dispositivo (T054). | Cumple (código) | 2026-11-11 / revisión de código (Claude) |
| CE-003 | Productos visibles en menos de 3 s con 4G y caché vacía | Peso (T051): HTML + CSS + JS = 74 780 bytes (73 KiB) sin comprimir, **por encima de 60 KB**; unos 25 KB comprimidos. Fotos con carga diferida; sin librerías. La medición con 4G es de T054. | Pendiente | 2026-11-11 / revisión de código (Claude) |
| CE-004 | Cambiar un precio sin ayuda en menos de 1 minuto | | Pendiente | Sin cronometrar: la guía fue revisada por el instalador el 2026-11-11; se medirá con el primer dueño real. |
| CE-005 | Costo mensual de operación: S/ 0 | Revisión de código (T050): sin costo ni servicios de pago. Falta confirmarlo con el sitio publicado. | Cumple (código) | 2026-11-11 / revisión de código (Claude) |
| CE-006 | 0 errores de suma en el mensaje de pedido | | Pendiente | |

**Revisiones de código de la Fase 8 (2026-11-11)**

- **T049 (diseño a 360 px):** botones, campos, filtros y opciones con mínimo de 44 px; textos base de 1 rem; sin anchos fijos que pasen de 360 px (tarjetas con columnas `96px` + `minmax(0, 1fr)`); todo el texto visible sale de `contracts/textos-interfaz.md` y los precios con `S/`. Sin hallazgos.
- **T050 (privacidad y costo):** la única llamada de red del código es `fetch` a las dos hojas publicadas (`hoja.js`); las demás solicitudes son las fotos y el logo de Drive (con `referrerpolicy="no-referrer"`) y el enlace `wa.me` al enviar. No hay analíticas, cookies, fuentes ni scripts externos, ni servidor propio. En el celular solo se guarda el pedido y la copia del catálogo (localStorage). `config.js` solo tiene el número del negocio y los dos enlaces CSV, que son públicos. Hallazgo menor: los comentarios de `config.js` aún dicen que los valores son de ejemplo, aunque ya son los reales.
- **T051 (peso):** `index.html` 1 086 B, `css/estilos.css` 10 789 B, `js/*.js` 62 905 B (total 74 780 B); `img/generica.svg` 342 B; sin librerías. Supera en unos 14 KB el máximo de 60 KB de T051: queda por decidir si se recorta el código o se sube el máximo.

**Verificación final sobre el sitio publicado (T056)**: _pendiente_
