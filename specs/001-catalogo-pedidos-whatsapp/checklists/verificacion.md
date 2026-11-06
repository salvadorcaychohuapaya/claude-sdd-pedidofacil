# Registro de verificación: Catálogo digital con pedidos por WhatsApp

**Propósito**: registro único de resultados de la prueba de concepto, de cada historia de usuario y de los criterios de éxito. La constitución exige registrar el resultado antes de dar por terminada una historia (sección "Flujo de Desarrollo y Puertas de Calidad").
**Escenarios**: [spec.md](../spec.md) | **Cómo probar**: [quickstart.md](../quickstart.md) | **Tareas**: [tasks.md](../tasks.md)

**Cómo se llena**: cada resultado lleva fecha, quién probó, dispositivo y navegador, y estado (`Cumple`, `No cumple` o `Pendiente`). Lo que no cumple se anota con el problema y la tarea que lo corrige. Una historia no se da por terminada mientras tenga escenarios en `No cumple` o `Pendiente`.

---

## Prueba de concepto (T007)

- **Fecha / quién**: _pendiente_
- **Hoja publicada como CSV, leída desde el navegador (computadora)**: _pendiente_
- **Hoja publicada como CSV, leída desde celulares reales (modelo y navegador)**: _pendiente_
- **Encabezado `access-control-allow-origin` de la respuesta de Google**: _pendiente (anotar el valor exacto)_
- **Foto de Drive: formato que carga** (`lh3.googleusercontent.com/d/ID=w400` o `drive.google.com/thumbnail?id=ID&sz=w400`): _pendiente_
- **Riesgo anotado**: Google puede limitar o cambiar el acceso a las fotos de Drive (límites de uso no documentados); la imagen genérica `img/generica.svg` sirve de respaldo.
- **Decisión**: _pendiente_ (seguir con lo decidido en el plan, o alternativa de [research.md](../research.md) sección 2, confirmada con el usuario)

---

## Historia 1 – Ver el catálogo (T025)

| Escenario / paso de quickstart | Estado | Fecha / quién / dispositivo | Notas |
|---|---|---|---|
| Esc. 1: productos con foto, nombre, descripción corta (máx. 2 líneas), precio y categoría | Pendiente | | |
| Esc. 2: producto agotado sin forma de agregarlo | Pendiente | | |
| Esc. 3: filtro por categoría y "Todos" | Pendiente | | |
| Esc. 4: nombre y logo arriba | Pendiente | | |
| RF-011: abrir sin iniciar sesión ni instalar nada | Pendiente | | |
| Hoja sin productos válidos: "Por ahora no hay productos disponibles" con botón de WhatsApp | Pendiente | | |
| Caracteres especiales (tildes, ñ, emoji) | Pendiente | | |

**Revisión de principios I–VII (Historia 1)**

| Principio | Cumple | Nota |
|---|---|---|
| I. Costo cero | Pendiente | |
| II. Primero el celular | Pendiente | |
| III. Simplicidad | Pendiente | |
| IV. El dueño no programa | Pendiente | |
| V. Privacidad | Pendiente | |
| VI. Español de Perú | Pendiente | |
| VII. Entrega por historias | Pendiente | |

---

## Historia 2 – Armar el pedido y enviarlo por WhatsApp (T036, T037)

| Escenario / paso de quickstart | Estado | Fecha / quién / dispositivo | Notas |
|---|---|---|---|
| Esc. 1: subtotales y total al instante | Pendiente | | |
| Esc. 2: mensaje de WhatsApp completo y correcto | Pendiente | | |
| Esc. 3: pedido vacío no se envía | Pendiente | | |
| Esc. 4: delivery sin dirección no se envía | Pendiente | | |
| Esc. 5: nota de delivery no incluido | Pendiente | | |
| Esc. 6: pedido se conserva y "Empezar un pedido nuevo" destacado | Pendiente | | |
| Esc. 7: "Empezar un pedido nuevo" vacía el pedido | Pendiente | | |
| Esc. 8: producto agotado o eliminado se quita con aviso | Pendiente | | |
| Esc. 9: aviso (incluido cambio de precio) y segundo toque en "Enviar pedido" | Pendiente | | |
| Cierre de la página y reapertura | Pendiente | | |
| Cantidades solo enteras de 1 a 99 | Pendiente | | |
| Método de pago deja de ser válido tras actualizar la hoja: se limpia la selección, hay aviso y se elige otro | Pendiente | | |
| Control de sumas CE-006 (`0.10`, `0.20`, `19.99`, `12,50`) | Pendiente | | |
| Prueba en celular real: WhatsApp abre con el mensaje correcto (Android / iPhone) | Pendiente | | |

