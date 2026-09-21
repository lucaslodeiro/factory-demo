# Estado de verificación

Verificación del 21/09/2026 con Node 22.23.2 y Chrome 153.0.8010.53 de Factory. La instrucción humana de secuencia 7 autoriza el fallback mailto de AC-6 y exime las pruebas de AC-10. No se modificó la especificación aprobada. No se desplegó ni se enviaron correos reales.

## Comandos y resultados

- Instalación reproducible: npm ci --cache /tmp/openxpand-npm-cache, exit 0; 401 paquetes, sin vulnerabilidades reportadas por npm.
- npm run check: exit 0; 26 archivos sin errores, advertencias ni hints; paridad de traducciones y diez familias.
- npm test: exit 0; 35 pruebas de validación, proveedores, fallback, idempotencia y middleware.
- PUBLIC_SITE_ENV=production PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run build: exit 0; 55 páginas, 54 páginas localizadas comprobadas sin JavaScript; máximo JS inicial propio de 1383 bytes gzip.
- npm run test:browser -- --grep-invert 'responsive|200%|keyboard reaches': exit 0; 16 pruebas, con navegación en tres idiomas, ambos formularios, errores, reintento, doble clic, confirmación, API contextual, canonical, redirección raíz y seis variantes de borrador mailto.

## Correo autorizado

Cuando falta RESEND_API_KEY o MAIL_FROM, el servidor valida origen, tamaño, contrato y honeypot; responde con una indicación de fallback sin llamar a proveedores ni devolver datos personales. SITE_ORIGIN sigue siendo necesario. El token solo es obligatorio cuando el correo está configurado. El cliente genera un borrador para info@openxpand.com con intención, idioma, nombre, email, empresa, mensaje y API, codificados de forma segura. Conserva los campos, intenta abrir el cliente y ofrece un enlace explícito para reabrirlo. El estado localizado aclara que el usuario debe enviar el correo. El aviso de privacidad explica la intervención de su proveedor de correo.

Las pruebas de navegador interceptaron la apertura nativa para inspeccionar el mailto real; no se afirma apertura de una aplicación nativa ni recepción de mensajes. Se requiere un cliente de correo configurado. La ruta de servidor configurada conserva Turnstile y Resend; sus errores no disparan el fallback para evitar duplicaciones tras respuestas inciertas. Las pruebas unitarias cubren ambos modos, y el backend local de navegador simula los proveedores.

## Continuidad visual

Se inspeccionaron las ocho capturas previas de docs/evidence: original, portada nueva, desarrolladores y operadores a 360/1440 px. Se conserva logo blanco, violeta dominante, acento cálido y las fotografías por audiencia. Las plantillas comparadas no cambiaron en esta ejecución. Procedencia y decisiones visuales en docs/assets.md. AC-10 no se ejecutó por exención humana; no se presenta como verificado.

## Entorno e incidentes resueltos

El reporte del supervisor indicó ready y CDP funcionó. Se reutilizó el servidor de producción estática en 127.0.0.1:4321 después de verificar con lsof que su cwd era este worktree. El supervisor conserva el ciclo de vida del navegador.

El primer build encontró ENOTEMPTY en la caché Vite al correr junto a astro check. Se eliminó únicamente node_modules/.vite y se repitió el build en secuencia: exit 0. Un script auxiliar de edición por stdin falló antes de modificar archivos por codificación; se usó Node y la edición se completó. Ninguno constituye un bloqueo vigente.

Las Functions y cabeceras en Cloudflare desplegado se comprobarán en el despliegue autorizado, fuera del alcance local. No se leyeron secretos ni se cambiaron cuentas, DNS o servicios externos.

## Rendimiento del build actual

npm run test:performance: exit 0. Quince mediciones Lighthouse móvil con caché fría, throttling simulado predeterminado, macOS arm64 y puerto CDP de Factory.

| Ruta | Mediana Performance | LCP (ms) | CLS |
|---|---:|---:|---:|
| /es/ | 100 | 901 | 0 |
| /es/apis/ | 100 | 901 | 0 |
| /es/apis/sim-swap/ | 100 | 902 | 0 |
| /es/operators/ | 100 | 1277 | 0 |
| /es/contact/apis/ | 100 | 901 | 0 |

Informes completos en docs/evidence/lighthouse-*.json y resumen en performance.json. Contacto incluye el widget externo con clave pública de pruebas; las solicitudes externas y sus estados se registran por corrida. No se interceptaron durante Lighthouse. Repetir con configuración operativa antes de publicar; no es evidencia de recepción de correo.
