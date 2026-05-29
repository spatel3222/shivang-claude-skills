---
name: write_pitch
description: Generate investor-ready one-pagers, pitch decks, and presentations with enforced clarity, privacy-first framing, strategic messaging, and validated claims.
---

# Write Pitch Skill - Investor-Ready Documents

## Core Principle
**Every statement must pass the "investor with zero domain knowledge" test.**

## When to Use This Skill

Use this skill when user mentions:
- One-pager, vision document
- Investor pitch, pitch deck
- Grant application
- Stakeholder presentation
- Strategy document
- "Write a pitch for..."

## The 9 Immutable Principles

| # | Principle | Enforcement |
|---|-----------|-------------|
| 1 | **Investor clarity** | Every statement makes sense to someone with zero domain knowledge |
| 2 | **Privacy-first** | No language implying proprietary data sharing between stakeholders |
| 3 | **Strategic over tactical** | "What's Missing" = co-pilots, risk intelligence — not just "search" |
| 4 | **No filler** | Every line earns its place; cut vague setup lines |
| 5 | **Problem → Vision coherence** | Problem sets up all stakeholders; vision solves all |
| 6 | **Concrete examples** | Abstract concepts grounded with real scenarios (NDA example, etc.) |
| 7 | **Validated claims** | Numbers need sources (superscript references) |
| 8 | **Cross-reference & grounding** | Claims linked to evidence throughout |
| 9 | **No duplication** | Same "so-what" must not repeat. Executive Summary ≠ copy of body sections. |

---

## DUPLICATION DETECTION PROTOCOL (Principle 9)

**The "So-What" Test:** If two sections deliver the same bottom-line insight, one must go.

### Common Duplication Patterns to Catch

| Pattern | Example | Fix |
|---------|---------|-----|
| **Stat repeated** | "47M cases pending" in Exec Summary AND Problem section | Keep in Problem only; Exec Summary references, doesn't repeat |
| **Table repeated** | Same Phase II/III investment table twice | Keep detailed table once; summarize elsewhere |
| **Tagline repeated** | "Infrastructure exists, intelligence missing" in 3 places | Use ONCE for maximum impact |
| **Stack description repeated** | "Hardware → OCR → Search" in Exec Summary AND Solution | Exec Summary = 1-line; Solution = detail |
| **Traction repeated** | "2 law firms" in Exec Summary AND Traction section | Keep in Traction; Exec Summary says "paying customers" |
| **Budget repeated** | Full breakdown in Exec Summary AND Budget section | Exec Summary = total only; Budget = breakdown |

### Executive Summary Rules

**Exec Summary is NOT a copy of the document. It is:**
- Hook (1 line)
- Problem (1 line + "so what")
- Solution (1 line)
- Traction (1 line)
- Ask (1 line)
- Vision (1 line)

**MAX 15 lines. No tables. No details. Just highlights.**

### Validation Scan

Before finalizing, scan top-to-bottom for:
1. **Same number appearing twice** → Keep in most relevant section
2. **Same phrase appearing twice** → Keep first occurrence, remove/rephrase second
3. **Same table appearing twice** → Consolidate; reference if needed
4. **Same "bottom-line" appearing twice** → Pick strongest location

### Appendix Exception

Technical details CAN appear in Appendix if:
- Body has summary version
- Appendix has detailed version
- Clear reference: "See Appendix A for specifications"

---

## STORYTELLING FRAMEWORK

### Golden Circle (Sinek) — Presentation Order

Start with WHY, not WHAT. Investors buy belief before product.

1. **WHY** — Founder's belief + Market urgency ("Why does this exist?")
2. **HOW** — Differentiator + Approach ("How is this different?")
3. **WHAT** — Product + Features ("What are we building?")

> "People don't buy what you do; they buy why you do it."

### Hero's Journey Arc — Narrative Structure

Map your pitch to this arc for emotional engagement:

| Stage | Pitch Element | Purpose |
|-------|---------------|---------|
| **Ordinary World** | Industry status quo | Set the scene — what exists today |
| **Call to Adventure** | Market gap / "Why Now?" | Create urgency — why change is needed |
| **Trials & Allies** | Traction + Team | Build credibility — proof you can deliver |
| **Transformation** | Product / Solution | Show the change — how you solve it |
| **Return with Elixir** | Vision + Impact | Paint the future — what success looks like |

