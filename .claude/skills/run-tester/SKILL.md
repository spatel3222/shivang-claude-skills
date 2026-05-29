---
name: run-tester
description: Run the full Jarvis regression suite (kernel pytest + contract test + UI build + headless e2e + visual baselines), classify failures into REAL / KNOWN-FAIL / VISUAL, auto-file new bugs (or increment recurrence count if already filed), report per-loop output, and ask the user whether to auto-proceed (let /write_code fix the new bugs and re-test) or stay in the loop. Use this skill after any code change touching kernel, UI, or schemas. Trigger phrases include: "run tests", "validate this", "regression check", "make sure nothing broke", "/run-tester", or the implicit hand-off at the end of /write_code and /fix-bug.
---

# run-tester — Jarvis regression gate

## Role in the flow

```
/write_prd  →  PLAN (plan doc + MASTER_TODO row PENDING)
/write_code →  BUILD (atomic phases, parallel agents)
/run-tester ←  VALIDATE  ← YOU ARE HERE
                ├─ PASS  → /write_code proceeds to WRAP
                ├─ KNOWN-FAIL only → PASS; logged
                └─ REAL FAIL → file/bump BUG, ask user:
                              [a] auto-proceed: /write_code fixes, /run-tester re-runs
                              [s] stay in loop: surface failures, user guides
                              [x] stop: accept current state
```

**Source of truth for "did this change break anything?" in Jarvis.** Replaces the ad-hoc "run pytest + npm build" verification step that lived in `/write_code` and `/fix-bug`.

---

## When to fire

Trigger automatically (without waiting for the literal `/run-tester` slash):

- The user invokes `/write_code` and that skill reaches its verification gate
- The user invokes `/fix-bug` and that skill reaches step 8
- The user says any of: "run tests", "validate this", "regression check", "make sure nothing broke", "did I break anything"
- The user says "tested" or "QA this"
- Any phase exit where a meaningful change to kernel / UI / schemas just landed

Do NOT fire on:

- Pure documentation edits (Markdown only, no code/schema)
- Memory / preference updates
- Slash command edits in `.claude/commands/` (unless they touch test wiring)

---

## Inputs

Optional flags (parse from the user message; default if absent):

| Flag | Default | Meaning |
|---|---|---|
| `--scope=full \| diff` | `full` | `full`: run every test surface. `diff`: skip surfaces unrelated to staged + unstaged changes (kernel-only diff skips e2e; UI-only skips kernel pytest). User explicitly chose `full` as the default. |
| `--max-loops=N` | `3` | Cap on auto-fix iterations before forcing user decision. |
| `--interactive` | `true` | After each loop, surface output and ask user [a/s/x]. Setting `false` makes it best-effort linear (one loop, report, exit). |
| `--continue-on-fail` | `false` | Run all test surfaces even if an early one fails (useful for first-time full-suite audit). |

---

## Pre-flight (mandatory)

