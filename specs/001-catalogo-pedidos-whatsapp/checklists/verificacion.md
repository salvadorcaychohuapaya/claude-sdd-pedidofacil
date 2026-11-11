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
| Esc. 1: precio nuevo visible en un máximo de 5 minutos (tiempo medido: ___ min) | Pendiente | | Si supera 5 minutos: ajustar spec y guía del dueño |
| Esc. 2: producto nuevo aparece en su categoría | Pendiente | | |
| Esc. 3: fila con nombre o precio vacío no se muestra | Pendiente | | |
| Esc. 4: sin conexión, con copia guardada: aviso, envío bloqueado, botón de WhatsApp visible | Pendiente | | |
| Con el catálogo cargado, sin conexión al tocar "Enviar pedido": envío bloqueado con aviso y botón de WhatsApp visible (RF-013) | Pendiente | | |
| Foto inexistente muestra la imagen genérica | Pendiente | | |
| Sin copia y hoja inaccesible: mensaje amable con botón de WhatsApp que abre el chat con "Hola, quiero hacer un pedido." | Pendiente | | |
| CE-004: cambiar un precio con la guía en menos de 1 minuto (tiempo: ___ s) | Pendiente | | |

**Revisión de principios I–VII (Historia 3)**

| Principio | Cumple | Nota |
|---|---|---|
| I. Costo cero | Pendiente | |
| II. Primero el celular | Pendiente | |
| III. Simplicidad | Pendiente | |
| IV. El dueño no programa | Pendiente | |
| V. Privacidad | Pendiente | |
| VI. Español de Perú | Pendiente | |
| VII. Entrega por historias | Pendiente | |

---

## Historia 4 – Métodos de pago (T048)

| Escenario / paso de quickstart | Estado | Fecha / quién / dispositivo | Notas |
|---|---|---|---|
| Esc. 1: solo métodos aceptados por el negocio | Pendiente | | |
| Esc. 2: Yape/Plin muestran número, titular e indicación de captura | Pendiente | | |
| Esc. 3: Yape/Plin sin número o titular no aparecen | Pendiente | | |
| Esc. 4: sin métodos válidos solo "A coordinar por WhatsApp" | Pendiente | | |
| Línea de pago correcta en el mensaje de WhatsApp | Pendiente | | |

**Revisión de principios I–VII (Historia 4)**

| Principio | Cumple | Nota |
|---|---|---|
| I. Costo cero | Pendiente | |
| II. Primero el celular | Pendiente | |
| III. Simplicidad | Pendiente | |
| IV. El dueño no programa | Pendiente | |
| V. Privacidad | Pendiente | |
| VI. Español de Perú | Pendiente | |
| VII. Entrega por historias | Pendiente | |

---

## Criterios de éxito (T054) y verificación final (T056)

| Criterio | Medida | Resultado | Estado | Fecha / quién |
|---|---|---|---|---|
| CE-001 | Pedido de 3 productos en menos de 2 minutos (cliente nuevo) | | Pendiente | |
| CE-002 | Sin desplazamiento horizontal a 360 px y áreas táctiles de al menos 44×44 px | | Pendiente | |
| CE-003 | Productos visibles en menos de 3 s con 4G y caché vacía | | Pendiente | |
| CE-004 | Cambiar un precio sin ayuda en menos de 1 minuto | | Pendiente | |
| CE-005 | Costo mensual de operación: S/ 0 | | Pendiente | |
| CE-006 | 0 errores de suma en el mensaje de pedido | | Pendiente | |

**Verificación final sobre el sitio publicado (T056)**: _pendiente_
