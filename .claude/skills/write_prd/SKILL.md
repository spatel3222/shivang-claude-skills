---
name: write_prd
description: Owns the PLAN phase. Check MASTER_TODO (exists? resume. done? stop.) → check SHIPPED (already built?) → write the plan or PRD doc → get approval → add to MASTER_TODO as PENDING. Handoff to /write_code for execution. Also generates full L1/L2/L3 PRDs and Jarvis Decision History.
---

# Write PRD Skill

## Role in the Flow
**This skill owns PLAN (steps 1–4). `/write_code` owns BUILD + WRAP.**

```
PLAN  ← YOU ARE HERE
  1. Read MASTER_TODO.md → task exists? resume it. already DONE? stop.
  2. Read SHIPPED.md → already built? if yes, stop.
  3. Write plan-<feature>.md or PRD → present to user → get approval
  4. Add row to MASTER_TODO.md → status: PENDING

BUILD + WRAP → hand off to /write_code
```

**Never hand off to `/write_code` without explicit user approval on the plan.**

---


## Core Principle
**Understand first → Ask PRD level → Generate top-down → Validate bottom-up**

## Quality Principles (ENFORCED)
```
CLEAR      → No ambiguity, answers "so what?"
CONSISTENT → Same terminology across all specs
NO DUPES   → Info lives in ONE place only
CONCISE    → No fluff, every word earns its place
```

## When to Use This Skill

Use this skill when user mentions:
- "PRD", "product requirements", "feature spec"
- New feature for Mirai360
- "Document this feature"
- "Write requirements for..."

## Execution Framework

### Phase 1: Understand the Feature

**ASK THESE QUESTIONS FIRST:**

1. **Feature name?** - What are we building?
2. **Problem solved?** - What pain point does this address for the lawyer?
3. **Product location?** - Where does it fit? (Prepare / Research / Create / Settings)
4. **Primary user?** - Super Admin, Associate, or both?

**WAIT for answers before proceeding.**

### Phase 1.5: Parallel Discovery Fan-Out (read-only)

Before asking the user anything else, ground the plan in **what already exists**. Dispatch 3 read-only Explore agents in a single message (parallel) so the plan is informed by codebase reality, not assumptions.

**Why this matters:** plans written without discovery either duplicate existing work, miss shared contracts, or under-scope risk. Discovery is read-heavy and parallelizes exceptionally well — three agents cost the same wall-clock time as one and triple the coverage.

**Dispatch all three in a single message (parallel):**

| Agent | Job | Returns |
|---|---|---|
| **Codebase map** | Where similar features live, naming conventions, framework patterns to mirror | ≤200 words: file paths + 1-line purpose each |
| **Risk surface** | Shared modules, contracts, locked decisions this feature would touch | ≤200 words: file/decision + impact level |
| **Prior work** | Scan `Code/DevLog/SHIPPED.md` + recent DevLog entries for related implementations or deferred items | ≤200 words: shipped/deferred items + plan-doc links |

**Use the standard agent brief template** (see "Agent Brief Template" section below). Each brief must explicitly tell the agent what to read, what NOT to read, and what to return — otherwise discovery agents drift into recommendations or rewrite history.

**After all three return:** synthesize findings into a "Discovery Findings" section in the plan doc. This becomes part of the contract that build agents read later.

