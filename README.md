# OpenXpand portal

Portal estático Astro + TypeScript, español principal y rutas equivalentes en inglés y portugués. Diez familias de APIs, recorridos para desarrolladores y operadores, y dos formularios con un backend Cloudflare Pages Functions común. Sin base de datos, CMS, analítica ni credenciales de APIs de telecomunicaciones.

## Runtime y comandos

Node **22.23.2**, npm 10.9.8. En el entorno AI Factory:

```sh
export PATH='/Users/lucaslodeiro/.local/opt/node-v22.23.2-darwin-arm64/bin':"$PATH"
node --version
npm ci --cache /tmp/openxpand-npm-cache
npm run check
npm test
npm run build
npm run dev
```

`package-lock.json` fija las versiones. La telemetría de Astro está desactivada en los comandos del proyecto. El build por defecto es un preview no indexable y sin widget configurado: el formulario falla de forma visible y segura. `astro dev` y `astro preview` sirven el frontend; no ejecutan las Functions.

Verificación de navegador con un build estático y backend **simulado exclusivamente en scripts/test-server.ts**:

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/openxpand-browsers npx playwright install chromium
PUBLIC_SITE_ENV=production PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run build
PLAYWRIGHT_BROWSERS_PATH=/tmp/openxpand-browsers npm run test:browser
```

La clave anterior es pública de pruebas de Turnstile; **no desplegar ese build como producción**. Las pruebas interceptan Turnstile y simulan Resend; no envían correos ni contactan producción por defecto. El comando `capture` sí visita el portal original y es una comprobación manual explícita.

Para medir rendimiento y capturar referencias, mantener `npm run test:server` en otra terminal y ejecutar:

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/openxpand-browsers npm run test:performance
PLAYWRIGHT_BROWSERS_PATH=/tmp/openxpand-browsers npm run capture
```

Lighthouse ejecuta tres mediciones móviles con perfil Chrome nuevo por ruta: portada, catálogo, SIM Swap, operadores y contacto. Reporta medianas, entorno y solicitudes externas; exige Performance ≥90, LCP ≤2500 ms y CLS ≤0,1. El build verifica ≤80 KiB gzip de JS propio por página. Medir con el widget externo habilitado; repetir con configuración operativa antes de publicar. No hay cifras Lighthouse acreditadas en esta entrega: ver `docs/verification.md`.

## Estructura

- `src/data/catalog.ts`: IDs tipados, operaciones y descripción/caso de uso por idioma.
- `src/data/i18n.ts`: todas las cadenas editoriales, de interfaz, accesibilidad y metadatos. Los nombres técnicos de las APIs se conservan.
- `src/pages/[...route].astro`: generación estática de 18 rutas por idioma.
- `src/components`, `src/layouts`, `src/styles`: plantillas y estilos compartidos.
- `src/scripts/contact.ts`: validación y estados accesibles; API opcional por identificador; nunca datos personales en URL.
- `src/lib/contact.ts`: contrato cerrado, límites, antispam, correo e idempotencia.
- `functions/api/contact.ts`: endpoint real; sin modo mock desplegable.
- `functions/_middleware.ts`: fallback 404 localizado con estado HTTP 404.
- `public/_redirects`, `_headers`, `_routes.json`: redirección raíz 301, cabeceras y rutas de Functions.

Agregar un idioma exige ampliar `Locale`, las traducciones y cada ficha. `check` verifica estructura, claves, paridad de arrays y texto no vacío. `build` comprueba HTML sin JS, enlaces internos, H1, metadatos, datos estructurados y dimensiones de imágenes.

## Configuración permitida

Solo deben inyectarse los valores siguientes mediante configuración autorizada de ejecución o secretos de Cloudflare; nunca leer archivos personales ni copiar secretos a informes. Esta ejecución no recibió una allow-list de credenciales ni acceso a un buzón.