### What / Why / By When — Closing Framework

End every pitch with crystal clarity:

- **WHAT** we're building (1 sentence max)
- **WHY** it matters now (urgency trigger)
- **BY WHEN** milestones will be achieved (with funding ask)

---

## Execution Framework

### Phase 1: Discovery Questions (MANDATORY)

**ASK THESE BEFORE WRITING:**

1. **Audience?** - Investor, grant committee, internal stakeholder?
2. **Format?** - One-pager (MD) or Pitch Deck (10 slides)?
3. **Core message?** - What's the ONE thing they should remember?
4. **Stakeholders?** - Who are we serving? (e.g., Companies, Lawyers, Courts)
5. **Sensitive framing?** - Any privacy/data sharing concerns to avoid?

**Format Selection Guide:**

| Format | Use When | Slides | Time | Template |
|--------|----------|--------|------|----------|
| **One-Pager** | Email, quick reads, grants | N/A | Async | Phase 2A |
| **Demo Day Deck** | Stage presentation, YC-style | 5-7 | 2:30 | Phase 2B |
| **Seed/Investor Deck** | Meetings, grants, follow-ups | 10-12 | 10-15 min | Phase 2B |
| **Email Deck** | Shared as PDF, no presenter | 10-15 | Async | Phase 2B |

**FOR DECKS ONLY — Additional Questions:**

6. **Purpose?**
   - Demo Day (stage, 2:30, max impact)
   - Investor Meeting (10-15 min, Q&A expected)
   - Email/PDF (async, self-explanatory)

7. **Presentation context?**
   - Live on stage (legibility critical)
   - Shared as PDF (more text ok)
   - Both (optimize for stage, add speaker notes)

8. **Time limit?** - 2:30 / 5 min / 10-15 min / Async

**WAIT for answers before proceeding.**

### Phase 2A: One-Pager Template

**For One-Pagers (markdown format):**

```markdown
# [Product] — [Tagline]

**[Subtitle: Scope Definition]**

---

## THE PROBLEM

**[The workflow is a loop — but it's broken.]**

- [Stakeholder A] generates **[X]** → [flow to B]
- [Stakeholder B] processes **[Y]** → [flow to C]
- [Stakeholder C] produces **[Z]** → [should inform A]

**Why it's broken:** Each stakeholder works in isolation.

| Stakeholder | What They Have | What's Missing | Impact |
|-------------|----------------|----------------|--------|
| **[A]** | [Current state]¹ | [Strategic gap — co-pilot, intelligence, etc.]² | [Quantified impact]³ |
| **[B]** | [Current state] | [Strategic gap] | [Impact] |
| **[C]** | [Current state] | [Strategic gap] | [Impact] |

The infrastructure exists. The intelligence layer is missing.

---

## THE VISION

**[One Platform. X Stakeholders. Complete Loop.]**

```
[ASCII diagram showing the loop]
```

**Network Effect:** [How value compounds with each participant]

[Product] is the operating system that connects this loop.

---

## THE APPROACH

**[Technical differentiator]**

**End-to-End Stack:**
- [Layer 1]
- [Layer 2]
- [Layer 3]
- [Layer 4]

**[Key Architecture]:**
[Brief description of how it works]

**[Foundation]:**
- [Data source 1]
- [Data source 2]

**Security & Compliance:**
- [Point 1]
- [Point 2]

---

## THE OPPORTUNITY

**Who pays and how much?**

| Segment | Size | Current Coverage | Opportunity |
|---------|------|------------------|-------------|
| [Segment 1] | [Size] | [%] | [Amount] |
| [Segment 2] | [Size] | [%] | [Amount] |

**Why now?** [Timing catalyst with validation]

**Why us?** [Differentiation]

---

**[Product]** | [Meaning] | [Translation]

*[Tagline]*

[contact] | [location]

---

## Sources

1. [Source 1] — [What it validates]
2. [Source 2] — [What it validates]
```

### Phase 2B: 10-Slide Pitch Deck Template

