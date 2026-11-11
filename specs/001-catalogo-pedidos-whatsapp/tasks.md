---

description: "Lista de tareas para implementar el catálogo digital con pedidos por WhatsApp"
---

# Tareas: Catálogo digital con pedidos por WhatsApp

**Entrada**: documentos de diseño en `specs/001-catalogo-pedidos-whatsapp/`

**Requisitos previos**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Pruebas**: no se generan tareas de pruebas automatizadas. El plan define pruebas **manuales** con los escenarios de aceptación en vista de celular de 360 px; cada historia termina con una tarea de verificación manual según [quickstart.md](quickstart.md).

**Organización**: las tareas se agrupan por historia de usuario para implementar y probar cada una por separado (principio VII de la constitución).

## Formato: `[ID] [P?] [Historia] Descripción`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin depender de tareas sin terminar).
- **[US1]–[US4]**: historia de usuario a la que pertenece la tarea.
- 👤 **[MANUAL]**: tarea que **haces tú** (crear o publicar la hoja, probar en un celular real, medir tiempos, publicar el sitio). Claude Code no puede hacerla por ti.
- Todas las rutas son relativas a la raíz del repositorio y siguen la estructura de [plan.md](plan.md).

## Convenciones de ruta

Sitio estático de una sola página: `index.html`, `config.js`, `css/estilos.css`, `js/*.js`, `img/generica.svg`, `docs/guia-del-dueno.md`. No hay `src/` ni `tests/`. Todas las rutas dentro del HTML, CSS y JS son **relativas** (el sitio vive bajo `/nombre-del-repositorio/`).

---

## Fase 1: Prueba de concepto (PRIMERA TAREA DE IMPLEMENTACIÓN)

**Propósito**: verificar con una hoja real de Google Sheets que el navegador puede leer el CSV publicado y que las fotos de Drive se muestran. Es el riesgo principal del plan ([research.md](research.md), secciones 1 y 2). **Si falla, se detiene todo** y se decide la alternativa contigo antes de seguir.

- [X] T001 👤 **[MANUAL]** Crear en tu cuenta de Google una hoja de cálculo de prueba con las pestañas "Productos" y "Negocio" (nombres exactos), con las columnas de [contracts/hoja-de-calculo.md](contracts/hoja-de-calculo.md) y los datos de prueba de [quickstart.md](quickstart.md), sección "Requisitos previos": al menos 3 categorías, un producto agotado, un producto sin foto, una fila sin precio, un nombre con tildes, ñ y emoji, un nombre con coma, y Yape con número y titular completos.
- [X] T002 👤 **[MANUAL]** Subir 2 o 3 fotos de prueba a una carpeta de tu Google Drive, compartirlas como "Cualquier persona con el enlace" y pegar los enlaces de compartir en la columna `foto` de la pestaña "Productos" (y uno en la clave `logo` de "Negocio").
- [X] T003 👤 **[MANUAL]** Publicar cada pestaña de la hoja en la web como CSV (Archivo → Compartir → Publicar en la web → formato CSV) y guardar los dos enlaces CSV obtenidos.
- [X] T004 Crear la página descartable `poc/poc.html` (sin dependencias) con tres campos de texto (enlace CSV de "Productos", enlace CSV de "Negocio" y enlace de foto de Drive) y un botón "Probar" que: descargue ambos CSV con `fetch` en paralelo usando `cache: "no-cache"`, muestre el texto crudo recibido o el error exacto (incluido el de acceso entre sitios), y muestre la foto con `https://lh3.googleusercontent.com/d/ID=w400` (ID extraído del enlace de Drive) y, debajo, con la alternativa `https://drive.google.com/thumbnail?id=ID&sz=w400`. Debe verse bien a 360 px.
- [X] T005 👤 **[MANUAL]** Servir la carpeta del repositorio con un servidor local (ver [quickstart.md](quickstart.md), sección "Cómo abrir el sitio en local"), abrir `http://localhost:5500/poc/poc.html` en el navegador de la computadora, pegar los tres enlaces y anotar si los CSV se leen y si la foto carga.
- [X] T006 👤 **[MANUAL]** Repetir la prueba en **celulares reales** (Chrome en Android y Safari en iPhone, o los que tengas) abriendo `http://<IP de la computadora>:5500/poc/poc.html` por la misma red Wi-Fi. _Hecho: iPhone 12 con Safari y Redmi 15C con Chrome (Android); en ambos los dos CSV se leen y las fotos cargan con `referrerpolicy="no-referrer"`._ Anotar, por celular, si los CSV se leen y cuál de los dos formatos de foto carga. Además, en las herramientas del navegador (pestaña de red), revisar el encabezado `access-control-allow-origin` de la respuesta de Google y anotar su valor exacto.
- [X] T007 Registrar el resultado en la sección "Prueba de concepto" de [checklists/verificacion.md](checklists/verificacion.md) (fecha, dispositivos, qué funcionó, formato de foto elegido, valor del encabezado `access-control-allow-origin` de T006) y confirmar la decisión. Anotar también el riesgo de que Google limite o cambie el acceso a las fotos de Drive; la imagen genérica sirve de respaldo. Si el CSV no se puede leer desde el navegador o ningún formato de foto funciona: **detenerse** y proponerte las alternativas descritas en la sección 2 de research.md antes de continuar.