| Variable | Uso | Visibilidad |
|---|---|---|
| `PUBLIC_SITE_ENV` | `production` permite indexar; cualquier otro valor bloquea | Pública, build |
| `PUBLIC_TURNSTILE_SITE_KEY` | Clave pública del widget, limitada al dominio operativo | Pública, build |
| `SITE_ORIGIN` | Origen exacto, p. ej. `https://openxpand.com`, sin barra final | Servidor |
| `TURNSTILE_SECRET_KEY` | Verificación de Turnstile | Secreto servidor |
| `RESEND_API_KEY` | Envío transaccional | Secreto servidor |
| `MAIL_FROM` | Dirección del dominio verificado, opcionalmente con nombre | Servidor |

El destinatario es fijo: `info@openxpand.com`. Reply-To usa el email validado. El servidor limita a 16 KiB, exige JSON y Origin exacto, valida campos y enums, honeypot, hostname y acción de Turnstile. No registra cuerpos, emails ni tokens. Rechaza encabezados inyectados y escapa el HTML. Timeouts externos de 8/10 segundos y error genérico reintentable para cuotas/fallos. El cliente conserva la clave de intento ante respuesta incierta y el servidor la liga al contenido; Resend aplica su ventana de idempotencia. No se garantiza deduplicación indefinida ni entrega a la bandeja por la mera aceptación del proveedor.

## Cloudflare Pages Free

Preparación documentada; **no se desplegó, registró cuentas ni cambió DNS**. En un proyecto Pages autorizado configurar Node 22.23.2, comando `npm ci && npm run build`, salida `dist`, Functions desde `functions/`. Definir variables y secretos del entorno correspondiente. Solo producción debe tener `PUBLIC_SITE_ENV=production`; previews usan el valor por defecto y no reciben secretos de producción. Comprobar el hostname de Turnstile y su acción (`contact_apis` / `contact_demo`). Reconstruir tras cambiar variables públicas.

Verificar en un preview autorizado la redirección 301, cabeceras CSP, 404 localizadas, antispam y errores; luego repetir los checks completos. Las rutas HTML pasan por middleware para conservar 404 localizadas y consumen invocaciones de Workers; assets bajo `/_astro/` y `/assets/` quedan fuera de Functions. No habilitar planes pagos ni sobrecostes automáticamente. El responsable del sitio debe revisar el aviso de privacidad antes de publicar.

Cuotas consultadas el 21/09/2026: [Resend Free](https://resend.com/pricing), 3.000 correos/mes y 100/día; [Pages Functions](https://developers.cloudflare.com/pages/functions/pricing/), cuota compartida de Workers Free de 100.000 solicitudes/día; [Turnstile Free](https://developers.cloudflare.com/turnstile/plans/), hasta 20 widgets y desafíos ilimitados. Las cuotas pueden cambiar: revisar en la cuenta antes del despliegue. Agotar correo debe producir error visible, nunca una confirmación falsa.

## Verificación de correo real — requisito pendiente

AC-6 no se satisface con el mock. Se necesitan secretos autorizados, dominio remitente verificado, widget operativo y acceso autorizado a `info@openxpand.com`. Sin esos elementos no se puede aprobar la entrega.

1. En entorno operativo autorizado, enviar datos sintéticos por cada intención, con idiomas distintos y una API en la solicitud de acceso.
2. Comprobar en el buzón receptor ambos mensajes y Reply-To, nombre, email, empresa, mensaje, intención, idioma y API.
3. Registrar fecha, intención y resultado de recepción, con identificadores redactados; no guardar secretos, tokens ni datos reales en el repositorio.
4. Probar fallo de proveedor y reintento sin duplicar una aceptación anterior dentro de la ventana de idempotencia. Conservar evidencia redactada fuera de logs con datos personales.

Ver `docs/assets.md`, `docs/redirects.md` y `docs/verification.md` para procedencia, migración y límites reales de validación.
