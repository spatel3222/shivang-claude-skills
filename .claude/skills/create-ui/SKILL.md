---
name: create-ui
description: Design-focused agent for UI creation and modification. Accepts URLs (Chrome MCP screenshot — Playwright fallback), Figma links (Figma MCP), or text descriptions to understand current state. Presents design options, component states, and layout decisions before any code is written. Hands off to /write_code for implementation. No DevLog, no git — pure design.
---

# Create UI Skill — LegalAI Design Agent

## Purpose
Design-focused agent for UI creation and modification. Presents design options, states, and layout decisions **before** any code is written. Hands off to `/write_code` for implementation.

## When to Use
- Any UI change (new component, layout update, styling fix)
- User invokes `/create-ui`
- Modifying existing UI components

## What This Skill Does NOT Do
- No DevLog entries (handled by `/write_code`)
- No git operations (handled by `/write_code`)
- No commits or PRs (handled by `/write_code`)
- No implementation code — output is a design spec

---

## Execution Framework

### Step 1: Read Brand Guidance (MANDATORY)
```
Read: MiraiCodeBots/Spec/brand-guidance.md
```
Confirm adherence to:
- Colors: Navy `#1B365D`, Tech Accent `#2E86C1`, Success `#28B463`, Gray `#566573`, Background `#FAFBFC`
- Typography: Inter font, correct size/weight per style
- Spacing: 8px grid (xs=8, sm=16, md=45, lg=90, xl=135)
- Borders: `1px solid rgba(27,54,93,0.05)`, cards `rounded-[12px]`, buttons `rounded-[6px]`
- Shadows: minimal — prefer borders over box-shadow
- Transitions: `0.2s ease`

### Step 2: Explore Current Implementation

Detect what the user provided and route accordingly:

**Input A — URL provided (localhost, deployed link, or any http/https URL):**
Use Chrome MCP (primary) to capture the current state as the "before" baseline:
```
mcp__chrome-devtools__navigate_page → the provided URL
mcp__chrome-devtools__take_screenshot → save as "before" snapshot
mcp__chrome-devtools__take_snapshot → get accessibility tree for DOM structure
```
**Fallback:** if Chrome MCP is unavailable, use `mcp__playwright__browser_navigate` / `browser_take_screenshot` / `browser_snapshot`.
This gives you the real rendered state — colors, spacing, layout, responsive behavior — not just what the code says it should look like.

**Input B — Figma URL provided (figma.com/design/... or figma.com/make/...):**
Use the Figma MCP plugin to pull the design context:
```
mcp__claude_ai_Figma__get_design_context → extract code + screenshot + hints
mcp__claude_ai_Figma__get_screenshot → visual reference of the design
```
Parse fileKey and nodeId from the URL (convert `-` to `:` in nodeId). The Figma output is a reference, not final code — adapt to our stack and brand system.

**Input C — Text description or notation (no link):**
Read the component(s) from the codebase directly:
- Read the file(s) mentioned or grep for the component name
- Identify the parent layout, sibling components, and data flow
- If the dev server is running, still try a Chrome MCP screenshot for visual context (fallback: Playwright)

**In all cases, also do:**
- Identify the parent layout, sibling components, and data flow
- Note existing patterns (how similar components are built in the codebase)
- Record what input type was used in the design spec output for traceability

### Step 2.5: Pattern Audit (MANDATORY — Design Consistency)

**Read the pattern registry first:**
```
Read: .claude/skills/create-ui/design-patterns.md
```

Then scan the codebase for **every existing instance** of the component type being designed:
```
Grep for the component type (Badge, Card, Button variant, etc.) across all page files
```

Produce a **Pattern Audit Table**:
```markdown
## Pattern Audit: [Component Type]

| Page / File | Current Placement | Alignment | Size | Spacing | Matches Registry? |
|-------------|-------------------|-----------|------|---------|-------------------|
| [page 1]    | [where]           | [how]     | [px] | [gap]   | YES / NO — [detail] |
| [page 2]    | [where]           | [how]     | [px] | [gap]   | YES / NO — [detail] |
```

**If inconsistencies are found**: Flag them to the user with a recommendation. Do NOT auto-fix. The user decides whether to normalize existing pages or match the existing (inconsistent) pattern.

