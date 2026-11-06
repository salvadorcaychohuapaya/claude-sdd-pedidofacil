# Contrato: hoja de cálculo del dueño

**Plan**: [../plan.md](../plan.md) | **Modelo de datos**: [../data-model.md](../data-model.md)

La hoja de Google Sheets tiene **dos pestañas** con estos nombres exactos, y **cada una está publicada en la web como CSV** (Archivo → Compartir → Publicar en la web → formato CSV). Los enlaces CSV se pegan en `config.js` (ver [config.md](config.md)).

Todo el texto se lee como UTF-8 (tildes, ñ y emojis permitidos). La primera fila de cada pestaña son los encabezados, escritos tal cual se indican (sin importar mayúsculas ni tildes).

## Pestaña "Productos"

Una fila por producto. Cada presentación (1/4 pollo, 1/2 pollo; vaso chico, vaso grande) es **una fila distinta** con su propio precio.

| Columna | Obligatoria | Ejemplo | Notas |
|---------|:-----------:|---------|-------|
| `id` | No | `pollo-1-4` | Identificador estable. No cambiarlo si el producto ya existe. |
| `nombre` | **Sí** | `1/4 de pollo a la brasa` | Vacío → la fila no se muestra. |
| `descripcion` | No | `Con papas y ensalada` | Corta: se muestra en un máximo de 2 líneas y, si es más larga, se corta con "…". |
| `precio` | **Sí** | `18.50` o `18,50` | En soles, sin el símbolo S/. Vacío, cero o texto → la fila no se muestra. |
| `categoria` | No | `Pollos` | Sin categoría → "Otros". |
| `foto` | No | enlace de Drive o `https://...` | Vacío o roto → imagen genérica. |
| `disponible` | No | `si` / `no` | `no` o `agotado` → aparece agotado y no se puede agregar. No importan mayúsculas, tildes ni espacios (`NO`, ` Agotado `, `sí`). Vacío, `sí` u otro valor → disponible. |
| `orden` | No | `10` | Número menor aparece antes. También define el orden de las categorías (la categoría con el menor `orden` entre sus productos va primero; ver [../data-model.md](../data-model.md)). |

## Pestaña "Negocio"

Dos columnas: `clave` y `valor`. Una fila por dato.

| `clave` | Obligatoria | Ejemplo de `valor` | Notas |
|---------|:-----------:|--------------------|-------|
| `nombre` | Recomendada | `Pollería El Sabor` | Si falta, se muestra "Catálogo". |
| `logo` | No | enlace de Drive o `https://...` | Si falta, solo se ve el nombre. |
| `metodos_pago` | No | `Yape, Plin, Efectivo` | Separados por comas. Valores: `Yape`, `Plin`, `Efectivo`, `Transferencia`. |
| `yape_numero` | Si usa Yape | `987654321` | |
| `yape_titular` | Si usa Yape | `María Pérez` | |
| `plin_numero` | Si usa Plin | `987654321` | |
| `plin_titular` | Si usa Plin | `María Pérez` | |

El **número de WhatsApp del negocio no va en la hoja**: está en `config.js` (decisión registrada en la sección "Aclaraciones" de la spec).

## Reglas de lectura (comportamiento esperado)

| Situación | Resultado |
|-----------|-----------|
| Fila de producto con `nombre` o `precio` inválido | Esa fila se omite; el resto funciona. |
| `id` repetido | Se conserva la primera fila; las demás se omiten. |
| Yape o Plin marcado pero sin número o sin titular | Ese método no se muestra. |
| Ningún método de pago válido | Solo se ofrece "A coordinar por WhatsApp". |
| Falta una pestaña o no se puede descargar | Estado "Copia guardada" o "Sin datos" (ver modelo de datos). |
| Encabezados con otro orden de columnas | Se leen por nombre de columna, no por posición. |
| Columna desconocida | Se ignora. |

## Frescura

El dueño edita la hoja y el cambio debe verse en el catálogo en **un máximo de 5 minutos** (Historia 3). El retraso depende de la publicación de Google; ver [research.md](../research.md), sección 2. Si la medición real supera 5 minutos, se ajusta la especificación al valor medido y se informa en la guía del dueño (sin agregar servidor).
