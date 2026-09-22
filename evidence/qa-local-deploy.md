# Verification Report — Desplegar local para pruebas (#6)

## Summary
PASS

URL verificada: **http://127.0.0.1:64347/es/** (proceso PID 74743, `scripts/local-server.ts`,
supervisado por Factory, escucha solo en 127.0.0.1).
Base: `3780ec8d9478ddc55e42a77a468cfaa0771874e6` (= `origin/main` confirmado con
`git ls-remote origin refs/heads/main`).

## Acceptance Criteria Coverage

| Criterion | Result | Evidence |
|---|---|---|
| AC-1 | passed | `git ls-remote origin refs/heads/main` → `3780ec8…`, igual a `origin/main` local y a `git merge-base HEAD origin/main`. `git diff --name-only origin/main HEAD` devuelve solo las cinco adaptaciones locales declaradas (`.gitignore`, `README.md`, `package.json`, `scripts/local-server.ts`, `scripts/verify-local.ts`). Árbol de trabajo limpio antes de esta verificación; no se tocó código de producción. SHA registrado en README.md. |
| AC-2 | passed | Recorrido en navegador de las 55 páginas generadas (es/en/pt): 200, `html[lang]` correcto, título no vacío, sin errores de consola, sin peticiones fallidas ni imágenes rotas. 60 referencias internas (`href`/`src`) resueltas con 200. `/` → 301 `/es/`; `/es` → 301 `/es/`; `/sitemap_index.xml`, `/page-sitemap.xml`, `/wp-sitemap.xml` → 301 `/sitemap.xml`. `/es|/en|/pt/does-not-exist/` → 404 con copia localizada; `/missing` → 404 global. Cabeceras de `_headers` aplicadas (incluye `Cache-Control` inmutable en `/_astro/*`) más `X-Robots-Tag: noindex, nofollow`. `_headers`, `_redirects`, `_routes.json` → 403. Deep link `?api=sim-swap` preselecciona la API y se conserva al cambiar de idioma. |
| AC-3 | passed | Seis envíos reales en navegador (es/en/pt × apis/demo) contra `/api/contact`: HTTP 200 `{"fallback":"mailto"}`, nunca `{"ok":true}`. Enlace `#mail-fallback` visible con destino `mailto:info@openxpand.com`; el cuerpo incluye intención, idioma, nombre, email, empresa, mensaje y la API elegida. `#status` muestra exactamente `copy.mailDraft` (aclara que el usuario debe enviarlo), distinto de `copy.success`. Todos los campos conservan su valor. Cero peticiones externas desde el contexto del navegador. Capturas: `local-mailto-es-apis.png`, `local-mailto-en-demo.png`, `local-mailto-pt-apis.png`. |
| AC-4 | passed | GET y PUT → 405; `Origin` ajeno y sin `Origin` → 403; `Content-Type: text/plain` → 415; JSON inválido y cuerpo vacío → 400; honeypot relleno, campo extra y locale inválido → 400 `{"error":"invalid"}`; cuerpo de 16384 B → 400 por validación (se leyó), 16385 B → 413, tanto con `Content-Length` como con `Transfer-Encoding: chunked`. Formulario vacío en navegador: no genera POST y muestra el mensaje de validación. Log del runtime (127 B) contiene solo la línea de arranque; `grep` de los datos sintéticos enviados → 0 coincidencias. |
| AC-5 | passed | `curl http://127.0.0.1:64347/es/` → 200 y navegación real en Chromium. `lsof -nP -iTCP:64347 -sTCP:LISTEN` → `TCP 127.0.0.1:64347 (LISTEN)`; `curl http://192.168.4.30:64347/es/` falla (no expuesto en LAN). El proceso lo arrancó el supervisor de Factory a las 00:04:08, fuera del árbol de procesos del worker, con stdout en `data/local-runtimes/<id>.log`. README documenta URL (`.local/url`), SHA, reinicio (`npm run local:serve`), parada por PID exacto y la limitación de requerir cliente de correo. |

## Findings
Ninguna. Dos señales investigadas y descartadas:

- Imágenes marcadas como no cargadas en `/es/apis/` y `/pt/apis/` durante el primer
  recorrido: es el logo del pie con `loading="lazy"`; tras esperar/desplazar,
  `naturalWidth = 300`. Artefacto del momento de medición, no defecto.
- 404 en consola durante el recorrido: corresponden a las rutas inexistentes que la
  propia verificación solicita a propósito.

## Tests Added or Modified
Ninguno en el repositorio. Los guiones independientes de verificación se ejecutaron desde
`/tmp` (recorrido y formularios en navegador, comprobación de enlaces internos, capturas)
para no alterar los puntos de entrada declarados.

## Commands Executed
- `npm run check` → 0
- `npm test` → 0 (35 pruebas)
- `npm run local:build` → 0 (55 páginas, preview no indexable, sin clave de Turnstile)
- `npm run test:local` → 0 (63 archivos, redirecciones, 404 localizadas, rechazos y seis envíos)
- Verificación independiente: sondas HTTP con `curl`, recorrido y formularios en Chromium
  supervisado (CDP), comprobación de referencias internas, `lsof`, `git ls-remote`.

## Deferred Items
Ninguno.