**Punto de control**: la lectura del CSV y las fotos de Drive están confirmadas en una hoja real. Solo entonces se sigue.

---

## Fase 2: Preparación (estructura del proyecto)

**Propósito**: crear la estructura de archivos del plan.

- [X] T008 Crear la estructura del plan: `index.html`, `config.js`, `css/estilos.css`, `js/app.js`, `js/hoja.js`, `js/catalogo.js`, `js/pedido.js`, `js/formulario.js`, `js/mensaje.js`, `js/almacenamiento.js`, `js/formato.js`, `img/` y `docs/`, cada archivo de JavaScript con un comentario de una línea, en español, que indique su propósito según [plan.md](plan.md).
- [X] T009 [P] Crear `img/generica.svg`: imagen genérica liviana (ícono de producto neutro, menos de 2 KB) para fotos vacías o que no cargan.
- [X] T010 [P] Crear `config.js` según [contracts/config.md](contracts/config.md): `export const CONFIG` con `whatsapp` (solo dígitos, empieza con `51`), `hojaProductosCsv` y `hojaNegocioCsv`, con valores de ejemplo claramente marcados.
- [X] T011 👤 **[MANUAL]** Poner en `config.js` tu número de WhatsApp de prueba (con `51`, sin `+`, espacios ni guiones) y los dos enlaces CSV obtenidos en T003.

---

## Fase 3: Base común (bloquea todas las historias)

**Propósito**: módulos compartidos sin interfaz que usan todas las historias.

**⚠️ CRÍTICO**: ninguna historia puede empezar hasta terminar esta fase.

- [X] T012 [P] Implementar en `js/formato.js` el dinero en céntimos: función que convierte céntimos enteros a `S/ 0.00` con división y resto enteros (sin decimales flotantes), y función que convierte el texto del precio a céntimos enteros aceptando `12`, `12.5`, `12.50` y `12,50`, y rechazando vacíos, cero, negativos y textos no numéricos (devuelve "inválido").
- [X] T013 Implementar en `js/formato.js` (después de T012) la normalización de texto (quitar espacios al inicio y al final, ignorar mayúsculas y tildes) y `urlFoto()` según [research.md](research.md), sección 1 y el resultado de T007: extrae el ID de enlaces `https://drive.google.com/file/d/ID/view...` y `...open?id=ID` y construye la URL con ancho reducido (`=w400`); deja pasar cualquier otro enlace `https://` directo; si la celda está vacía devuelve la imagen genérica `img/generica.svg`. **Rechaza como inválido un enlace de carpeta de Drive** (`drive.google.com/drive/folders/...`, no contiene el ID de un archivo): devuelve la imagen genérica y deja un aviso en la consola (resultado de T007, ver [docs/resultado-poc.md](../../docs/resultado-poc.md)).
- [X] T014 [P] Implementar `js/almacenamiento.js`: lectura y escritura de JSON en `localStorage` con `try/catch` y respaldo en memoria si no está disponible (ventana privada o bloqueado), con las claves `pedidofacil:pedido:v1` y `pedidofacil:catalogo:v1` de [data-model.md](data-model.md); debe indicar si el almacenamiento persistente está disponible.
- [X] T015 [P] Implementar en `js/hoja.js` el lector de CSV propio, sin librerías: comillas dobles, comas y saltos de línea dentro de una celda, comillas escapadas (`""`), BOM al inicio y saltos `\r\n`; lectura como UTF-8; las filas se entregan por **nombre de columna** (encabezados normalizados), ignorando columnas desconocidas. Incluir la descarga de las dos pestañas en paralelo con `fetch`, `cache: "no-cache"` y un tiempo de espera máximo de 8 segundos.
- [X] T016 [P] Crear la estructura base de `index.html`: `lang="es-PE"`, `meta viewport`, `<script type="module" src="js/app.js">`, rutas relativas, y los contenedores vacíos de encabezado, filtro de categorías, lista de productos, aviso general, resumen del pedido y formulario; todos los textos visibles en español de Perú.
- [X] T017 [P] Crear los estilos base mobile-first en `css/estilos.css` (variables de color, tipografía, espaciado, botones con áreas táctiles de al menos 44×44 px, sin desplazamiento horizontal desde 360 px).

