# Modelo de datos (Fase 1): Catálogo digital con pedidos por WhatsApp

**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

Todo el dinero se guarda y calcula en **céntimos enteros** (`S/ 12.50` → `1250`).

## Negocio

Origen: pestaña "Negocio" de la hoja (clave/valor) + `config.js` para el número de WhatsApp.

| Campo | Origen | Tipo | Regla |
|-------|--------|------|-------|
| `nombre` | Hoja | Texto | Obligatorio; si falta, se muestra "Catálogo". |
| `logo` | Hoja | URL de imagen | Opcional; si falta o falla, solo se muestra el nombre. Se procesa con `urlFoto()`; un enlace de carpeta de Drive es inválido. La etiqueta `<img>` del logo lleva `referrerpolicy="no-referrer"`. |
| `metodosPago` | Hoja | Lista | Valores reconocidos: `Yape`, `Plin`, `Efectivo`, `Transferencia`. Ver reglas de validez abajo. |
| `yape` | Hoja | `{numero, titular}` | Solo válido si ambos tienen valor. |
| `plin` | Hoja | `{numero, titular}` | Solo válido si ambos tienen valor. |
| `whatsapp` | `config.js` | Texto de dígitos | Empieza con `51`; sin `+`, espacios ni guiones. **Nunca** se lee de la hoja. |

**Métodos de pago válidos** (RF-009):

1. `Yape` / `Plin` están marcados **y** tienen número y titular → válidos. Si falta alguno de los dos datos, el método no se muestra.
2. `Efectivo` / `Transferencia` marcados → válidos (sin datos adicionales).
3. Si no queda ningún método válido → solo se ofrece "A coordinar por WhatsApp".

## Producto

Origen: pestaña "Productos" de la hoja, una fila por producto.

| Campo | Tipo | Regla |
|-------|------|-------|
| `id` | Texto | Estable; si falta se genera desde el nombre; si se repite, se descarta la fila repetida. |
| `nombre` | Texto | **Obligatorio**; si está vacío la fila no se muestra. |
| `descripcion` | Texto | Opcional. Se muestra en un máximo de 2 líneas; si es más larga se corta con "…". Sin "ver más" en la versión 1. |
| `precioCentimos` | Entero > 0 | **Obligatorio**; texto no numérico, vacío, cero o negativo → la fila no se muestra. |
| `categoria` | Texto | Opcional; si falta, se agrupa en "Otros". |
| `foto` | URL | Opcional; si falta o falla, imagen genérica. Debe ser el enlace de **un archivo** de Drive (o un `https://` directo); un enlace de carpeta (`drive.google.com/drive/folders/...`) es inválido: imagen genérica y aviso en la consola. La etiqueta `<img>` lleva `referrerpolicy="no-referrer"`. |
| `disponible` | Booleano | Se normaliza el texto (se quitan espacios al inicio y al final, y se ignoran mayúsculas y tildes). Si el resultado es `no` o `agotado` → **no disponible** (agotado). Vacío, `si` (o `sí`) y cualquier otro valor → **disponible**. |
| `orden` | Número | Opcional; define el orden de aparición de los productos dentro de su categoría. Sin orden (o no numérico): después de los que sí tienen, en el orden de la hoja. A igual `orden`, se respeta el orden de la hoja. |

Una fila inválida **no rompe** el resto del catálogo (Historia 3, escenario 3).

## Categoría

Derivada, sin pestaña propia: lista de nombres únicos de `categoria` tomados de los productos que **sí se muestran** (las filas inválidas no cuentan). Los nombres se comparan sin importar mayúsculas, tildes ni espacios sobrantes; se muestra el escrito en la primera fila donde aparece.

**Orden en que se muestran** (de izquierda a derecha en el filtro):

1. **"Todos"** va siempre primero y es la vista inicial.
2. Después, las categorías **ordenadas por el menor `orden` entre sus productos** (de menor a mayor). Ejemplo: si "Pollos" tiene productos con orden 10 y 30, y "Bebidas" tiene 20 y 40, el orden es Pollos (10), Bebidas (20).
3. Si dos categorías tienen el mismo menor `orden`, o ninguno de sus productos tiene `orden`, se respeta el **orden de la primera aparición de la categoría en la hoja**. Las categorías con algún `orden` van antes que las que no tienen ninguno.
4. **"Otros"** (productos sin categoría) va siempre al final.

Dentro de cada categoría (y en la vista "Todos", agrupado por categoría en el mismo orden), los productos se ordenan por `orden` y, a igual `orden`, por su posición en la hoja. Los agotados conservan su lugar; no se mueven al final.

## Pedido (solo en el celular)

Guardado en `localStorage` (`pedidofacil:pedido:v1`):

```text
{
  "items":   [{ "id": "pollo-1-4", "cantidad": 2 }],
  "cliente": { "nombre": "", "modalidad": "recojo|delivery",
               "direccion": "", "referencia": "",
               "metodoPago": "", "comentario": "" },
  "enviado": false
}
```

| Campo | Regla |
|-------|-------|
| `items[].cantidad` | Entero entre 1 y 99. Bajar de 1 quita el producto. |
| `items[].id` | Debe existir y estar disponible en el catálogo vigente; si no, se quita con aviso. |
| `cliente.nombre` | Obligatorio. |
| `cliente.modalidad` | Obligatoria: `recojo` o `delivery`. |
| `cliente.direccion`, `referencia` | Obligatorias solo si `modalidad = delivery`. |
| `cliente.metodoPago` | Obligatorio; debe ser uno de los métodos válidos mostrados. Si tras actualizar la hoja el método elegido deja de ser válido, se limpia la selección, se muestra un aviso ([contracts/textos-interfaz.md](contracts/textos-interfaz.md)) y el cliente elige otro. |
| `cliente.comentario` | Opcional. |
| `enviado` | Pasa a `true` al tocar "Enviar pedido"; hace destacar "Empezar un pedido nuevo". No vacía el pedido. |

Los **precios no se guardan** en el pedido: subtotales y total se calculan siempre con los precios vigentes (`subtotal = precioCentimos × cantidad`; `total = suma de subtotales`).

## Copia del catálogo (solo en el celular)

`pedidofacil:catalogo:v1`:

```text
{ "guardadoEn": "2026-11-06T10:15:00Z", "negocio": {...}, "productos": [...] }
```

Se reemplaza solo cuando la descarga y la lectura de la hoja terminan bien.

## Estados de la pantalla

| Estado | Condición | Qué se ve | ¿Se puede enviar? |
|--------|-----------|-----------|-------------------|
| Cargando sin copia | Primera visita, descargando | Marcadores de carga | No |
| Cargando con copia | Hay copia, descargando | Copia guardada mientras se actualiza | No hasta terminar |
| Vigente | Descarga correcta en esta visita | Catálogo actual | Sí (si el pedido es válido) |
| Copia guardada | Descarga falló, hay copia | Catálogo guardado + aviso "Mostrando datos guardados, pueden estar desactualizados" + botón de WhatsApp | **No** |
| Sin datos | Descarga falló, no hay copia | Mensaje amable + botón de WhatsApp | No |
| Sin productos | La hoja responde, pero no queda ningún producto válido | "Por ahora no hay productos disponibles" + botón de WhatsApp | No |

Transiciones: *Cargando* → *Vigente* si la descarga funciona; → *Copia guardada* o *Sin datos* si falla. Al volver la conexión, "Reintentar" lleva a *Vigente*. Justo antes de enviar se vuelve a pedir la hoja; si falla, se pasa a *Copia guardada* y se bloquea el envío.
