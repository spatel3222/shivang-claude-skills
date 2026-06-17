---
name: content-writer-distributor
description: Creates ready-to-publish content for Blog, Instagram carousel (GIF), LinkedIn carousel (PDF), and LinkedIn post from a single topic. Adapts visual styling (colors + fonts) to the brand guidelines or design system found in the current working directory; voice and tone stay consistent. Use this skill whenever the user wants to create multi-channel content, distribute content across platforms, repurpose a blog post into other formats, or when the marketing-advisor orchestrator delegates content creation. Also trigger when the user says things like "create content about...", "distribute this to all channels", "write a blog and Instagram post about...", or "push this to all platforms".
---

# Content Writer & Distributor

You turn a single topic into publish-ready content across multiple channels. The blog is the pillar — everything else extracts the strongest angle from it.

## File Organization

Every content piece goes in a **date-topic folder** to keep things clean:

```
Outreach/content/YYYY-MM-DD-{slug}/
├── blog.md                    # Blog post + 20-field CMS frontmatter
├── blog.json                  # CMS JSON (via blog_cms_prep.py)
├── carousel-slides.md         # Slide descriptions (creative source)
├── carousel.html              # HTML slides 1080x1080 (via /create-ui)
├── carousel.gif               # Animated GIF for Instagram (Playwright → GIF)
├── caption-instagram.md       # Instagram caption + hashtags
├── caption-linkedin.md        # LinkedIn caption (Shivang's voice)
├── carousel-linkedin.pdf      # PDF for LinkedIn carousel upload
└── reel-script.md             # Instagram Reel script (HeyGen-ready)
```

Example: `Outreach/content/2026-04-01-ai-contract-review/`

**This folder is the single source of truth.** No files are copied elsewhere. All outputs for a topic live in one place.

### Symlink Indexes (backward-compatible views)

After creating content, create symlinks so older browsing paths still work:

```bash
# SEO view (for blog_cms_prep.py and blog numbering)
ln -sf ../../content/YYYY-MM-DD-{slug}/blog.md   Outreach/SEO/blog-{NN}-{slug}.md
ln -sf ../../../content/YYYY-MM-DD-{slug}/blog.json  Outreach/SEO/cms-output/blog-{NN}-{slug}.json

# LinkedIn view (for browsing all LinkedIn content chronologically)
ln -sf ../../content/YYYY-MM-DD-{slug}/linkedin-text-post.md  Outreach/LinkedIn/Mirai360/YYYY-MM-DD-{slug}-text-post.md
ln -sf ../../content/YYYY-MM-DD-{slug}/caption-linkedin.md    Outreach/LinkedIn/Mirai360/YYYY-MM-DD-{slug}-carousel-caption.md
ln -sf ../../content/YYYY-MM-DD-{slug}/carousel-linkedin.pdf  Outreach/LinkedIn/Mirai360/carousel{NN}_{slug}.pdf
```

The carousel PDF numbering continues from the last one in the LinkedIn folder (glob `carousel*.pdf`, increment). The symlink NAME carries the number; the actual file is always `carousel-linkedin.pdf` in the content folder.

These are browse-only views. The content folder is canonical.

## Channels & Outputs

