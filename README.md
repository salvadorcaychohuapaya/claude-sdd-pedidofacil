# PedidoFácil

Catálogo digital para negocios pequeños de Perú. El cliente ve los productos con sus precios en soles, arma su pedido en el celular y lo envía como mensaje de WhatsApp al negocio.

- **Sin costo:** es una página estática (HTML, CSS y JavaScript, sin librerías ni compilación) que se publica gratis en GitHub Pages.
- **El dueño no programa:** los productos, precios, fotos, disponibilidad y métodos de pago se editan en una hoja de Google Sheets. Ver la [guía del dueño](docs/guia-del-dueno.md).
- **Privacidad:** el pedido y los datos del cliente solo viven en su celular y en el mensaje de WhatsApp. No hay servidor propio, analíticas ni rastreadores.
- **Primero el celular:** está pensado para pantallas desde 360 px de ancho.
- **Sin conexión:** si no se puede leer la hoja, muestra la última copia guardada (sin permitir enviar) y un botón para escribir por WhatsApp.

## Cómo probarlo en local

La página usa módulos de JavaScript, así que **no se abre con doble clic** sobre `index.html`: hay que servirla con un servidor estático. Desde la carpeta del repositorio, con la primera opción que tengas:

- Python: `python -m http.server 5500 --bind 127.0.0.1` (en algunas computadoras el comando es `py`).
- Node.js: `npx serve -l 5500`.
- Visual Studio Code: extensión "Live Server" → "Go Live".

Luego abre `http://localhost:5500`. Para probar en un celular de la misma red Wi-Fi, inicia el servidor con `--bind 0.0.0.0` y abre `http://<IP de tu computadora>:5500`. Más detalles y los escenarios de prueba están en [quickstart.md](specs/001-catalogo-pedidos-whatsapp/quickstart.md).

## Cómo configurar `config.js`

`config.js` está en la raíz y lo edita quien instala el catálogo (no el dueño). Tiene tres datos:

```js
export const CONFIG = {
  whatsapp: "51987654321",
  hojaProductosCsv: "https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv",
  hojaNegocioCsv: "https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv",
};
```

- `whatsapp`: número del negocio, solo dígitos y con `51` al inicio (sin `+`, espacios ni guiones).
- `hojaProductosCsv` y `hojaNegocioCsv`: enlaces CSV de las pestañas "Productos" y "Negocio". En Google Sheets: **Archivo → Compartir → Publicar en la web**, elige la pestaña, formato **CSV** y copia el enlace.

**Todo lo que hay en `config.js` es público** en el sitio publicado: no pongas claves ni datos privados. Las columnas de la hoja están en [contracts/hoja-de-calculo.md](specs/001-catalogo-pedidos-whatsapp/contracts/hoja-de-calculo.md).

## Fotos

Las fotos se suben a Google Drive, se comparten con "Cualquier persona con el enlace" y se pega en la hoja el enlace de **cada foto** (no el de la carpeta). Los detalles están en la [guía del dueño](docs/guia-del-dueno.md).

## Cómo publicarlo (GitHub Pages)

1. Revisa que el historial del repositorio no tenga datos personales ni claves.
2. Haz público el repositorio en GitHub (solo cuando estés listo para publicar).
3. En **Settings → Pages**, elige la rama principal y la carpeta raíz (`/`) como origen.
4. Espera un par de minutos y abre `https://<usuario>.github.io/<repositorio>/`.
5. Prueba en celulares reales, por `https`: el catálogo, las fotos y el envío a WhatsApp.

Todas las rutas del sitio son relativas, por eso funciona bajo `https://<usuario>.github.io/<repositorio>/` y en cualquier otro hosting estático.

## Más información

- [Guía del dueño](docs/guia-del-dueno.md): cómo actualizar el catálogo desde la hoja.
- [Especificación y plan](specs/001-catalogo-pedidos-whatsapp/): `spec.md`, `plan.md`, `tasks.md` y los contratos.
- [Registro de verificación](specs/001-catalogo-pedidos-whatsapp/checklists/verificacion.md).