**Punto de control**: base lista; se puede empezar la historia 1.

---

## Fase 4: Historia de usuario 1 – Ver el catálogo (Prioridad: P1) 🎯 MVP

**Meta**: el cliente abre el enlace y ve los productos con foto, nombre, descripción, precio en soles y categoría, puede filtrar por categoría y ve los agotados como no disponibles.

**Prueba independiente**: abrir el enlace del negocio en un celular y ver los productos disponibles ([spec.md](spec.md), Historia 1).

### Implementación de la Historia 1

- [ ] T018 [US1] Implementar en `js/hoja.js` la interpretación de la pestaña "Productos" según [data-model.md](data-model.md) y [contracts/hoja-de-calculo.md](contracts/hoja-de-calculo.md): `id` ("Estable; si falta se genera desde el nombre; si se repite, se descarta la fila repetida" con aviso en la consola); `nombre` ("**Obligatorio**; si está vacío la fila no se muestra"); `precioCentimos` ("Entero > 0; texto no numérico, vacío, cero o negativo → la fila no se muestra"); `categoria` ("si falta, se agrupa en 'Otros'"); `foto` opcional; `disponible` normalizado (sin importar mayúsculas, tildes ni espacios: `no` o `agotado` → no disponible; vacío, `sí` y cualquier otro valor → disponible); `orden` numérico opcional. Una fila inválida no rompe el resto; si tras validar no queda ningún producto, devolver una lista vacía para que `js/app.js` (T023) muestre el estado "Sin productos".
- [ ] T019 [US1] Implementar en `js/hoja.js` la interpretación de la pestaña "Negocio" (columnas `clave` y `valor`): `nombre` ("Obligatorio; si falta, se muestra 'Catálogo'"), `logo` (opcional), `metodos_pago` (lista separada por comas con `Yape`, `Plin`, `Efectivo`, `Transferencia`), `yape_numero`, `yape_titular`, `plin_numero`, `plin_titular`; el número de WhatsApp **nunca** se lee de la hoja.
- [ ] T020 [US1] Implementar en `js/catalogo.js` la derivación de categorías y el orden de [data-model.md](data-model.md): "Todos" primero y vista inicial; luego las categorías por el menor `orden` entre sus productos; en empate o sin `orden`, por primera aparición en la hoja (las que tienen algún `orden` van antes que las que no); "Otros" al final; nombres comparados sin importar mayúsculas, tildes ni espacios. Productos dentro de cada categoría por `orden` y, a igual `orden`, por posición en la hoja; los agotados conservan su lugar.
- [ ] T021 [US1] Implementar en `js/catalogo.js` (después de T020) la tarjeta de producto: foto con carga diferida, **`referrerpolicy="no-referrer"` en la etiqueta `<img>` (obligatorio: sin él Google responde 429 a las fotos de Drive)**, ancho y alto reservados y reemplazo por `img/generica.svg` si falla (`onerror`); nombre; descripción corta (máximo 2 líneas; si es más larga se corta con "…"; sin "ver más" en la versión 1); precio `S/ 0.00` con `js/formato.js`; categoría; los productos no disponibles se ven como "Agotado" y **no** tienen forma de agregarse (textos de [contracts/textos-interfaz.md](contracts/textos-interfaz.md)).
- [ ] T022 [US1] Implementar en `js/catalogo.js` (después de T021) el filtro por categoría: tocar una categoría muestra solo sus productos y "Todos" vuelve a mostrarlos todos.
- [ ] T023 [US1] Implementar en `js/app.js` el arranque: validar `CONFIG.whatsapp` (solo dígitos, empieza con `51`; si no, mensaje en la consola y envío deshabilitado), descargar las dos pestañas con `js/hoja.js`, mostrar nombre y logo del negocio arriba (si no hay logo, o es inválido, solo el nombre; la etiqueta `<img>` del logo lleva `referrerpolicy="no-referrer"` igual que las fotos, y el enlace se procesa con `urlFoto()`) y manejar los estados "Cargando" (marcadores de carga), "Vigente", "Sin datos" (mensaje amable con botón "Escribir por WhatsApp" que abre `https://wa.me/<whatsapp>?text=` con el mensaje prellenado "Hola, quiero hacer un pedido." codificado con `encodeURIComponent`, según [contracts/textos-interfaz.md](contracts/textos-interfaz.md); el mismo botón se reutiliza en los demás estados) y "Sin productos" (la hoja responde pero no queda ningún producto válido: mostrar "Por ahora no hay productos disponibles" con ese mismo botón de WhatsApp). Todos los textos visibles, incluidos el aviso de número mal configurado y el mensaje amable, salen de [contracts/textos-interfaz.md](contracts/textos-interfaz.md).
- [ ] T024 [US1] Completar en `css/estilos.css` los estilos del encabezado, filtro de categorías, tarjetas de producto, marcadores de carga y mensaje "Sin datos", verificando que se ven bien desde 360 px sin desplazamiento horizontal.
- [ ] T025 [US1] 👤 **[MANUAL]** **Verificación de la Historia 1**: ejecutar en vista de celular de 360 px los pasos 1 a 6 de la tabla "Historia 1" de [quickstart.md](quickstart.md) (catálogo con foto/nombre/descripción/precio/categoría, producto agotado, filtro por categoría y "Todos", nombre y logo arriba, y abrir el enlace sin iniciar sesión ni instalar nada, RF-011, y hoja sin productos válidos con "Por ahora no hay productos disponibles") y la sección "Caracteres especiales". Anotar el resultado, los problemas encontrados y la revisión breve de los principios I–VII en la sección "Historia 1" de [checklists/verificacion.md](checklists/verificacion.md).

