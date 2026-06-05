---
name: write_code
description: Owns BUILD + WRAP. Requires an approved plan from /write_prd already in MASTER_TODO as PENDING. Flips status to IN_PROGRESS, codes the feature, then wraps: appends to SHIPPED.md, marks MASTER_TODO ✅ DONE, writes completion log. Never starts without an approved plan.
---

# Write Code Skill — Jarvis

## Role in the Flow
**This skill owns BUILD + WRAP (steps 5–9). `/write_prd` owns PLAN.**

```
PLAN  → done by /write_prd. Plan file exists. MASTER_TODO row is PENDING.

BUILD ← YOU START HERE
  5. Flip MASTER_TODO → IN_PROGRESS
  6. Code it (phased, parallel agents, atomic steps)

WRAP
  7. Append to SHIPPED.md
  8. Mark MASTER_TODO → ✅ DONE
  9. Write YYYY-MM-DD-<topic>.md (surprises + deferred only)
```

**Do not start if no approved plan exists. Send user to `/write_prd` first.**

---

## How to find WHAT to read, do, and write

**Step 1 — Find the task:**
Read `Code/DevLog/MASTER_TODO.md`.
- Look for a row with status `IN_PROGRESS` → that's your task. Resume it.
- If none `IN_PROGRESS`, look for `PENDING` with a plan file linked → confirm with user before starting.
- If no plan file exists → stop. Tell user to run `/write_prd` first.

**Step 2 — Read the plan:**
Open `Code/DevLog/plan-<feature-slug>.md`.
- This is the contract. Read all sections: architecture, file layout, contracts, phases, acceptance criteria.
- Also read: `Code/brain-kernel-and-forks/brain-kernel/Spec/tech_spec.md` (relevant sections only)
- Also read: `Code/DevLog/SHIPPED.md` — understand what's already live that this touches

**Step 3 — Do the work:**
Execute phases in order. Lock contracts first if dispatching parallel agents. One agent per disjoint file subtree.

**Step 4 — Write the wrap:**
- Append a section to `Code/DevLog/SHIPPED.md` — what shipped, plan/log links, key constraints
- Update `Code/DevLog/MASTER_TODO.md` — mark row ✅ DONE
- Write `Code/DevLog/YYYY-MM-DD-<topic>.md` — surprises, deviations, deferred items only (not a recap)

---

## Core Principle
**Plan exists and is approved. Code second. Dispatch parallel agents for independent phases. Never deviate from locked contracts without flagging.**

---

## Prerequisites (MANDATORY before any code)

1. **Plan file exists** — `Code/DevLog/plan-<feature-slug>.md` written and approved by user
2. **MASTER_TODO row is PENDING** — if missing, stop and run `/write_prd` first
3. **Read the kernel contract** — `Product/jarvis_kernel_contract_v1.md` (the 4 contracts: schema / fork-sync / capability / runtime + the new-vertical recipe). MANDATORY before touching kernel @tools, render_component, fork sync, capability gate, venv, or launching a new vertical fork.
4. **Read the tech spec** — `Spec/tech_spec.md`
5. **Read relevant product docs** — `Product/jarvis_prd_v1.md`, `Product/jarvis_ui_v1.md`
6. **Use Shadcn UI** for all UI work — no custom CSS components
7. **Use TodoWrite** to track phases in real time

---

## Execution Framework

### Phase 0: Context Gathering & DevLog Setup

#### STEP 1: Read existing docs (MANDATORY)

For **Jarvis** projects, always read in this order:
```
Product/jarvis_kernel_contract_v1.md       ← 4 kernel contracts + new-vertical recipe (FIRST)
Code/DevLog/MASTER_TODO.md                 ← check if task exists + current status
Code/DevLog/SHIPPED.md                     ← check if feature already built
Code/DevLog/README.md                      ← workflow rules
Spec/tech_spec.md                          ← kernel architecture, contracts, P0/P1 priorities
Product/jarvis_prd_v1.md                   ← kernel abilities, build priority
Product/jarvis_ui_v1.md                    ← UI protocol strategy, locked decisions, phases
```

Identify:
- Relevant stack sections for this task
- Locked decisions — do NOT re-open these
- Affected modules and files
- Any prior DevLog entry for this task (duplicate check)

#### STEP 1.5: Check for plan doc handoff

If a `plan-<feature-slug>.md` exists in `Code/DevLog/` for this task, read it fully — it is the contract. Do not deviate from its locked decisions without flagging and getting approval. Update `MASTER_TODO.md` status to `IN_PROGRESS` before writing the first line of code.

