# Procedencia e identidad visual

Recursos descargados del portal del cliente el 21/09/2026 para la reutilización solicitada. No se añaden fotos de stock ni marcas de clientes. La autorización de uso se basa en el encargo de reutilizar los recursos del portal; no se afirma una licencia pública independiente.

| Archivo local | Procedencia | Transformación |
|---|---|---|
| `public/assets/logo.svg` | https://openxpand.com/wp-content/uploads/2024/06/logo-openexpand-white.svg | Logo blanco original, sin cambio de formas |
| `public/assets/favicon.svg` | https://openxpand.com/wp-content/uploads/2024/06/favicon-opx-light.svg | Original |
| `public/assets/operators.webp` | https://openxpand.com/wp-content/uploads/2024/06/for-operators-openxpand.webp | 1024×768 → 760×570, WebP calidad 82 |
| `public/assets/developers.webp` | https://openxpand.com/wp-content/uploads/2024/06/for-developers-openxpand.webp | 800×600 → 760×570, WebP calidad 82 |

El CSS público `wp-content/uploads/elementor/css/post-8.css` define violeta `#3D00A9`, durazno `#FFBC7D`, coral `#E89A8F` y gris `#282828`. El nuevo portal conserva el violeta dominante, el acento durazno, el logo blanco y las ilustraciones específicas por audiencia, con mayor espacio y jerarquía. Se usa tipografía de sistema para evitar descarga externa de fuentes; el portal original sirve Roboto. El diagrama `work-flow-openxpand.png` no se reutiliza: la arquitectura se explica como contenido traducible y accesible, sin trasladar texto incrustado ni afirmaciones no corroboradas.

**Comparación visual pendiente:** los recursos y CSS se inspeccionaron, pero Chromium falló al arrancar por permisos MachPortRendezvous y la herramienta de UI no ofrece navegadores. No hay capturas ni afirmación de equivalencia visual verificada. `npm run capture`, con servidor de pruebas activo en un entorno con navegador habilitado, genera PNG de portada original y de portada/desarrolladores/operadores nuevos a 360 y 1440 px en `docs/evidence`. Revisarlos y documentar diferencias antes de aprobar AC-11.