**Punto de control**: la historia 1 funciona y está verificada por sí sola. No se pasa a la historia 2 hasta cumplirla.

---

## Fase 5: Historia de usuario 2 – Armar el pedido y enviarlo por WhatsApp (Prioridad: P1)

**Meta**: el cliente agrega productos con cantidades, completa sus datos y envía el pedido ya redactado al WhatsApp del negocio con un solo toque.

**Prueba independiente**: agregar 2 productos, completar los datos, tocar "Enviar pedido" y comprobar que WhatsApp se abre con el mensaje correcto ([spec.md](spec.md), Historia 2).

### Implementación de la Historia 2

- [ ] T026 [US2] Implementar `js/pedido.js`: estado del pedido con `items` (`id` y `cantidad`) según [data-model.md](data-model.md): "`cantidad`: Entero entre 1 y 99. Bajar de 1 quita el producto"; agregar, quitar y cambiar cantidad; "`subtotal = precioCentimos × cantidad`; `total = suma de subtotales`" calculados solo con enteros en céntimos; los **precios no se guardan** en el pedido, se calculan siempre con el catálogo vigente.
- [ ] T027 [US2] Agregar en `js/catalogo.js` el botón "Agregar" en cada producto disponible (los agotados siguen sin botón) y los controles de cantidad (más, menos, quitar) que usan `js/pedido.js`.
- [ ] T028 [US2] Implementar en `js/app.js` e `index.html` el resumen "Tu pedido": productos con cantidad, precio unitario, subtotal por producto y total en `S/ 0.00`, que se actualizan al instante al cambiar cantidades o quitar un producto; con el pedido vacío se muestra un texto que invita a agregar productos (textos de [contracts/textos-interfaz.md](contracts/textos-interfaz.md)).
- [ ] T029 [P] [US2] Implementar `js/formulario.js` (campos y reglas) según [data-model.md](data-model.md) y [contracts/mensaje-whatsapp.md](contracts/mensaje-whatsapp.md): `nombre` ("Obligatorio"), `modalidad` ("Obligatoria: `recojo` o `delivery`"), `direccion` y `referencia` ("Obligatorias solo si `modalidad = delivery`"), `metodoPago` ("Obligatorio; debe ser uno de los métodos válidos mostrados") y `comentario` ("Opcional"). En esta historia el selector ofrece los métodos marcados en la hoja y, si no hay ninguno, solo "A coordinar por WhatsApp"; el filtrado por datos de Yape/Plin queda para la Historia 4. Con delivery, mostrar bajo el total que el costo del delivery se coordina por WhatsApp y no está incluido. Los textos de los campos y avisos salen de [contracts/textos-interfaz.md](contracts/textos-interfaz.md).
- [ ] T030 [P] [US2] Implementar `js/mensaje.js` según [contracts/mensaje-whatsapp.md](contracts/mensaje-whatsapp.md): texto del pedido con líneas `<cantidad> x <nombre> (S/ <precio unitario>) = S/ <subtotal>`, total exacto igual a la suma de los subtotales mostrados, nota de delivery, comentario solo si existe, y enlace `https://wa.me/<whatsapp>?text=` con el mensaje codificado con `encodeURIComponent` (conserva tildes, ñ, emojis y saltos de línea).
- [ ] T031 [US2] Conectar `js/almacenamiento.js` con el pedido y el formulario: guardar `items`, `cliente` y `enviado` en `pedidofacil:pedido:v1` en cada cambio y restaurarlos al abrir la página (el pedido se conserva al cerrar y volver); si el almacenamiento persistente no está disponible, mostrar el aviso discreto de que el pedido no se conservará (texto en [contracts/textos-interfaz.md](contracts/textos-interfaz.md)).
- [ ] T032 [US2] Implementar en `js/app.js` y `js/pedido.js` la revisión del pedido contra el catálogo vigente, que se ejecuta al abrir el catálogo y justo antes de enviar: los productos agotados o que ya no están en la hoja se quitan del pedido, se muestra un aviso con el nombre del producto y el motivo, y el total se recalcula; si cambió algún precio, también se avisa. Si el método de pago elegido ya no es válido, se limpia la selección, se muestra un aviso y el cliente elige otro. Los avisos usan la redacción de [contracts/textos-interfaz.md](contracts/textos-interfaz.md).
- [ ] T033 [US2] Implementar en `js/app.js` el flujo del botón "Enviar pedido": comprobar las seis condiciones de [contracts/mensaje-whatsapp.md](contracts/mensaje-whatsapp.md) (pedido con productos, nombre, modalidad, dirección y referencia si es delivery, método de pago, cantidades enteras de 1 a 99), mostrando un aviso que diga qué falta (redacción en [contracts/textos-interfaz.md](contracts/textos-interfaz.md)); volver a descargar la hoja y ejecutar la revisión de T032; si la descarga falla, bloquear el envío con un aviso y el botón para escribir directo al negocio; si la revisión quitó productos o cambió precios, mostrar el aviso (incluido el de cambio de precio) y **no** abrir WhatsApp solo (el cliente debe tocar otra vez "Enviar pedido", escenario 9 de la Historia 2); si todo está bien, marcar `enviado = true` y navegar al enlace con `location.href` (no ventana nueva).
- [ ] T034 [US2] Implementar el botón "Empezar un pedido nuevo": vacía el pedido y el formulario tras una confirmación (textos en [contracts/textos-interfaz.md](contracts/textos-interfaz.md)); el pedido **no** se vacía al enviar; después de tocar "Enviar pedido" el botón se muestra de forma destacada.
- [ ] T035 [US2] Completar en `css/estilos.css` los estilos del resumen del pedido, controles de cantidad, formulario, avisos y botón destacado, con campos de al menos 16 px de tamaño de letra (evita el acercamiento automático en iPhone) y áreas táctiles de al menos 44×44 px, desde 360 px.
- [ ] T036 [US2] 👤 **[MANUAL]** **Prueba en celular real**: en un Android y, si tienes, un iPhone, enviar un pedido de prueba y comprobar que WhatsApp abre hacia el número del negocio con el mensaje correcto (tildes, ñ y emoji incluidos) y que, tras una revisión que quitó productos, hay que tocar "Enviar pedido" otra vez. Anotar en la sección "Historia 2" de [checklists/verificacion.md](checklists/verificacion.md) si algún navegador bloquea la apertura (riesgo de [research.md](research.md), sección 5).
- [ ] T037 [US2] 👤 **[MANUAL]** **Verificación de la Historia 2**: ejecutar los pasos 1 a 11 de la tabla "Historia 2" de [quickstart.md](quickstart.md) en vista de celular de 360 px, incluido el **control de sumas (CE-006)** con precios `0.10`, `0.20`, `19.99` y `12,50`, el aviso de cambio de precio con segundo toque (escenario 9) y el método de pago que deja de ser válido (paso 11). Anotar el resultado, los problemas encontrados y la revisión breve de los principios I–VII en la sección "Historia 2" de [checklists/verificacion.md](checklists/verificacion.md).