#### STEP 1.7: Consult Knowledge Graph (if present)

```
Check: graphify-out/GRAPH_REPORT.md
Check: graphify-out/graph.json
```

If present, use `graphify query / path / explain` CLI instead of grepping blindly. After code changes: `graphify update .`

If absent and the codebase requires many Glob/Grep calls to navigate: suggest user runs `/graphify` in a fresh session.

#### STEP 2: Conflict detection

Read all `IN_PROGRESS` DevLog entries. Extract their **Files to Touch** lists. If any file overlaps with the current task: flag the conflict, do not proceed in parallel.

#### STEP 3: Write DevLog entry (MANDATORY — before any code)

```
Read: DevLog/TEMPLATE.md    ← copy this block exactly
```

**Filename convention:** `YYYY-MM-DD-<topic-slug>.md` (e.g., `2026-05-03-ui-rendering-skill-login-otp-chat.md`). Never use a bare `YYYY-MM-DD.md` for Jarvis — the topic slug is required.

**Duplicate check (REQUIRED before creating):**
- **Entry exists — PENDING** → update to IN_PROGRESS, resume
- **Entry exists — IN_PROGRESS** → resume directly, no new entry
- **Entry exists — DONE** → STOP, confirm with user before reopening
- **No match** → create new file, fill all sections

Fill ALL sections:
- **Request Summary** — what was asked and why
- **Tech Spec References** — which sections + module paths
- **Files to Touch** — every file to be modified or created
- **To-Do List** — atomic, executable steps
- **Implementation Plan** — approach + steps + acceptance criteria
- **Status** = IN_PROGRESS

**DO NOT write any code until this entry is complete.**

#### STEP 4: Git (when applicable)

```bash
git config user.email "shivang.patel@gmail.com"
git config user.name "Shivang Patel"

git checkout -b [type]/[short-description]   # feat/, fix/, chore/, refactor/
```

Skip git steps if the project has no remote (e.g., early Jarvis work). Do not force git when not set up.

#### STEP 5: UI brand context (if UI work)

For **Jarvis UI Protocol** (`Code/jarvis-ui-protocol/`):
- Token source of truth: `Product/jarvis_ui_v1.md` §5 (Style Dictionary taxonomy)
- Component source: `research/components/<name>/tokens.json`
- Light theme only for v1; dark mode deferred
- Desktop-web optimized; mobile-web via Tailwind responsive classes

For other projects: read the project's brand-guidance doc before writing any UI code.

#### STEP 6: Shadcn component plan (if UI work)

Write inline hand-rolled Shadcn-compatible components when `npx shadcn add` is not available (no terminal in context). Add deps to `package.json` manually and note for the user to run `npm install`.

```typescript
// GOOD
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// BAD — custom HTML/CSS components
<div className="custom-button">Click</div>
```

**CRITICAL**: Always complete Steps 1–5 before coding. Present the DevLog entry and wait for approval.

---

### Pre-Dispatch Compliance Checklist (parent must echo verbatim before spawning agents)

Parallel dispatch is the highest-risk move in this skill. Two parallel agents writing incompatible code in the same tree will produce a broken merge that's painful to untangle. Before spawning any sub-agent, the parent (you) must explicitly confirm each item below in chat — out loud, not internally:

```
□ Plan file approved by user. Path: [plan-<slug>.md]
□ All shared contracts locked (wire format, type signatures, return shapes, file paths). Locations: [...]
□ Each agent's scope is a disjoint file subtree — no two agents write the same file. Subtrees: [...]
□ Each agent runs with `isolation: 'worktree'`. Reason: shared working tree under concurrent writes corrupts state.
□ Each brief includes What-to-read / What-NOT-to-read / What-to-return sections.
□ Verification command identified for post-merge run (see WRAP gate). Command: [...]
□ MASTER_TODO row flipped to IN_PROGRESS.
```

If any item is unchecked, do not dispatch. Either fix the gap or run sequentially in the parent's tree.

### Multi-Agent Parallel Dispatch

When a plan has **independent phases** (disjoint file trees, no shared contracts that could drift), dispatch parallel agents instead of executing sequentially.

