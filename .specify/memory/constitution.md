<!--
Informe de impacto de sincronización
- Cambio de versión: (plantilla sin rellenar) → 1.0.0
- Principios modificados: ninguno renombrado; se definieron 7 principios nuevos (I–VII)
- Secciones añadidas: Restricciones Técnicas y de Alcance; Flujo de Desarrollo y Puertas de Calidad
- Secciones eliminadas: ninguna
- Pendientes: ninguno
-->
# Constitución de PedidoFácil

## Principios Fundamentales

### I. Costo Cero
Solo se DEBEN usar servicios y herramientas gratuitas. NO se permiten servidores, bases de datos
ni APIs de pago, ni planes gratuitos que exijan tarjeta con cobro automático posterior.

**Justificación**: el negocio que usa PedidoFácil no debe asumir ningún gasto recurrente.

### II. Primero el Celular
Todo se DEBE diseñar para pantallas desde 360 px de ancho y conexiones móviles lentas. Ninguna
pantalla puede requerir desplazamiento horizontal a 360 px, y el peso de las páginas y recursos
(imágenes incluidas) DEBE mantenerse mínimo.

**Justificación**: los clientes piden desde su celular, a menudo con datos móviles limitados.

### III. Simplicidad
El producto se DEBE construir con HTML, CSS y JavaScript sin frameworks ni pasos de compilación.
Entre varias soluciones que cumplan la especificación, se DEBE elegir la más simple. Cualquier
dependencia o complejidad adicional DEBE justificarse por escrito.

**Justificación**: el código debe poder abrirse, entenderse y publicarse sin herramientas de build.

### IV. El Dueño No Programa
Todo lo que el dueño del negocio necesite cambiar (productos, precios, fotos, disponibilidad) se
DEBE editar desde una hoja de cálculo. NO se puede exigir al dueño tocar código ni archivos
técnicos para operar el negocio.

**Justificación**: el dueño es quien administra el catálogo y no tiene perfil técnico.

### V. Privacidad
NO se DEBEN guardar datos de los clientes en ningún servidor. El pedido solo existe en el celular
del cliente y en el mensaje de WhatsApp. No se admiten analíticas ni rastreadores que envíen
datos personales a terceros.

**Justificación**: protege al cliente y elimina la necesidad de infraestructura y custodia de datos.

### VI. Español de Perú
La interfaz, los mensajes y la documentación DEBEN estar en español de Perú, con precios en soles
(S/). Los textos visibles al usuario NO deben mezclar otros idiomas ni monedas.

**Justificación**: el producto está dirigido a negocios y clientes de Perú.

### VII. Entrega por Historias
Cada historia de usuario se DEBE implementar por separado y probar en vista de celular contra sus
escenarios de aceptación antes de pasar a la siguiente. NO se inicia una historia mientras la
anterior tenga escenarios de aceptación sin cumplir.

**Justificación**: entregar valor incremental y verificable reduce el riesgo y facilita corregir.

## Restricciones Técnicas y de Alcance

- Tecnología permitida: HTML, CSS y JavaScript del navegador, hojas de cálculo gratuitas como
  fuente de datos del catálogo y WhatsApp como canal de envío del pedido.
- Alojamiento: únicamente servicios estáticos gratuitos; no se permite lógica de servidor propia.
- Cualquier propuesta que contradiga los principios I–VII requiere una enmienda previa de esta
  constitución antes de implementarse.

## Flujo de Desarrollo y Puertas de Calidad

- Cada historia de usuario parte de su especificación y escenarios de aceptación.
- Antes de dar por terminada una historia, se DEBEN ejecutar todos sus escenarios de aceptación
  en vista de celular (desde 360 px de ancho) y registrar el resultado.
- La revisión de cada cambio DEBE verificar el cumplimiento de los principios I–VII.
- La documentación y los mensajes de commit se redactan en español.

## Gobernanza

Esta constitución prevalece sobre cualquier otra práctica del proyecto. Las enmiendas requieren
documentar el cambio y su justificación, la aprobación de quien mantiene el proyecto y, si
afectan código existente, un plan de migración.

Política de versiones (versionado semántico): MAYOR para eliminar o redefinir principios de forma
incompatible; MENOR para añadir un principio o sección, o ampliar materialmente la guía; PARCHE
para aclaraciones y correcciones de redacción.

Revisión de cumplimiento: toda especificación, plan y revisión de cambios DEBE comprobar el
cumplimiento de los principios; las desviaciones se justifican por escrito o se rechazan.

**Versión**: 1.0.0 | **Ratificada**: 2026-11-06 | **Última enmienda**: 2026-11-06
