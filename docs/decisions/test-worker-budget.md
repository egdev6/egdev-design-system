# Default test worker budget

`pnpm test` runs the complete Vitest suite with `--maxWorkers=2` by default. The existing pre-push hook still invokes `pnpm test`; its file, all existing test assertions/timeouts and watch/coverage commands remain unchanged.

Owner authorization, verbatim: **"Limitar pnpm test a 2 workers (Recomendado)"**. This separately authorizes runner-budget maintenance, verification and resuming the already-authorized ScrollReveal tracker integration; it does not grant extra retries or hook bypasses.

The original direct two-worker suite passed, while unrestricted pre-push extraction checks intermittently exceeded five seconds. Limiting concurrency aligns the standard command with the verified path; the full public command must pass before delivery, rather than assuming this observation proves the cause.

Risk: item 5 — the root test command also governs the shared pre-push verification environment. One independent verifier is required. The public command regression first failed on the missing worker argument; focused/full checks and independent verification results are recorded at delivery, not predicted here.