**Rules:**
- Lock all contracts first (wire format, type signatures, return shapes) in the plan doc before spawning agents
- Each agent brief must be self-contained — include the locked contracts verbatim so agents can't drift
- **Each agent runs in an isolated git worktree** via `isolation: 'worktree'`. Why: parallel agents writing in a shared working tree corrupt each other's state; worktrees give each agent a private copy of the repo. The parent merges back after all agents complete.
- One agent per disjoint subtree: e.g., `research/` (Phase 0), `src/` (Phase 1+2), `brain_kernel/ui/` + `overrides/tools/` (Phase 3)
- Use `run_in_background: true` and `TodoWrite` to track progress
- After all agents complete: parent merges worktree branches back into the working branch, then does a **contract drift check** (read key files, compare schemas against Zod against Python signatures) on the merged tree
- If a worktree has no changes, it's auto-cleaned by the runtime. If it has changes, the runtime returns the path + branch — parent merges and deletes the worktree.

**Agent brief template (LEAKAGE-GUARDED):**
```
You are executing Phase [X] of [plan doc path] in an isolated worktree.

## What to read (priority order)
1. CLAUDE.md (auto-loaded — gives you project flow, file map, locked decisions)
2. The plan doc: [absolute path]
3. Tech spec sections: [exact paths + section names]
4. Reference inputs: [paths to schemas, screenshots, prior implementations]

## What NOT to read
- Sibling agents' worktrees (you don't have access; don't try)
- DevLog completion entries unrelated to this feature
- The parent's conversation history (you can't see it; don't fabricate context)
- Files outside your assigned subtree: [list out-of-scope paths]

## What to write
- Only files inside your assigned subtree: [list in-scope paths]
- Do NOT touch: MASTER_TODO.md, SHIPPED.md, DevLog/YYYY-MM-DD-*.md (parent owns these)

## What to return — STRUCTURED, exactly these 5 sections

Context flows through artifacts, not conversation. Your return is a structured artifact the parent uses to synthesize integration without re-reading every file. Keep it tight; the parent's context window is the bottleneck.

### Inspected
- [file path] — [why you read it, 1 line]

### Changed
- [file path] — [created | modified | deleted] — [1-line summary of what + why]

### Tests Run
- Command: [exact command run inside your worktree, e.g., `pytest tests/test_foo.py`]
- Result: [PASS / FAIL / SKIPPED — with count or error excerpt]
- If SKIPPED: state why (e.g., "no test infra in this slice", "env missing dep X"). Skipping is allowed; silent skipping is not.

### Risks
- [Anything you noticed during execution: drift from locked contract (with reason), ambiguous spec you had to interpret, missing dependency, performance concern, decision that conflicts with a sibling slice you can't see]
- "None observed" is a valid answer if true

### Diffs
- For each Changed file, append a unified diff (max 50 lines per file). Format:
  ```diff
  --- a/path/to/file
  +++ b/path/to/file
  @@ ... @@
  [diff body]
  ```
- For files larger than 50 changed lines: report path + line count + "see worktree for full diff"
- For pure-creation files >100 lines: skip diff, list class/function names instead

## What NOT to return
- Do NOT recap the plan back to the parent — parent already has it
- Do NOT prose-summarize what the feature does — Diffs section carries the truth
- Do NOT include unchanged files in Diffs section

## Locked contracts (reproduce verbatim — do NOT let yourself drift)
[paste contracts here]

## Constraints
- Stack: [stack]
- V1 limitations / deferred: [list]
- Tests must run successfully before you report DONE: [exact command]
```

The "What NOT to read/write" sections are the leakage and corruption guards. Without them, agents wander, summarize the whole repo when returning, write to MASTER_TODO concurrently and corrupt it, or fabricate parent context they never had.

---

### Phase Documentation (present before each phase)

```markdown
## Phase [X] — [Feature Name]

### Objective
[Single sentence]

### Prerequisites
- [ ] Tech spec read
- [ ] DevLog entry written (Files to Touch complete)
- [ ] Conflict check passed
- [ ] Locked contracts identified (no drift possible)
- [ ] User approval received

### Implementation Steps
1. [File: what changes — atomic]
2. [File: what changes — atomic]
3. [File: tests]

### Success Criteria
- [ ] [Measurable outcome]
- [ ] Tests pass: `pytest tests/` (Python) / `npm run build` (TS)
- [ ] No regressions in existing tests

### Testing Instructions
[Exact commands for user to run]
```

**STOP HERE — present plan, wait for approval before writing code.**

---

## Atomic Step Guidelines

**Valid:**
- "Add `render_component` @tool to `overrides/tools/render_component.py` — emits UISchema over WS, awaits ComponentResult"
- "Create `src/schemas/login.ts` — Zod schema mirroring `research/components/login/schema.json` payload contract"
- "Update `pyproject.toml` — add `fastapi>=0.110`, `uvicorn[standard]>=0.27`, `websockets>=12`"

