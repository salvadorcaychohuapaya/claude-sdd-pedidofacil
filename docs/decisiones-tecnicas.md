# Decisiones técnicas de partida

- HTML, CSS y JavaScript puro, sin frameworks, librerías externas ni pasos de compilación.
- Datos desde Google Sheets con dos pestañas, "Productos" y "Negocio", publicadas en la web como CSV.
- El pedido y la última versión del catálogo se guardan en localStorage del navegador.
- El pedido se envía con un enlace https://wa.me/ con el mensaje codificado.
- Un archivo config.js con el número de WhatsApp (con código 51) y los enlaces CSV de la hoja.
- Los precios se calculan en céntimos (enteros) para evitar errores de redondeo.
- Pruebas manuales con los escenarios de aceptación de la spec, en vista de celular de 360 px.
- Publicación gratuita en GitHub Pages. El repositorio es privado y se hará público solo al momento de publicar; el sitio no debe depender de funciones exclusivas de GitHub, para poder mudarlo a otro hosting estático gratuito si hace falta.

## Para investigar

- Cómo puede el dueño subir fotos de productos gratis y obtener un enlace que funcione en la página. Proponer opciones en research.md.