**Revisión de principios I–VII (Historia 2)**

| Principio | Cumple | Nota |
|---|---|---|
| I. Costo cero | Pendiente | |
| II. Primero el celular | Pendiente | |
| III. Simplicidad | Pendiente | |
| IV. El dueño no programa | Pendiente | |
| V. Privacidad | Pendiente | |
| VI. Español de Perú | Pendiente | |
| VII. Entrega por historias | Pendiente | |

---

## Historia 3 – El dueño actualiza sus productos sin saber programar (T042, T043, T044)

| Escenario / paso de quickstart | Estado | Fecha / quién / dispositivo | Notas |
|---|---|---|---|
| Esc. 1: precio nuevo visible en un máximo de 5 minutos (tiempo medido: ___ min) | Pendiente | | Si supera 5 minutos: ajustar spec y guía del dueño |
| Esc. 2: producto nuevo aparece en su categoría | Pendiente | | |
| Esc. 3: fila con nombre o precio vacío no se muestra | Pendiente | | |
| Esc. 4: sin conexión, con copia guardada: aviso, envío bloqueado, botón de WhatsApp visible | Pendiente | | |
| Con el catálogo cargado, sin conexión al tocar "Enviar pedido": envío bloqueado con aviso y botón de WhatsApp visible (RF-013) | Pendiente | | |
| Foto inexistente muestra la imagen genérica | Pendiente | | |
| Sin copia y hoja inaccesible: mensaje amable con botón de WhatsApp que abre el chat con "Hola, quiero hacer un pedido." | Pendiente | | |
| CE-004: cambiar un precio con la guía en menos de 1 minuto (tiempo: ___ s) | Pendiente | | |

**Revisión de principios I–VII (Historia 3)**

| Principio | Cumple | Nota |
|---|---|---|
| I. Costo cero | Pendiente | |
| II. Primero el celular | Pendiente | |
| III. Simplicidad | Pendiente | |
| IV. El dueño no programa | Pendiente | |
| V. Privacidad | Pendiente | |
| VI. Español de Perú | Pendiente | |
| VII. Entrega por historias | Pendiente | |

---

## Historia 4 – Métodos de pago (T048)

| Escenario / paso de quickstart | Estado | Fecha / quién / dispositivo | Notas |
|---|---|---|---|
| Esc. 1: solo métodos aceptados por el negocio | Pendiente | | |
| Esc. 2: Yape/Plin muestran número, titular e indicación de captura | Pendiente | | |
| Esc. 3: Yape/Plin sin número o titular no aparecen | Pendiente | | |
| Esc. 4: sin métodos válidos solo "A coordinar por WhatsApp" | Pendiente | | |
| Línea de pago correcta en el mensaje de WhatsApp | Pendiente | | |

**Revisión de principios I–VII (Historia 4)**

| Principio | Cumple | Nota |
|---|---|---|
| I. Costo cero | Pendiente | |
| II. Primero el celular | Pendiente | |
| III. Simplicidad | Pendiente | |
| IV. El dueño no programa | Pendiente | |
| V. Privacidad | Pendiente | |
| VI. Español de Perú | Pendiente | |
| VII. Entrega por historias | Pendiente | |

---

## Criterios de éxito (T054) y verificación final (T056)

| Criterio | Medida | Resultado | Estado | Fecha / quién |
|---|---|---|---|---|
| CE-001 | Pedido de 3 productos en menos de 2 minutos (cliente nuevo) | | Pendiente | |
| CE-002 | Sin desplazamiento horizontal a 360 px y áreas táctiles de al menos 44×44 px | | Pendiente | |
| CE-003 | Productos visibles en menos de 3 s con 4G y caché vacía | | Pendiente | |
| CE-004 | Cambiar un precio sin ayuda en menos de 1 minuto | | Pendiente | |
| CE-005 | Costo mensual de operación: S/ 0 | | Pendiente | |
| CE-006 | 0 errores de suma en el mensaje de pedido | | Pendiente | |

**Verificación final sobre el sitio publicado (T056)**: _pendiente_