**Invalid:**
- "Build the renderer"
- "Refactor all schemas"
- "Update the whole auth system"

---

## Questions Protocol (MANDATORY)

Before surfacing **any** unresolved question in a plan:

1. Check `Spec/tech_spec.md` — is it answered there?
2. Check all DevLog entries — was this decided in a prior session?
3. Check `Product/jarvis_prd_v1.md` and `Product/jarvis_ui_v1.md` — is it in the locked decisions table?
4. Check any companion plan doc (e.g., `TechDiscovery_plan.md`)

Only surface questions that are **genuinely absent** from all these sources. Asking about something already decided wastes the user's time and signals the docs weren't read.

---

## Error Handling Protocol

### If implementation deviates from plan
1. **STOP** immediately
2. Update DevLog with new approach
3. Get user approval for the change
4. Resume

### If user finds issues during testing
1. Document in DevLog **Completion Notes**
2. Fix, re-test, update DevLog
3. Do NOT mark DONE until acceptance criteria pass

---

## Communication Protocol

### Starting a phase
```
## Phase [X] — [Feature] Plan

[DevLog summary — Files to Touch, steps, approach]

**Unresolved Questions:** (only if genuinely absent from all docs)
- [Question]?

**Ready to proceed?**
```

### Completing a phase
```
## Phase [X] — Complete

**Built:**
- [Deliverable]

**Files:** [count] new, [count] modified

**Testing:**
1. [Command]
2. [Command]

**DevLog updated. Ready for your validation.**
```

---

## Quality Gates

