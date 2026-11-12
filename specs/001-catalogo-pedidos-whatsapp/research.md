# Investigación (Fase 0): Catálogo digital con pedidos por WhatsApp

**Fecha**: 2026-11-06 | **Plan**: [plan.md](plan.md)

Las decisiones técnicas de partida están en `docs/decisiones-tecnicas.md` y no se reabren. Este documento resuelve lo que quedaba abierto y deja a la vista los riesgos.

> **Nivel de confianza**: la búsqueda en la web solo encontró guías de la comunidad, no documentación oficial de Google. Todo lo que dependa de URLs de Google que no están documentadas como estables se marca como **por verificar** y se comprueba en la primera tarea con la hoja real del negocio.

## 1. Cómo sube fotos el dueño, gratis, y obtiene un enlace que funcione

**Requisito**: el dueño no programa (principio IV), el costo es S/ 0 (principio I) y la foto debe cargarse en una etiqueta de imagen de la página.

| Opción | Cómo funciona | Ventajas | Desventajas |
|--------|---------------|----------|-------------|
| **A. Google Drive del dueño** | Sube la foto a una carpeta de Drive, la comparte como "Cualquier persona con el enlace" y pega ese enlace en la columna `foto` de la hoja. | Ya tiene cuenta de Google (supuesto de la spec); sin registrarse en nada nuevo; gratis. | Los formatos de URL de imagen de Drive no son una API documentada y han cambiado antes. |
| **B. Carpeta `img/` del repositorio** | Las fotos se suben al repositorio de GitHub. | URL estable y rápida. | Obliga al dueño a usar Git/GitHub: incumple el principio IV. |
| **C. Servicio gratuito de alojamiento de imágenes** (por ejemplo ImgBB, Cloudinary) | El dueño crea una cuenta, sube la foto y copia el enlace directo. | Pensado para enlazar imágenes. | Cuenta y condiciones nuevas; los planes gratuitos pueden cambiar o limitar; más pasos para el dueño. |

**Decisión**: **Opción A (Google Drive)**, con una función única `urlFoto()` en `js/formato.js` que:

1. Acepta el enlace que el dueño copia de Drive (`https://drive.google.com/file/d/ID/view?...` o `...open?id=ID`), extrae el `ID` y construye `https://lh3.googleusercontent.com/d/ID=w400` (ancho reducido para conexiones lentas).
2. Acepta también cualquier otro enlace directo `https://...` tal cual, de modo que el dueño pueda usar la opción C si lo prefiere.
3. Si la celda está vacía o la imagen falla al cargar, muestra `img/generica.svg` (caso límite de la spec).
4. Rechaza como inválido un enlace de carpeta de Drive (`drive.google.com/drive/folders/...`): no contiene el ID de un archivo. Usa la imagen genérica y deja un aviso en la consola.
5. **Toda imagen que venga de Drive (fotos y logo) lleva `referrerpolicy="no-referrer"`** (comprobado, ver abajo).

**Por qué**: es la opción con menos pasos para el dueño, y como toda la lógica está en una sola función, si Google cambia el formato basta cambiar esa función (o pasar a la opción C) sin tocar el resto.

**Comprobado en la prueba de concepto (2026-11-11, T005–T007; detalle en [../../docs/resultado-poc.md](../../docs/resultado-poc.md))**:

- Sin `referrerpolicy`, `lh3.googleusercontent.com/d/ID=w400` y `drive.google.com/thumbnail?id=ID&sz=w400` responden **429 Too Many Requests** (`text/html`) cuando la imagen está dentro de la página (Brave y Chrome en Windows), aunque la misma foto abierta en una pestaña aparte sí carga.
- Con `referrerpolicy="no-referrer"` en la etiqueta `<img>`, los dos formatos cargan (HTTP 200, `image/jpeg`, 400×267) en Brave, Chrome y Safari de iPhone.
- **Formato elegido**: `https://lh3.googleusercontent.com/d/ID=w400` (una sola solicitud). `drive.google.com/thumbnail` queda de alternativa: redirige con 302 al mismo `lh3`.
- Un enlace de carpeta de Drive no sirve (no trae el ID de un archivo); `urlFoto()` lo rechaza y la guía del dueño explica que se copia el enlace de cada foto.
- **Android**: en un Redmi 15C con Chrome las fotos también cargan con `referrerpolicy="no-referrer"`.
- No se encontró información sobre límites de uso; sigue siendo un riesgo, con la imagen genérica como respaldo.

