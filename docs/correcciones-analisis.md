# Correcciones del análisis (2026-11-06)

Aplica estas correcciones. Primero spec.md, luego quickstart.md, plan.md y tasks.md, manteniendo todo coherente:

- C1: Mover el escenario 5 de la Historia 1 (catálogo sin conexión con copia guardada) a la Historia 3 en spec.md y en la tabla de quickstart.md. Ajustar T025 para que no lo mencione.
- C2: Crear specs/001-catalogo-pedidos-whatsapp/checklists/verificacion.md como registro único de resultados (una sección por historia y otra para la prueba de concepto y los criterios de éxito). Citarlo en T007, T025, T037, T042, T043, T044, T048, T054 y T056.
- C3: En verificacion.md, cada historia incluye una revisión breve de los principios I–VII.
- G1: En T006, revisar en las herramientas del navegador el encabezado access-control-allow-origin de la respuesta de Google y anotarlo en T007.
- G2: Si la medición de T042 supera 5 minutos, se ajusta la spec al valor medido y se informa en la guía del dueño. No se agrega servidor.
- G3: Agregar a la verificación de la Historia 1: abrir el enlace sin iniciar sesión ni instalar nada (RF-011).
- G4: Anotar en T007 el riesgo de límites de uso de las fotos de Drive; la imagen genérica sirve de respaldo.
- A1: Áreas táctiles de al menos 44×44 px, y "sin desplazamiento horizontal a 360 px" como medida de CE-002.
- A2: La descripción corta se muestra en un máximo de 2 líneas, con "…" si es más larga. Sin "ver más" en la versión 1.
- I1: Cambiar "productos activos" por "productos válidos de la hoja" en spec.md.
- I2: Agregar a la spec, en la Historia 2: si la revisión antes de enviar quitó productos o cambió precios, se muestra un aviso (incluido el de cambio de precio) y el cliente debe tocar "Enviar pedido" otra vez.
- I3: En T025, cambiar "caja" por "sección".
- D1: Dejar una sola justificación de la excepción al principio IV en Aclaraciones.

No escribas código. Al terminar, lista los archivos modificados.