**If component type is new (not in registry)**: Propose the canonical pattern and add it to `design-patterns.md` after user approval.

### Step 2.6: Full-Page Context Check (MANDATORY)

Do NOT design in isolation. Read the **entire page layout** the component lives in:
- What's the page-level grid/flex structure?
- How do header, sidebar, main content, and footer relate?
- What are the vertical rhythm and spacing patterns on this page?
- Does the proposed change break alignment with sibling sections?

Produce a brief **Page Context Summary**:
```markdown
## Page Context: [Page Name]
- **Layout**: [grid/flex structure]
- **Sections above**: [what sits above the target area]
- **Sections below**: [what sits below]
- **Sidebar**: [present? width? content?]
- **Spacing rhythm**: [consistent gap between sections]
- **Potential conflicts**: [anything the new design might break]
```

### Step 3: Discover & Reuse Shadcn Components (MANDATORY)

**3a. Check what's already installed:**
```
Glob: legalai-frontend-v2/src/components/ui/*.tsx
```
List all installed Shadcn components. These MUST be reused before considering custom implementations.

**3b. Search for additional components if needed:**
```javascript
await mcp__shadcn__search_items_in_registries({
  registries: ['@shadcn'],
  query: '[describe the UI element]'
});
```

**3c. Produce a Component Reuse Table:**
```markdown
## Shadcn Reuse Check

| UI Need | Installed Component? | Reuse? | Notes |
|---------|---------------------|--------|-------|
| [need 1] | Badge (yes) | YES | Already used in [file] |
| [need 2] | — (no) | INSTALL | Available via shadcn registry |
| [need 3] | — (no) | CUSTOM | No shadcn equivalent exists |
```

**Rules:**
- **NEVER** build a custom component when a Shadcn equivalent exists (installed or installable)
- **NEVER** duplicate Shadcn functionality with hand-rolled CSS/markup
- If a Shadcn component needs minor styling overrides, extend it via `className` — don't recreate it
- If the codebase already wraps a Shadcn component (e.g., a custom `StatusBadge` using Shadcn `Badge`), reuse the wrapper

### Step 4: Present Design Options

For each UI change, present **2-3 options** covering:

```markdown
## Design Options for [Component Name]

### Option A: [Name]
- **Layout**: [description]
- **Behavior**: [interactions, animations]
- **Pros**: [why this works]
- **Cons**: [tradeoffs]

### Option B: [Name]
- **Layout**: [description]
- **Behavior**: [interactions, animations]
- **Pros**: [why this works]
- **Cons**: [tradeoffs]

### Recommendation: Option [X] — [one-line reason]

### Cross-Page Consistency Matrix
| Page | Component Instance | Matches This Option? | Delta (if any) |
|------|--------------------|----------------------|----------------|
| [page 1] | [where it appears] | YES / NO | [what differs] |
| [page 2] | [where it appears] | YES / NO | [what differs] |

**Consistency verdict**: [All aligned / N pages need updates — list them]
```

### Step 5: Define All States

Every component must account for these states:

| State | What it shows |
|-------|--------------|
| Empty | No data yet — placeholder or CTA |
| Loading | Skeleton, spinner, or shimmer |
| Populated | Normal view with data |
| Error | Error message with retry action |
| Overflow | Too many items — truncation, scroll, or pagination |

Present each state visually using ASCII mockup or description.

### Step 6: Responsive Considerations

Define behavior at:
- **Desktop** (1280px+)
- **Tablet** (768px)
- **Mobile** (375px)

Note what collapses, stacks, or hides at each breakpoint.

### Step 7: Accessibility Checklist

```
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 large text)
- [ ] Interactive elements have focus states
- [ ] Screen reader labels on icons/buttons
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Motion respects prefers-reduced-motion
```

### Step 8: Output Design Spec

Produce a clear spec that `/write_code` can implement:

```markdown
## UI Spec: [Component Name]

### Shadcn Components
- [Component 1] — [purpose]
- [Component 2] — [purpose]

### Layout
[Description or ASCII mockup]

### States
[Empty / Loading / Populated / Error / Overflow]

### Props / Data
- [prop 1]: [type] — [source]
- [prop 2]: [type] — [source]

### Brand Compliance
- Colors: [which tokens used]
- Typography: [which styles used]
- Spacing: [grid values used]

### Files to Modify
- [file 1] — [what changes]
- [file 2] — [what changes]

### Affected Pages (Consistency Scope)
List ALL pages where this component type exists. For each, confirm consistency:
| Page | File | Status |
|------|------|--------|
| [page 1] | [file path] | Consistent — no changes needed |
| [page 2] | [file path] | NEEDS UPDATE — [what to align] |
| [page 3] | [file path] | Consistent — no changes needed |

**If any page needs updates**: Include those files in "Files to Modify" above so `/write_code` handles them in the same pass.

### Pattern Registry Update
- [ ] New pattern? Add to `design-patterns.md`
- [ ] Existing pattern changed? Update `design-patterns.md` and flag all affected pages
- [ ] No pattern change? Confirm match with registry
```

### Step 9: Visual Verification via Chrome MCP (WHEN APP IS RUNNING)

If the dev server is running, use Chrome MCP (primary) to capture visual feedback at key points. Fallback to Playwright MCP if Chrome MCP is unavailable.

**9a. Before designing — capture current state:**
```
mcp__chrome-devtools__navigate_page → target page URL
mcp__chrome-devtools__take_screenshot → "before" snapshot
```

**9b. During pattern audit — capture other pages for comparison:**
```
For each page in the Pattern Audit Table:
  mcp__chrome-devtools__navigate_page → that page's URL
  mcp__chrome-devtools__take_screenshot → compare component placement/alignment
```

**9c. After `/write_code` implements — verify the result:**
```
mcp__chrome-devtools__navigate_page → target page URL
mcp__chrome-devtools__take_screenshot → "after" snapshot
mcp__chrome-devtools__take_snapshot → get DOM accessibility tree for structure verification
mcp__chrome-devtools__list_console_messages → confirm no JS errors
```

**9d. Cross-page consistency verification:**
```
For each page in Affected Pages list:
  mcp__chrome-devtools__navigate_page → page URL
  mcp__chrome-devtools__take_screenshot → confirm visual consistency
```

**Chrome MCP Quick Reference (Playwright fallback in parens):**
| Tool | Use |
|------|-----|
| `navigate_page` (`browser_navigate`) | Go to a page URL |
| `take_screenshot` (`browser_take_screenshot`) | Full-page or element screenshot |
| `take_snapshot` (`browser_snapshot`) | Accessibility tree — DOM structure, labels, roles |
| `click` (`browser_click`) | Test interactive states (hover, open dropdown, etc.) |
| `resize_page` (`browser_resize`) | Test responsive breakpoints (1280px, 768px, 375px) |
| `evaluate_script` (`browser_evaluate`) | Run JS to inspect computed styles, spacing, colors |
| `list_console_messages` | Catch JS errors / warnings — no Playwright equivalent |
| `list_network_requests` | Inspect failed requests — no Playwright equivalent |

**If dev server is NOT running**: Skip this step, rely on code review and ASCII mockups only. Note in the spec that visual verification is pending.

---

### Step 8b: Write Handoff File (MANDATORY after user approval)

After the user approves a design option, persist the spec to a file so `/write_code` can consume it directly:

1. Read the template:
```
Read: MiraiCodeBots/UISpecs/TEMPLATE.md
```

2. Fill in all sections from the approved design spec.

3. Write to:
```
MiraiCodeBots/UISpecs/{component-name}.ui-spec.md
```
Use kebab-case for the filename (e.g., `chronology-card.ui-spec.md`).

4. Set `Status: PENDING_IMPLEMENTATION` in the frontmatter.

**This file is the contract between `/create-ui` and `/write_code`.** It eliminates redundant brand/Shadcn discovery and preserves design decisions.

### Step 9b: Post-Implementation Verification (when called back by /write_code)

When `/write_code` completes implementation and the dev server is running, `/create-ui` can be invoked in **verify mode** to:
1. Take "after" Chrome MCP screenshots of the target page (fallback: Playwright)
2. Compare against the spec's layout, states, and responsive requirements
3. Run cross-page consistency screenshots for all Affected Pages
4. Report pass/fail for each spec section

To invoke verify mode, run: `/create-ui verify {component-name}`