**Skip Phase 1.5 only when:** task is a literal one-line change, or user explicitly says "skip discovery" (rare — push back unless they're confident).

### Phase 2: Ask PRD Level

**ASK THIS QUESTION:**

```
What level of PRD do you want?

1. Main PRD Only
   → L1/L2 features, user journey, assumptions (2 pages max)

2. L3 High-Level
   → Main PRD + L3 specs with context, acceptance criteria, dependencies
   → AI agent needs to figure out implementation details

3. L3 Granular
   → Main PRD + L3 specs with full UX/API/FE/Test specifications
   → AI agent can build standalone with zero guesswork
```

**WAIT for answer before proceeding.**

### Phase 3: Validate Scope

Before writing PRD, confirm:
- Is this a feature (not a bug fix or enhancement)?
- Which module does it belong to?
- Any dependencies on existing features?
- Reference existing PRDs if related

### Phase 4: Generate PRD

Use this exact template:

```markdown
# [Feature] MVP PRD

## L1 Features
+ [Feature Group 1]
+ [Feature Group 2]
+ [Feature Group 3]
+ [Feature Group 4]
+ [Feature Group 5]

## L2 Features

### [Feature Group 1]
+ Capability 1
+ Capability 2
+ Capability 3

### [Feature Group 2]
+ Capability 1
+ Capability 2

---

## User Journey
- Step 1 → Step 2 → Step 3 → Step 4

---

## Visual (if UI involved)
[ASCII wireframe or flow diagram - only when helpful]

---

## Custom Sub-Agents / Services (if applicable)
+ *AgentName*: Description

---

## Assumptions
- Assumption 1
- Assumption 2

## Open Questions (optional)
**[Date] - [Context]**
- Question 1?
- Question 2?

---

## Changelog (for updates only)

| Version | Date | Changes |
|---------|------|---------|
| v2 | [Date] | [Brief summary of changes] |
| v1 | [Date] | Initial PRD |
```

---

## L3 Spec Generation (If Selected)

### Output Structure (Lawyer PRDs)
```
[Feature]_PRD/
├── [Feature]_MVP_PRD.md           # Main PRD (L1/L2 format)
├── README.md                       # Index with dependency graph
└── L3_Specs/
    ├── 01_[L2Capability]/
    │   └── SPEC.md                 # Standalone spec
    ├── 02_[L2Capability]/
    │   └── SPEC.md
    └── ...
```

### Output Structure (Court PRDs)
```
[##_ModuleName]/
├── [ModuleName]_MVP_[DDMMYY]_PRD.md    # Main PRD (L1/L2 format)
└── L3_Specs/
    ├── 01_[L2Capability]/
    │   └── Court_[L1]_[L2]_[L3]_PRD_[DDMMYY].md
    ├── 02_[L2Capability]/
    │   └── Court_[L1]_[L2]_[L3]_PRD_[DDMMYY].md
    └── ...

Example:
01_Document_Ingestion_Processing/
├── Document_Ingestion_MVP_090126_PRD.md
└── L3_Specs/
    ├── 01_Petition_Document_Ingestion/
    │   └── Court_DocIngest_Petition_Ingest_PRD_090126.md
    ├── 02_OCR_Document_Processing/
    │   └── Court_DocIngest_OCR_DocProc_PRD_090126.md
    └── ...
```

### Hierarchy
```
L1 = Feature Group (e.g., "Playbook Builder")
L2 = Capability (e.g., "Create new playbook")
L3 = Atomic Task (e.g., "Playbook name input field with validation")
     ↳ Each SPEC.md targets one L2 capability, broken into L3 atomic tasks
```

### Key Principle: Each SPEC.md is Self-Contained
AI coding agent receives ONE file with ALL context needed:
- No "see PRD.md for details"
- No "refer to other specs"
- Everything in one place

### Phase 5: Phased L3 Generation

**For L3 High-Level or L3 Granular:**

1. Generate Main PRD first
2. Create TODO list with all L2 capabilities
3. For each L2 capability (one at a time):
   - Mark as "in_progress"
   - Classify type: UI-only | API-only | Full-stack
   - Generate SPEC.md
   - Mark as "completed"
   - Proceed to next

**Why phased?** Detailed specs can be lengthy. Phased approach keeps context clean.

### Selective Content Based on Feature Type
| Feature Type | SPEC.md Sections |
|--------------|------------------|
| UI-only | Context + Acceptance + UX + FE + Tests |
| API-only | Context + Acceptance + API + Tests |
| Full-stack | Context + Acceptance + UX + API + FE + Tests |

### Phase 6: Bottom-Up Validation (MANDATORY)

After ALL L3 specs generated:

```
1. STANDALONE CHECK
   For each SPEC.md:
   - Can AI agent build this without reading other files?
   - Are all required inputs defined?
   - Are all outputs specified?

2. CONSISTENCY CHECK
   Across all specs:
   - Same terms used for same concepts?
   - API contracts match between caller/callee?
   - Data models align across specs?

3. DUPLICATION CHECK
   - Any content repeated across specs?
   - If yes → extract to Main PRD or single source

4. DEPENDENCY CHECK
   - Draw dependency graph
   - Verify no circular dependencies
   - Verify build order is achievable

5. FIX & FINALIZE
   - Update any failing specs
   - Update README.md with final dependency graph
   - Mark PRD package as complete
```

---

## L3 High-Level SPEC.md Template

```markdown
# [L2 Capability Name] - Spec

## Context
**Parent:** [L1 Feature Name]
**What:** [One-line description]
**Why:** [User problem solved]
**Where:** [Route/component location]

## Acceptance Criteria
- [ ] AC1: [Testable criterion]
- [ ] AC2: [Testable criterion]
- [ ] AC3: [Testable criterion]

## Dependencies
- [Other specs this depends on]
- [External APIs/services needed]

## Implementation Hints
- [Key patterns to follow]
- [Existing code to reference]

## Out of Scope
- [Explicitly excluded]
```

---

## L3 Granular SPEC.md Template

```markdown
# [L2 Capability Name] - Standalone Spec

## 1. Context
**Parent Feature:** [L1 Feature Name]
**What:** [One-line description]
**Why:** [User problem this solves]
**Where:** [Location in app - route, component path]

## 2. Tech Stack (Auto-filled from app_spec.txt)
[Read from project's app_spec.txt file]

## 3. Acceptance Criteria
- [ ] AC1: [Specific, testable criterion]
- [ ] AC2: [Specific, testable criterion]
- [ ] AC3: [Specific, testable criterion]

## 4. Dependencies
**Must Complete First:**
- [ ] [Other L3 spec this depends on]

**External APIs/Services:**
- [API/service needed]

## 5. UX Specification (if UI-facing)
### User Flow
[Entry Point] → [Step 1] → [Step 2] → [Success State]
                    ↓
              [Error State]

### Wireframe
┌─────────────────────────────────┐
│  [Component Layout]             │
├─────────────────────────────────┤
│  [Interactive Element]          │
│  [Form Fields / Data Display]   │
└─────────────────────────────────┘

### States
| State | Behavior |
|-------|----------|
| Default | [description] |
| Loading | [skeleton/spinner] |
| Empty | [empty state message] |
| Error | [error handling] |
| Success | [confirmation] |

## 6. API Specification (if has backend)
### Endpoint
`[METHOD] /api/v2/[resource]`

### Request
interface RequestBody {
  field: string;
  optionalField?: number;
}

### Response
interface Response {
  success: boolean;
  data: { id: string; /* fields */ };
  message: string;
}

### Errors
| Code | Condition | Message |
|------|-----------|---------|
| 400 | Invalid input | "Validation error: {field}" |
| 401 | Unauthorized | "Authentication required" |
| 404 | Not found | "Resource not found" |

### Database Model (if new/modified)
class ModelName(Document):
    field: str
    created_at: datetime
    class Settings:
        name = "collection_name"

## 7. Frontend Specification (if has UI)
### Component Path
`src/app/(protected)/[route]/components/[ComponentName].tsx`

### Component Structure
[ParentComponent]/
├── [ChildComponent]
│   ├── props: { data: Type, onAction: () => void }
│   └── state: { isLoading, error }
└── [SiblingComponent]

### Props Interface
interface [ComponentName]Props {
  prop1: string;
  onAction: (data: Type) => void;
}

### Styling Notes
- Use Tailwind classes
- Shadcn components: [list components to use]
- Responsive: Mobile-first

## 8. Test Cases
### Unit Tests
describe('[ComponentName]', () => {
  it('should [expected behavior 1]', () => {});
  it('should [expected behavior 2]', () => {});
});

### Integration Tests
- [ ] API returns correct data
- [ ] Component renders with API data
- [ ] Error states display correctly

### E2E Scenario
Given [precondition]
When [user action]
Then [expected result]

## 9. Out of Scope
- [Explicitly excluded for this spec]

## 10. Notes for AI Agent
- [Any gotchas, patterns to follow, or context from codebase]
- [Reference to existing similar implementations]
```

---

## README.md Template (for L3 packages)

```markdown
# [Feature Name] - PRD Package

## Main PRD
→ [[Feature]_MVP_PRD.md]([Feature]_MVP_PRD.md)

## L3 Specs (for AI Coding Agents)

### Build Order (Dependency Graph)
┌─────────────┐
│ 01_Spec     │ ← Start here (no dependencies)
└──────┬──────┘
       │
┌──────▼──────┐
│ 02_Spec     │ ← Depends on 01
└──────┬──────┘
       │
┌──────▼──────┐     ┌─────────────┐
│ 03_Spec     │────▶│ 04_Spec     │ ← Can run in parallel
└─────────────┘     └─────────────┘

### Spec Index
| # | Spec | Type | Dependencies | Status |
|---|------|------|--------------|--------|
| 01 | [Name](L3_Specs/01_Name/SPEC.md) | Full-stack | None | ⬜ |
| 02 | [Name](L3_Specs/02_Name/SPEC.md) | UI-only | 01 | ⬜ |
| 03 | [Name](L3_Specs/03_Name/SPEC.md) | API-only | 01, 02 | ⬜ |

### Quick Start for AI Agent
1. Pick next uncompleted spec with resolved dependencies
2. Read the SPEC.md file
3. Implement following the spec
4. Mark as ✅ when done
```

---

## Versioning

When updating an existing PRD:

**Markers (at line end):**
| Marker | Meaning |
|--------|---------|
| `🆕` | New in this version |
| `📝` | Modified from previous |
| `⚡` | Breaking/major change |

**Rules:**
+ Add markers at end of changed lines
+ Remove markers after team sign-off
+ Keep only last 3 versions in Changelog
+ Changelog goes before References section

**Example:**
```markdown
## L1 Features
+ Client Management
+ Matter Management (Optional) 🆕
+ Case Management with eCourts Integration 📝
+ Hearing & Cause List Tracking 🆕
```

## Constraints

| Rule | Detail |
|------|--------|
| Max length | 2 pages |
| L1 items | 5-7 max |
| L2 items | 3-5 per group |
| Bullets | Use `+` not `-` |
| Agents | `*CamelCaseAgent*` format |
| Filename (Lawyer) | `[Feature]_MVP_[DDMMYY]_PRD.md` |
| Filename (Court L3) | `Court_[L1]_[L2]_[L3]_PRD_[DDMMYY].md` |
| User Journey | Simple bullets, not detailed paragraphs |
| Visuals | Only when helpful (preferred not required) |
| Change markers | `🆕 📝 ⚡` at line end (remove after sign-off) |
| Changelog | Last 3 versions only, before References |

## File Location

**Lawyer PRDs:**
```
/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Docs/Product/PRD/Lawyer/
```

**Court PRDs:**
```
/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Docs/Product/Courts/PRD/
```

## Naming Convention

### Lawyer PRDs (Standard)
`[FeatureName]_MVP_[DDMMYY]_PRD.md`

Examples:
- `Timeline_MVP_051225_PRD.md`
- `BulkExport_MVP_051225_PRD.md`
- `JudgeAnalysis_MVP_051225_PRD.md`

### Court PRDs (L1/L2 Module Level)
`[ModuleName]_MVP_[DDMMYY]_PRD.md`

Examples:
- `Document_Ingestion_MVP_090126_PRD.md`
- `AI_Analysis_MVP_090126_PRD.md`

### Court L3 Specs (Granular)
`Court_[L1]_[L2]_[L3]_PRD_[DDMMYY].md`

Pattern: `Court_[L1Short]_[L2Short]_[L3Short]_PRD_[DDMMYY].md`

**Abbreviation Rules:**
- Use CamelCase shortened names
- Remove common words (Processing, Management, System)
- Max ~15 chars per level

Examples:
- `Court_DocIngest_OCR_HighVolScan_PRD_090126.md`
- `Court_AIAnalysis_EntityExtract_PetitionParse_PRD_090126.md`
- `Court_CaseMgmt_Workflow_EFileRoute_PRD_090126.md`
- `Court_Security_Auth_MFA_PRD_090126.md`
- `Court_Search_Knowledge_PrecedentLib_PRD_090126.md`

**L3 Spec Location:**
```
[Module]/L3_Specs/[##_FolderName]/Court_[L1]_[L2]_[L3]_PRD_[DDMMYY].md
```

## Reference PRDs

Look at these for tone and structure:
- `Playbook_MVP_03122025_PRD.md`
- `Canvas_Editor_MVP_03122025_PRD.md`
- `Research_MVP_01122025_PRD.md`

## Agent Brief Template (for Phase 1.5 Discovery)

Every dispatched agent — discovery or build — gets a self-contained brief. The brief is the agent's entire world; it cannot ask follow-up questions and does not see the parent's conversation. Write it like a contract.

```
You are running Phase 1.5 Discovery for the plan: [feature name].

## What to read (priority order)
1. CLAUDE.md (auto-loaded — gives you project flow, file map, locked decisions)
2. [exact file paths the agent should read for its job]
3. [exact file paths for cross-reference]

## What NOT to read
- DevLog completion entries unrelated to this feature (drift)
- Sibling agents' worktrees (you don't have access; don't try)
- The parent's conversation history (you can't see it; don't fabricate)
- Files outside [scoped subtree]

## What to return — STRUCTURED, exactly these 4 sections

Context flows through artifacts, not conversation. Your return is a structured artifact the parent can synthesize without re-reading the codebase. ≤200 words total.

### Inspected
- [file path] — [why you read it, 1 line]

### Findings
- [in the format the brief specified — usually a table of fact rows]
- Facts only: file paths, names, signatures, what exists

### Risks
- [Anything concerning you noticed: ambiguous APIs, missing modules, conflicting decisions, deprecated patterns]
- "None observed" is a valid answer if true

### Not Found
- [Things the brief asked about that you could not find — explicit gaps]
- "I did not find X" beats inventing X

## What NOT to return
- **Do NOT propose implementation patterns, recommendations, or "patterns for new tool" sections** — that is the parent's synthesis job after reading all 3 discovery reports. Editorialising poisons synthesis because it pre-commits the parent to one agent's worldview.
- Do NOT recap the brief or the plan back to the parent
- Do NOT prose-summarize the codebase — return facts in the 4 sections above

## Constraints
- Read-only: do NOT modify any files
- Do NOT spawn further sub-agents
- If your scope is unclear, return "scope unclear: [why]" rather than guessing
```

The "What NOT to read" section is the leakage guard. Without it, agents wander into adjacent files, summarize the whole repo, and bloat the parent's context window when they return. Be explicit.

## Visual Guidelines

When visuals are needed, use ASCII box-drawing:
```
┌─────────────┐     ┌─────────────┐
│  Step 1     │────▶│  Step 2     │
└─────────────┘     └─────────────┘
```

Characters: `┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼ ▶ ▼`

## Output Format

End every PRD session with:
```
Skills: write_prd
Agents: None
Tools: Write
TimeStamp: [Date Time] (India Standard Time)
```

---

---

## Jarvis Project PRDs

Use this section when writing or updating PRDs in the `jarvis` project (`Product/` folder).

### Before writing a Jarvis PRD
1. Read all existing PRDs in `Product/` — never duplicate content; cross-link instead
2. Read `Product/ARCHIVE-decisions-v1.md` — historical context only (frozen, do not update it)
3. Read `Code/DevLog/SHIPPED.md` — confirm what's already built before speccing it as new

### Jarvis PRD file location
```
Product/
├── jarvis_prd_v1.md              ← Kernel engine spec (The HOW)
├── jarvis_product_brief_v1.md    ← Business one-pager (The WHAT)
├── jarvis_ui_v1.md               ← UI strategy + component vocabulary
├── jarvis_gtm_v1.md              ← Go-to-market strategy
└── ARCHIVE-decisions-v1.md       ← Frozen. Historical decisions. Read-only.
```

Naming: `jarvis_<topic>_v<N>.md`. Version bump only on owner approval.

### Mandatory section — Decision History

Every Jarvis PRD must have this section at the bottom. Append decisions; never rewrite.

```markdown
## Decision History

Significant architectural or product decisions that shaped this PRD. Append; never rewrite.

| Decision | What changed | Rationale |
|---|---|---|
| [decision name] | [what was decided] | [why — constraint, tradeoff, or incident] |
```

**When to append a row:**
- An architectural direction is chosen over an alternative (e.g., 4 layers not 3)
- A feature or approach is explicitly deferred with a reason
- A prior decision is reversed — log both the reversal and why

### Bookkeeping after writing a Jarvis PRD
- If the PRD introduces new buildable features: add rows to `Code/DevLog/MASTER_TODO.md` (status: PENDING)
- If updating an existing PRD: append to its `## Decision History` section, do not overwrite prior entries

### Jarvis UI stack — NEVER recommend Streamlit for new UI work

The Jarvis project has two separate UI systems. Know which one a task belongs to:

| System | What | Port | Path |
|---|---|---|---|
| **Custom playground (PRIMARY)** | React + Vite + Shadcn UI — the real runtime surface | `localhost:5173` | `Code/jarvis-ui-protocol/` |
| **Streamlit playground (LEGACY dev tool only)** | `playground.py` — chat + trace sidebar for kernel REPL | `localhost:8501` | `brain-kernel/playground.py` |

**Rule:** any new UI feature, admin panel, debug surface, or workflow screen goes in the **React/Vite** app (`jarvis-ui-protocol/`). Never recommend Streamlit for new UI work.

**Adding a new page to the React app:**
- Add a new entry in `vite.config.ts` `rollupOptions.input` (e.g., `admin: path.resolve(__dirname, 'admin.html')`)
- Create `admin.html` at repo root (copy `index.html`, change entry script)
- Create `src/admin/AdminApp.tsx` + `src/admin/main.tsx`
- Access at `http://localhost:5173/admin.html`

**Existing Vite entry points (as of 2026-05-03):**
- `index.html` → `src/playground/main.tsx` (PlaygroundApp) — the main kernel dev surface
- `renderer.html` → `src/renderer/main.tsx`
- `demo.html` → `src/demo/main.tsx`

**Shadcn components available:** Button, Card, Input, Separator, ScrollArea, InputOTP + all renderer components in `src/renderer/components/`.

---

*Skill Version: 2.5*
*Last Updated: 2026-05-05*
*Change: (1) Phase 1.5 Parallel Discovery Fan-Out (3 read-only Explore agents). (2) Leakage-guarded brief template (What-to-read / NOT / What-to-return / NOT-to-return). (3) Anti-editorialising rule (no implementation patterns from individual discovery agents — that's parent's synthesis job). (4) Structured 4-section handback for discovery agents: Inspected / Findings / Risks / Not Found — context flows through artifacts, not conversation.*