Fuentes consultadas (comunidad, no oficiales): [Google Apps Script Community](https://groups.google.com/g/google-apps-script-community/c/84nBhhce8LY), [DEV Community](https://dev.to/temmietope/embedding-a-google-drive-image-in-html-3mm9), [Labnol](https://labnol.org/embed/google/drive), [MIT App Inventor Community](https://community.appinventor.mit.edu/t/url-local-image-for-fancygallery/106840?page=2).

**Consejo para el dueño** (va en la guía): subir fotos cuadradas y livianas (menos de 1 MB), y no moverlas ni borrarlas de Drive.

## 2. Leer la hoja publicada como CSV desde el navegador

**Decisión (de partida)**: pestañas "Productos" y "Negocio" publicadas en la web como CSV, descargadas con `fetch` en paralelo (una sola espera de red).

**Riesgo principal – CORS**: las búsquedas encontraron mensajes de la comunidad que dicen que Google cambió el comportamiento de CORS para las hojas publicadas y que, en algunos casos, el navegador ya no puede leer el CSV directamente. No es información oficial ni confirmada.

**Resultado de la prueba de concepto (2026-11-11, T005–T007)**: el riesgo **no se materializó**. Desde `localhost`, en Brave y Chrome (Windows) y en Safari de iPhone 12, los dos CSV publicados se leen con `fetch`: HTTP 200, `text/csv; charset=utf-8`, y la respuesta trae `Access-Control-Allow-Origin: *`. Google redirige con 307 desde `pub?gid=...` hacia `doc-*-sheets.googleusercontent.com` y el `fetch` lo sigue sin problema. Tildes, ñ, emoji y valores con coma entre comillas llegan correctos. También en un Redmi 15C con Chrome (Android) los dos CSV se leen. Pendiente: la prueba por `https` en el sitio publicado (T055). **Decisión**: se mantiene la decisión de partida; no se activa ninguna de las alternativas (a) ni (b) del plan siguiente.

**Plan**:

1. **Primera tarea de implementación**: con una hoja real publicada, probar `fetch` desde una página servida por `https://` y desde `localhost`.
2. Si funciona: se sigue con la decisión de partida.
3. Si no funciona: evaluar, en este orden, (a) la URL de exportación CSV de la pestaña (`.../gviz/tq?tqx=out:csv&sheet=NOMBRE`), con la hoja compartida como "Cualquier persona con el enlace puede ver", y (b) cargar los datos con una etiqueta `<script>` en lugar de `fetch`. Ambas siguen sin servidor y a costo cero. Cualquier cambio se anota aquí y se confirma con el usuario antes de seguir.

**Frescura (≤ 10 minutos de forma estable, Historia 3)**: Google actualiza el CSV publicado con un retraso propio, que **no está documentado con una cifra oficial**. Para no sumar retrasos, el `fetch` usa `cache: "no-cache"`. Medición real del 2026-11-11 (T042): el valor nuevo aparece por primera vez en segundos, pero durante la transición alterna con el anterior porque Google sirve el CSV desde varias copias; tiempo hasta verse de forma estable: unos 5 min 30 s (arroz-leche 6.00 → 6.80) y unos 2 min (6.80 → 5.80); un cambio de `metodos_pago` tardó más de 5 minutos. Como superó los 5 minutos iniciales, la especificación se ajustó a un máximo de 10 minutos y se informa en la guía del dueño; no se agrega ningún servidor. Los resultados se registran en [checklists/verificacion.md](checklists/verificacion.md).

## 3. Lectura del CSV sin librerías

**Decisión**: lector propio en `js/hoja.js` que soporta comillas dobles, comas y saltos de línea dentro de una celda, comillas escapadas (`""`), BOM al inicio y saltos de línea `\r\n`. Se lee como UTF-8 (`response.text()`), por lo que tildes, ñ y emojis se conservan.

**Alternativas descartadas**: una librería de CSV (rompe el principio III) y `split(",")` (falla con descripciones que contienen comas).

## 4. Dinero sin errores de redondeo (CE-006)

**Decisión**: el precio se interpreta como texto y se convierte a **céntimos enteros** sin usar decimales flotantes: se aceptan `12`, `12.5`, `12.50` y `12,50`; se rechazan vacíos, cero, negativos y textos no numéricos (la fila no se muestra). Subtotales y total se calculan solo con enteros. Para mostrar: `S/ ` + parte entera + `.` + dos dígitos de los céntimos, calculados con división y resto enteros.

## 5. Enlace de WhatsApp

**Decisión**: `https://wa.me/<51XXXXXXXXX>?text=<mensaje>`, con el mensaje pasado por `encodeURIComponent` (conserva tildes, ñ, emojis y saltos de línea). El número se guarda solo con dígitos y empieza en `51`.

**Riesgo**: como el envío ocurre después de volver a pedir la hoja (revisión previa, escenario 8 de la Historia 2), algunos navegadores móviles pueden bloquear abrir un enlace fuera del toque directo del usuario. **Mitigación**: se navega con `location.href` (no con una ventana nueva) y, si la revisión quitó productos o cambió precios, el pedido no se abre solo: se muestra el aviso y el cliente vuelve a tocar "Enviar pedido". Se prueba en Android e iOS reales.

**Límite de longitud**: un pedido normal (menos de 30 líneas) queda muy por debajo de los límites prácticos de longitud de URL. Si se superan 20 productos distintos se muestra el mismo mensaje sin recortes; se vigila en las pruebas.

## 6. Qué se guarda en el celular

| Clave | Contenido | Para qué |
|-------|-----------|----------|
| `pedidofacil:pedido:v1` | Productos (id y cantidad), datos del formulario y marca "ya se tocó Enviar". | Conservar el pedido al cerrar la página (caso límite) y mostrar destacado "Empezar un pedido nuevo". |
| `pedidofacil:catalogo:v1` | Última copia válida de productos y datos del negocio, con fecha. | Modo sin conexión con aviso (RF-013) y carga inmediata mientras se actualiza. |

El pedido guarda **solo ids y cantidades**, no precios: así siempre se usan los precios vigentes al enviar. Si `localStorage` no está disponible (ventana privada, bloqueado), la aplicación sigue funcionando en memoria y muestra un aviso discreto de que el pedido no se conservará.

## 7. Publicación en GitHub Pages

**Decisión (de partida)**: GitHub Pages gratuito. El plan gratuito de GitHub exige repositorio público para Pages, y el repositorio pasará a público **solo al momento de publicar**.

**Implicaciones**:

- Todo lo que está en el repositorio será público: `config.js` (número de WhatsApp y enlaces CSV) ya es visible en el sitio, por lo que no hay secretos en el código. Antes de hacerlo público, revisar el historial para confirmar que no hay datos personales.
- Rutas relativas en todo el HTML, CSS y JS (el sitio vive bajo `/nombre-del-repositorio/`).
- No usar funciones exclusivas de GitHub (sin Actions para generar contenido, sin Jekyll): así el sitio se puede mudar a otro hosting estático gratuito copiando los archivos.
- Mudanza o cambio de repositorio implican una URL nueva que hay que compartir de nuevo con los clientes.

## 8. Lo que el plan asume y la spec no decía

Se resolvieron con valores razonables, que quedan documentados para revisarlos con el usuario:

- **Categorías**: no hay pestaña propia; se derivan de la columna `categoria` de los productos. Orden: "Todos" primero, luego por el menor `orden` de sus productos (desempate por primera aparición en la hoja) y "Otros" al final; detalle en [data-model.md](data-model.md). Esto respeta las dos pestañas decididas.
- **Disponibilidad** (definido por el usuario): la columna `disponible` se normaliza (sin importar mayúsculas, tildes ni espacios). `no` y `agotado` significan **no disponible**; vacío, `sí` y cualquier otro valor significan disponible.
- **Transferencia y efectivo**: no muestran datos extra (la spec solo exige datos para Yape y Plin); los detalles se coordinan por WhatsApp.
- **Identificador de producto**: si falta `id`, se usa el nombre normalizado; si hay `id` repetido, la segunda fila se descarta con un aviso en la consola.