**Punto de control**: las historias 1 y 2 funcionan. Ya se puede pedir de punta a punta (MVP completo).

---

## Fase 6: Historia de usuario 3 – El dueño actualiza sus productos sin saber programar (Prioridad: P1)

**Meta**: el dueño cambia precios, fotos, disponibilidad y productos desde la hoja; el cliente ve los cambios en un máximo de 5 minutos y el catálogo sigue siendo útil si no hay conexión.

**Prueba independiente**: cambiar un precio y marcar un producto como agotado en la hoja, recargar el catálogo y ver ambos cambios ([spec.md](spec.md), Historia 3).

### Implementación de la Historia 3

- [ ] T038 [P] [US3] Escribir `docs/guia-del-dueno.md` en español de Perú, para una persona que no programa: cómo cambiar un precio, agregar un producto, marcar un producto agotado (`no` o `agotado`), poner fotos desde Drive (compartir "Cualquier persona con el enlace" y pegar el enlace **de cada foto, no el de la carpeta**: un enlace de carpeta no funciona y se verá la imagen genérica; fotos cuadradas y menores de 1 MB; no moverlas ni borrarlas), qué hace cada columna de las pestañas "Productos" y "Negocio" según [contracts/hoja-de-calculo.md](contracts/hoja-de-calculo.md), que los cambios tardan unos minutos en verse, y que el número de WhatsApp lo cambia quien instaló el catálogo. Si la medición de T042 supera 5 minutos, actualizar aquí el tiempo de espera real que se informe al dueño.
- [ ] T039 [US3] Implementar en `js/almacenamiento.js` y `js/hoja.js` la copia del catálogo: guardar `{ guardadoEn, negocio, productos }` en `pedidofacil:catalogo:v1` **solo** cuando la descarga y la lectura terminan bien, y exponer una función para recuperarla.
- [ ] T040 [US3] Completar en `js/app.js` los estados de [data-model.md](data-model.md): "Cargando con copia" (mostrar la copia guardada mientras se actualiza, sin permitir enviar hasta terminar) y "Copia guardada" (si la descarga falla y hay copia: mostrar la copia con el aviso exacto "Mostrando datos guardados, pueden estar desactualizados" (textos en [contracts/textos-interfaz.md](contracts/textos-interfaz.md)), **bloquear** el envío del pedido y mantener visible el botón para escribir directo al WhatsApp del negocio, con un botón "Reintentar"). El fallo de la revisión previa al envío (T033) debe llevar a este mismo estado.
- [ ] T041 [US3] Reforzar en `js/hoja.js` la tolerancia a datos incompletos: si falta una pestaña, un encabezado no existe o el CSV viene mal formado, el catálogo muestra lo que sí se pudo leer o pasa al estado "Copia guardada" o "Sin datos", sin romper la página; las filas inválidas se omiten con un aviso en la consola.
- [ ] T042 [US3] 👤 **[MANUAL]** Medir la frescura (escenario 1 de la Historia 3): cambiar un precio en la hoja, recargar el catálogo cada minuto y anotar en la sección "Historia 3" de [checklists/verificacion.md](checklists/verificacion.md) cuánto tarda en verse el precio nuevo (debe ser un máximo de 5 minutos). **Si supera 5 minutos**, se ajusta la spec (escenario 1 de la Historia 3 y el supuesto correspondiente) al valor medido y se informa ese valor en `docs/guia-del-dueno.md` (T038); no se agrega ningún servidor.
- [ ] T043 [US3] 👤 **[MANUAL]** Cronometrar a una persona que no programa (o a ti, siguiendo solo `docs/guia-del-dueno.md`) cambiando un precio en la hoja: debe tardar menos de 1 minuto (CE-004). Anotar el tiempo y las partes de la guía que confundan en la sección "Historia 3" de [checklists/verificacion.md](checklists/verificacion.md).
- [ ] T044 [US3] 👤 **[MANUAL]** **Verificación de la Historia 3**: ejecutar los pasos 1 a 8 de la tabla "Historia 3" de [quickstart.md](quickstart.md), incluido el paso 7 (catálogo sin conexión con copia guardada, aviso, envío bloqueado y botón de WhatsApp visible, escenario 4) y el paso 8 (cargar el catálogo, cortar la conexión, tocar "Enviar pedido" y comprobar que el envío queda bloqueado con el aviso y el botón de WhatsApp visible, RF-013). Anotar el resultado, los problemas encontrados y la revisión breve de los principios I–VII en la sección "Historia 3" de [checklists/verificacion.md](checklists/verificacion.md).