**For Pitch Decks (10 slides max — Guy Kawasaki rule):**

| # | Slide | Content | Framework |
|---|-------|---------|-----------|
| 1 | **Title** | Product name + tagline + founder | Hook (WHAT) |
| 2 | **The Problem** | Broken loop + stakeholder pain | Ordinary World |
| 3 | **Why Now?** | Market shift / timing catalyst | Call to Adventure |
| 4 | **The Vision** | WHY we exist + belief statement | WHY (Sinek) |
| 5 | **The Solution** | Product demo / how it works | Transformation |
| 6 | **How It's Different** | Technical differentiator + moat | HOW (Sinek) |
| 7 | **Traction** | Users, revenue, partnerships, pilots | Trials & Allies |
| 8 | **Market Opportunity** | TAM/SAM/SOM + who pays | Return with Elixir |
| 9 | **Team** | Why THIS team wins | Allies |
| 10 | **The Ask** | Amount + milestones + timeline | BY WHEN |

**Slide-by-Slide Guidance:**

```
SLIDE 1: TITLE
- [Product] — [Tagline]
- [Founder Name] | [Contact]
- [One-line positioning statement]

SLIDE 2: THE PROBLEM
- The loop is broken: [A] → [B] → [C] → [back to A]
- Each stakeholder works in isolation
- [Quantified pain point]¹

SLIDE 3: WHY NOW?
- [Market catalyst / regulatory shift / tech breakthrough]
- [Timing validation with source]²
- "The window is open."

SLIDE 4: THE VISION (WHY)
- "We believe [founder's belief statement]"
- [One Platform. X Stakeholders. Complete Loop.]
- [ASCII or visual of connected loop]

SLIDE 5: THE SOLUTION
- [Product name] does [core function]
- [Key feature 1] → [benefit]
- [Key feature 2] → [benefit]
- Demo screenshot or flow

SLIDE 6: HOW IT'S DIFFERENT
- [Technical differentiator]
- [Competitive moat]
- Why competitors can't copy this

SLIDE 7: TRACTION
- [Users/customers] | [Revenue] | [Growth %]
- [Key partnerships or pilots]
- [Social proof / logos]

SLIDE 8: MARKET OPPORTUNITY
| Segment | Size | Opportunity |
|---------|------|-------------|
| TAM | $X | [Total market] |
| SAM | $X | [Serviceable] |
| SOM | $X | [Obtainable] |

SLIDE 9: TEAM
- [Founder 1] — [Relevant credential]
- [Founder 2] — [Relevant credential]
- [Advisor] — [Why they matter]

SLIDE 10: THE ASK
- Raising: $[Amount]
- Use of funds: [Top 3 allocations]
- Milestones by [Date]:
  - [ ] [Milestone 1]
  - [ ] [Milestone 2]
  - [ ] [Milestone 3]

WHAT: [1-sentence product description]
WHY: [Why it matters now]
BY WHEN: [Key milestone + date]
```

---

## Phase 2C: Figma AI Designer Brief

**INSTRUCTION TO FIGMA AI: Use this section as your design specification. Follow these rules exactly.**

### Slide Specifications

| Property | Value |
|----------|-------|
| Aspect Ratio | 16:9 |
| Dimensions | 1920 x 1080 px |
| Resolution | 72 PPI (screen) / 300 PPI (print) |
| Format | Figma / Google Slides / Keynote |

### The 3 YC Design Principles

**RULE 1: LEGIBLE**
- Old person in back row with bad eyesight can read it
- Test: Readable from 10 feet away

**RULE 2: SIMPLE**
- One idea per slide
- Test: Can explain slide meaning in one sentence

**RULE 3: OBVIOUS**
- Understood at a glance
- Test: Show to stranger, they instantly understand

### Typography Rules

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Slide Title | Inter | 100-150pt | Bold (700) | #1B365D |
| Key Statement | Inter | 80-100pt | Bold (700) | #1B365D |
| Body Text | Inter | 40-60pt | Medium (500) | #405A7A |
| Labels/Captions | Inter | 30-40pt | Regular (400) | #566573 |
| Chart Callouts | Inter | 60-80pt | Bold (700) | #2E86C1 |

