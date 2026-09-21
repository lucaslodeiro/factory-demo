# Estado de verificación

La implementación no está aprobada para entrega: faltan ejecución de navegador y recepción real de correo. No se desplegó ni se contactó el formulario de producción.

## Evidencia disponible

- Runtime Node 22.23.2 comprobado.
- Contenido: tres idiomas, diez familias, operaciones y casos de uso; 54 páginas localizadas más fallback global.
- Vitest verifica validación, rechazos previos a proveedores, antispam, límites de cuerpo, escape HTML, destinatarios fijos, Reply-To, errores y claves de idempotencia; prueba middleware 404.
- Build inspecciona contenido HTML, enlaces, metadatos, JSON-LD, imágenes y presupuesto de JS comprimido. Las pruebas estáticas no equivalen a navegar, evaluar contraste o medir rendimiento.
- Auditoría de dependencias: las versiones iniciales reportaron vulnerabilidades; se actualizaron Astro, Vitest, Lighthouse y sharp a versiones compatibles y sin vulnerabilidades conocidas en la auditoría final.

## Bloqueos para Retry

1. **AC-5 (cliente), AC-9, AC-10, AC-11 y parte de AC-12:** Playwright no puede iniciar Chromium. Error real: `bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer: Permission denied (1100)`, seguido de SIGTRAP. El browser descargado existe; no es un fallo de descarga. La herramienta alternativa de UI reporta `Browser is not available: iab` y un inventario vacío de navegadores. Reintentar en un worker que permita iniciar Chromium y su IPC. Ejecutar navegador/axe, Lighthouse y capturas; corregir los hallazgos que surjan. No se inventan resultados ni imágenes.
2. **AC-6:** no se proporcionaron allow-list de secretos operativos, configuración de remitente verificado ni acceso autorizado a la bandeja de recepción. Inyectar configuración autorizada y habilitar comprobación de recepción para ambas intenciones. No se buscaron credenciales fuera del ámbito permitido. Un correo simulado no satisface el criterio.

## Incidentes resueltos

La caché habitual de npm no era escribible; se utilizó `/tmp/openxpand-npm-cache`. Astro intentó escribir su configuración de telemetría fuera del worktree; se desactivó la telemetría en los scripts. Se detectó que Astro inlinaba el pequeño script del formulario; se desactivó el inlining para compatibilidad con CSP y se añadió una comprobación de build.

## Verificación que debe completarse

Las pruebas de navegador cubren tres idiomas, formularios por intención, error/reintento, bloqueo durante envío, API contextual, anchos 360/768/1440, axe y reflujo con texto ampliado. Completar además inspección manual de tabulación completa y zoom real del navegador al 200%; el reflujo automatizado no sustituye totalmente esa inspección. Revisar CSP y fallback en Cloudflare preview autorizado. Lighthouse debe incluir Turnstile externo y documentar sus solicitudes; no hay medianas medidas aún.
