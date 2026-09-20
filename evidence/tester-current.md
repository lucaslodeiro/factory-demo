# Verification Report — OpenXpand

## Summary
PASS. Independent Tester execution 2026-09-20, Node v22.23.2, Chrome 153.0.8010.53 via supervisor CDP. Browser readiness report was read and connection plus loopback navigation succeeded. No production, dependency, test script or policy changes. The optional .factory/verification.json inspection found no file; the supplied policy was used. No acceptance command failed.

Preview started in the assigned worktree at http://127.0.0.1:4741/ (reported PID 43422). It is intentionally left running for human review before any PR. English /en/ and Portuguese /pt/ are also available. No existing process was stopped; supervisor browser lifecycle was preserved. No publication or GitHub operation performed.

## Acceptance Criteria Coverage
| Criterion | Result | Evidence |
|---|---|---|
| AC-1 | PASS | All dictionaries, shared template and editorial matrix reviewed against captured public original; three categories and eleven API names retained; unsupported guarantees removed. |
| AC-2 | PASS | Nine new-page screenshots at 360/768/1440 reviewed; original desktop reviewed with all three source widths captured. Recognizable logo, palette, gradients and geometric typography; no overlaps or horizontal overflow. |
| AC-3 | PASS | Localized subjects verified statically; hero CTA clicks intercepted and checked without sending email. Address visible; no forms or false confirmation. |
| AC-4 | PASS | Direct routes and all five section switches across three languages pass; complete translated copy and metadata inspected. |
| AC-5 | PASS | Static HTTP HTML, canonical/hreflang, Open Graph, JSON-LD, sitemap and robots assertions pass. |
| AC-6 | PASS | Nine fresh Lighthouse 13.5.0 default simulated mobile reports. All locale medians Performance 100, LCP under 1.055 seconds, CLS 0; own initial JavaScript 205 bytes gzip. |
| AC-7 | PASS | Nine axe reports zero violations; keyboard records (19 links each, 360/1440) reviewed in logical order. Visible focus inspected in es-13/en-0/pt-16 captures. Skip activation and no-JS language/navigation/contact pass. Reduced-motion CSS inspected. Gradient/overlap/non-text axe incomplete cases resolved by screenshot/CSS inspection and contrast calculations in tester-current-contrast.json. |
| AC-8 | PASS | Clean npm ci, check and build succeeded; static and browser route/resource/anchor assertions pass; README operation/edit/domain instructions reviewed. |

## Findings
None.

## Tests Added or Modified
None. Existing suites refreshed permitted evidence. Additional inline contrast assertions saved their results only.

## Commands Executed
All commands used the prescribed Node PATH; node --version returned v22.23.2 before verification.
- npm ci --cache .npm-cache && npm run check && npm run build — exit 0.
- TEST_URL=http://127.0.0.1:4741 npm run test:static && TEST_URL=http://127.0.0.1:4741 npm test && TEST_URL=http://127.0.0.1:4741 npm run test:performance — exit 0.
- node --input-type=module (inline contrast and keyboard assertions) — exit 0; all checked text contrasts >=4.5.
- Final fetch assertions for all three preview routes — exit 0, HTTP 200 each.

Performance medians: [{"path":"/","performance":100,"lcp":1052.7186,"cls":0},{"path":"/en/","performance":100,"lcp":1053.7301,"cls":0},{"path":"/pt/","performance":100,"lcp":1052.476,"cls":0}].

## Deferred Items
None. Human review remains requested before the orchestrator creates a PR.
