# Contrato: archivo `config.js`

**Plan**: [../plan.md](../plan.md)

`config.js` está en la raíz del sitio y lo edita **quien instala el catálogo**, no el dueño en el día a día. Contiene los únicos datos que no vienen de la hoja.

```text
// config.js  (módulo de JavaScript)
export const CONFIG = {
  whatsapp: "51987654321",     // solo dígitos, empieza con 51
  hojaProductosCsv: "https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv",
  hojaNegocioCsv:   "https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv",
};
```

| Campo | Regla |
|-------|-------|
| `whatsapp` | Solo dígitos, con código de país `51` (11 dígitos en total para un celular peruano). Sin `+`, espacios ni guiones. Se usa en el enlace `wa.me` y en el botón de respaldo. |
| `hojaProductosCsv` | Enlace CSV publicado de la pestaña "Productos". |
| `hojaNegocioCsv` | Enlace CSV publicado de la pestaña "Negocio". |

**Por qué el número va aquí**: el botón de respaldo (hoja inaccesible, modo sin conexión) lo necesita aunque la hoja falle, y un error al escribirlo en la hoja haría perder todos los pedidos. Es una excepción al principio IV de la constitución, justificada en la sección "Aclaraciones" de la spec.

**Validación al arrancar**: si `whatsapp` no cumple la regla, la página lo muestra en la consola y deshabilita el envío (no se produce un enlace roto). Si faltan los enlaces CSV, se muestra el mensaje amable con el botón de WhatsApp.

**Sin secretos**: todo lo que contiene este archivo es público en el sitio publicado. No se guardan claves ni datos de clientes.
