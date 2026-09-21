# Estado de verificación

Verificación ejecutada el 21/09/2026 con Node 22.23.2 y Chrome 153.0.8010.53 administrado por Factory. La entrega permanece bloqueada por AC-6 y por la comprobación nativa de zoom de AC-10. No se desplegó ni se enviaron correos reales.

## Comandos y resultados actuales

- `npm ci --cache /tmp/openxpand-npm-cache`: instalación reproducible correcta, 401 paquetes; auditoría de instalación sin vulnerabilidades reportadas.
- `npm run check`: exit 0; 26 archivos, sin errores, advertencias ni hints; paridad de tres idiomas y diez familias.
- `npm test`: exit 0; 33 pruebas en dos archivos. Contrato cerrado, límites, antispam, Reply-To, destinatario fijo, escape, fallos, idempotencia y middleware 404.
- `PUBLIC_SITE_ENV=production PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run build`: exit 0; 55 páginas generadas, 54 páginas localizadas inspeccionadas sin JS. Metadatos, enlaces, JSON-LD, imágenes y regla 301 verificados. Máximo JS propio inicial: **1.212 bytes gzip**.
- `npm run test:browser`: exit 0; **15 pruebas aprobadas**. Ambos formularios en es/en/pt, error/reintento, preservación de datos, estado pendiente, confirmación, API contextual, navegación equivalente, 404 y canonical. Nueve plantillas a 360/768/1440 px sin desbordamiento ni hallazgos axe graves/críticos. Tabulación completa y foco visible. Reflujo a 720×450 con tamaño raíz al 200 % y reduced-motion.
- `npm run test:performance`: exit 0; 15 mediciones, tres por ruta con caché fría. Informes completos y resumen en `docs/evidence/lighthouse-*.json` y `docs/evidence/performance.json`.

## Rendimiento

Build estático de producción servido en `127.0.0.1:4321`, macOS arm64, Lighthouse móvil con throttling simulado predeterminado. Se usó el puerto CDP suministrado por Factory; no se lanzó ni cerró el navegador del supervisor.

| Ruta | Mediana Performance | Mediana LCP | Mediana CLS |
|---|---:|---:|---:|
| `/es/` | 100 | 902 ms | 0 |
| `/es/apis/` | 100 | 902 ms | 0 |
| `/es/apis/sim-swap/` | 100 | 902 ms | 0 |
| `/es/operators/` | 100 | 1.277 ms | 0 |
| `/es/contact/apis/` | 100 | 922 ms | 0 |

Contacto carga Turnstile real con su clave pública de pruebas: cuatro solicitudes externas registradas por medición, incluidos script e iframe con HTTP 200. Una solicitud auxiliar del desafío no completó (estado -1); queda visible en los informes. No se simularon ni excluyeron los scripts externos durante Lighthouse. Los ensayos funcionales sí simulan antispam/correo explícitamente. Repetir con la configuración operativa antes de publicar; estas mediciones no prueban recepción de correo.

## Continuidad visual

Se inspeccionaron las ocho capturas existentes del portal original y del nuevo portal: portada, desarrolladores y operadores en escritorio/móvil. Conservan logo blanco, violeta, acento cálido y fotografías de ambas audiencias. Inventario, transformaciones y justificación de omisiones en `docs/assets.md`. No se modificó código visual durante esta ejecución.

## Bloqueos para Retry

1. **AC-6:** esta ejecución no recibió una allow-list de credenciales operativas, remitente verificado ni acceso autorizado a `info@openxpand.com`. No se intentó buscar secretos ni enviar mensajes con credenciales no autorizadas. Proporcionar configuración autorizada de Resend/Turnstile, dominio remitente verificado y capacidad autorizada de comprobar ambos mensajes recibidos. Ejecutar las dos intenciones con datos sintéticos y registrar evidencia redactada; el mock no satisface este criterio.
2. **AC-10, zoom nativo:** pasaron axe, teclado y reflujo automatizado, pero no se ejecutó el zoom nativo del navegador al 200 %. La herramienta de UI devolvió `browsers: []`; el navegador aislado del supervisor solo está expuesto por CDP, sin una superficie nativa controlable. No se utilizó el perfil personal de Chrome. Habilitar controles nativos del navegador aislado o un runner autorizado que permita verificar ese zoom, y completar la comprobación antes de aprobar AC-10. La simulación de reflujo no se presenta como prueba de zoom nativo.

## Incidentes y límites

El bloqueo histórico de lanzamiento Chromium quedó resuelto mediante el navegador del supervisor: su reporte indicó `ready` y las conexiones CDP, pruebas y Lighthouse funcionaron. Las limitaciones históricas de caché npm y telemetría están resueltas por los comandos documentados.

Un intento auxiliar de iniciar `npm run test:server` devolvió `EADDRINUSE` en 4321. Se comprobó mediante `lsof` que el servidor existente pertenece a este mismo worktree y se reutilizó para las verificaciones. No es un fallo de aceptación ni un bloqueo pendiente. El servidor lee el build actual desde `dist`.

La validación de cabeceras y Functions en infraestructura Cloudflare desplegada queda para el despliegue autorizado, fuera del alcance de esta implementación local. No se modificaron cuentas, DNS ni servicios externos.