**Punto de control**: las historias 1, 2 y 3 funcionan y están verificadas.

---

## Fase 7: Historia de usuario 4 – Métodos de pago (Prioridad: P2)

**Meta**: el cliente solo ve los métodos de pago válidos del negocio y, al elegir Yape o Plin, ve el número, el titular y la indicación de enviar la captura.

**Prueba independiente**: elegir Yape al armar el pedido y ver los datos para pagar ([spec.md](spec.md), Historia 4).

### Implementación de la Historia 4

- [ ] T045 [US4] Implementar en `js/formulario.js` la lista de métodos de pago válidos según [data-model.md](data-model.md): "`Yape` / `Plin` están marcados **y** tienen número y titular → válidos. Si falta alguno de los dos datos, el método no se muestra"; "`Efectivo` / `Transferencia` marcados → válidos (sin datos adicionales)"; "Si no queda ningún método válido → solo se ofrece 'A coordinar por WhatsApp'".
- [ ] T046 [US4] Mostrar en la interfaz (`index.html`, `js/app.js`, `css/estilos.css`) los datos de pago al elegir Yape o Plin: número, nombre del titular y la indicación de enviar la captura del pago por WhatsApp (textos en [contracts/textos-interfaz.md](contracts/textos-interfaz.md)).
- [ ] T047 [US4] Ajustar `js/mensaje.js` según [contracts/mensaje-whatsapp.md](contracts/mensaje-whatsapp.md): línea `*Pago:*` con el método elegido; para Yape o Plin agregar `Enviaré la captura del pago por este chat.`; para "A coordinar por WhatsApp" escribir `A coordinar por WhatsApp`.
- [ ] T048 [US4] 👤 **[MANUAL]** **Verificación de la Historia 4**: ejecutar los pasos 1 a 4 de la tabla "Historia 4" de [quickstart.md](quickstart.md) (solo métodos aceptados, datos de Yape/Plin, Yape sin titular desaparece, sin métodos válidos solo "A coordinar por WhatsApp") y comprobar la línea de pago en el mensaje de WhatsApp. Anotar el resultado, los problemas encontrados y la revisión breve de los principios I–VII en la sección "Historia 4" de [checklists/verificacion.md](checklists/verificacion.md).

