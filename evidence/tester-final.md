# Verification Report — OpenXpand

## Summary

PASS_WITH_DEFERRED. Independent Tester execution on 2026-09-20, Node v22.23.2, supervisor Chrome 153.0.8010.53. Read the supplied readiness report and independently connected via CDP and loaded `tester-ready` from a temporary loopback server. Closed only the owned context/server. Production files, dependencies and policies were not edited.

Clean installation (`npm ci --cache .npm-cache --no-audit --no-fund`) succeeded, 388 packages. `npm run check && npm run build` exited 0, zero diagnostics and three static pages. One preview served this build at http://127.0.0.1:4638. All suites explicitly used that TEST_URL. No acceptance command failed in this execution. An auxiliary file inspection reported the absent `.factory/verification.json`; the explicitly supplied write policy was followed.

## Acceptance Criteria Coverage

| Criterion | Result | Evidence |
| --- | --- | --- |
| AC-1 | Passed | Independently read all three dictionaries and editorial matrix; compared with https://openxpand.com/ and original capture. Three categories and eleven API names preserved; claims are descriptive, no invented endpoints, guarantees, pricing or authenticated functions. |
| AC-2 | Passed | Inspected all nine regenerated locale/width screenshots at 360/768/1440 and original desktop reference. Logo, violet/coral, gradients and geometric font character retained. No overlapping content or horizontal overflow; long mobile words wrap. Space Grotesk fallback documented. |
| AC-3 | Passed | Static suite validates localized subjects and visible email. Browser suite activates both hero mail links with default prevented, without sending email; no forms or false confirmations. |
| AC-4 | Passed | Complete localized pages, lang attributes and metadata; all 45 language/known-section transitions pass. |
| AC-5 | Passed | Static HTTP checks verify complete HTML without JavaScript, one H1, unique metadata, reciprocal alternates, canonical, Open Graph, JSON-LD, sitemap and robots. |
| AC-6 | Passed | Nine Lighthouse 13.5.0 mobile runs. Median Performance 100 for all locales, LCP es 1051.8712 ms/en 1052.8719 ms/pt 1052.9363 ms; CLS 0. Own initial JS 205 bytes gzip per route. Full configSettings retained in lighthouse reports. SVG logo dimensions and lazy footer verified. |
| AC-7 | Passed | Nine axe reports have zero violations. Reviewed keyboard sequences from actual Tab/Enter at 360/1440 in each locale: 19 links in logical order, skip-to-main works. Inspected focus screenshots on light and dark surfaces. No-JS mobile navigation, language and contact checks pass; reduced-motion CSS removes motion. Manual contrast calculations saved in tester-contrast.json. |
| AC-8 | Passed | Node 22 clean install, check/build/static/browser/performance commands all succeed. Resource and anchor HTTP checks pass. README documents content/domain editing, checks and static deployment preparation; no publication performed. |

## Manual accessibility and visual review

Reviewed axe's incomplete contrast cases separately: gradient backgrounds, conservative overlap detection in header and decorative symbols. Captures show header links unobscured. Decorative network and icons are aria-hidden. Recalculated CSS color contrast: white/violet 11.86, white/dark gradient 12.13, eyebrow/dark gradient 8.11, muted contact text/dark gradient 9.91, dark text/cards 10.62 or greater, CTA text/coral 7.47. Conservative brightest orbit composite gives white text 5.46. All exceed AA text thresholds. Representative focus captures inspected: focus-es-13.png, focus-en-10.png, focus-pt-16.png; complete ordered focus records reviewed in verification.json.

## Findings

### QA-1 — Optional preview cleanup

- Classification: defer
- Severity: low, operational follow-up only; no unmet acceptance criterion.
- Evidence: owned preview startup reported port 4638 and PID 76448. `npm run preview -- stop --port 4638` returned exit 0 with “No preview server is running”, but a subsequent HTTP probe still returned 200.
- Recommended next action: environment manager should verify current process identity/ownership and stop this preview through an authorized lifecycle mechanism. Do not signal the historical PID without rechecking it. No process was signalled and the supervisor browser was not closed.

## Tests Added or Modified

None. Only permitted reports and screenshot evidence were regenerated. Existing qa-current.md and tester-review.md were inherited and not edited. tester-final.md and tester-contrast.json are new in this execution.

## Commands Executed

All shell commands using Node/npm had the required Node 22 bin directory prepended to PATH.

| Final verification | Exit |
| --- | --- |
| npm ci --cache .npm-cache --no-audit --no-fund | 0 |
| npm run check && npm run build | 0 |
| TEST_URL=http://127.0.0.1:4638 npm run test:static && TEST_URL=http://127.0.0.1:4638 npm test | 0 |
| TEST_URL=http://127.0.0.1:4638 npm run test:performance | 0 |
| node --input-type=module (inline WCAG luminance/contrast calculations and nine axe report assertions) | 0 |

Installation, runner probe, server lifecycle and diagnostic inspections are described separately from the structured acceptance test list. No production changes, dependency changes, email sends, publication, commits or pushes occurred.

## Deferred Items

Only optional preview cleanup above. No browser or acceptance execution blocker remains.
