# Resultado de la prueba de concepto (T005–T007), 2026-11-11

Probó: Salvador.

## Lectura de la hoja (CSV)
- Computadora (Windows, Brave y Chrome): los dos CSV se leen. HTTP 200, text/csv; charset=utf-8. Google redirige con 307 desde pub?gid=... hacia doc-*-sheets.googleusercontent.com.
- Encabezado de la respuesta: Access-Control-Allow-Origin: *
- iPhone 12, Safari (por la red Wi-Fi local): los dos CSV se leen correctamente.
- Tildes, ñ, emoji y valores con coma (entre comillas) llegan correctos.
- Android: pendiente. Se probará en T036 o T055.

## Fotos de Drive
- Sin referrerpolicy: los dos formatos responden 429 Too Many Requests (Content-Type text/html), en Brave y en Chrome. Abierta en una pestaña aparte, la foto sí carga.
- Con referrerpolicy="no-referrer": los dos formatos cargan (HTTP 200, image/jpeg, 400x267) en Brave, Chrome y Safari de iPhone.
- Formato elegido: https://lh3.googleusercontent.com/d/ID=w400 (una sola solicitud). drive.google.com/thumbnail queda como alternativa: redirige con 302 al mismo lh3.
- Regla obligatoria: toda imagen que venga de Drive (fotos de productos y logo del negocio) lleva referrerpolicy="no-referrer".
- Un enlace de carpeta de Drive (drive.google.com/drive/folders/...) no sirve: no contiene el ID de un archivo. urlFoto() debe tratarlo como inválido (imagen genérica y aviso en la consola), y la guía del dueño debe explicar que se copia el enlace de cada foto, no el de la carpeta.

## Servidor local en Windows
- El puerto 8080 falló con WinError 10013 (puerto reservado por Windows). Se usó el 5500.
- En esta computadora el comando es python, no py.
- Solo computadora: python -m http.server 5500 --bind 127.0.0.1
- Para probar en el celular: python -m http.server 5500 --bind 0.0.0.0, la red de casa como Privada en Windows y permitir Python en el Firewall.

## Decisión
Se mantiene el plan técnico. No se activa ninguna alternativa de research.md.