# Verification Report — Rediseño de Portal Openxpand.com

## Summary

PASS — Fresh independent Tester verification on 2026-09-21 local time (2026-09-22 UTC). No production code, dependencies, tests or policy changed. Latest human instructions through sequence 11 authorize mailto when email delivery is unconfigured and exempt native 200% zoom only.

Node v22.23.2 verified. Factory readiness report reported Chrome 153.0.8010.53 ready; browser tests used the supplied CDP endpoint and Lighthouse used the supplied debugging port. The existing loopback production-build server was reused after lsof confirmed its cwd is this assigned worktree. The supervisor browser was not closed. npm ci --cache /tmp/openxpand-npm-cache succeeded (401 packages, zero reported vulnerabilities). All final acceptance checks succeeded. An initial independent stdin assertion incorrectly treated the XML declaration question mark as a URL query; it was corrected to inspect only parsed loc URLs and rerun successfully. This was a verification assertion error, not an application defect.

An auxiliary combined inspection returned exit 1 because the optional .factory directory does not exist; the explicit execution write policy supplied by Factory was followed: only regular evidence files under evidence/ were added. This is not an execution blocker.

## Acceptance Criteria Coverage

| Criterion | Result | Evidence |
|---|---|---|
| AC-1 | PASS | Browser checks cover both hero CTAs and equivalent language navigation in es/en/pt; audience copy inspected. |
| AC-2 | PASS | Independently asserted exact approved ten directories and every approved operation in all 30 detail pages, contextual API contact links and equivalent locale links; descriptions and use cases reviewed in catalog.ts. |
| AC-3 | PASS | Read all three translation trees and API content: separate developer/operator journeys, explicit access request and no immediate credentials, qualified availability, no invented endpoints, guarantees or certification. |
| AC-4 | PASS | Type/content checks report three complete locale trees; browser language navigation passes; static HTML and 301 root checks pass. |
| AC-5 | PASS | Six locale/intent browser flows validate fields, pending state, preservation on error, retry idempotency and success. Unit tests exercise server validation and provider responses; associated field errors and live status inspected. |
| AC-6 | PASS, authorized alternative | Six locale/intent browser cases inspect generated mailto recipient, complete encoded data, retained fields and explicit unsent status. Unit tests verify unconfigured mode makes no provider calls. Native mail app launch is intercepted; no real receipt or live email delivery is claimed. |
| AC-7 | PASS | 35 unit/integration tests cover closed contract, size, origin, headers, honeypot, antispam hostname/action, provider/network failures, fixed recipient, Reply-To, escaping and idempotency. Inspected server/client and privacy text; no form logging or client secret use. |
| AC-8 | PASS | Build checks 54 localized HTML pages, H1, metadata, canonicals, hreflang, JSON-LD, internal links and image dimensions. Independent assertions verify production robots and 51 sitemap entries excluding 404. Inspected content, structured data and parameter canonical behavior. |
| AC-9 | PASS | Fifteen fresh cold-cache Lighthouse mobile runs on production static build, three per route; all five median scores 100, CLS 0, LCP 901–1725 ms. Maximum own initial JS 1383 gzip bytes. Full reports and external request details in this directory. |
| AC-10 | PASS within human instruction | Nine templates at 360/768/1440 px: no horizontal overflow or serious/critical axe violations. Keyboard test reaches every main control with visible outline. Reduced motion and enlarged-text reflow pass; native browser zoom was exempted and is not claimed. |
| AC-11 | PASS | Independently inspected eight existing original/new desktop/mobile captures and docs/assets.md against current templates/CSS: white logo, purple/peach palette and original audience photographs retained. Asset inventory documents source URLs, optimization and intentional omitted decoration. |
| AC-12 | PASS | Clean npm ci, check, 35 unit tests, production build, 21 browser tests and performance verification all exit 0. README covers runtime, commands, i18n, configuration, free quotas, deployment and mail verification. Tests simulate email providers by default. |

## Findings

None.

## Tests Added or Modified

None. Evidence reports only. The performance script was streamed through stdin with its output-directory literal replaced from docs/evidence to evidence; no script file was edited, and all measurement settings and assertions were retained.

## Commands Executed

Every Node/npm invocation used the required PATH prefix:

`export PATH='/Users/lucaslodeiro/.local/opt/node-v22.23.2-darwin-arm64/bin:/usr/bin':"$PATH"`

| Acceptance command | Exit | Result |
|---|---|---|
| npm run check | 0 | 26 files, zero diagnostics; locale/catalog checks pass |
| npm test | 0 | 35 tests, 2 files |
| PUBLIC_SITE_ENV=production PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run build | 0 | 55 built pages; 54 localized pages checked; JS max 1383 gzip bytes |
| FACTORY_BROWSER_CDP_URL=http://127.0.0.1:52713 npm run test:browser -- --output=evidence/browser | 0 | 21 tests passed |
| node --input-type=module with independent stdin assertions | 0 | Exact approved ten families/operations in 30 pages; contextual CTA, language links, robots and 51 sitemap entries |

Performance acceptance command (exit 0):

```sh
sed 's@docs/evidence@evidence@g' scripts/performance.mjs | FACTORY_BROWSER_DEBUG_PORT=52713 node --input-type=module
```

Environment: macOS arm64, Node 22.23.2, supervisor Chrome 153, Lighthouse mobile default simulated throttling, cold storage reset each run, http://127.0.0.1:4321. Public Turnstile test key enabled and external requests included without interception during performance measurements. Script and challenge document returned HTTP 200 in each contact run; reports record external transfers separately.

| Route | Median Performance | Median LCP ms | Median CLS |
|---|---:|---:|---:|
| /es/ | 100 | 901.634 | 0 |
| /es/apis/ | 100 | 901.279 | 0 |
| /es/apis/sim-swap/ | 100 | 901.399 | 0 |
| /es/operators/ | 100 | 1276.364 | 0 |
| /es/contact/apis/ | 100 | 1724.907 | 0 |

## Deferred Items

None required for acceptance under the active human instructions. Deployment is outside local scope; live Cloudflare behavior and operational provider configuration were not exercised. Performance evidence uses a public Turnstile test key, not a production account. No secrets or authorized mailbox were accessed; no email was sent. Existing original-site captures were inspected, not recaptured in this execution.
