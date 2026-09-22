# Procedencia e identidad visual

Recursos descargados del portal del cliente el 21/09/2026 para la reutilización solicitada. No se añaden fotos de stock ni marcas de clientes. La autorización de uso se basa en el encargo de reutilizar los recursos del portal; no se afirma una licencia pública independiente.

| Archivo local | Procedencia | Transformación |
|---|---|---|
| `public/assets/logo.svg` | https://openxpand.com/wp-content/uploads/2024/06/logo-openexpand-white.svg | Logo blanco original, sin cambio de formas |
| `public/assets/favicon.svg` | https://openxpand.com/wp-content/uploads/2024/06/favicon-opx-light.svg | Original |
| `public/assets/operators.webp` | https://openxpand.com/wp-content/uploads/2024/06/for-operators-openxpand.webp | 1024×768 → 760×570, WebP calidad 82 |
| `public/assets/developers.webp` | https://openxpand.com/wp-content/uploads/2024/06/for-developers-openxpand.webp | 800×600 → 760×570, WebP calidad 82 |

El CSS público `wp-content/uploads/elementor/css/post-8.css` define violeta `#3D00A9`, durazno `#FFBC7D`, coral `#E89A8F` y gris `#282828`. El nuevo portal conserva el violeta dominante, el acento durazno, el logo blanco y las ilustraciones específicas por audiencia, con mayor espacio y jerarquía. Se usa tipografía de sistema para evitar descarga externa de fuentes; el portal original sirve Roboto. El diagrama `work-flow-openxpand.png` no se reutiliza: la arquitectura se explica como contenido traducible y accesible, sin trasladar texto incrustado ni afirmaciones no corroboradas.

## Rediseño con referencia de ritmo visual — 22/09/2026

El rediseño toma de [Railway](https://railway.com/) **solo patrones de composición**: cabecera compacta con CTA primario a la derecha, héroe con eyebrow/titular/lead/doble CTA y un artefacto lateral, secciones con encabezado y rejilla de tarjetas de borde fino, pasos numerados, banda de cierre y pie agrupado por temas. **No se han copiado textos, ilustraciones, iconografía, tipografías, componentes, nombres ni activos de Railway**: el portal publicado no contiene ninguna referencia a esa marca, y en el repositorio solo aparece nombrada en esta nota de procedencia.

**No se añadió ningún activo.** El inventario sigue siendo el de la tabla anterior: logotipo blanco, favicon y las dos fotografías por audiencia, que ahora encabezan las tarjetas de audiencia de la portada. El artefacto del héroe son diez «chips» de HTML/CSS con los nombres reales de `catalog.ts`: sin imágenes nuevas, sin capturas de producto y sin ejemplos de petición/respuesta que insinúen un entorno de pruebas.

Tokens de color efectivos en el CSS compilado, todos de la identidad documentada o derivados neutros/tintados de ella:

| Token | Valor | Origen |
|---|---|---|
| `--purple` / `--purple-deep` | `#3d00a9` / `#2d007c` | Violeta de marca y su oscurecido para hover |
| `--ink` | `#24103f` | Tinta de marca (fondos oscuros y pie) |
| `--peach` | `#ffbc7d` (+ `#ffcd9c` hover) | Acento durazno de marca |
| `--coral` | `#e89a8f` | Acento terciario documentado; solo sobre fondos oscuros, donde alcanza 5,3:1 |
| `--muted` / `--line` / `--line-strong` | `#f3f1f7` / `#ded7ea` / `#c4b8db` | Neutros tintados de violeta |
| `--text` / `--text-soft` / `--on-dark-soft` | `#282828` / `#4a4358` / `#e5dbf9` | Texto de marca y sus variantes de apoyo |
| `--focus` / `--danger` | `#c65500` / `#a52217` | Foco y error preexistentes, sin cambios |

Se mantiene la tipografía de sistema: no se descarga ninguna fuente externa. El foco visible conserva su regla dedicada y usa durazno sobre violeta y tinta.

## Evidencia visual — 22/09/2026

Capturas de página completa a 360 y 1440 px generadas con `npm run capture` desde el build local (Chrome 153 administrado por Factory, `reducedMotion: reduce`). El script **aborta cualquier petición fuera de `127.0.0.1`**, de modo que la evidencia no depende de un sitio externo.

| Plantilla | Archivos |
|---|---|
| Portada | `docs/evidence/new-home-{360,1440}.png` |
| Catálogo | `docs/evidence/new-catalog-{360,1440}.png` |
| Ficha de API (SIM Swap) | `docs/evidence/new-api-sim-swap-{360,1440}.png` |
| Desarrolladores | `docs/evidence/new-developers-{360,1440}.png` |
| Operadores | `docs/evidence/new-operators-{360,1440}.png` |
| Formulario de contacto | `docs/evidence/new-contact-apis-{360,1440}.png` |

`original-{360,1440}.png` son las capturas del portal del cliente del 21/09/2026 y se conservan como referencia de continuidad de marca.

## Comparación renderizada — 21/09/2026

Capturas reales con Chrome 153 administrado por Factory, a 360 y 1440 px. Revisadas portada original, portada nueva y páginas de desarrolladores y operadores. Archivos en `docs/evidence/original-{360,1440}.png`, `new-home-{360,1440}.png`, `new-developers-{360,1440}.png` y `new-operators-{360,1440}.png`.

Se preservan el logotipo blanco, violeta dominante, acento cálido y ambas fotografías específicas por audiencia. Se reemplazan las tarjetas densas y el titular animado por jerarquía estática, navegación visible y dos CTA diferenciados. Las secciones se apilan en móvil, conservando sus fotografías y enlaces. Los fondos neutros y mayor espacio mejoran la lectura. Se omite el fondo decorativo de circuitos para priorizar el mensaje y evitar una descarga ornamental; no se sustituye por stock genérico. Los textos alternativos describen las fotografías efectivamente reutilizadas.

El capturador espera la decodificación de las imágenes diferidas antes de exportar, para evitar huecos que no corresponden a la experiencia de desplazamiento.
