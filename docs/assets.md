# Procedencia e identidad visual

Recursos descargados del portal del cliente el 21/09/2026 para la reutilización solicitada. No se añaden fotos de stock ni marcas de clientes. La autorización de uso se basa en el encargo de reutilizar los recursos del portal; no se afirma una licencia pública independiente.

| Archivo local | Procedencia | Transformación |
|---|---|---|
| `public/assets/logo.svg` | https://openxpand.com/wp-content/uploads/2024/06/logo-openexpand-white.svg | Logo blanco original, sin cambio de formas |
| `public/assets/favicon.svg` | https://openxpand.com/wp-content/uploads/2024/06/favicon-opx-light.svg | Original |
| `public/assets/operators.webp` | https://openxpand.com/wp-content/uploads/2024/06/for-operators-openxpand.webp | 1024×768 → 760×570, WebP calidad 82 |
| `public/assets/developers.webp` | https://openxpand.com/wp-content/uploads/2024/06/for-developers-openxpand.webp | 800×600 → 760×570, WebP calidad 82 |

El CSS público `wp-content/uploads/elementor/css/post-8.css` define violeta `#3D00A9`, durazno `#FFBC7D`, coral `#E89A8F` y gris `#282828`. El nuevo portal conserva el violeta dominante, el acento durazno, el logo blanco y las ilustraciones específicas por audiencia, con mayor espacio y jerarquía. Se usa tipografía de sistema para evitar descarga externa de fuentes; el portal original sirve Roboto. El diagrama `work-flow-openxpand.png` no se reutiliza: la arquitectura se explica como contenido traducible y accesible, sin trasladar texto incrustado ni afirmaciones no corroboradas.

## Comparación renderizada — 21/09/2026

Capturas reales con Chrome 153 administrado por Factory, a 360 y 1440 px. Revisadas portada original, portada nueva y páginas de desarrolladores y operadores. Archivos en `docs/evidence/original-{360,1440}.png`, `new-home-{360,1440}.png`, `new-developers-{360,1440}.png` y `new-operators-{360,1440}.png`.

Se preservan el logotipo blanco, violeta dominante, acento cálido y ambas fotografías específicas por audiencia. Se reemplazan las tarjetas densas y el titular animado por jerarquía estática, navegación visible y dos CTA diferenciados. Las secciones se apilan en móvil, conservando sus fotografías y enlaces. Los fondos neutros y mayor espacio mejoran la lectura. Se omite el fondo decorativo de circuitos para priorizar el mensaje y evitar una descarga ornamental; no se sustituye por stock genérico. Los textos alternativos describen las fotografías efectivamente reutilizadas.

El capturador espera la decodificación de las imágenes diferidas antes de exportar, para evitar huecos que no corresponden a la experiencia de desplazamiento.