| # | Channel | File | Format | Auto/Manual |
|---|---------|------|--------|-------------|
| 1 | **Blog** | `blog.md` | Markdown + 20-field CMS frontmatter | Auto |
| 2 | **Blog CMS JSON** | `blog.json` | JSON (via `blog_cms_prep.py`) | Auto |
| 3 | **Carousel slides** | `carousel-slides.md` | Markdown (creative source) | Auto |
| 4 | **Carousel HTML** | `carousel.html` | HTML 1080x1080 (via `/create-ui`) | Auto |
| 5 | **Instagram carousel** | `carousel.gif` | Animated GIF (Playwright → GIF, ~1.5s/slide) | Auto |
| 6 | **Instagram caption** | `caption-instagram.md` | Caption + hashtags | Auto |
| 7 | **LinkedIn carousel** | `carousel-linkedin.pdf` | PNGs stitched into PDF | Auto |
| 8 | **LinkedIn caption** | `caption-linkedin.md` | Post text + hashtags (Shivang's voice) | Auto |
| 9 | **LinkedIn text post** | Presented in chat | Via `write-linkedin-post` skill | Auto |
| 10 | **Instagram Reel** | `reel-script.md` | HeyGen-ready video script | Auto |

**10 outputs, all auto-generated.** Only manual step: reviewing before publishing.

## LinkedIn 360Brew Layer (April 2026+) — applies to all LinkedIn outputs

LinkedIn's ranking is now driven by 360Brew (150B-param decoder-only foundation model). Every LinkedIn output (caption, carousel, text post) must respect:

- **Carousel preferred over text or video** for any framework, checklist, teardown — carousels get 1.39× reach vs video's 0.86×.
- **Saves > comments > likes** in priority. Optimize for save-worthiness, not reactions.
- **Profile-content alignment** — the post topic must match the author's headline/about. For Shivang: Intelligence Transformation, manufacturing, AI Advisor topics only during the 2-week sprint.
- **Substantive comment bait** — closing question must demand a paragraph, not "agree?"
- **2 hashtags max** — hashtags are near-irrelevant for ranking; only context tags.
- **No first-hour engagement obsession** — delayed engagement (24–72h) now drives 4–6× boost.

### Phase awareness

If `Outreach/content/PHASE.md` exists and contains `audience-build`, OR if the user invokes via `write-linkedin-post` skill which is in audience-build phase: **strip all booking-link CTAs from LinkedIn caption and final carousel slide.** Replace with a substantive question or POV close. Lead-gen-phase CTAs ("Try Mirai free → mirai360.ai") apply only to non-LinkedIn channels (blog, Instagram) during this phase.

### Bucket tag (LinkedIn outputs only)

Every LinkedIn caption file must start with a YAML-style header:

```
<!-- bucket: Growth | Authority | Conversion | Personal -->
<!-- type: brandjack | newsjack | namejack | hot-take | public-diagnostic | advisor-log | lexicon-teardown -->
```

This lets weekly reviews check the 40/30/20/10 mix.

### Voice handoff

For LinkedIn captions and text posts, **defer voice rules to `write-linkedin-post`** — read that skill's voice + 6 rules + 360Brew checklist before drafting. This skill handles distribution mechanics; `write-linkedin-post` owns the voice.

## Content Creation Flow

```
Topic
  │
  ├─→ 1. Blog post (markdown + CMS frontmatter)
  │     └─→ blog_cms_prep.py → CMS JSON
  │
  ├─→ 2. Carousel slide descriptions (markdown — creative source)
  │     └─→ /create-ui → HTML (1080x1080 slides)
  │           ├─→ Playwright → animated GIF (1.5s/slide) → Instagram
  │           └─→ Playwright → PNGs → PDF → LinkedIn carousel
  │
  ├─→ 3. Instagram Reel script (markdown → feed into HeyGen)
  ├─→ 4. Instagram caption (markdown)
  └─→ 5. LinkedIn caption (markdown — Shivang's voice)
```

The markdown slide descriptions are the **single source of truth** for carousel visuals. Both Instagram and LinkedIn carousel reuse the same slides.

## Global Language Rule — English as Second Language (APPLIES TO ALL CHANNELS)

Our audience is Indian lawyers, advocates, and small-firm practitioners. English is **often their second language**. This rule overrides "clever" phrasing on every channel — blog, carousel, caption, Reel script, Instagram, LinkedIn post.

**Write like this:**
- Short sentences. 8-12 words max per sentence.
- Plain verbs: **use, check, read, send, build, lose, stop, write, file**
- Concrete nouns: **client name, case, judgment, bail, citation, licence, firm**
- One idea per sentence. No sub-clauses.
- Contractions are fine ("don't", "can't") — they sound natural.
- Active voice always. "AI made it up" not "it was generated by AI".

**Banned words (pick plain alternatives):**
| Don't write | Write instead |
|---|---|
| hallucinated / hallucination | fake / made-up |
| disbarred / sanctioned | lose your licence |
| adjudicatory / operative | decision / ruling |
| breach the policy | break the rule |
| grounded in primary sources | every citation is checked |
| zero public-AI exposure | your client data stays private |
| verify before you file | read it before you send it |
| encroach / inviolable / ultra-strict | crosses the line / strict / very strict |
| leverage | use |
| utilise | use |
| litigant | client / party |
| subsequent | next / later |
| aforementioned | this / that |
| substantive | main / real |

**Structure rules:**
- Lead with the concrete action or stakes, not the abstract concept.
- Hooks use common everyday English, not legal English.
- On-screen text uses CAPS for emphasis, not italics or bold (easier to read at a glance).
- For video scripts, read every sentence aloud — if you stumble, rewrite it.
- Use Indian English spellings when the user writes in Indian English ("licence", "organisation", "defence").

This rule is MANDATORY on every channel. If a draft breaks it, rewrite before delivering.

## Step 0: Load Brand Visuals (colors + fonts) from the Working Directory

Before writing or rendering anything, resolve which brand's **colors and fonts** to use. **Only visuals adapt to the workspace.** Voice, tone, CTA, author, ICP, hashtags, and the language rules below stay exactly as defined in this skill (Mirai360 / Indian-legal) — they do NOT change per directory.

### Resolve order (first match wins — NEVER merge two brands)

1. If `.brand-profile.json` exists at the workspace root, use it as-is and skip scanning.
2. Otherwise Glob the working directory in this priority order and take the **FIRST** file that defines colors/fonts (do not combine sources):
   - `brand-guidelines.*`, `BRAND.md`, `brand/**`, `.brand/**`
   - `design-system.*`, `design-tokens.json`, `tokens.json`, `theme.*`, `theme/**`
   - `tailwind.config.{js,ts}` (`theme.colors`, `theme.fontFamily`)
   - `styles/globals.css` or any CSS with `:root { --… }` color vars + `font-family`
   - `STYLEGUIDE.md`, `docs/brand/**`
3. Extract **ONLY**:
   - **Colors:** primary, secondary, accent, light background, neutral gray
   - **Fonts:** heading + body family (use one if only one is defined)
4. Write the resolved values to `.brand-profile.json` at the workspace root so later runs reuse them.

### If no brand source is found
Do NOT stop. **Tell the user once, in chat:** "No brand guidelines found in this directory — defaulting to Mirai360 visuals (navy #1B365D / gold #C4A04A / Inter)." Then proceed with the Mirai360 defaults below.

### `.brand-profile.json` schema

```json
{
  "brandName": "string",
  "source": "path the values came from, or \"mirai360-default\"",
  "colors": { "primary": "#1B365D", "secondary": "#C4A04A", "accent": "#2E86C1", "bgLight": "#FAFBFC", "warmGray": "#5A5550" },
  "fonts": { "heading": "Inter", "body": "Inter" }
}
```

These resolved colors + fonts feed the carousel/Reel CSS in **Channel 2**. Map them onto the existing CSS variable names so the rest of the design system is untouched — only the values change:

| Brand Profile field | CSS variable | Mirai360 default |
|---|---|---|
| `colors.primary` | `--navy` | `#1B365D` |
| `colors.secondary` | `--gold` | `#C4A04A` |
| `colors.accent` | `--accent` | `#2E86C1` |
| `colors.bgLight` | `--bg-light` | `#FAFBFC` |
| `colors.warmGray` | `--warm-gray` | `#5A5550` |
| `fonts.heading` / `fonts.body` | font stack | `Inter` |

## Before You Write Anything

1. **Read business context** at `~/.claude/skills/marketing-advisor/references/business-context.md` — brand colors, ICP, CTA strategy, validated stats bank.
2. **Read the SEO master plan** at `Outreach/SEO/master-plan.md` — keyword strategy.
3. **Read the Instagram master plan** at `Outreach/Instagram/master-plan.md` — content pillars, visual style, posting cadence.
4. **Check existing content** — Glob `Outreach/content/*/blog.md` for existing topics. Glob `Outreach/SEO/blog-*.md` for next blog number (symlinks count). Glob `Outreach/content/*/carousel.html` for last carousel style (to alternate).
5. **Research** — Check validated stats bank first. WebSearch only if topic needs stats not already there. Every claim needs a source URL. Never invent numbers.

## Channel 1: Blog Post

The blog is the pillar — write it first, then derive everything else.

### Voice & Tone
- **Direct and informational** — no hedging, no filler. Claim + data.
- **Written as "Mirai360 Team"** — third-person brand voice, not "I"
- **Audience**: Indian solo practitioners and small law firms. English often second language — keep clear and jargon-light.
- **Data-backed** — every major claim gets a stat with a source link.

### Structure
- **1,200-1,800 words**
- **H2/H3 headers as questions** (LLM-friendly, readable)
- **1-2 stats from validated stats bank** with source URLs inline
- **CTA at bottom**: "Try Mirai free — 2 cases, no payment, no expiry — at mirai360.ai"
- **Sources section** at end with clickable URLs for every claim

### CMS JSON Output (MANDATORY)

After writing blog.md, generate `blog.json` in the SAME content folder. This JSON is the CMS-ready payload — it replaces the old YAML frontmatter + blog_cms_prep.py workflow.

**Exact schema (all fields required):**

```json
{
  "title": "string — blog title",
  "slug": "url-friendly-slug",
  "content": "full blog body in markdown — escaped for JSON (newlines as \\n)",
  "excerpt": "max 500 chars summary",
  "category": "Legal AI",
  "tags": ["tag-1", "tag-2", "target-keyword"],
  "authorName": "Mirai360 Team",
  "status": "draft",

  "coverImageUrl": "",
  "coverImageAlt": "descriptive alt text for cover image",

  "metaTitle": "max 70 chars, include target keyword",
  "metaDescription": "max 160 chars, include target keyword",
  "metaKeywords": ["keyword-1", "keyword-2", "keyword-3"],

  "ogTitle": "social-optimized, max 70 chars",
  "ogDescription": "social-optimized, max 200 chars",
  "ogImageUrl": "",

  "summary": "2-3 sentence AI summary, plain-text, factual",
  "keyTopics": ["topic-1", "topic-2", "topic-3"],

  "faq": [
    {
      "question": "from H2/H3 heading in blog",
      "answer": "from blog content, max 300 chars"
    }
  ],

  "cta": {
    "text": "Try Mirai Free",
    "url": "https://mirai360.ai"
  }
}
```

**Rules:**
- `tags`, `metaKeywords`, `keyTopics` are arrays of strings (not comma-separated strings)
- `faq` is an array of objects with `question` and `answer` fields
- `content` contains the full blog markdown body (everything after the frontmatter), JSON-escaped
- `cta.text` and `cta.url` are always present — default to "Try Mirai Free" / "https://mirai360.ai"
- `coverImageUrl` and `ogImageUrl` can be empty strings if no image uploaded yet
- Generate this JSON DIRECTLY — do not rely on blog_cms_prep.py

Then create symlinks in the SEO folder for backward compatibility (see Symlink Indexes above).

## Channel 2: Carousel (Instagram + LinkedIn)

One set of slides serves both platforms. Extract the single most compelling stat or transformation from the blog.

### Step 1: Write the markdown slide descriptions

This is the creative source — human-readable, easy to review/edit before committing to visuals.

Every carousel MUST follow the **Hook → Buildup → Payoff → CTA** framework in **4-5 slides max** (never more than 5):

| Phase | Slide | Purpose |
|-------|-------|---------|
| **Hook** | 1 | Stop the scroll. Big stat, bold claim, or provocative question. One slide, maximum impact. |
| **Buildup** | 2-3 | Build the case. Problem + evidence. Each slide adds one layer. Keep it tight — 1-2 slides only. |
| **Payoff** | 3-4 | Deliver the answer. The solution, comparison, or transformation. This is where Mirai/the insight lands. |
| **CTA** | 4-5 (last) | Convert. Comment keyword + "Try free → mirai360.ai". |

**HARD LIMIT: 4-5 slides. Never 6, 7, or 8.** Shorter carousels get higher completion rates. Every slide must earn its place.

Follow this format for slide descriptions:

```markdown
# {Title}
- **Date:** YYYY-MM-DD
- **Format:** Carousel (4-5 slides)
- **Pillar:** {Stat Bomb | Before/After | Mindset Shift | Feature Demo | Free Trial CTA}
- **Stats used:** #{N} ({stat} — {source})
- **Visual Style:** {Grand White | Grand Navy} — alternate from last carousel
- **Framework:** Hook → Buildup → Payoff → CTA
- **Slides:**

**Slide 1 (HOOK):**
- Large: "{number or bold claim}"
- Below: "{subtext + tension}"
- Source: "{source name}"

**Slide 2 (BUILDUP):**
- "{Problem / evidence / what most people miss}"

**Slide 3 (BUILDUP or PAYOFF):**
- "{Deeper evidence OR the solution — depends on topic complexity}"

**Slide 4 (PAYOFF):**
- "{The answer / comparison / transformation + proof it works}"

**Slide 5 (CTA) — optional, only if slide 4 isn't the CTA:**
- "Comment {KEYWORD} to..."
- "Try free → mirai360.ai"
- "2 cases free. No payment. No expiry."
```

The framework is mandatory. 4 slides is the default. Use 5 only if the topic genuinely needs the extra buildup slide. Never exceed 5.

### Step 2: Generate HTML via /create-ui

From the markdown, create an HTML file with `<div class="slide">` elements at 1080x1350px. Study existing HTML at `Outreach/Instagram/carousels/feature-series/carousel-1-timeline.html` for the exact CSS design system:

- **Font:** use the Brand Profile font from Step 0 (`fonts.heading` / `fonts.body`), loaded via Google Fonts. Mirai360 default: Inter.
- **CSS variables — populate VALUES from the Brand Profile colors (Step 0), keep the NAMES:** `--navy` ← `colors.primary`, `--gold` ← `colors.secondary`, `--accent` ← `colors.accent`, `--bg-light` ← `colors.bgLight`, `--warm-gray` ← `colors.warmGray`. Mirai360 defaults shown for reference: `--navy: #1B365D`, `--gold: #C4A04A`, `--accent: #2E86C1`, `--bg-light: #FAFBFC`, `--warm-gray: #5A5550`. Never hardcode these — read them from the resolved brand.
- **Slide classes:** `.slide-light` (white bg), `.slide-dark` (navy bg), `.slide-accent` (blue CTA)
- **Components:** `.hook-title` (88px), `.slide-title` (64px), `.slide-body` (44px), `.point` (arrow lists), `.big-quote` (72px), `.brand-footer`, `.slide-counter`, `.deco-line`
- **Slides alternate** `.slide-light` / `.slide-dark` within a carousel for visual rhythm

### Instagram Safe Zones & Layout Defaults (MANDATORY)

All Instagram visuals must respect safe zones so critical content is never cropped or hidden by UI overlays. Run `node ~/.claude/skills/content-writer-distributor/scripts/validate-safe-zones.js <file.html> <format>` after every HTML render to verify.

**DEFAULT FORMAT: 1080×1080 square (1:1), center-aligned.**
This is the canonical format for every Instagram/Facebook feed post, carousel slide, and single-tile visual going forward. It crops cleanly to every placement (feed, explore, grid, reels cover, FB feed) and is the safest canvas for Indian-lawyer audiences who primarily consume on mobile.

**MANDATORY CSS for every slide/image:**
```css
.slide {
  width: 1080px; height: 1080px;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center; text-align: center;
  padding: 70-90px;
}
```
- `justify-content: center` + `align-items: center` + `text-align: center` on the slide container
- Each `<h1/h2/p/ul>` also gets `text-align: center` (inherits unless overridden)
- Only the chip-UI / data-table components may be `text-align: left` internally, but their WRAPPER stays centered on the page with `margin: 0 auto`

**Use the alternate dimensions ONLY when explicitly required:**

| Format | Canvas | When to use | Safe zone |
|---|---|---|---|
| **1080×1080 (1:1)** | Square | **DEFAULT for every IG/FB visual** | 64px side padding; full canvas usable |
| 1080×1350 (4:5) | Portrait | Only if user asks explicitly | center 1080×1080 — ≥135px top/bottom, ≥64px sides |
| 1080×1920 (Reel/Story) | Vertical | Reels, Stories only | center 968×960 — top ≥269px, bottom ≥768px (Reel) / ≥384px (Story), side ≥64px |
| 1200×630 (OG) | Landscape | Blog hero + LinkedIn OG share image | ≥60px all sides; text on one half, visual on other |

**Rules:**
- Headline, brand logo, CTA pill, and any legibility-critical text MUST sit inside the safe zone.
- Background gradients, decorative grain, and divider lines MAY extend into unsafe bands.
- Reel/Story 1080×1920 → set canvas `padding-top: 280px`, `padding-bottom: 400px` (Reel), `padding-left/right: 70px`.
- If content overflows, reduce font size or split into multiple slides — do NOT push into unsafe bands.
- If a user-provided visual needs portrait/landscape, generate a 1:1 version ALONGSIDE the requested format (never instead of).

### Step 3: Write captions

**Instagram caption** (`YYYY-MM-DD-{slug}-caption-ig.md`):
- Short, punchy, conversational
- Include comment-keyword bait: "Comment {KEYWORD} to..."
- End with: "Try free → mirai360.ai (link in bio)"
- 8-10 hashtags, always include: #LegalTech #LegalAI #LawyersOfIndia #MiraiLegal #AIForLawyers

**LinkedIn caption** (`YYYY-MM-DD-{slug}-caption.md` in `Outreach/LinkedIn/carousels/`):
- Longer, story-first, in Shivang's voice ("I watched a colleague...")
- Arrow bullets (→) for key points
- Data-backed with sources
- End with CTA + 3 hashtags: #LegalTech #LegalAI #LawyersOfIndia

### Alternating Grid Pattern

Check the last carousel's slide 1 style and use the opposite:
- Last was `.slide-light` (Grand White) → new one starts `.slide-dark` (Grand Navy)
- Last was `.slide-dark` (Grand Navy) → new one starts `.slide-light` (Grand White)

### GIF Generation (Instagram)

After the HTML is rendered, generate `carousel.gif` using Playwright:

```bash
# Render each slide to a PNG, then stitch into an animated GIF
node ~/.claude/skills/content-writer-distributor/scripts/render-gif.js carousel.html carousel.gif --delay 1500
```

- **Delay:** 1.5 seconds per slide (1500ms)
- **Canvas:** 1080×1080px per frame
- **Output:** `carousel.gif` in the content folder
- If `render-gif.js` is unavailable, render PNGs per slide and instruct the user to stitch them with any GIF tool (e.g., ezgif.com or ImageMagick).

### PDF Generation (LinkedIn)

```bash
# Render each slide to a PNG, stitch into PDF
node ~/.claude/skills/content-writer-distributor/scripts/render-pdf.js carousel.html carousel-linkedin.pdf
```

**Instagram:** HTML → Playwright → animated GIF (`carousel.gif`) → upload to Instagram
**LinkedIn:** HTML → Playwright → PNGs → PDF (`carousel-linkedin.pdf`) → upload with caption

## Channel 3: Instagram Reel (HeyGen Script)

Extract the most compelling 30-60 second story from the blog and write a script that feeds directly into HeyGen for AI avatar video generation.

**Safe-zone reminder (Reels 1080×1920):** any on-screen text, lower-third caption, CTA overlay, or avatar face must sit inside the **center 968×960 safe box** (top ≥269px / bottom ≥768px / side ≥64px). If the HeyGen avatar's head or caption drops into the bottom 40% unsafe band, Instagram's caption + icons will cover it. See Safe Zones table in Channel 2.

### Script Format

```markdown
# Reel: {Topic}
- **Date:** YYYY-MM-DD
- **Duration:** 30-60 seconds
- **Pillar:** {Stat Bomb | Feature Demo | Mindset Shift | Before/After}
- **HeyGen avatar:** Shivang (or default)

## Script

**[HOOK — 0-5 sec]**
{Opening line that stops the scroll. Lead with the biggest stat or most provocative claim from the blog. Speak directly to camera.}

**[PROBLEM — 5-15 sec]**
{Describe the pain point. Be specific to Indian lawyers. Use a concrete scenario, not abstract.}

**[SOLUTION — 15-35 sec]**
{Show what AI/Mirai does. Use 2-3 arrow points. Keep each point to one sentence.}

**[PROOF — 35-45 sec]**
{One stat with source. "According to [source], [stat]." Builds credibility.}

**[CTA — 45-60 sec]**
{Direct call to action. "Try Mirai free at mirai360.ai — 2 cases, no payment, no expiry."}

## Caption
{Same caption as Instagram carousel or a shorter version. Include hashtags.}
```

### Reel Rules
- **30-60 seconds** max — HeyGen renders the avatar speaking the script
- **Hook in first 3 seconds** — viewers decide to stay or scroll in that window
- **Conversational tone** — written to be spoken aloud, not read. Short sentences. No jargon.
- **One stat only** — reels are too short for multiple data points. Pick the strongest one from the blog.
- **End with CTA** — always "Try Mirai free at mirai360.ai"
- **No text overlays in script** — HeyGen handles the video; text overlays are added post-production if needed

## Process

### Dates
Use today's date for all outputs. If user specifies a publish date, use that instead.

### When called directly:
1. Clarify topic if vague — "What topic? Specific keyword to target?"
2. Run **Step 0** — resolve brand colors + fonts from the working directory (or default to Mirai360 and say so), then do the "Before You Write" steps
3. Write ALL files to `Outreach/content/YYYY-MM-DD-{slug}/` — blog, carousel slides, captions, reel script
4. Generate carousel HTML via `/create-ui` (1080x1080px)
5. Generate `carousel.gif` from carousel HTML (Playwright → animated GIF, 1.5s/slide) for Instagram
6. Generate `carousel-linkedin.pdf` from carousel HTML (Playwright → PNGs → PDF) for LinkedIn
7. Run `python3 blog_cms_prep.py --content-dir` for CMS JSON (outputs blog.json into content folder)
8. Create symlinks for SEO + LinkedIn browsing views (see "Symlink Indexes" section)
9. Report: content folder path + list of all files inside

### When called by marketing-advisor orchestrator:
Orchestrator passes a strategy brief (topic, keyword, pillar, stat, angle). Use directly — don't second-guess. Write all outputs to the content folder, create symlinks, report back.

### When user only wants specific channels:
Respect it. Only create what was asked for. Blog is always the pillar — if they ask for carousel without a blog, write the blog anyway (it's the source material).

## What This Skill Does NOT Do
- **LinkedIn text posts (non-carousel)** — hand off to `write-linkedin-post`
- **Marketing strategy** — that's `marketing-advisor`
- **CMS upload** — that's `blog_cms_prep.py --upload`
- **Invent statistics** — every number from validated stats bank or WebSearch with source URL
