# Verification Report — Rediseñar el portal de Openxpand con referencia visual a Railway (#12)

Revision under test: `358d29d`; base `7d6d106`. Node v22.23.2, Chrome 153.0.8010.53 supervised by Factory over CDP.
Verification depth: **thorough** (per approved SPEC).

## Summary
**PASS_WITH_DEFERRED** — 13/13 acceptance criteria verified. One minor documentation gap deferred.

## How the suite was run

Port 4321 is held by a **foreign worktree's** server (`…/f40f2a74-…`), and the Factory-supervised runtime on 57175 is this checkout's `local-server.ts`, which runs with mail delivery unconfigured and therefore answers `{"fallback":"mailto"}`. The contact suite asserts the *delivered* success path, which requires `scripts/test-server.ts` and its simulated Turnstile/Resend. A first run pointed at 57175 produced 6 contact failures for that reason alone; re-run on a private transient `test-server.ts` at `PORT=4405`, the whole suite is green. This confirms the Builder's `PORT` parameterization was necessary, not cosmetic.

## Acceptance Criteria Coverage

| Criterion | Result | Evidence |
|---|---|---|
| AC-1 | passed | Brand, `h1`, lead and both CTAs render fully above the fold at 360 and 1440 px in es/en/pt (6/6 independent checks). Header CTA resolves to `/{locale}/contact/apis/`; hero peach CTA to the same, outline CTA to `/{locale}/contact/demo/`. |
| AC-2 | passed | `#audiences` has exactly 2 labelled cards per locale: `EMPRESAS Y DESARROLLADORES` → `/es/developers/` + `contact/apis/`; `OPERADORES DE TELECOMUNICACIONES` → `/es/operators/` + `contact/demo/`; 3 value points each. Same in en/pt. |
| AC-3 | passed | 10 capability cards in 4 labelled groups (Identidad y antifraude / Ubicación / Conectividad y calidad / Mensajería) per locale; shortest plain-language description 59 chars; all 30 links (10 × 3 locales) return HTTP 200. |
| AC-4 | passed | Adversarial term sweep over all 54 built pages (sandbox, playground, SLA, certification, GDPR/LGPD, compliance, uptime, 99.x, 24/7, pricing, coverage, operator brands): only matches are Portuguese "telefone/telefônicas". All availability wording is conditional ("la disponibilidad y las condiciones dependen…", "se confirma con el equipo"). Copy states explicitly "no entrega credenciales inmediatas" / "Sin credenciales automáticas". Pending confirmations recorded in `docs/verification.md`, not on the page. |
| AC-5 | passed | Every colour literal in `global.css` is documented in `docs/assets.md` or is an alpha/tinted derivative of `#24103f`/white. New colours (`#2d007c`, `#ffcd9c`, `#e89a8f`, `#ded7ea`, `#c4b8db`, `#4a4358`) are all documented palette members or tinted neutrals. No new assets in `public/assets/` (logo, favicon, 2 photos unchanged). "Railway" appears nowhere in the built site — only in a provenance note in `docs/assets.md`. |
| AC-6 | passed | Header brand, 3 section links, 3 language links and the CTA are all visible with no horizontal overflow at 360/768/1440 in es/en/pt (9/9). No collapsible menu. Both forms complete and submit at **360 and 1440** in 3 locales × 2 intents (12/12): validation marks fields, data preserved on error, retry succeeds, message cleared on success, `requestId` stable across retry, `api`/`intent`/`locale` carried. Mailto draft covered by the project's 6 passing draft tests. |
| AC-7 | passed | axe reports **zero violations at any impact level** (not just serious/critical) across 9 templates × 3 widths in es, plus home/catalog/contact at 360 in en/pt. Structure audit over 27 template×locale combinations: exactly one `h1`, no skipped heading level, `header`/`main`/`footer` landmarks present, skip link → `#main`. 200 % text reflow at 720×450: no horizontal overflow in any of 27 combinations. `prefers-reduced-motion: reduce` disables animation, transition, scroll-behaviour and hover transforms globally. Sections without an accessible name carry no region role, so the criterion holds by definition. |
| AC-8 | passed | `npm run check` exit 0 (28 files, 0 diagnostics; es/en/pt structural parity; 10 families in 4 labelled groups). The only literals in `.astro` templates are "OpenXpand", `info@openxpand.com` and the aria-hidden "↗" glyph. Language links point at the equivalent route on every template. |
| AC-9 | passed | `package.json` / `package-lock.json` byte-identical to base (empty diff). Only external origins in the build are `https://openxpand.com` (canonical) and `https://schema.org` (JSON-LD vocabulary) — no fonts, CDNs or analytics. `npm run build` exit 0 through `check-html.ts`. With `javaScriptEnabled:false`, all three home pages render 1 `h1`, 10 capability cards, 0 own `<script>`, and the primary CTA navigates to the contact page with the form markup intact. |
| AC-10 | passed | `PORT=4405 npm run test:performance` exit 0. Medians: `/es/` 100 / 1126 ms / 0 · `/es/apis/` 100 / 901 / 0 · `/es/apis/sim-swap/` 100 / 901 / 0 · `/es/operators/` 100 / 1276 / 0 · `/es/contact/apis/` 100 / 901 / 0. Committed reports in `docs/evidence/` restored after the run so the tree is unchanged. |
| AC-11 | passed | `npm run check`, `npm test` (35), `npm run build`, `PORT=4405 npm run test:browser` (26) all exit 0. Browser spec grew 7 → 9 blocks / 21 → 26 executed tests. Only two lines were removed: the import line, and one hardcoded `http://127.0.0.1:4321` replaced by the parameterized `${origin}` — same assertion strength. No unit test touched. |
| AC-12 | passed | 12 full-page screenshots at 360 and 1440 for home, catalog, API detail, developers, operators and contact form in `docs/evidence/new-*.png`, referenced from `docs/assets.md` with date 22/09/2026 and "Chrome 153 administrado por Factory". `scripts/capture.mjs` aborts every request whose URL does not start with the local origin, so no external site is visited. |
| AC-13 | passed | Visual review of home (1440), API detail (1440), contact form (360) plus Tester-generated captures of the localized 404 (pt) and the form error and success states: all use the new header, footer, typography, cards, buttons and focus styling. No screen retains the previous style. Error state uses `#a52217` on white with red field borders; success and 404 legible with sufficient contrast (axe: no `color-contrast` violation anywhere). |