### Code
- Matches the plan's locked contracts exactly
- Shadcn UI components only for UI work
- Async throughout for Python tools
- Type-safe (TypeScript strict; Python type hints)
- Fail-loud on validation errors (throw, don't swallow)

### Documentation
- DevLog entry written **before** any code
- Files to Touch list complete and accurate
- Completion Notes filled before marking DONE
- Acceptance criteria verified

---

## Phase 0 Checklist (Before Starting Any Work)

```
- [ ] Read Spec/tech_spec.md (relevant sections)
- [ ] Read Product/jarvis_prd_v1.md + jarvis_ui_v1.md (for Jarvis)
- [ ] Read all today's DevLog entries (conflict detection)
- [ ] Cross-checked all candidate questions against docs — none are already answered
- [ ] DevLog entry written (Status = IN_PROGRESS)
- [ ] User approval received on plan
- [ ] TodoWrite set up with all phases
- [ ] Contracts locked (wire format, type signatures, return shapes) before any parallel dispatch
- [ ] Shadcn component list identified (if UI work)
```

## Verification Gate (MANDATORY before WRAP) — invoke `/run-tester`

After phases complete and worktrees are merged, **DO NOT WRAP directly**. Hand off to the `run-tester` skill, which owns the full Jarvis regression suite (kernel pytest, schema-contract test, UI typecheck/build, headless E2E with visual baselines). Trigger it explicitly:

```
Skill: run-tester
```

Pass any `--scope` flag if the user specified one; otherwise default to `--scope=full`.

`/run-tester` will:

1. Run all four test surfaces
2. Classify failures (REAL / KNOWN-FAIL / RECURRING / VISUAL)
3. Auto-file new bugs in `Code/DevLog/BUGS.md` (or bump the Occurrences counter on existing rows — never duplicates)
4. Print a per-loop structured report
5. Ask the user: `[a]` auto-proceed (fix new bugs and re-run), `[s]` stay in loop (user guides), `[x]` stop

**Routing back from /run-tester:**

- If user picks `[a]` and `/run-tester` filed new bugs, `/run-tester` invokes **`/fix-bug`** (NOT `/write_code` — filed bugs don't have plans in MASTER_TODO; `/fix-bug` is the only skill that accepts BUG-N input without a plan). `/fix-bug` handles diagnose + fix + re-verification per its own contract. Control eventually returns to you (or to `/fix-bug` if /run-tester was invoked from /fix-bug) once the loop closes with PASS.
- If `[x]` is chosen, leave MASTER_TODO row as `IN_PROGRESS` (do NOT mark DONE) and surface to the user that the task is incomplete.
- If `/run-tester` reports PASS (no real fails; KNOWN-FAILs only is fine), proceed to WRAP.

*Wiring caveat (2026-05-17):* `/fix-bug` is currently the bug-fix entry point but lacks some of `/write_code`'s discipline (worktree isolation, parallel agent dispatch, structured handback). Long-term the project plans to bring `/fix-bug` up to `/write_code`'s standard or merge them. Until then, the [a] route lands in `/fix-bug` by design.

**Why the gate is now a skill, not a command list:** test surfaces drift (we added contract tests + e2e mid-2026, may add visual-diff later). One source of truth ensures every fix gets the same battery. Recurrence-counter logic, auto-file dedup, and KNOWN-FAIL acceptance are all encoded in `/run-tester` — `/write_code` doesn't reimplement them.

**Marking SHIPPED while tests fail destroys SHIPPED.md as a source of truth.** Don't.

For UI changes that REQUIRE browser interaction the e2e suite can't simulate (drag-drop, file upload, etc.), `/run-tester` will surface the gap and the user walks the golden path manually. "Started the dev server" is not enough — actually use the feature.

## After Implementation Complete Checklist

```
- [ ] Verification command run in parent's tree post-merge; output captured in DevLog (FIRST gate)
- [ ] All To-Do items marked [x] in DevLog entry
- [ ] Completion Notes filled in DevLog entry (includes verification output)
- [ ] Status set to DONE in DevLog entry (YYYY-MM-DD-<topic-slug>.md)
- [ ] SHIPPED.md updated — append new section with what shipped + plan/log links
- [ ] MASTER_TODO.md row marked ✅ DONE
- [ ] Contract drift check done (schemas match across layers)
- [ ] Acceptance criteria verified (manual or automated)
- [ ] User validation received before next phase
- [ ] Git commit + PR (if repo has remote)
- [ ] Worktrees from parallel dispatch all merged + cleaned up (no stragglers)
- [ ] **If this change was deployed (or altered scaling/infra/DB): invoke `/deployment-cost-analysis`** — post-deploy cost guardrail
```

**Post-deploy cost guardrail — invoke `/deployment-cost-analysis`:** If the wrapped change was
deployed, or touched scaling, infrastructure, schedulers, or the database, hand off to
`/deployment-cost-analysis` after WRAP. Why: deploys silently carry forward expensive scaling and
DB settings (always-on instances, uncapped Atlas auto-scaling), and the dollar console lags
24-48h, so a cost regression runs for days unseen. That skill audits the config, validates real
spend via near-real-time instance-time, and — with user consent — applies low-risk fixes or hands
code changes back here. Skip it only for pure local/code-only changes that were not deployed.

---

## Jarvis Project Reference

| Item | Path |
|---|---|
| Universal task list | `Code/DevLog/MASTER_TODO.md` |
| Execution changelog | `Code/DevLog/SHIPPED.md` |
| Plan template | `Code/DevLog/PLAN_TEMPLATE.md` |
| Feature plans | `Code/DevLog/plan-<feature-slug>.md` |
| Completion logs | `Code/DevLog/YYYY-MM-DD-<topic>.md` |
| DevLog rules | `Code/DevLog/README.md` |
| Kernel tech spec | `Code/brain-kernel-and-forks/brain-kernel/Spec/tech_spec.md` |
| PRD | `Product/jarvis_prd_v1.md` |
| UI Protocol | `Product/jarvis_ui_v1.md` |
| UI renderer | `Code/jarvis-ui-protocol/` |
| Override tools | `Code/brain-kernel-and-forks/brain-kernel/overrides/tools/` |
| Override skills | `Code/brain-kernel-and-forks/brain-kernel/overrides/skills/` |
| Reference screenshots | `Code/Assets/web-captures/<Component>/{desktop,mobile-web}/` |
| Research artifacts | `Code/jarvis-ui-protocol/research/components/<name>/` |

---

**Remember: DevLog first, code second. Read before asking. Lock contracts before parallelizing.**

*Skill Version: 3.2*
*Last Updated: 2026-05-05*
*Framework: Jarvis — DevLog-First, Multi-Agent Parallel, Protocol-Driven UI*
*Change: (1) Worktree isolation mandatory for parallel agents (`isolation: 'worktree'`). (2) Pre-Dispatch Compliance Checklist — parent must echo verbatim before spawning. (3) Verification Gate mandatory before WRAP — tests/build run in parent's tree post-merge, output captured in DevLog. (4) Leakage-guarded brief: What-to-read / NOT / What-to-write / NOT. (5) Structured 5-section handback: Inspected / Changed / Tests Run / Risks / Diffs — context flows through artifacts, not conversation; parent synthesizes integration without re-reading every file.*
