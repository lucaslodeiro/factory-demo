# OpenXpand public portal

Static Astro + TypeScript landing pages: Spanish `/`, English `/en/`, generic Portuguese `/pt/`. No backend, forms, accounts, analytics or deployment integration.

## Reproduce locally

Use Node 22.23.2 (Node 22 required) and npm. From a clean checkout:

```sh
node --version
npm ci --cache .npm-cache
npm run check
npm run build
npm run preview
```

The preview serves the generated `dist/` files, normally at http://127.0.0.1:4321. Read the actual URL printed by preview: if the port is occupied, Astro may select another one. Keep this single preview running and pass its actual URL to all three suites. In another terminal run (adjust the URL if needed):

```sh
export TEST_URL=http://127.0.0.1:4321
npm run test:static
npm test
npm run test:performance
```

When a Factory runner is supplied, `FACTORY_BROWSER_CDP_URL` connects Playwright to its isolated browser and `FACTORY_BROWSER_DEBUG_PORT` selects the same browser for Lighthouse. Read `FACTORY_BROWSER_REPORT` and confirm readiness first. Tests close their own contexts; the supervisor owns browser lifecycle. Without these variables, tests use local Google Chrome on macOS by default. Set `CHROME_PATH` to a Chrome/Chromium executable on other systems. The test suite does not send email. `npm test` checks built HTML, metadata, portfolio, assets, anchors, CTA activation with prevented default, language switching, no-JavaScript navigation, keyboard focus, responsive overflow and axe at 360, 768 and 1440 px. Screenshots and machine-readable reports go to `evidence/`. Performance runs nine sequential Lighthouse mobile measurements (three per locale); JSON reports contain the complete Lighthouse version and default simulated mobile configuration. Tests assert median score ≥90, LCP ≤2500 ms, CLS ≤0.1 and initial own JS ≤50 KiB gzip. Run against an otherwise idle local machine.

`npm run dev` starts development. Telemetry is disabled in all Astro scripts. Scripts use POSIX environment assignments; Windows users can run in WSL.

## Editing

- `src/data/content.ts`: typed dictionaries, shared API names and language paths. Translate every field in every locale. Category descriptions summarize source scope; do not add unsupported API functionality.
- `src/components/Landing.astro`: shared semantic page and structured metadata.
- `src/styles/global.css`: responsive layout, brand colors, focus and reduced-motion support.
- `docs/editorial-matrix.md`: original sources and editorial/asset decisions. Review this when editing claims.

Section IDs are stable across languages. The small progressive-enhancement script preserves a known current hash when switching languages. Without JavaScript all language routes, navigation and contact remain available; switching languages opens the destination landing page. The H1 and all substantive content are generated at build time.

## Domain and deployment preparation

`astro.config.mjs` defines the single production `site` URL. Change it before building for another domain; canonical URLs, reciprocal hreflang, sitemap, robots and JSON-LD derive from it. Maintain trailing slashes. Serve `dist/` with directory index support for `/en/` and `/pt/`; serve correct MIME types, HTTPS and compression. Fingerprinted `_astro/` assets may receive long immutable caching; HTML should revalidate. No application server or runtime secrets are needed. Preview and production both serve identical static artifacts; measured acceptance does not rely on CDN compression.

Deployment, domain modification, historical redirects and search console setup are separate tasks. Nothing has been published. Preserve the logo only for the authorized OpenXpand portal; see source/license notes in the editorial matrix. Font license is preserved in `public/assets/space-grotesk-LICENSE.txt`.

## Current verification status

See `docs/verification.md`. Results and retained browser, accessibility, visual and performance evidence are recorded there. Re-run all checks against the final build before accepting changes.
