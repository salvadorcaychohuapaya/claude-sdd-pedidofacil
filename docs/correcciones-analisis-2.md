# Correcciones del segundo análisis (2026-11-06)

Aplica estas correcciones manteniendo la coherencia entre spec.md, quickstart.md, plan.md, tasks.md, contracts/ y checklists/verificacion.md:

- G1: Agregar a la Historia 3 (quickstart.md y verificacion.md) un paso: cargar el catálogo, cortar la conexión, tocar "Enviar pedido" y comprobar que el envío queda bloqueado con el aviso y el botón de WhatsApp visible. Citarlo en T044.
- U1: Si la hoja responde pero no queda ningún producto válido, se muestra "Por ahora no hay productos disponibles" con el botón para escribir directo al WhatsApp del negocio. Agregarlo como caso límite en spec.md y reflejarlo en T018 y T023.
- U2: Si el método de pago elegido deja de ser válido tras actualizar la hoja, se limpia la selección, se muestra un aviso y el cliente elige otro. Agregarlo a T032 y a data-model.md.
- G2: En T049, T050 y T051, anotar el resultado en la sección "Criterios de éxito" de verificacion.md.
- A1: Crear contracts/textos-interfaz.md con todos los textos visibles de avisos y mensajes (incluidos el "mensaje amable" y el "aviso discreto"), en español de Perú. Citarlo en las tareas que muestran esos textos.
- I1: Agregar README.md a la estructura de plan.md y anotar poc/ como carpeta temporal que se elimina en T052.
- I2: En spec.md, Historia 2, cambiar el enunciado a "con un solo toque, salvo que la revisión previa cambie el pedido".

No escribas código. Al terminar, lista los archivos modificados y creados.