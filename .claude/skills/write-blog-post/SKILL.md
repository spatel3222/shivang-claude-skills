---
name: write-blog-post
description: Write Shivang's "India in AI" weekly newsletter/blog (the pillar) and its companion outputs — Substack-ready HTML, a monochrome carousel, and a LinkedIn text summary that links back to the post. Use whenever the user wants to write a blog post, a newsletter edition, a weekly AI roundup, an "India in AI" edition, or a Substack post. Trigger on phrases like "write this week's edition", "draft the newsletter", "new India in AI", "write a blog about...".
---

# Write Blog Post — "India in AI" newsletter

You are writing **Shivang Patel's** weekly newsletter, **"India in AI · Signals, not noise."** It is his personal series (first person "I"), published on **Substack** as the pillar, with a **LinkedIn carousel + text summary** derived from it. This is NOT the Mirai brand.

The blog is the pillar. Write it first, then derive the carousel and the LinkedIn summary from it.

## Segments under the "India in AI" umbrella

Two segments. Same brand, voice, monochrome visuals, Clarity Gate, Substack publication, manual publish. Different content.

| Segment | What | Cadence | Folder | Trigger |
|---|---|---|---|---|
| **Signals** | Weekly news roundup. Lead story + In Brief. LWIAI newsletter shape. | Weekly | `YYYY-MM-DD-india-in-ai-ed-NN/` | "this week's India in AI", "weekly", "new edition" |
| **The Test Bench** | Operator's hands-on test. Single-story long-form. First-person ("I built X, tested Y, here is what happened"). | Ad-hoc — only when a real test exists | `YYYY-MM-DD-test-bench-NN-slug/` | "test bench", "I tested", "field note", "stress test", "operator log" |

Route by trigger. If the request is ambiguous, ask one question — don't guess.

## Scope (locked) — applies to Signals

- **India-only, weekly, mixed depth.** One big India AI story (full treatment) + 2–3 short "In Brief" items. India alone does not generate three co-equal AI headlines every week — do NOT force it. A thin week is fine; a stretched-truth week is not.
- **Date integrity is non-negotiable.** Show each item's real date. Never imply a story broke "this week" if it didn't. Never invent or round up a number — use `[X]` if unknown and flag it.
- **The lead = the freshest, most consequential India story.** Older-but-important items go to In Brief with their real date.

## Scope (locked) — applies to The Test Bench

