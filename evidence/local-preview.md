# Human review preview — 2026-09-20

Open http://127.0.0.1:4739/ (Spanish), http://127.0.0.1:4739/en/ or http://127.0.0.1:4739/pt/ on this machine.

Started from the assigned worktree with npm run preview -- --port 4739 after a clean npm ci, check and build with Node v22.23.2. The server is deliberately left running for the requested human review. Startup reported PID 31630; this is an observation, not authorization to signal a historical PID. No other preview process was touched. No PR, commit, push or deployment was performed.

The supervisor reported Chrome 153.0.8010.53 ready. The worker independently connected using Playwright CDP and exercised this preview through the browser suite. The existing test scripts already supported FACTORY_BROWSER_CDP_URL and FACTORY_BROWSER_DEBUG_PORT; no script or production changes were needed.

Static and browser suites passed against this exact preview. Nine locale/width captures were visually inspected at 360/768/1440, along with the refreshed original desktop capture. No overlap or horizontal overflow was observed. The three categories and eleven API names match the original reference and editorial matrix. All three dictionaries and shared template were reviewed.

Actual Tab/Enter traversal records show 19 links per locale at 360/1440 in logical order, with the skip link first. Reviewed representative focus captures es-13, en-0 and pt-16: focus remains visible on light and dark surfaces. No-JavaScript navigation/contact checks passed. Reduced-motion CSS was reviewed. All nine axe reports have no violations; incomplete contrast cases concern gradient surfaces, conservative header overlap detection and decorative symbols. These were checked against the rendered captures and CSS. Recomputed AA contrast ratios are saved in builder-contrast.json (minimum conservative ratio 5.4585:1). Performance results are recorded in performance.json and nine full Lighthouse reports.

Inherited untracked qa-current.md and tester-review.md were not modified or used as current execution evidence. Current acceptance evidence comes from this run.

Final performance suite exit 0: /: Performance 100, LCP 1054.351 ms, CLS 0; /en/: Performance 100, LCP 1054.3053 ms, CLS 0; /pt/: Performance 100, LCP 1052.7331 ms, CLS 0. Lighthouse 13.5.0, three default simulated mobile runs per route; initial own JavaScript 205 bytes gzip each. No acceptance command failed. Final HTTP availability check returned 200 for all three routes.