After verification passes:
1. Update the spec status to `IMPLEMENTED`
2. Move the file: `MiraiCodeBots/UISpecs/{file}` → `MiraiCodeBots/UISpecs/archive/{file}`

---

**STOP HERE** — wait for user approval on the design spec before handing off to `/write_code`.

---

## Communication Format

### Starting
```
## Create UI: [Component/Feature Name]

Reading brand guidance and exploring current implementation...

[Present design options]

**Which option do you prefer?** (A / B / C / Modifications)
```

### Completing
```
## UI Spec Ready: [Component Name]

[Full spec as above]

Handoff file written to: `MiraiCodeBots/UISpecs/{component-name}.ui-spec.md`

**Ready to implement?** Run `/write_code` to begin implementation.
```

### Verify Mode
```
## Verify: [Component Name]

Reading spec from: `MiraiCodeBots/UISpecs/{component-name}.ui-spec.md`

[Screenshot comparisons + pass/fail per section]

**Result:** PASS / FAIL — [summary]
Spec archived to: `MiraiCodeBots/UISpecs/archive/{file}`
```

---

## Brand Quick Reference

### Colors
| Token | Hex | Use |
|-------|-----|-----|
| Navy Primary | `#1B365D` | Headers, primary text |
| Navy Light | `#405A7A` | Secondary text |
| Tech Accent | `#2E86C1` | CTAs, links, active states |
| Neutral Base | `#FAFBFC` | Backgrounds |
| White | `#FFFFFF` | Cards |
| Success | `#28B463` | Success states |
| Error | `#E74C3C` | Error states |
| Processing | `#2E86C1` | Loading/in-progress |
| Prof Gray | `#566573` | Subtle text, icons |
| Border | `rgba(27,54,93,0.05)` | Dividers, card borders |

### Typography (Inter)
| Style | Size | Weight |
|-------|------|--------|
| H1 | 40px | 600 semibold |
| H2 | 24px | 600 semibold |
| H3 | 20px | 500 medium |
| Body | 16px | 400 normal |
| Caption | 14px | 400 normal |
| Micro | 10-12px | 500 medium |

### Spacing (8px grid)
`xs=8px` `sm=16px` `md=45px` `lg=90px` `xl=135px`

### Components
- Buttons: `rounded-[6px]`
- Cards: `rounded-[12px]`
- Shadows: minimal, prefer `1px` borders
- Transitions: `duration-200 ease-in-out`

---

## Design Consistency Rules (ENFORCED)

These rules are non-negotiable. Every `/create-ui` invocation must comply.

### Rule 1: One Pattern, All Pages
A component type (badge, card header, empty state, etc.) must look and behave **identically** across every page. If you change it on one page, you change it everywhere.

### Rule 2: Full-Page View, Not Section View
Never design a component without reading the full page it lives on. A badge that looks great in isolation can break the visual balance of the whole page.

### Rule 3: Pattern Registry Is Source of Truth
Before proposing any design, check `design-patterns.md`. If a canonical pattern exists, match it. If you want to deviate, explicitly justify why and get user approval.

### Rule 4: No Silent Drift
If the pattern audit reveals existing inconsistencies in the codebase, **flag them visibly** in the design options. Don't ignore them. Don't silently match the wrong one.

### Rule 5: Affected Pages Are Mandatory
The design spec MUST list every page affected by the component type. If a change creates inconsistency on another page, that page goes into "Files to Modify."

### Rule 6: Shadcn First, Custom Never (Unless No Alternative)
Never build custom when Shadcn has it. Never duplicate what's already installed. Extend via `className`, don't recreate. If the codebase has a wrapper around a Shadcn component, reuse the wrapper.

### Rule 7: Visual Verification When Possible
If the dev server is running, take screenshots before and after. Compare cross-page visually, not just in code. Use Chrome MCP (fallback: Playwright) to verify responsive breakpoints, not just assume them.

### Rule 8: Placement and Alignment Are Locked Per Type
Once a component type's position (e.g., "status badge = right-aligned in card header") is established in the registry, all future instances must match. Changing placement requires updating the registry + all pages.

---

*Skill Version: 3.1*
*Framework: LegalAI — Design-First UI Development with Cross-Page Consistency*
