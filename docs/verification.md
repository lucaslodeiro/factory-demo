# Estado de verificación

## Rediseño del portal — Builder, 22/09/2026

Node v22.23.2 y Chrome administrado por Factory vía CDP. El puerto 4321 estaba ocupado por el servidor de **otro worktree** (comprobado con `lsof`: cwd `…/f40f2a74-…`), así que `test-server.ts`, `playwright.config.ts`, `performance.mjs` y `capture.mjs` pasaron a respetar `PORT` y toda la verificación se ejecutó en 4399 contra el build de este checkout. Sin esa separación, Playwright habría reutilizado el servidor ajeno y medido un build distinto.

| Comando | Resultado |
|---|---|
| `npm run check` | exit 0; 28 archivos sin diagnósticos; paridad es/en/pt y diez familias en cuatro grupos |
| `npm test` | exit 0; 35 pruebas |
| `npm run build` | exit 0; 54 páginas localizadas; máximo 1391 bytes gzip de JS propio |
| `PORT=4399 npm run test:browser` | exit 0; **26 pruebas** (21 previas + 5 nuevas) |
| `PORT=4399 npm run test:performance` | exit 0; cinco rutas, mediana Performance 100 y CLS 0 |

**Pruebas nuevas** (ninguna existente se relajó ni se eliminó): estructura de la portada en los tres idiomas —CTA de cabecera, chips del héroe, dos tarjetas de audiencia con su recorrido y su intención, diez capacidades enlazadas en cuatro grupos, pasos, bloque de responsabilidad, banda de cierre, pie agrupado y cero JavaScript propio— más el encaje de la primera pantalla a 360 y 1440 px.

**Accesibilidad (AC-7).** axe sin violaciones `serious`/`critical` en las nueve plantillas a 360, 768 y 1440 px, incluido `color-contrast`. El recorrido completo por teclado alcanza **todos** los controles focusables de cada plantilla con `outline` visible. Reflujo con texto al 200 % en 720×450 sin desbordamiento horizontal. La cabecera no usa menú plegable: los enlaces permanecen visibles y tabulables en los tres anchos.

**Sin JavaScript (AC-9).** Con `javaScriptEnabled:false`, la portada de los tres idiomas renderiza sus ocho secciones, 42 enlaces y las diez tarjetas de capacidad; el CTA primario navega a `/es/contact/apis/`, donde el formulario conserva `method="post"` y `action="/api/contact"`. Las tres portadas compiladas cargan **0 bytes** de JavaScript propio.

**Dependencias (AC-9).** `package.json` y `package-lock.json` idénticos a la base (`git diff origin/main...HEAD` vacío). No se añadieron recursos externos ni activos en `public/`.

**Afirmaciones (AC-4).** Auditoría sobre las 54 páginas compiladas con un patrón de términos de riesgo (sandbox, credenciales inmediatas, certificaciones, cumplimiento, SLA, precios, cobertura, disponibilidad geográfica, prueba social, plazos). Las únicas coincidencias son **negaciones explícitas** —«no entrega credenciales inmediatas» / «does not provide immediate credentials» / «não fornece credenciais imediatas»— y dos falsos positivos léxicos («av**iso** de privacidad», «**Plan** the integration»). No hay logotipos de clientes, métricas ni sellos.

### Pendiente de confirmación humana (no publicado en la página)

1. Operadores, mercados o regiones con disponibilidad confirmada. *Por defecto: no se nombra ninguno.*
2. Certificaciones, auditorías o marcos de cumplimiento. *Por defecto: no se mencionan.*
3. Plazo de respuesta a una solicitud de acceso. *Por defecto: no se indica plazo.*
4. Clientes o partners autorizados a aparecer. *Por defecto: sin prueba social; en su lugar, el bloque de responsabilidad.*

Rendimiento medido en esta revisión (mediana de tres corridas móviles con caché fría, límites: Performance ≥90, LCP ≤2500 ms, CLS ≤0,1):

| Ruta | Performance | LCP (ms) | CLS |
|---|---:|---:|---:|
| `/es/` | 100 | 1126 | 0 |
| `/es/apis/` | 100 | 901 | 0 |
| `/es/apis/sim-swap/` | 100 | 901 | 0 |
| `/es/operators/` | 100 | 1276 | 0 |
| `/es/contact/apis/` | 100 | 1685 | 0 |

Contacto incluye el widget externo con clave pública de pruebas, que explica su LCP mayor; las solicitudes externas se registran por corrida. Informes renovados en `docs/evidence/lighthouse-*.json` y `performance.json`. La evidencia visual y la procedencia de la paleta están en `docs/assets.md`.

## Revalidación Builder — instrucción humana de secuencia 8

