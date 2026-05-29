---
name: fix-bug
description: Diagnose, fix, and test bugs in the Jarvis project with an architecture-aware workflow. Maintains a running daily bug log at Code/DevLog/BUGS.md (auto-incremented IDs, root cause, commit sha, regression tests). Use this skill whenever the user reports a bug, regression, broken behavior, or unexpected error, even if they don't explicitly say "fix-bug" — trigger on phrases like "this is broken", "regression in...", "I just hit a bug where...", "X stopped working", "the playground crashes when...", "<feature> doesn't render anymore". Reads Jarvis architecture docs first, identifies root cause, distinguishes recent-commit regressions from pre-existing bugs, fixes minimally, runs the full test suite, adds a regression test, and walks the cross-impact matrix before declaring fixed.
---

# fix-bug — architecture-aware bug fixing for Jarvis

You are the on-call bug fixer for the Jarvis project. Your job: from a one-line bug report, produce a fix that's grounded in the architecture, won't regress other flows, and leaves a paper trail future-you can read.

## Why this skill exists

Bugs in Jarvis are usually one of three flavours:
1. **Regressions** — yesterday's commit broke today's flow (e.g., chat-loop fix exposed an overlay-clobber bug)
2. **Latent fork drift** — kernel changes that didn't sync to a running fork (e.g., bare `@tool` decorators in `acme-automation`)
3. **Genuine new bugs** — a code path that was never quite right

Telling these apart matters. Regressions point to recent commits; latent drift points to fork-sync gaps; genuine bugs need tests. This skill makes you check all three before touching code.

## When to trigger

Trigger whenever the user reports something broken or unexpected. Don't wait for the literal phrase `/fix-bug`. Examples that should fire:

- `/fix-bug the login modal doesn't appear`
- "the playground stopped responding to attach"
- "regression in ingest_document — second call doesn't hit cache"
- "I just hit a bug where Claude calls the tool but nothing renders"
- "this is broken: [paste error]"
- "X used to work, now it doesn't"

Don't fire on routine code review / refactor requests — those are `/review` or just normal coding.

## The workflow (run in order)

### 1. Ground yourself in the architecture FIRST

Read these in order before touching code. They tell you what's expected, what just changed, and which prior bugs look similar:

| Doc | What you learn |
|---|---|
| `CLAUDE.md` | Project flow + locked decisions. Plan-approval discipline lives here. |
| `Product/jarvis_prd_v1.md` | Kernel engine spec — the canonical "how it should work" |
| `Product/jarvis_ui_v1.md` | UI strategy — overlay/backdrop semantics, component vocabulary |
| `Code/DevLog/SHIPPED.md` | **Read recent entries**. Most regressions trace to the last 3 shipped items. |
| `Code/DevLog/MASTER_TODO.md` | In-flight work. The bug may be inside something not yet finished. |
| `Code/DevLog/BUGS.md` | Past bugs. Search for similar symptoms — duplicates exist. |
| Component-specific PRDs in `Product/` | Per-feature standalone PRDs (e.g. `jarvis_ingest_document_v1.md`) |

If `Code/DevLog/BUGS.md` does not exist yet, create it with the header below before appending the first row.

### 2. Append a BUGS.md row immediately as `in-progress`

Before fixing anything, log it. The row gets enriched as the diagnosis progresses, but its mere existence is the lock that says "this bug is being worked on."

`Code/DevLog/BUGS.md` table format:

```markdown
# Bug Log

> Append-only. One row per bug. IDs auto-increment from the highest BUG-N in the file.
> Status legend: open | in-progress | fixed | wontfix | duplicate-of-BUG-X

| ID | Date | Severity | Reporter | Summary | Repro | Root cause | Fix commit | Regression test | Status |
|---|---|---|---|---|---|---|---|---|---|
| BUG-1 | YYYY-MM-DD | high | Shivang | one-liner | numbered steps | … | sha | tests/test_X.py | fixed |
```

Severity buckets: **critical** (data loss / brain unusable), **high** (feature broken), **medium** (workflow degraded), **low** (cosmetic).

### 3. Boil the bug down to four lines — repro / expected / actual / gap

Before tracing any code, force the bug into this exact frame. Every bug must compress to four lines. If you can't compress it, you don't understand it yet — go back to the user and ask, don't speculate.

```
Steps to reproduce: <numbered, minimal sequence — fewest steps that consistently surface the bug>
Expected:           <what the system was supposed to do at the last step>
Actual:             <what the system actually did>
Gap:                <one-line precise diff between expected and actual — this is what to fix>
```

The **Gap** is the only thing that matters for the rest of the workflow. The fix should target the gap, the regression test should assert the gap is closed, and the commit message should quote the gap. Vague gaps ("nothing happens") become specific gaps after step 4 below ("WS frame X is sent but the React handler resets state Y before rendering it"). Don't stop at vague.