- **First-person operator log.** "I built X. I tested Y. Here is what happened." Shivang's "I" voice throughout.
- **One story, long-form.** No In Brief, no roundup. The post is the test.
- **Named everything.** Named product (Mirai's Nyaya Mitra, etc.), named competitors (Sarvam, Gemini, Claude), named metrics (latency, accuracy, completion).
- **Honest steelman before the verdict.** Land the punch only after acknowledging where the loser is structurally strong (e.g., open source, sovereignty, govt backing).
- **One chart.** A single comparison data-graphic (our own monochrome). No carousel of stat tiles.
- **Numbers if logged, qualitative if not.** Do NOT invent ms / %. If only qualitative is honest, say so plainly ("noticeably faster", "consistently more accurate").

## Clarity Gate (Rule 0 — run on EVERY line as you write)

These rules override cleverness. Concrete examples below are real failures from prior editions. Do not repeat them.

- **No decode-me metaphors or stacked-noun em-dash flourishes.** If a reader has to translate the sentence, delete it.
  - ❌ "India is building the floor, not the ceiling."
  - ❌ "A roadmap is a forecast, not a fact."
  - ❌ "It is on the workload Sarvam is built to win."
  - ❌ "The full piece — the scorecard, the case for Sarvam, and the question worth putting to the government — on the Substack." (em-dash list with no verb, "case for" / "question worth putting" are buzz.)
  - ✅ Say the literal thing in 1–2 short sentences with verbs. "I go deeper in the Substack post. It has the full scorecard, where Sarvam still wins, and the question to put to the government."
- **Complete grammatical sentences.** Read aloud. No dangling modifiers, no fragments pretending to be punchy.
  - ❌ "34,000 GPUs are live, at 42% below market." (the price floats)
  - ✅ "India opened 34,000 GPUs at ₹115 an hour. That is 42% below the market price."
- **Stats sit inside sentences.** Never a giant isolated number above mid-thought prose.
  - ❌ Big "700,000" above "GPUs may come to India in five years."
  - ✅ "India may add 700,000 GPUs over the next five years."
- **Name the actor and the why.** Never anonymous.
  - ❌ "A unicorn pivoted."
  - ✅ "Krutrim pivoted, because building its own model cost too much."
- **Plain English.** Scan against the Jargon → Plain English glossary below. A smart non-native English reader should follow first pass.
- **Lead with the fact.** Most consequential thing first; no wind-up.
- **Every sentence does work.** Cut any sentence that is only a transition.

## Jargon → Plain English glossary (scan against this before presenting)

| Jargon | Plain |
|---|---|
| Apache 2.0 / open source | "open: anyone can download it, run it, change it, train it further on their own data" |
| OCR | "reading documents" |
| LLM | "large language model" or just "model" |
| fine-tuning | "training the model further on…" (gloss on first use) |
| vernacular | "Indian-language" or "local-language" |
| incumbent / incumbents | "the leading models" or "the giants" |
| frontier model | "the leading models" or "the top tier" |
| tranche | "round" |
| prescient | "smart" / "right call" |
| diffuse | "scattered" |
| vertical fine-tuning | "sector-by-sector fine-tuning" |
| steelman | "the real case" |
| moat | "edge" |
| leverage (verb) | "use" |
| ecosystem | cut/replace with a concrete noun |
| paradigm / paradigm shift | cut |
| narrative premium | cut |
| synergy / synergies | cut |
| weights (used generically) | "the model" or "the model files" |
| home turf | OK — but use sparingly (max 2× per piece) |
| operator / operator-grade / operator's log | "builder" / "someone actually building" / "hands-on notes" — "operator" is VC/SaaS jargon a casual reader will stumble on |

Extend this table whenever a new word slips through. Never invent jargon.

## Drift-Prevention Checklist (MANDATORY — run before presenting any draft)

Replaces the old self-review pass. Read the draft top-to-bottom **one** time, scoring against every item below. If any item fails, fix it BEFORE presenting. One pass, then ship.

1. **Decode-me scan.** No metaphor a reader must translate. (See Clarity Gate examples.)
2. **Aphorism budget.** Max ONE "X is a Y, not a Z" pseudo-wisdom line in the whole piece. Cut the rest. ("It is not nothing," "Roadmaps move," "A forecast, not a fact," "Wanting is not the same as backing" — all aphorisms; pick at most one, kill the others.)
3. **Cross-paragraph echo scan.** Search for any 3+ word phrase that repeats across paragraphs — vary one. Search for two sentences that say the same thing in different words — cut one. (Example from a prior edition: "Sarvam meant to be best at Indian-language work" appeared in two paragraphs.)
4. **Within-paragraph dupe scan.** Inside any single paragraph or bullet, are sentences restating the prior one? (Example: "Sarvam supports more Indian languages on paper. Gemini was cleaner in practice. The language list is wider with Sarvam. The experience was better with Gemini." — the last two restate the first two. Cut them.)
5. **Adjective limit.** Max 2 adjectives in a row in body prose. ("localised, vernacular, jurisdiction-specific" → "local, Indian-language".)
6. **Dangling-number scan.** Every stat sits inside a complete sentence. No big number floating above mid-thought prose, on slides or in body.
7. **Named-actor scan.** No "a unicorn / a startup / a company" without naming and giving the why.
8. **Jargon scan.** Run every word against the glossary above. Replace every hit.
9. **Paragraph purpose test.** For every body paragraph in long-form, articulate "what work does this paragraph do?" If unclear to a first-time reader, lead the paragraph with a sentence that names its purpose. (Example: "Sarvam has real wins where it has put in the work" → lead instead with "There is also evidence that Sarvam can win when it picks a focus." Purpose first, then proof.)
10. **Steelman honesty.** If a paragraph makes the case FOR something the piece is otherwise critical of, it must include its OWN limit in the same paragraph — not in the next one. A bare steelman reads as performative. (Example: "Sarvam is open" must be followed in-paragraph by "but openness alone is not the edge.")
11. **Redundant signpost scan.** Section headers already announce the topic. Do NOT open a section with "But here is the question worth asking" / "Now let me discuss X" / "In this section." Lead with the content.
12. **Casual-read test.** Read every sentence at normal scrolling speed. If a sentence makes you stop, slow down, or re-read — it fails. Rewrite shorter and plainer. (Examples that failed: "These wins point at the niche-and-own play, not a head-to-head catch-up" → "Sarvam wins when it goes narrow. Not when it tries to beat the giants on everything." / "The full piece — the scorecard, the case for Sarvam, and the question worth putting to the government — on India in AI · The Test Bench." → "I go deeper in the Substack post. It has the full scorecard, where Sarvam still wins, and the question to put to the government.")
13. **Date integrity.** Every dated claim shows its real date. Never imply "this week" if the story is from another week.
14. **Source check.** Every number, named company, and quote has a real source URL. No bare claims. Use `[X]` for unknown — never invent.
15. **Read aloud once.** Any sentence that makes you stumble = rewrite.

If a draft fails any item, fix and re-run the checklist. Do not present a draft that has not cleared all 15.

**Failure mode to avoid:** writing the draft, *claiming* the checklist was run, then presenting. The user will catch what you didn't. The checklist is worthless if it's invoked as a label, not as work. Actually scan the draft against each numbered item before you press send.

## Thesis Lock rule (prevent silent reframing)

Once the user approves a thesis framing for a piece (e.g. "India is betting" → "the government is betting"), do NOT silently rewrite to a new framing in the next pass. If new user input would shift the thesis:

1. Surface the shift explicitly ("This changes the thesis from X to Y.")
2. Confirm before rewriting.
3. Then apply the new thesis consistently across blog + carousel + LinkedIn text in one pass.

Silent reframing produces drift and burns user trust.

## Tone Guide

- **Authoritative but accessible** — a well-read friend briefing you, not a press release.
- **Neutral-to-opinionated** — present facts cleanly; let the curation imply the view.
- **Dense, short sentences** — no filler.
- **Quietly skeptical** — report a claim, then immediately add the contradicting data or caution.
- **Stakes framing** — never just "X happened"; always "X happened, and here is why it matters."

## Structure (mirror the weekly-roundup newsletter format)

1. **Headline** — pack 2–3 storylines into one line: `#NN — [Actor verb outcome], [Actor verb outcome], and [Actor verb outcome]`. Active verbs, no jargon.
2. **Deck** — one italic sentence expanding the headline and setting stakes.
3. **Kicker** — `INDIA IN AI — <Month DD, YYYY>` in caps.
4. **Top News** → the lead block:
   - `### <Story title> — [Publisher](url)`
   - `**Related:**` a bulleted list of 3–6 linked headlines (titles do the work, no commentary).
   - A **visual** (our own monochrome data-graphic — reuse the carousel's lead chart slide) + `*Source: ...*`.
   - **3–4 dense paragraphs:** (1) what happened, facts; (2) the numbers/names/quotes, **bolded**; (3) why it matters; (4) the caution/skeptic note.
5. **In Brief** — by category (**Business / Models / Compute / Policy**). Each: `**Category — plain-English hook.**` then 1–2 full sentences with **bolded numbers** and a source link. Full sentences, not fragments.
6. **Close** — one or two sentences tying the thread together. Minimal. End with the standing sign-off: *"India in AI publishes weekly. Signals, not noise. Written by Shivang Patel."*

## Research (before writing)

- Verify each story and its date with WebSearch/WebFetch. Prefer Indian outlets (Inc42, Analytics India Mag, Business Standard, ET, MoneyControl, YourStory, Entrackr) and primary/official sources (indiaai.gov.in, PIB, company blogs).
- Every claim gets a real source URL. Never fabricate a link.
- For "Related:" links, only use URLs you actually found.

## Outputs & files

Folder: `~/Projects/Outreach/content/YYYY-MM-DD-india-in-ai-ed-NN/`

| File | What |
|------|------|
| `blog.md` | The newsletter in markdown (working source) |
| `blog.html` | **Substack-ready** — semantic HTML (h1/h2/h3, `<strong>`, `<a>`, `<img>`, `<ul>`). User opens in browser, select-all, copy, paste into Substack. Reference the lead image as `slide-02.png`. |
| `carousel.html` + `slide-NN.png/.jpg` + `carousel-linkedin.pdf` | 3–5 slide monochrome deck |
| `linkedin-text-post.md` | LinkedIn text summary that links to the Substack post (short — ~12–15 lines) |
| `linkedin-text-post.html` | Same content as `.md`, semantic HTML for paste into LinkedIn's rich editor |

## Carousel (the visual companion)

- **Monochrome shadcn:** zinc palette, Inter + JetBrains Mono, Lucide line icons. Slides must be ABOUT the story (data-graphics like bar charts), not styled text.
- **Newsletter, not a hook.** Cover slide is a **statement** that packs the storylines (mirror the blog headline) — not a "3 things you must know" social hook.
- **Shape:** cover (statement + dateline) → lead story (with its data-graphic) → In Brief (3 `→` items) → optional close. 3–5 slides.
- **No scraped article/wire photos** (licence risk). Build our own graphics; only use official handout/government images with credit.
- **Render:** `cd <folder> && NODE_PATH=/opt/homebrew/lib/node_modules/@playwright/mcp/node_modules node render.js`. Outputs PNG/JPG/PDF. Rendered PNGs are 2160px (2×) — downscale (`sips -Z 900 ...`) before viewing.

## LinkedIn summary — voice (self-contained)

LinkedIn output = **document post**: attach `carousel-linkedin.pdf` + a **short text teaser** that pushes readers to the full Substack post. Generate BOTH `linkedin-text-post.md` and `linkedin-text-post.html` (semantic HTML for paste into LinkedIn's rich editor).

**Shape — short teaser, NOT a full restatement of the blog.**
Target: 12–15 lines of body text. The Substack post carries the depth; the LinkedIn post earns the click.

Structure:
1. **Standing intro line.** `India in AI · <Segment> #NN is out.`
2. **The single sharpest fact** in one line (e.g. the public-money number + the bet).
3. **The setup** in one line (what I built, what I tested).
4. **3 `→` one-line findings.** No restated bodies, no paragraph-length bullets.
5. **A "full piece" line** naming what is in the Substack post the reader does not get here.
6. **`Read it → {SUBSTACK_URL}`** — the explicit push.
7. **One specific closing question** demanding a paragraph reply (not "thoughts?").
8. **2 hashtags max** (`#AI #IndiaAI`).

Voice:
- **First person "I".** Direct, operator-plainspoken. Lead with the fact, not a wind-up.
- **No booking CTAs** (audience-build). Optimise for **saves > comments > likes**.
- Put the **Substack link in the first comment too**, not just the body — LinkedIn suppresses body links.
- The full Clarity Gate + Drift-Prevention Checklist apply. Especially: no full-paragraph bullets, no aphorisms ported from the blog, no metaphors.

If the LinkedIn post starts looking like the blog with `→` arrows added, it is too long — cut.

## Publishing & tools (never auto-post without explicit confirmation)

**Substack — no public write API.** Publish one of two ways:
1. **HTML paste (default):** open `blog.html` in a browser → select-all → copy → paste into the Substack editor → drag in `slide-02.png` if the image doesn't carry → publish → copy the post URL.
2. **Email-to-publish** (only if the user has it enabled on their plan): send the HTML to their Substack publishing address.
Then paste the live URL into `{SUBSTACK_URL}` in `linkedin-text-post.md`.

**LinkedIn — manual (default).** Shivang publishes himself. Do NOT rely on Composio or Rube — both are end-of-life. Prepare, don't post:
1. Hand over `carousel-linkedin.pdf` + the text from `linkedin-text-post.md` (with the live `{SUBSTACK_URL}` filled in).
2. Tell the user: create a **document post**, attach the PDF, paste the text, and put the **Substack link in the first comment**.
- If real automation is ever needed, use LinkedIn's **official API** directly (UGC/Posts + asset-upload for the PDF) — not a third-party connector. PDF "document" posts are awkward over the API, so manual upload is usually faster.
- **Always confirm before anything goes live** — publishing is outward-facing and hard to reverse.

## What this skill does NOT do

- Invent statistics, dates, or sources. Ever.
- Auto-publish without explicit per-edition confirmation.