## Findings

### F-1 — `#8d819d` form-input border absent from the token table in `docs/assets.md`
- Classification: defer
- Severity: minor
- Acceptance criterion: AC-5
- Evidence: `src/styles/global.css:165` uses the literal `#8d819d` for `input,select,textarea` borders. The new table in `docs/assets.md` is introduced as "Tokens de color efectivos en el CSS compilado" but does not list it.
- Expected: either the colour appears in the provenance table, or it is promoted to a token.
- Actual: it is an undocumented literal.
- Why this is not blocking: the colour is **pre-existing** (present in the base `global.css` at `7d6d106`), it is a violet-tinted neutral consistent with the palette, and axe reports no contrast violation. AC-5 requires colours to derive from the documented palette, which it does; only the table is incomplete.
- Recommended next action: add one row to `docs/assets.md` on the next docs pass. Not worth a Builder/Tester correction cycle.

## Tests Added or Modified
None persisted. Four throwaway audit scripts were created under `tests/` for this execution and **deleted afterwards**; the repository is byte-identical to the inherited state. Their machine-readable output is in `evidence/tester-*.json`.

## Commands Executed (acceptance evidence)
- `npm run check` → 0
- `npm test` → 0
- `npm run build` → 0
- `PORT=4405 npm run test:browser` → 0 (26 passed)
- `PORT=4405 npm run test:performance` → 0

Auxiliary (not acceptance evidence): first `PORT=57175 npm run test:browser` → 1, six contact failures caused by pointing at the preview server; `npm run test:server` started as a transient child process on 4405 and stopped afterwards; `git checkout -- docs/evidence` to restore the Lighthouse reports the performance run rewrote.

## Deferred Items
- F-1 above.