**CRITICAL:**
- Minimum text size: 40pt
- Text position: TOP of slide (back-row visibility)
- Never use font smaller than 30pt

### Color Palette

**Use client's brand colors. If none provided, use this default professional palette:**

| Role | Default Hex | Usage |
|------|-------------|-------|
| Primary | #1B365D (Navy) | Headlines, titles |
| Secondary | #405A7A (Navy Light) | Body text |
| Accent | #2E86C1 (Blue) | CTAs, highlights, chart callouts |
| Background | #FFFFFF (White) | Slide backgrounds |
| Alt Background | #FAFBFC (Off-white) | Alternate sections |
| Success | #28B463 (Green) | Growth metrics only |
| Muted | #566573 (Gray) | Secondary text, captions |

**Color Rules:**
- Max 3 colors per slide
- High contrast (WCAG AA minimum)
- Accent color for emphasis only

### Layout Rules

**Grid:**
- 12-column grid
- Margins: 80px all sides
- Gutter: 40px

**Text Position:**
- Title: Top 20% of slide
- Key message: Upper half
- Supporting visuals: Lower half
- NEVER put key text at bottom of slide

### Visual Do's

- [ ] White backgrounds (#FFFFFF)
- [ ] Large, bold text at TOP
- [ ] CliffsNotes caption on every chart (e.g., "50% Monthly Growth")
- [ ] Bulleted steps instead of screenshots
- [ ] One chart per slide maximum
- [ ] Labels on ALL visuals
- [ ] Logo: bottom-right, small (max 100px height)

### Visual Don'ts

| NEVER USE | WHY (YC Kevin Hale) |
|-----------|---------------------|
| Screenshots | "Illegible, complex, non-obvious — breaks all 3 rules" |
| Complex diagrams | "Little mazes for ideas — path too long" |
| Animations | Distracting |
| Transitions | Distracting |
| Memes/humor | Unprofessional |
| Videos | "Think twice before using" |
| Multiple ideas per slide | Violates simplicity |
| Text at bottom | Hard to read from back row |
| Photos without captions | Non-obvious |
| 3D charts | Illegible |

### Chart Design Rules

**Bad:** Chart alone
**Better:** Chart + axis labels
**Best:** Chart + explicit CliffsNotes caption

**Example:**
```
[Title at TOP]: "Revenue doubling every month"
[Simple line chart below]
[Callout next to chart]: "50% MoM Growth"
```

**Chart Types Allowed:**
- Line chart (growth)
- Bar chart (comparison)
- Simple pie (max 4 segments)

**Chart Types Forbidden:**
- 3D anything
- Stacked area
- Radar/spider
- Complex multi-axis

### Slide-by-Slide Design Specs

| Slide | Layout | Key Visual Element |
|-------|--------|-------------------|
| Title | Centered text, logo bottom-right | Product name 150pt |
| Problem | Title top, 3 bullets below | Pain stat callout |
| Why Now | Title top, timeline or single stat | Large number |
| Vision | Title top, simple diagram or statement | Loop visual |
| Solution | Title top, 3-step flow | Numbered steps |
| Differentiator | Title top, comparison or moat | 2-column if needed |
| Traction | Title top, single chart | CliffsNotes callout |
| Market | Title top, TAM/SAM/SOM circles | Dollar amounts |
| Team | Title top, headshots row | Name + 1-line credential |
| Ask | Title top, amount + 3 milestones | Timeline visual |

### The "Push Button, Get Marijuana" Test

If you can explain the product in 2-3 bullet points, use text instead of screenshots:

```
We make it easy:
1. Choose Amount
2. Choose Stock
3. Send
```

### Appendix Slides (Optional)

- Use for backup/Q&A
- Same design rules apply
- Number as A1, A2, A3...
- Topics: detailed financials, technical architecture, competitive matrix

### Figma Component Checklist

```
□ Master slide template (16:9, 1920x1080)
□ Title slide component
□ Content slide component
□ Chart slide component
□ Team slide component
□ Typography styles (H1, H2, Body, Caption)
□ Color styles (all 7 brand colors)
□ Logo component (light + dark versions)
□ Chart templates (line, bar, pie)
□ Icon set (if needed)
```

### Export Settings

| Format | Use For | Settings |
|--------|---------|----------|
| PDF | Email, printing | High quality, embed fonts |
| PNG | Individual slides | 2x scale, transparent |
| Figma Link | Collaboration | View-only for reviewers |

---

### Phase 3: Validation Checklist (MANDATORY)

Before delivering, verify ALL:

**Content Validation:**
- [ ] Every claim has superscript reference to Sources
- [ ] No privacy-implying language (data sharing between parties)
- [ ] "What's Missing" is strategic (co-pilot, intelligence), not tactical (search)
- [ ] Problem → Vision is coherent (same stakeholders appear in both)
- [ ] Abstract concepts have concrete examples (appendix if needed)
- [ ] No filler lines (every line answers "so what?")
- [ ] Loop/flow bullets describe natural workflow, not data sharing

**Duplication Validation (Principle 9):**
- [ ] No stat appears twice (47M, ₹8,880 Cr, etc.)
- [ ] No tagline appears twice ("infrastructure exists...")
- [ ] Exec Summary has NO tables — only 1-line highlights
- [ ] Exec Summary ≤ 15 lines total
- [ ] Technical details in Appendix only, not repeated in body
- [ ] Same "so-what" does not appear in multiple sections

**Storytelling Validation:**
- [ ] WHY is clear before WHAT (Golden Circle order)
- [ ] Can investor retell pitch in 30 seconds? (retellability test)
- [ ] Opening grabs attention in first 2 minutes
- [ ] Ends with clear WHAT / WHY / BY WHEN
- [ ] Hero's Journey arc is evident (problem → transformation → vision)
- [ ] Investor with zero domain knowledge can follow the logic

**Deck Design Validation (for Figma AI output):**
- [ ] All text 40pt+ minimum
- [ ] Key text at TOP of each slide
- [ ] One idea per slide
- [ ] Every chart has CliffsNotes caption
- [ ] No screenshots used
- [ ] Colors match brand palette
- [ ] Correct slide count (5-7 Demo Day / 10-12 Seed)
- [ ] 16:9 aspect ratio, 1920x1080px

### Phase 4: Common Pitfalls to Avoid

| Pitfall | Fix |
|---------|-----|
| "Each stakeholder generates data the others need but can't access" | Implies they SHOULD share proprietary data. Remove. |
| "Legal matters naturally flow through the system" | Vague filler. Cut it. |
| "No search, no findability" | Too tactical. Use "No co-pilot, no intelligence layer" |
| Problem only mentions one stakeholder, Vision mentions three | Restructure Problem to include all stakeholders |
| Numbers without sources | Add superscript + Sources section |

## File Location

Save pitch documents to:
```
/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Docs/Grants/Pitch/
```

## Naming Convention

`[Product]_[Type]_[DDMMYYYY].md`

Examples:
- `Mirai_Vision_10122025.md`
- `Mirai_InvestorDeck_10122025.md`
- `Mirai_GrantPitch_10122025.md`

## Reference Documents

Look at these for tone and structure:
- `Legal_OS_Vision.md` — One-pager template
- `NIDHI_PRAYAS_Grant_Pitch.md` — Grant application format

## Appendix Guidelines

When abstract concepts need grounding, add appendix:

```markdown
## Appendix: How the Loop Works

**Example: [Scenario Name]**

```
[ASCII flow diagram]
```

**Key insight:** [Privacy-respecting summary]

- [Stakeholder A]'s [data] = private (visible only to [who])
- [Stakeholder B]'s [data] = private (competitive advantage)
- [Public data] = accessible to all via [method]
```

## Output Format

End every pitch session with:
```
Skills: write_pitch
Agents: None
Tools: Write, Edit
TimeStamp: [Date Time] (India Standard Time)
```

---

*Skill Version: 3.0*
*Last Updated: December 10, 2025*
*Based on: 9 Principles + Sinek Golden Circle + Hero's Journey + What/Why/By When Framework + Duplication Detection Protocol*

**Sources:**
- YC Kevin Hale — "How to Design a Better Pitch Deck"
- YC Aaron Harris — "How to Build Your Seed Round Pitch Deck"
- Superside — "35 Best Pitch Deck Examples"