**Punto de control**: las cuatro historias funcionan y están verificadas.

---

## Fase 8: Pulido y publicación

**Propósito**: mejoras que afectan a varias historias y publicación gratuita.

- [ ] T049 [P] Auditar el diseño a 360 px en `css/estilos.css` e `index.html`: sin desplazamiento horizontal a 360 px en ninguna pantalla, todo elemento que se toca con el dedo de al menos 44×44 px, textos legibles y todos los textos en español de Perú, con la redacción de [contracts/textos-interfaz.md](contracts/textos-interfaz.md) y precios en soles (CE-002, principios II y VI). Anotar el resultado en la sección "Criterios de éxito" de [checklists/verificacion.md](checklists/verificacion.md).
- [ ] T050 [P] Revisar privacidad y costo en todo el código: ningún dato del cliente sale del celular salvo el mensaje de WhatsApp; no hay analíticas, rastreadores, servidores propios ni servicios con cobro; las únicas solicitudes externas son la hoja publicada, las fotos y `wa.me` (CE-005, principios I y V). Anotar el resultado en la sección "Criterios de éxito" de [checklists/verificacion.md](checklists/verificacion.md).
- [ ] T051 Revisar el peso y la velocidad: HTML + CSS + JS de hasta 60 KB sin comprimir, fotos con carga diferida y ancho reducido, sin librerías externas (CE-003, principios II y III). Anotar el resultado en la sección "Criterios de éxito" de [checklists/verificacion.md](checklists/verificacion.md).
- [ ] T052 Eliminar la carpeta temporal `poc/` (carpeta descartable anotada como temporal en [plan.md](plan.md)) una vez registrado su resultado (T007).
- [ ] T053 [P] Escribir `README.md` en español de Perú: qué es PedidoFácil, cómo probarlo en local con un servidor estático, cómo configurar `config.js`, enlace a `docs/guia-del-dueno.md` y cómo publicarlo.
- [ ] T054 👤 **[MANUAL]** Medir los criterios de éxito de [quickstart.md](quickstart.md): CE-001 (cliente nuevo arma y envía un pedido de 3 productos en menos de 2 minutos, cronometrado) y CE-003 (productos visibles en menos de 3 segundos con limitación de red "4G" y caché vacía). Anotar los resultados, junto con los de CE-002, CE-004, CE-005 y CE-006, en la sección "Criterios de éxito" de [checklists/verificacion.md](checklists/verificacion.md).
- [ ] T055 👤 **[MANUAL]** Publicar en GitHub Pages: revisar que el historial del repositorio no tenga datos personales, hacer público el repositorio solo en este momento, activar GitHub Pages, comprobar que el sitio carga con todas las rutas relativas bajo `https://<usuario>.github.io/<repositorio>/` y repetir las pruebas clave (catálogo, fotos, envío a WhatsApp) en celulares reales por `https`.
- [ ] T056 👤 **[MANUAL]** Ejecutar el [quickstart.md](quickstart.md) completo una última vez sobre el sitio publicado y anotar el resultado final en la sección "Criterios de éxito (T054) y verificación final (T056)" de [checklists/verificacion.md](checklists/verificacion.md).

