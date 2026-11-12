# Guía del dueño: cómo actualizar tu catálogo

Esta guía es para ti, dueño o dueña del negocio. No necesitas saber programar: todo se hace en tu **hoja de Google Sheets**. Lo que escribas ahí es lo que verán tus clientes en el catálogo.

## Lo más importante

- Tu hoja tiene **dos pestañas**, y se llaman exactamente **Productos** y **Negocio**. No les cambies el nombre.
- La primera fila de cada pestaña tiene los títulos de las columnas (`id`, `nombre`, `precio`…). **No los cambies ni los borres.**
- Los cambios **no se ven al instante**: Google tarda unos minutos en publicarlos (normalmente menos de 5). Después de editar, espera un rato y recarga el catálogo.
- No tienes que guardar nada: Google Sheets guarda solo.

## Pestaña "Productos"

Cada **fila es un producto**. Si un producto viene en varios tamaños (por ejemplo, 1/4 de pollo y 1/2 pollo), cada tamaño va en **su propia fila**, con su propio precio.

| Columna | ¿Es obligatoria? | Qué poner | Ejemplo |
|---|:---:|---|---|
| `id` | No | Un código corto para identificar el producto. Una vez puesto, **no lo cambies**. | `pollo-1-4` |
| `nombre` | **Sí** | Cómo se llama el producto. Si está vacío, el producto no se muestra. | `1/4 de pollo a la brasa` |
| `descripcion` | No | Una frase corta. En el catálogo se ven solo 2 líneas; si es más larga, se corta con "…". | `Con papas y ensalada` |
| `precio` | **Sí** | El precio en soles, **solo el número**, sin "S/". Se puede usar punto o coma. Si está vacío, en cero o tiene letras, el producto no se muestra. | `18.50` o `18,50` |
| `categoria` | No | El grupo donde aparece el producto. Si la dejas vacía, va a "Otros". | `Pollos` |
| `foto` | No | El enlace de la foto (mira la sección "Fotos"). Si está vacío o no funciona, se ve una imagen genérica. | |
| `disponible` | No | `no` o `agotado` si ya no tienes el producto. Cualquier otra cosa (o vacío) significa que sí hay. | `no` |
| `orden` | No | Un número para decidir qué sale primero: el número menor aparece antes. También ordena las categorías. | `10` |

### Cambiar un precio

1. Abre la pestaña **Productos**.
2. Busca el producto y cambia el número de la columna `precio`.
3. Espera unos minutos y recarga el catálogo.

### Agregar un producto

1. Escribe una fila nueva debajo de la última, sin dejar filas vacías en medio.
2. Llena como mínimo `nombre` y `precio`. Si quieres, agrega también la categoría, la descripción y la foto.

### Marcar un producto como agotado

1. En la columna `disponible` del producto, escribe `no` o `agotado`.
2. El producto seguirá apareciendo con la etiqueta **Agotado** y tus clientes no podrán agregarlo a su pedido.
3. Cuando vuelvas a tenerlo, borra lo escrito o escribe `si`.

Si un cliente ya tenía ese producto en su pedido, se lo quitamos y se lo avisamos antes de enviarlo.

### Quitar un producto

Borra la fila completa, o deja el `precio` vacío. En ambos casos el producto deja de mostrarse.

## Fotos

Las fotos se guardan en **Google Drive**. Para cada foto:

1. Sube la foto a tu Google Drive.
2. Haz clic derecho sobre **esa foto** → **Compartir** → en "Acceso general" elige **Cualquier persona con el enlace**.
3. Toca **Copiar enlace** y pégalo en la columna `foto` del producto.

Ten en cuenta:

- Pega el enlace **de cada foto, no el de la carpeta.** Un enlace de carpeta no funciona: el producto se verá con la imagen genérica.
- Usa fotos **cuadradas** y que pesen **menos de 1 MB**, para que carguen rápido en el celular de tus clientes.
- **No muevas ni borres** las fotos de Drive mientras las uses en el catálogo. Si lo haces, el producto se verá con la imagen genérica.
- Si una foto no aparece, revisa que esté compartida como "Cualquier persona con el enlace".

## Pestaña "Negocio"

Tiene dos columnas: `clave` y `valor`. **Cada fila es un dato.** No cambies lo que dice en `clave`; solo escribe o cambia lo que va en `valor`.

| `clave` | ¿Es obligatoria? | Qué poner en `valor` | Ejemplo |
|---|:---:|---|---|
| `nombre` | Recomendada | El nombre de tu negocio. Si falta, el catálogo se llama "Catálogo". | `Pollería El Sabor` |
| `logo` | No | El enlace del logo, de la misma forma que las fotos (enlace del archivo, no de la carpeta). Si falta, solo se ve el nombre. | |
| `metodos_pago` | No | Los métodos de pago que aceptas, separados por comas. Puedes usar: `Yape`, `Plin`, `Efectivo`, `Transferencia`. | `Yape, Plin, Efectivo` |
| `yape_numero` | Si usas Yape | El número de Yape. | `987654321` |
| `yape_titular` | Si usas Yape | El nombre de la persona a quien pertenece el Yape. | `María Pérez` |
| `plin_numero` | Si usas Plin | El número de Plin. | `987654321` |
| `plin_titular` | Si usas Plin | El nombre de la persona a quien pertenece el Plin. | `María Pérez` |

Si en `metodos_pago` no pones ningún método válido, tus clientes solo verán la opción **"A coordinar por WhatsApp"**.

## Cuando algo no se ve como esperabas

- **Cambié algo y no aparece:** espera unos minutos más y recarga la página. Google tarda en publicar los cambios.
- **Un producto no aparece:** revisa que tenga `nombre` y un `precio` que sea solo un número mayor que cero.
- **Un producto aparece con la imagen genérica:** el enlace de la foto está vacío, es de una carpeta o la foto no está compartida con "Cualquier persona con el enlace".
- **Mis clientes ven el aviso "Mostrando datos guardados, pueden estar desactualizados":** significa que su celular no pudo conectarse para traer los datos nuevos y está mostrando lo último que guardó. Mientras tanto no pueden enviar el pedido, pero sí pueden escribirte por WhatsApp.

## El número de WhatsApp

El número de WhatsApp al que llegan los pedidos **no está en la hoja**. Lo cambia la persona que instaló el catálogo; si necesitas cambiarlo, pídeselo a ella.
