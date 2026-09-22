# Verification Report — Desplegar local para pruebas (#6)

## Summary
PASS

URLs verificadas (proceso PID 32900, `npm run local:serve`, arrancado por el supervisor de
Factory a las 00:52:05 con `LOCAL_HOSTS=192.168.4.30,100.77.212.98,127.0.0.1 LOCAL_PORT=4330`,
padre `npm` reparentado a PID 1, fuera del árbol de procesos del worker):

- **https://192.168.4.30:4330/es/** (LAN, primaria)
- **https://100.77.212.98:4330/es/** (Tailscale)
- **http://127.0.0.1:4330/es/** (loopback)

Base: `3780ec8d9478ddc55e42a77a468cfaa0771874e6`, confirmada con
`git ls-remote origin refs/heads/main` en esta ejecución.

Los hosts de red usan HTTPS con certificado autofirmado en `.local/` (clave en 0600, ruta
excluida de Git): sin contexto seguro el formulario no instala su manejador. El navegador
pide aceptar el certificado una vez por dispositivo.

Segunda ronda de verificación: la primera cubrió la revisión anterior, limitada a
`http://127.0.0.1:64347/es/`. Esa instancia previa (PID 74743, 00:04:08) sigue viva y se
comprobó también en esta ronda; ver Deferred Items.

## Acceptance Criteria Coverage

| Criterion | Result | Evidence |
|---|---|---|
| AC-1 | passed | `git ls-remote origin refs/heads/main` → `3780ec8d9478…`, igual a `origin/main` local. `git diff --name-only 3780ec8 HEAD` devuelve solo las once rutas declaradas (`.gitignore`, `README.md`, `package.json`, `scripts/local-server.ts`, `scripts/verify-local.ts` y evidencias); `src/`, `functions/` y `package-lock.json` intactos. Árbol limpio antes y después de la verificación. SHA y adaptaciones registrados en README.md. |
| AC-2 | passed | `npm run test:local` → 189 respuestas estáticas (63 archivos × 3 orígenes) con tamaño idéntico al de `dist` y `X-Content-Type-Options: nosniff`; 55 páginas HTML generadas. `/` → 301 `/es/` y `/es` → 301 `/es/` conservando `?api=sim-swap`; las cuatro reglas de `dist/_redirects` verificadas en los tres orígenes. `/es|/en|/pt/<inexistente>/` → 404 con el HTML localizado (`lang` y título correctos en navegador), `/missing` → 404 global. Cabeceras de `_headers` aplicadas (CSP, `Cache-Control` inmutable en `/_astro/*`) más `X-Robots-Tag: noindex, nofollow`; `robots.txt` del build preview responde `Disallow: /`. `_headers`, `_redirects`, `_routes.json` → 403. |
| AC-3 | passed | Verificación propia en Chromium supervisado (CDP): cuatro envíos reales `es/demo` en loopback, `en/apis` en LAN, `pt/demo` en tailnet y `es/apis` en la instancia previa; todos HTTP 200 `{"fallback":"mailto"}`, sin `ok:true`. `#mail-fallback` visible con `mailto:info@openxpand.com`; el cuerpo contiene intención, idioma, nombre, correo, empresa, mensaje y la API elegida. `#status` coincide exactamente con `copy.mailDraft` y difiere de `copy.success`; todos los campos conservan su valor y el enlace para reabrir el borrador queda disponible. Cero peticiones externas y cero errores de consola. La suite `npm run test:local` añade los seis envíos es/en/pt × apis/demo en el origen primario más humo en el tailnet. Capturas: `qa-local-lan-en-apis.png`, `qa-local-tailnet-pt-demo.png`. |
| AC-4 | passed | Sondas propias con `curl` contra `https://192.168.4.30:4330`: GET → 405, PUT → 405, `Origin` ajeno y sin `Origin` → 403, `Content-Type: text/plain` → 415, campos inválidos → 400 `{"error":"invalid","fields":[…]}`, campo extra y honeypot relleno → 400, cuerpo de 20 KiB → 413 (también con `Transfer-Encoding: chunked` en la suite). `Host` fuera de la lista (`rebind.example`) → 403 antes de tocar archivos o API. Traversal `%2e%2e%2f`, `/..%2f..%2f`, `/../`, `//etc/passwd` → 403/404 sin filtrar archivos; porcentaje malformado → 400. El log del runtime sigue en 187 B tras todos los envíos y `grep` de los datos sintéticos da 0 coincidencias: no se registran datos del formulario ni se hace ninguna llamada a proveedores (correo deshabilitado ⇒ `handleContact` retorna antes de `fetcher`). |
| AC-5 | passed | Los tres orígenes responden 200 por HTTP (`curl`) y se navegaron realmente en Chromium. `lsof -nP -iTCP -sTCP:LISTEN` → `192.168.4.30:4330`, `100.77.212.98:4330` y `127.0.0.1:4330`, los tres del PID 32900; no hay escucha en `0.0.0.0`. Desviación declarada y vigente: la decisión humana de secuencia 15 sustituyó "escucha solamente en loopback" por LAN (opción A) y Tailscale (opción B). El ciclo de vida lo sostiene el supervisor (padre reparentado a PID 1, stdout en `/tmp/local-serve-6.log`), no el worker. README documenta URL efectiva (`.local/url`), SHA, comando de arranque con `LOCAL_HOSTS`/`LOCAL_PORT`, localización del PID con `lsof`, parada por PID exacto, el aviso de que `192.168.4.30` es concesión DHCP y la limitación de necesitar cliente de correo para abrir el borrador. |

## Findings

### QA-1 — Dos runtimes locales simultáneos del mismo worktree
- Classification: defer
- Severity: baja
- Acceptance criterion: AC-5
- Evidence / reproduction: `lsof -nP -iTCP -sTCP:LISTEN` muestra PID 32900 (00:52:05, tres hosts en 4330, revisión actual) y PID 74743 (00:04:08, solo `127.0.0.1:64347`, revisión anterior del guion cargada en memoria). `.local/url` contiene únicamente las tres URLs de 4330, mientras que el contexto del supervisor sigue anunciando `http://127.0.0.1:64347/es/`.
- Expected: un único runtime anunciado, coherente con `.local/url`.
- Actual: dos runtimes servidos en paralelo; ambos verificados y funcionando (`/es/` → 200 y envío de formulario correcto en los dos).
- Recommended next action: el supervisor, dueño del ciclo de vida, puede detener el PID 74743 para dejar una sola URL vigente. No bloquea la entrega: ningún origen verificado falla.

## Tests Added or Modified
Ninguno en el repositorio; `.factory/verification.json` no declara puntos de entrada de prueba
editables. La verificación independiente se ejecutó desde `/tmp/qa-node/run.mts` (envíos en
navegador y capturas) para no alterar el árbol del proyecto. Se añadieron dos capturas a
`evidence/`.

## Commands Executed
- `npm run check` → 0
- `npm test` → 0 (35 pruebas)
- `npm run local:build` → 0 (55 páginas, preview no indexable, sin clave de Turnstile)
- `npm run test:local` → 0 (189 respuestas en tres orígenes, redirecciones, 404 localizadas, rechazos y envíos en navegador)
- Verificación independiente: `tsx /tmp/qa-node/run.mts` → 0 (cuatro orígenes en navegador supervisado y 404 localizadas), sondas `curl`, `lsof`, `git ls-remote`.

## Deferred Items
QA-1 (dos runtimes simultáneos; decisión del supervisor).