Worked example (BUG-3 from this project):

```
Steps to reproduce: (1) start fork brain (2) open playground (3) say "log me in"
Expected:           login modal appears as overlay over chat
Actual:             chat shows Claude reply text describing schema_id; no modal renders
Gap:                kernel emits the login `render` frame correctly (Tools tab shows it),
                    but the React handleSchema resets overlaySchema=null on every chat
                    re-render, wiping the overlay before paint
```

The Gap is the entire fix in compressed form: it names the file (handleSchema), the wrong action (reset on chat re-render), and the right action (don't wipe transient overlay state).

After framing, trace the code path **only as deep as needed to confirm the Gap**:
- Bug in playground UI → `ChatComposer` → `ws-client.ts` → kernel WS server → `playground_brain.conversation_loop` → tool/skill
- Bug in kernel → `run_turn` → tool/skill → memory/store

Open the running brain's terminal output — stack traces are gold and most bugs leave one. If the user pasted a stack trace, the Gap line should reference its top frame.

### 4. Identify root cause — three buckets

Before writing a fix, assign the bug to one bucket. The bucket dictates how to fix it.

| Bucket | Signal | How to fix |
|---|---|---|
| **Regression** | Worked yesterday, broken today. SHIPPED.md shows a recent commit touching the path. | `git log -p <file>` for the last few commits; identify the commit that introduced it; minimal fix that preserves the new behaviour but restores the broken one (often a one-liner) |
| **Latent fork drift** | Master code looks fine; running fork has stale or divergent file. | Sync from master via `cp` (kernel files) or `upgrade.py` (when a VERSION bump is involved). See memory: `feedback_fork_sync_gotcha.md`. |
| **Genuine new bug** | Path was never quite right; no recent commit; not fork drift. | Fix the underlying bug in master + sync to fork(s). |

### 5. Fix the minimum

Touch only what's needed. Don't refactor adjacent code on the same commit — that conflates the bug fix with cleanup and bloats the regression-test surface.

### 6. Walk the cross-impact matrix BEFORE declaring fixed

Jarvis has a few flows that interact through shared state. A "fix" in one flow can break another. Mentally walk each affected flow:

| Flow | What to verify |
|---|---|
| **Chat loop** | After fix, can user send a plain text message and get a reply? Are messages still merging without dupes? |
| **Playground attachments** (`+` button) | Does inline ≤2 MB still attach? Does HTTP `/upload` still return file_id? |
| **Workdir / artifact_write** | Does linked workdir still receive `artifact_write` frames? Does fallback to `./logs/artifacts/` still fire when no workdir? |
| **Render-component overlays** (login, OTP, markdown_editor, image, document, sheet, form, modal, etc.) | Does the overlay show? Does the backdrop chat re-render NOT clobber it? Does submit/cancel return to chat correctly? |
| **`ingest_document` Skill** | Does `summary` mode still cache? Does `knowledge` mode still gate via canonicalize? |
| **Debug Panel** | Are Trace / Skills / Tools tabs still populating? |
| **Fork sync** (`acme-automation`) | If the fix touched `brain_kernel/` or `scripts/`, does the fork need the same change? |

If a flow could plausibly be affected, exercise it (manually if UI, via pytest if kernel) before declaring fixed.

### 7. Add a regression test that asserts the Gap is closed

The bug must produce a failing test in the repo BEFORE the fix and a passing test AFTER. This is the single most important step — without it, the bug will return.

The test's assertion should mirror the **Gap** line word-for-word as much as possible. If the Gap was "handleSchema resets overlay on chat re-render", the test should be `test_chat_rerender_preserves_open_overlay` and the assertion should literally check that `overlaySchema` is still set after a chat-render frame is received while in overlay mode. Don't write a test that incidentally would have caught the bug — write a test that directly asserts the Gap.

For kernel bugs: a test under `Code/brain-kernel-and-forks/brain-kernel/tests/test_*.py`.
For UI bugs: a test under `Code/jarvis-ui-protocol/__tests__/` if the build supports vitest, or a manual smoke step documented in BUGS.md if no test infra exists for that surface.

The test name should reference the BUG-id, e.g. `def test_bug_3_overlay_survives_chat_rerender():`.

### 8. Validate via `/run-tester` (MANDATORY)

Don't hand-run pytest + npm build + e2e — invoke the `run-tester` skill. It is the single source of truth for the Jarvis regression suite:

```
Skill: run-tester
```

`/run-tester` runs all four test surfaces (kernel pytest, schema contract, UI build, headless E2E with visual baselines), classifies each failure (REAL / KNOWN-FAIL / RECURRING / VISUAL), auto-files new bugs into `Code/DevLog/BUGS.md` (or bumps the Occurrences counter on existing rows — never duplicates), and asks the user to `[a]` auto-proceed, `[s]` stay in loop, or `[x]` stop.

**Routing for `/fix-bug` specifically:**

- If `/run-tester` reports the bug you JUST fixed now passes its regression test → declare fixed; proceed to step 9 (sync) and 10 (commit).
- If `/run-tester` reports the same bug RECURRING (status flip from `fixed → open` with bumped Occurrences) → your fix didn't hold. Return to step 4, identify what you missed.
- If `/run-tester` filed a NEW unrelated bug → your fix introduced a regression. Address it before commit; do not declare the original bug fixed in isolation.
- If `/run-tester` says PASS with only KNOWN-FAILs unchanged → proceed.

**Visual baseline drift:** if your fix intentionally changed UI, tell `/run-tester` to regenerate (it'll prompt `[b]`); commit the updated `e2e-baselines/*.png` alongside the fix.

**Why the gate is now a skill, not a command list:** test surfaces drift; one source of truth ensures every fix gets the same battery. New surfaces (e.g. perf benchmarks, security scans) get added to `/run-tester` once, and every fix gets them automatically.

**Do not declare fixed if `/run-tester` reports any non-known-fail failure** — even tests unrelated to your fix. A pre-existing failure means BUGS.md was already lying about its state; that's a separate /fix-bug to run first, or surface to the user.

### 9. Sync to fork if needed

If the fix touched any file under `brain_kernel/` (auto-synced via `upgrade.py`) or `scripts/` (NOT auto-synced) or the fork itself:

- For files under `brain_kernel/`: bump master `brain_kernel/VERSION`, run `python scripts/upgrade.py /path/to/master` from inside the fork directory.
- For files under `scripts/`: copy directly to each fork's `scripts/` (the `upgrade.py` walker doesn't touch this directory).
- For files under `overrides/`: fork-side by design — apply the same patch in each fork that uses it.

### 10. Commit + update BUGS.md to `fixed`

Commit message format — the body MUST reproduce the four-line frame from step 3 verbatim. This is the trail future-you reads when grepping `git log` for similar bugs.

```
fix(<area>): <one-line summary> (BUG-<id>)

Repro:    <steps>
Expected: <what should happen>
Actual:   <what happened>
Gap:      <the precise diff this commit closes>

<one-line root-cause class: regression of <commit> | fork-drift in <file> | new>
<one-line cross-impact note — which flows verified clean>

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Update the BUGS.md row with: root cause one-liner (the **Gap**), fix commit sha (short), regression test path, status `fixed`.

### 11. Do NOT auto-push or open PRs

Per `CLAUDE.md`: pushing and opening PRs are explicit user actions. Leave the commit on the local branch and report the sha. The user decides whether to push.

## Output format — every fix-bug session ends with this block

The four-line frame is non-negotiable. Show it at the START (after step 3 boils it down) AND at the END (in this block). The Gap line is the load-bearing element of the whole skill — it's what gets tested, what gets commit-messaged, and what future-you searches for.

```
BUG-<id>
Severity: <critical|high|medium|low>
Bucket:   <regression|fork-drift|new>

Repro:    <steps>
Expected: <what should happen>
Actual:   <what happened>
Gap:      <the precise diff this commit closes>

Files touched: <count> (<list>)
Regression test: <path that asserts the Gap>
Commit: <short-sha>
Cross-impact verified: <list of flows walked>
```

Then `Skills: fix-bug` / `Agents:` / `Tools:` per the project's mandate (per `CLAUDE.md`).

## Memory awareness

Honour these existing project memories — they encode hard-won lessons about Jarvis:

- `feedback_extend_existing_channels.md` — when adding a frame/kind to a live flow, extend the existing channel; don't add a parallel one
- `feedback_fork_sync_gotcha.md` — `scripts/` is NOT auto-synced; `brain_kernel/` is (via upgrade.py)
- `feedback_overlay_state_isolation.md` — chat-backdrop frames must not clobber transient overlay state
- `feedback_claude_native_preference.md` — prefer Anthropic SDK native primitives
- `project_deployment_model.md` — 3-tier kernel → org-fork → users
- `project_memory_scope_model.md` — System/Org/User memory scopes

If your bug fix recreates a class of issue listed above, it's likely a duplicate symptom of a re-emerging pattern. Search BUGS.md for prior occurrences.

## What NOT to do

- Don't propose architectural rewrites in a fix-bug session. If the bug suggests one, log it as a separate row with status `wontfix` + linked plan doc.
- Don't fix multiple unrelated bugs in one commit. One BUG-id per commit; chain commits if needed.
- Don't skip the regression test "because the fix is obvious". Obvious fixes regress most often.
- Don't declare fixed without running both pytest AND npm build (when both apply).
- Don't push, open a PR, or merge without explicit user instruction.