1. **Confirm servers running** — `lsof -iTCP:8502,5173 -sTCP:LISTEN`. If either port is missing, instruct user to run `/servers start` and exit. E2E + contract test require live BRAIN.
2. **Stage check** — `git status --short`. If nothing's changed since last commit AND `--scope=diff`, report "no diff, nothing to test" and exit unless `--scope=full`.
3. **Read** [`Code/DevLog/BUGS.md`](Code/DevLog/BUGS.md) into context — needed for the dedup step (don't file a duplicate of an open BUG).

---

## The loop

Run this loop up to `--max-loops` times. Each iteration:

### 1. Run the test surfaces

In order (fail-fast unless `--continue-on-fail`):

| # | Surface | Command | Catches |
|---|---|---|---|
| 1 | Kernel unit + integration | `cd Code/brain-kernel-and-forks/brain-kernel && .venv/bin/python -m pytest tests/ -q --no-header` | Kernel-side regressions |
| 2 | Schema contract | `.venv/bin/python -m pytest tests/test_render_component_contract.py -q --no-header` | Payload-shape drift (BUG-20 class) |
| 3 | UI typecheck + build | `cd Code/jarvis-ui-protocol && npm run typecheck && npm run build` | TS regressions |
| 4 | Headless E2E | `cd Code/jarvis-ui-protocol && npm run e2e 2>&1 \| tail -40` | Full-stack regression (clarify-full, policy-question, stop-button, md-rendering, visual-baseline) |

`--scope=diff` rules:

- If `git diff --cached --name-only` + unstaged has ONLY `Code/brain-kernel-and-forks/**/*.py` → run #1 + #2; skip #3 + #4
- If ONLY `Code/jarvis-ui-protocol/**/*.{ts,tsx,css,json}` → run #3 + #4; skip #1 + #2
- If ANY `Code/jarvis-ui-protocol/src/schemas/*.ts` → MUST run #2 (the contract test is the schema gate)
- Otherwise → run all four

### 2. Classify each failure

For every failing test or non-zero exit code:

**a. KNOWN-FAIL** — the test name or message matches an existing open BUG-N in `BUGS.md`. Examples already filed: `policy-question` (BUG-21), `stop-button` (BUG-22). Don't re-file. **DO bump the Occurrences counter on that row.**

**b. RECURRING-MATCH** — failure signature (file + error message head + selector + stack top) closely matches an existing BUG-N that is marked `fixed`. This means the fix regressed. **Bump the Occurrences counter AND change status from `fixed` to `open` AND set bucket to `regression`.** Surface this to the user as a special class.

**c. REAL FAIL (new)** — failure doesn't match any existing entry. **Create a new BUG-N row** with:
- Date today (resolve absolute, e.g. `2026-05-17`)
- Severity guess (critical/high/medium/low based on which surface failed — kernel + contract = high; e2e UI = medium; visual diff = low unless layout-critical)
- Bucket (`regression` if changed file matches recent commit; `new` otherwise)
- Reporter: `run-tester`
- Summary: one-line gap
- Root cause: stack trace head OR test assertion message (best-guess; the human or `/fix-bug` will refine)
- Fix commit: `pending`
- Regression test: name of the test that just caught it (this is the test that already exists)
- Status: `open`
- Occurrences: 1

**d. VISUAL DIFF** — `visual-baseline.ts` reported diff > threshold. Surface the diff image path. Ask user inline: "Is this intended? [b] regenerate baseline / [c] code bug, file BUG / [s] skip". Default surface as REAL FAIL unless user says regenerate.

### 3. Update BUGS.md

The recurrence-counter pattern (per user direction):

- **Existing open bug, same failure** → bump `Occurrences` column. If the row doesn't have an Occurrences column yet, add it: `| Occurrences |` between `Status` and the last column. Increment.
- **Existing fixed bug, regressed** → status `fixed → open`, bucket `regression`, Occurrences `+= 1`, prepend a "🔁 RECURRED on YYYY-MM-DD" line to the Root cause cell.
- **New bug** → append a new row at the bottom of the table; Occurrences = 1.
- **Recurrence ledger** — also update the class counter at the top of BUGS.md. If the new bug matches an existing class (`brain-payload-schema-drift`, `mirai-playground-parity-gap`, `venv-import-hang`, `react-init-race`, etc.), bump that class's count and append the new BUG-id to its `Bug IDs` cell.

### 4. Per-loop report (MANDATORY)

After each loop, print a structured report to stdout (the user MUST see this — never silently auto-proceed without showing it):

```
=== /run-tester loop N ===

Surfaces run:
  ✓ kernel-pytest     172 passed (10.4s)
  ✓ contract-test       6 passed (0.5s)
  ✓ ui-build            clean (3.1s)
  ✗ e2e                 3 PASS, 2 KNOWN-FAIL, 1 REAL-FAIL (72s)

Failures (1 real, 2 known):
  REAL  [new]  BUG-23 — clarify-full: option button not clickable
                src: scripts/e2e/clarify-full.ts:74
                root cause guess: `.clarify-opt` selector matched 0 elements
                screenshot: /tmp/e2e-clarify-full-FAIL-2026-05-17T18-32-…png
                Occurrences: 1 (just filed)
  KNOWN [bump] BUG-21 — policy-question: insurance_lookup stub still in use
                Occurrences: 1 → 2
  KNOWN [bump] BUG-22 — stop-button: turn_started not emitted
                Occurrences: 1 → 2

Recurrence ledger:
  brain-payload-schema-drift     count 1 (unchanged)
  mirai-playground-parity-gap    count 3 (unchanged)
  insurance-brain-capability-gate-omission  count 2 (unchanged)

Decide:
  [a] auto-proceed — invoke /write_code to fix the 1 new bug, then re-run /run-tester
  [s] stay in loop — show me the failure details, I'll guide
  [x] stop — accept current state, don't loop further
```

### 5. Decision routing

- **[a] auto-proceed** — invoke the **`/fix-bug`** skill chain (NOT `/write_code` — that one requires an approved plan in MASTER_TODO, which filed bugs never have). Pass the list of new BUG-N ids surfaced in this loop. `/fix-bug` handles each one end-to-end: diagnose root cause, fix minimally, sync to fork if needed, mark `fixed` in BUGS.md. When `/fix-bug` returns control, call `/run-tester` again for the next loop. **Increment loop counter; if at `--max-loops`, force [s] regardless of user choice.**
  - *Wiring note (2026-05-17):* longer-term the project wants a unified fix path — `/fix-bug` will be brought up to `/write_code`'s standard or merged with it. Until then, `/fix-bug` is the only skill that accepts BUG-N input without a plan, so it's the correct hand-off for filed bugs.
- **[s] stay in loop** — return to user with the loop report + full failure details (stack traces, screenshot paths, console logs). User drives the next move (fix manually, edit code, change baseline, etc.). After user signals "done fixing", call `/run-tester` again.
- **[x] stop** — exit. Report current state. The MASTER_TODO row stays `IN_PROGRESS` (not flipped to DONE) so the task is visibly unfinished.

If `--interactive=false`, skip the decision and treat as `[s]` (return to user with report).

---

## Auto-file rules — never file a duplicate

Before creating a new BUG-N row:

1. Grep `BUGS.md` for the failing test's name (e.g. `policy-question`, `clarify-full`) — if a row mentions it, that's the dedup target.
2. Grep for the failing assertion's error message head (first 40 chars) — close match counts.
3. Grep for the failing file's path — proximity signal.
4. If ANY of (1)(2)(3) matches an existing row with status `open`, `in-progress`, or `fixed` → treat as RECURRING, bump counter, don't create new row.
5. Only create new row when none of the above match.

When in doubt, prefer bumping an existing row's counter over filing a new one. False-positive new-bug rows are worse than false-positive bumps (the BUG-N space stays clean).

---

## Files this skill writes to

| File | When | What |
|---|---|---|
| `Code/DevLog/BUGS.md` | every loop | New row for REAL FAIL; Occurrences bump for KNOWN / RECURRING; recurrence-class counter bumps |
| `Code/DevLog/MASTER_TODO.md` | only on full PASS | Flip task row to ✅ DONE (only if /write_code handed off; never spontaneously) |
| `Code/jarvis-ui-protocol/e2e-baselines/*.png` | only on user `[b] regenerate baseline` | Overwrites the baseline |
| `/tmp/e2e-*.png`, `/tmp/e2e-*.console.log` | every loop | Artifacts from puppeteer; referenced in BUGS.md |
| `Code/DevLog/YYYY-MM-DD-run-tester-session.md` | only if 3+ loops in one session | Roll-up summary for future-you |

**Never writes to:** SHIPPED.md (that's /write_code's wrap step), Spec/tech_spec.md, Product/*.md.

---

## Handoff contract

**To `/fix-bug` (the [a] auto-proceed path):**

```
Tests: 4 surfaces, 7 tests
Result: REAL-FAIL × 1, KNOWN-FAIL × 2, PASS × N

New bugs filed: BUG-23
Existing bugs bumped: BUG-21 (occ 2), BUG-22 (occ 2)
Recurrence ledger: no class changes this loop

Next action: /fix-bug BUG-23 (then any other open `regression` bugs from this loop)
Priority order: 1) regression bucket, 2) high-severity new, 3) medium-severity, 4) low.
Auto-proceed approved by user: yes / no
```

`/fix-bug` reads this, fixes each BUG in priority order (diagnose → minimal fix → step 8 calls back into `/run-tester` per its own skill spec), and the loop closes when `/run-tester` reports PASS.

**To `/fix-bug` when /fix-bug invoked /run-tester (the verification path):**

Same shape, but `/fix-bug` is already inside a fix for a specific bug. If `/run-tester` reports failure:
- The same bug still failing → fix didn't hold; return to /fix-bug step 4
- A NEW bug appeared → /fix-bug's change introduced a regression; surface to user before proceeding
- All clean → /fix-bug proceeds to step 9 (sync) and 10 (commit)

**To user (direct):**

Always the per-loop structured report. Never just "tests pass" without the surface breakdown — the breakdown is the audit trail.

---

## Loop budget

- Default `--max-loops=3` — empirically more than that means the fix loop isn't converging (a deeper change is needed, the test infra has drifted, or BUG-N keeps regressing because the fix is wrong)
- At the cap, FORCE `[s] stay in loop` regardless of user preference — preserves human in the loop for the harder case
- The 3-loop cap is per-invocation, not per-session — the user can call `/run-tester` again to start a fresh 3-loop budget

---

## Quality gates (these are HARD STOPS)

A test cycle is NOT a PASS if any of these are true:

1. Pre-flight failed (servers not up) — exit with instructions, don't pretend tests passed
2. A new REAL-FAIL was filed and the user chose `[x] stop` — return non-zero verdict; MASTER_TODO stays IN_PROGRESS
3. Visual baseline diffed > threshold AND user neither regenerated nor accepted as bug — return non-zero
4. Any kernel pytest test went from PASS to FAIL in this loop — these are infrastructure-grade; never KNOWN-FAIL them
5. A `RECURRING-MATCH` was detected — the regression itself is a hard stop (means the prior fix didn't hold)

A test cycle IS a PASS if:

- All surfaces returned 0
- OR all failures are exact matches to existing open BUG-N entries (already known, tracked, accepted)
- AND no new RECURRING-MATCH was detected

---

## Edge cases

**No servers running.** Don't try to start them — that's `/servers`. Exit with: "Run `/servers start` first; pre-flight requires BRAIN on :8502 + Vite on :5173."

**E2E flakes (WS timeout on a single test).** Re-run that test once before classifying. If it passes on retry, mark it as `[flake-retry-passed]` in the report and surface to the user (don't auto-file). If it fails twice → REAL FAIL.

**Test infra itself broken** (e.g. `tsx` not installed, `puppeteer` missing). Treat as a hard-stop infra failure, NOT a code bug. Surface to user: "test infra needs setup; cannot proceed." Suggest fix path.

**Visual baseline doesn't exist yet** (first run for that state). Create it, mark as `[baseline-created]`, no failure. Commit the baseline alongside the change that introduced it.

**`/servers` itself regressed.** If `/run-tester` can't even confirm servers up because the pre-flight selectors broke, report this exact pattern to the user: "looks like /servers wiring drifted; can't validate."

---

## Memory awareness

Honour these existing project memories — they encode lessons that `/run-tester` must NOT relearn from scratch:

- `feedback_mirai_port_parity_gaps.md` — Plan F port gaps are a recurring class; bias toward filing as `mirai-playground-parity-gap` recurrence
- `feedback_fork_sync_gotcha.md` — kernel-side fixes need upgrade.py sync; flag this in bug routing notes
- `feedback_overlay_state_isolation.md` — chat-backdrop must not clobber overlays; relevant for any e2e failure involving modal disappearance
- `feedback_extend_existing_channels.md` — when filing a bug whose fix would involve adding a new WS frame kind, surface the question of whether to extend existing one instead

---

## Output template (verbatim — use this structure)

```
## /run-tester — Loop {N}/{MAX}

**Scope:** {full | diff} | **Interactive:** {yes | no}

### Surfaces

| # | Surface | Result | Detail |
|---|---|---|---|
| 1 | kernel-pytest | {✓ N passed | ✗ M failed} | {timing} |
| 2 | contract-test | {✓ | ✗} | {timing} |
| 3 | ui-build | {✓ clean | ✗ T errors} | {timing} |
| 4 | e2e | {3 PASS, 2 KNOWN, 0 REAL-FAIL} | {timing} |

### Failures

{If none: "No failures (or only KNOWN-FAILs). PASS."}

{Per failure:}
- **{REAL-NEW | RECURRING-FIXED | KNOWN-FAIL}** BUG-{N} — {test name}: {one-line gap}
  - **Root cause guess:** {one line from stack trace top / assertion msg}
  - **Artifacts:** {/tmp/screenshot.png}, {/tmp/console.log}
  - **Recurrence:** Occurrences {prev} → {new} | filed today

### Recurrence ledger changes

{Either "no class changes" or list each bumped class with new count}

### Decision

Pick one:
  [a] auto-proceed — invoke /fix-bug to fix new bugs (in priority order); re-run /run-tester after each fix
  [s] stay in loop — show me details; I'll guide
  [x] stop — accept current state; MASTER_TODO stays IN_PROGRESS

```

End every loop output with this exact prompt. Wait for user input before next loop unless `--interactive=false`.

---

*Skill version: 1.0*
*Last updated: 2026-05-17*
*Wires: `/write_code` verification gate, `/fix-bug` step 8, manual invocation*