---

## Dependencias y orden de ejecución

### Dependencias entre fases

- **Prueba de concepto (Fase 1)**: sin dependencias; es lo primero. **Bloquea todo** si falla.
- **Preparación (Fase 2)**: depende de que la prueba de concepto sea exitosa (T007).
- **Base común (Fase 3)**: depende de la Preparación; bloquea todas las historias.
- **Historias (Fases 4 a 7)**: dependen de la Base común y se entregan **en orden de prioridad, una por una** (principio VII): US1 → US2 → US3 → US4.
- **Pulido y publicación (Fase 8)**: depende de las historias terminadas.

### Dependencias entre historias

- **US1 (P1)**: solo depende de la Base común.
- **US2 (P1)**: usa el catálogo de US1 (productos, `js/catalogo.js`, estados de `js/app.js`).
- **US3 (P1)**: completa los estados de `js/app.js` y la copia del catálogo; el fallo de la revisión previa al envío de US2 (T033) termina en el estado "Copia guardada" de T040.
- **US4 (P2)**: reemplaza el selector básico de pago de US2 (T029) por la lista de métodos válidos.

### Dentro de cada historia

- Interpretación de datos (`js/hoja.js`) → lógica (`js/pedido.js`, `js/formulario.js`, `js/mensaje.js`) → interfaz (`js/catalogo.js`, `js/app.js`, `index.html`) → estilos → verificación manual.
- La verificación manual cierra cada historia; no se avanza hasta cumplirla.

### Oportunidades de trabajo en paralelo

- Fase 2: T009 y T010.
- Fase 3: T012, T014, T015, T016 y T017 (archivos distintos).
- Fase 5: T029 y T030 (`js/formulario.js` y `js/mensaje.js`).
- Fase 6: T038 (guía) en paralelo con T039–T041.
- Fase 8: T049, T050 y T053.
- Las tareas 👤 **[MANUAL]** de la Fase 1 (T001–T003) pueden hacerse mientras Claude Code redacta T004.

---

## Ejemplo de paralelismo: Base común

```text
# En paralelo (archivos distintos):
Tarea: "Dinero en céntimos y precio a céntimos en js/formato.js"        (T012)
Tarea: "localStorage con respaldo en memoria en js/almacenamiento.js"   (T014)
Tarea: "Lector de CSV y descarga en paralelo en js/hoja.js"             (T015)
Tarea: "Estructura base de index.html"                                  (T016)
Tarea: "Estilos base mobile-first en css/estilos.css"                   (T017)
```

---

## Estrategia de implementación

### Primero la prueba de concepto

1. Hacer T001–T003 (hoja y fotos) y T004 (página de prueba).
2. Probar en computadora y en celulares reales (T005–T006) y registrar el resultado (T007).
3. **Detenerse y validar**: si algo falla, decidir contigo la alternativa antes de escribir el producto.

### Primero el producto mínimo (historia 1, luego historia 2)

1. Completar Preparación y Base común.
2. Completar la **Historia 1** y verificarla en celular (T025). Ya reemplaza el envío de fotos sueltas.
3. Completar la **Historia 2** y verificarla (T036–T037). Con US1 + US2 el cliente ya puede pedir de punta a punta.

### Entrega incremental

1. Preparación + Base común → base lista.
2. Historia 1 → verificar → (demostrable).
3. Historia 2 → verificar → (producto mínimo útil).
4. Historia 3 → verificar → el dueño se vuelve independiente.
5. Historia 4 → verificar → métodos de pago completos.
6. Pulido y publicación.

---

## Notas

- [P] = archivos distintos, sin dependencias.
- La etiqueta [US#] liga cada tarea con su historia para dar seguimiento.
- 👤 **[MANUAL]** = lo haces tú; son T001–T003, T005–T006, T011, T025, T036–T037, T042–T044, T048 y T054–T056.
- Cada historia debe poder completarse y verificarse por sí sola, en vista de celular de 360 px.
- Hacer commit en español después de cada tarea o grupo lógico de tareas.
- Detenerse en cada punto de control para validar la historia antes de seguir.
- Evitar: tareas vagas, conflictos en el mismo archivo y dependencias entre historias que rompan su independencia.