El 21/09/2026 se verificó Node v22.23.2 y el informe autorizado del supervisor: ready, Chrome 153.0.8010.53. Las variables de conexión no estaban exportadas; se obtuvieron el endpoint y el puerto del informe y se suministraron como FACTORY_BROWSER_CDP_URL y FACTORY_BROWSER_DEBUG_PORT. La conexión CDP funcionó. Se reutilizó el servidor local en 127.0.0.1:4321 después de comprobar que su directorio de trabajo corresponde a este worktree; sirve el build recién generado y simula únicamente los proveedores de contacto.

La instalación reproducible terminó correctamente (401 paquetes). Pasaron check (26 archivos sin diagnósticos y paridad de contenido), 35 pruebas unitarias/integración, build (54 páginas localizadas verificadas, máximo de 1383 bytes gzip de JS propio) y las **21 pruebas de navegador completas**. Esta ejecución no tuvo intentos fallidos. No fue necesario modificar código de producción ni dependencias.

**AC-10:** se comprobaron nueve plantillas a 360, 768 y 1440 px sin desbordamiento horizontal ni hallazgos axe graves/críticos; también acceso por teclado y foco visible en todos los controles principales. Pasó la prueba complementaria de reflujo con fuente al 200 % y reduced-motion. No se probó zoom nativo al 200 %, exento por la instrucción de secuencia 8. La exención total mencionada en el historial inferior corresponde a la instrucción anterior y ya no determina la aceptación actual. README corregido para ejecutar toda la suite.

**AC-6:** se mantiene el fallback autorizado. Las pruebas cubren las dos intenciones y los tres idiomas, destinatario fijo, cuerpo completo codificado, conservación de campos y aviso explícito de borrador sin enviar. Se interceptó la apertura nativa del enlace para inspeccionarlo; no se abrió una aplicación de correo ni se afirma recepción real. Las pruebas del servidor comprueban que la falta de configuración no llama a proveedores.

Se inspeccionaron las ocho capturas existentes del original y del nuevo portal en escritorio/móvil, junto con docs/assets.md. Logo, paleta y recursos por audiencia se conservan. No hubo cambios visuales; las capturas previas siguen representando las plantillas actuales.

**AC-9:** `npm run test:performance` terminó con exit 0: quince mediciones móviles nuevas con caché fría, tres por ruta, mediante el puerto del supervisor. Todas las medianas de Performance son 100 y de CLS son 0. Medianas de LCP: portada 902 ms; catálogo 901 ms; SIM Swap 901 ms; operadores 1277 ms; contacto 926 ms. Los informes lighthouse-*.json y performance.json se renovaron y sustituyen las mediciones históricas inferiores. Contacto incluye las solicitudes externas de Turnstile con clave pública de prueba, registradas separadamente. El entorno es macOS arm64 con throttling móvil simulado predeterminado de Lighthouse. No se cerró el navegador administrado.

## Historial anterior a la instrucción de secuencia 8

## Revalidación Builder — 21/09/2026, 21:46 UTC

La ejecución fresca encontró ya implementadas las instrucciones humanas de secuencia 7. No fue necesario cambiar código ni dependencias. Se verificó Node v22.23.2 y se leyó el informe del supervisor (ready, Chrome 153.0.8010.53); las pruebas conectaron al navegador mediante CDP. El servidor existente en 127.0.0.1:4321 pertenece a este worktree, comprobado mediante su directorio de trabajo.

Se repitieron la instalación reproducible (401 paquetes, exit 0), check (26 archivos, cero diagnósticos), las 35 pruebas unitarias, el build de producción con clave pública de prueba (54 páginas localizadas, 1383 bytes gzip máximos de JavaScript propio) y las 16 pruebas de navegador requeridas: todos con exit 0. No hubo intentos fallidos en esta revalidación. Las pruebas de AC-10 se excluyeron expresamente según la instrucción humana; no se afirma haberlas ejecutado.

Se revisaron de nuevo las ocho capturas existentes de escritorio y móvil y el inventario de recursos. La implementación visual no cambió. El fallback se verificó como borrador mailto para ambas intenciones y los tres idiomas, sin abrir una aplicación nativa ni enviar correo real. La recepción real no se presenta como demostrada: se aplica la alternativa autorizada por el humano. Los incidentes descritos más abajo pertenecen a la ejecución anterior.

`npm run test:performance` terminó con exit 0: quince mediciones nuevas, tres por ruta. Las cinco medianas de Performance fueron 100 y todas las de CLS fueron 0. LCP: portada 902 ms, catálogo 901 ms, SIM Swap 901 ms, operadores 1277 ms y contacto 1683 ms. Los JSON de Lighthouse y performance.json se actualizaron con esta ejecución; sustituyen los valores históricos de la tabla inferior. Se incluyeron las solicitudes externas del widget con clave pública de prueba. No se modificó el ciclo de vida del navegador administrado.

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
