# Inventario público y migración

Inspección HTTP del 21/09/2026: `https://openxpand.com/robots.txt` anuncia `sitemap_index.xml`; `wp-sitemap.xml` devuelve el índice Yoast que apunta a `page-sitemap.xml`. El sitemap de páginas contiene únicamente `https://openxpand.com/`.

| URL actual | Destino | Tratamiento |
|---|---|---|
| `/` | `/es/` | 301 permanente en Cloudflare `_redirects` |
| `/sitemap_index.xml`, `/page-sitemap.xml`, `/wp-sitemap.xml` | `/sitemap.xml` | 301 para los puntos de descubrimiento anteriores |

El HTML original usa un popup Elementor para contacto, sin ruta pública adicional publicada en el sitemap. No se importan rutas administrativas ni formularios WordPress. Las secciones nuevas tienen anclas `#developers`, `#operators`, `#about`; no se hallaron anclas editoriales estables en el HTML anterior. Los IDs internos de widgets no constituyen rutas de contenido.

Las fichas usan slugs estables entre idiomas. `?api=` solo preselecciona IDs del catálogo; canonical y sitemap excluyen parámetros. El formulario envía datos personales exclusivamente por POST. La migración queda preparada, no publicada.
