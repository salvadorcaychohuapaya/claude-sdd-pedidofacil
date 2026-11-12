# PedidoFácil

Catálogo digital para negocios pequeños de Perú. El cliente ve los productos con sus precios en soles, arma su pedido en el celular y lo envía como mensaje de WhatsApp al negocio.

- **Sin costo:** es una página estática (HTML, CSS y JavaScript, sin librerías ni compilación) que se publica gratis en GitHub Pages.
- **El dueño no programa:** los productos, precios, fotos, disponibilidad y métodos de pago se editan en una hoja de Google Sheets. Ver la [guía del dueño](docs/guia-del-dueno.md).
- **Privacidad:** el pedido y los datos del cliente solo viven en su celular y en el mensaje de WhatsApp. No hay servidor propio, analíticas ni rastreadores.
- **Primero el celular:** está pensado para pantallas desde 360 px de ancho.
- **Sin conexión:** si no se puede leer la hoja, muestra la última copia guardada (sin permitir enviar) y un botón para escribir por WhatsApp.

## Estructura

- `app/`: el código del sitio (`index.html`, `config.js`, `css/`, `js/` e `img/`). Es lo único que se publica.
- `docs/`: guía del dueño, decisiones técnicas y otros documentos.
- `specs/` y `.specify/`: especificación, plan, tareas y herramientas de Spec Kit.

## Cómo probarlo en local

La página usa módulos de JavaScript, así que **no se abre con doble clic** sobre `index.html`: hay que servirla con un servidor estático. El código del sitio está en la carpeta `app/`; sírvela desde ahí, con la primera opción que tengas (desde la raíz del repositorio):

- Python: `python -m http.server 5500 --bind 127.0.0.1 --directory app` (en algunas computadoras el comando es `py`).
- Node.js: `npx serve -l 5500 app`.
- Visual Studio Code: extensión "Live Server": clic derecho sobre `app/index.html` → "Open with Live Server" (la dirección incluye `/app/`).

Luego abre `http://localhost:5500`. Para probar en un celular de la misma red Wi-Fi, inicia el servidor con `--bind 0.0.0.0` (y `--directory app`) y abre `http://<IP de tu computadora>:5500`. Más detalles y los escenarios de prueba están en [quickstart.md](specs/001-catalogo-pedidos-whatsapp/quickstart.md).

## Cómo configurar `app/config.js`

`app/config.js` lo edita quien instala el catálogo (no el dueño). Tiene tres datos:

```js
export const CONFIG = {
  whatsapp: "51987654321",
  hojaProductosCsv: "https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv",
  hojaNegocioCsv: "https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv",
};
```

- `whatsapp`: número del negocio, solo dígitos y con `51` al inicio (sin `+`, espacios ni guiones).
- `hojaProductosCsv` y `hojaNegocioCsv`: enlaces CSV de las pestañas "Productos" y "Negocio". En Google Sheets: **Archivo → Compartir → Publicar en la web**, elige la pestaña, formato **CSV** y copia el enlace.

**Todo lo que hay en `app/config.js` es público** en el sitio publicado: no pongas claves ni datos privados. Las columnas de la hoja están en [contracts/hoja-de-calculo.md](specs/001-catalogo-pedidos-whatsapp/contracts/hoja-de-calculo.md).

## Fotos

Las fotos se suben a Google Drive, se comparten con "Cualquier persona con el enlace" y se pega en la hoja el enlace de **cada foto** (no el de la carpeta). Los detalles están en la [guía del dueño](docs/guia-del-dueno.md).

## Cómo publicarlo (GitHub Pages)

El sitio se publica con **GitHub Actions** (`.github/workflows/pages.yml`), y solo se sube la carpeta `app/`.

1. Revisa que el historial del repositorio no tenga datos personales ni claves.
2. Haz público el repositorio en GitHub (solo cuando estés listo para publicar).
3. En **Settings → Pages**, en **Build and deployment → Source**, elige **GitHub Actions**.
4. Cada `push` a `main` publica el sitio; también puedes ejecutarlo a mano en la pestaña **Actions** ("Run workflow").
5. Espera un par de minutos y abre `https://<usuario>.github.io/<repositorio>/`.
6. Prueba en celulares reales, por `https`: el catálogo, las fotos y el envío a WhatsApp.

Todas las rutas del sitio son relativas, por eso funciona bajo `https://<usuario>.github.io/<repositorio>/` y en cualquier otro hosting estático.

## Más información

- [Guía del dueño](docs/guia-del-dueno.md): cómo actualizar el catálogo desde la hoja.
- [Especificación y plan](specs/001-catalogo-pedidos-whatsapp/): `spec.md`, `plan.md`, `tasks.md` y los contratos.
- [Registro de verificación](specs/001-catalogo-pedidos-whatsapp/checklists/verificacion.md).
