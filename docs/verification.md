# Current human review preview

The latest Builder execution leaves **http://127.0.0.1:4739/** running for the requested human review before a PR. See [current run](../evidence/local-preview.md). Node 22.23.2 clean install, check, build, static, browser and performance suites all succeeded. /: Performance 100, LCP 1054.351 ms, CLS 0; /en/: Performance 100, LCP 1054.3053 ms, CLS 0; /pt/: Performance 100, LCP 1052.7331 ms, CLS 0. Reports and captures in evidence/ were refreshed. No production code or dependencies changed. The records below describe earlier executions and their own preview ports.

# Verification report — 2026-09-20

## Final build verification

The Factory supervisor supplied an isolated Chrome 153.0.8010.53 runner. Its readiness report and our Playwright CDP/loopback probe both succeeded. Node was v22.23.2. The probe loaded `runner-ready` from its own temporary HTTP server, closed its context/server, and explicitly exited its client connection. No supervisor browser was closed or killed. Previous sandbox launch failures are resolved by this authorized runner.

`npm ci --cache .npm-cache --no-audit --no-fund` succeeded (388 packages). Final `npm run check` and `npm run build` succeeded, with zero diagnostics and three generated pages. All final suites used one production preview at **http://127.0.0.1:4527**, explicitly supplied through TEST_URL:

- `npm run test:static`: exit 0; three routes, local resources, portfolio, metadata, structured data, mail subjects, anchors, sitemap and robots.
- `npm test`: exit 0; all language/section transitions, intercepted CTA activation without sending mail, nine responsive/axe checks, skip link, complete keyboard traversal at 360/1440, and essential navigation/contact without JavaScript.
- `npm run test:performance`: exit 0; nine Lighthouse 13.5.0 measurements, default simulated mobile configuration. Full reports preserve configSettings, runtime and timing evidence in `evidence/lighthouse/`.

| Route | Median Performance | Median LCP (ms) | Median CLS |
| --- | --- | --- | --- |
| / | 100 | 1053.2114 | 0 |
| /en/ | 100 | 1053.5282 | 0 |
| /pt/ | 100 | 1054.5556 | 0 |

Each route has 205 bytes gzip of initial own JavaScript. Local SVG logos declare dimensions; the footer logo is lazy-loaded. Two local WOFF2 font preloads preserve font-display: swap while avoiding layout shifts.

## Visual, keyboard and contrast review

The Builder inspected the rendered captures for all three languages at 360, 768 and 1440 px. Logo, violet/coral identity, gradients and geometric typography remain recognizable against the original. Audience cards, portfolio, platform and contact sections are readable without overlapping or horizontal scrolling. Long mobile hero words now wrap within their container. The documented Space Grotesk fallback remains in place.

| Page | 360 px | 768 px | 1440 px |
| --- | --- | --- | --- |
| Spanish | [PNG](../evidence/es-360.png) | [PNG](../evidence/es-768.png) | [PNG](../evidence/es-1440.png) |
| English | [PNG](../evidence/en-360.png) | [PNG](../evidence/en-768.png) | [PNG](../evidence/en-1440.png) |
| Portuguese | [PNG](../evidence/pt-360.png) | [PNG](../evidence/pt-768.png) | [PNG](../evidence/pt-1440.png) |
| Original public site | [PNG](../evidence/original-360.png) | [PNG](../evidence/original-768.png) | [PNG](../evidence/original-1440.png) |

Keyboard review used actual Tab/Enter events through Playwright and inspection of the resulting ordered focus records and screenshots, rather than a DOM-only inference. The 19 links proceed through skip, brand, section navigation, languages, hero actions, audience actions, contact and footer. The skip link reaches main. Focus is visible on light cards and dark sections; no trap was observed. `evidence/focus-{es,en,pt}-{0,10,13,16}.png` records representative mobile focus states. `evidence/verification.json` records complete focus sequences at 360 and 1440.

All nine full axe reports (`evidence/axe-*.json`) have zero violations. Their color-contrast **incomplete** items were reviewed separately: gradient backgrounds, conservative overlap detection and decorative Unicode symbols require inspection. Screenshots show navigation and text unobscured; decorative symbols are aria-hidden. Solid-color text ratios tested by axe are at least 7.47:1. Manual WCAG relative-luminance calculations for the CSS colors give white/violet 11.85:1, white/dark-gradient 12.13:1, coral eyebrow/dark-gradient 8.11:1, muted contact text/dark-gradient 9.91:1, and dark text/audience cards at least 10.62:1. Conservatively compositing the brightest decorative orbit at its maximum 0.36 opacity yields white text contrast at least 5.45:1, above AA. Reduced-motion CSS removes animation/transition; no meaning depends on animation. No-JS mobile checks passed for every locale.

## Editorial and scope review

The original public portfolio screenshot confirms three categories and all eleven names. `docs/editorial-matrix.md` traces each section and claim; all three dictionaries and generated pages were inspected. Localized mail subjects distinguish demo from API access and the visible explanation leaves sending to the visitor. There is no form, authenticated portal, invented endpoint, pricing, metric or compliance guarantee. No dependency was added or updated in this execution.

## Inherited fixes reverified in this execution

- The inherited keyboard harness sent 24 Tab presses despite only 19 links, then timed out awaiting :focus after focus left the document. It now traverses the actual link count, has bounded waits, and records both mobile/desktop sequences.
- Visual inspection found a clipped Spanish mobile hero word despite no document overflow. `overflow-wrap:anywhere` fixes it; the browser suite now asserts the H1 itself does not overflow.
- An initial Lighthouse run failed English Performance (86) and CLS (0.2754), tracing the shift to late font loading. Local font preloads fixed it; all nine final measurements above replaced those failed-run artifacts.
- The managed CDP client remains connected after contexts close; the verification CLI explicitly exits after awaited cleanup, without issuing Browser.close. Standalone local browser launch/cleanup remains supported.

This fresh execution inherited the fixes above and reran installation, check, build and every acceptance suite successfully, with no failed verification commands. It independently inspected all nine new-page captures, the original desktop reference, keyboard focus records and representative focus captures, and recalculated the documented contrast ratios. The supervisor readiness report was refreshed in `evidence/runner.json`.

Prior executions failed to launch sandboxed Chrome (SIGABRT/ECONNREFUSED) and could only validate static output. Those historical results are not current acceptance evidence. No historical preview PID was signalled. No emails were sent and nothing was published, committed or pushed.

## Preview cleanup

The final preview was started by this execution at port 4527 (startup reported PID 83266). An auxiliary `npm exec astro preview stop` encountered EPERM creating Astro's preferences directory because telemetry was not disabled. Retrying with telemetry disabled, and via `npm run preview -- stop --port 4527`, reported no managed preview, although HTTP still returned 200. Process identity inspection with `ps -p 83266 -o pid=,command=` was denied by the sandbox. No signal was sent. The environment manager should identify and stop this preview through its authorized lifecycle mechanism; do not signal the recorded PID without rechecking ownership. This is post-verification cleanup only: all acceptance suites completed successfully before cleanup.
