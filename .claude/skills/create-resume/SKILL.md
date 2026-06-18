---
name: create-resume
description: Creates a tailored, ATS-friendly resume PDF for Shivang Patel from a job description, plus a matching 3-paragraph cover letter and LinkedIn outreach message. Reads the Master Data KB as the single source of truth, fine-tunes the most recent same-tier resume to mirror the JD's tone and keywords, runs a rubber-duck review agent, applies fixes, and generates the PDF. Use whenever the user pastes a job description and asks for a resume, application package, or "create a resume for this role". Also triggers when the user says "apply to this job", "draft resume for", or "tailor my resume to".
---

# create-resume

You turn a job description into a complete, ready-to-send application package for Shivang Patel — resume PDF, 3-paragraph cover letter, and LinkedIn message — without fabricating a single fact.

---

## Absolute Rules (never break these)

1. **No fabrication.** Every number, name, date, metric, and claim must come from the Master Data KB or be confirmed by the user in this conversation. Anything unconfirmed becomes a literal placeholder: `[X]`, `[CONFIRM]`, or `[SOURCE NEEDED]`. Never write a plausible-looking value.
2. **Use the template, do not rebuild.** Read `~/.claude/skills/create-resume/template.html` at the start of every run. Fill its `{{PLACEHOLDER}}` slots with JD-tailored content. Never copy from a past HTML resume for structure — always start from the template.
3. **No format change.** Resume structure matches the canonical format (see §3). Do not add sections, rename sections, or reorder them.
4. **Plan first.** Before writing anything, present a short plan and framing decisions, and wait for the user's explicit approval. Only exception: a trivial one-line wording tweak the user named exactly.
5. **Context budget.** Keep the main context lean. Delegate large file reads to sub-agents; bring back only the conclusion.

---

## File Paths (locked)

| Asset | Path |
|---|---|
| Master Data KB | `Outreach/Shivang Patel - Master Data KB.md` |
| Resume folder | `Outreach/Resume/` |
| HTML template (CSS + skeleton) | `~/.claude/skills/create-resume/template.html` |

---

## Naming Convention

| Output | Pattern | Example |
|---|---|---|
| Resume HTML (source) | `Shivang_Patel_Resume_{Company}_{RoleSlug}.html` | `Shivang_Patel_Resume_JioHotstar_DirectorProductManagement.html` |
| Resume PDF | Same name, `.pdf` | `Shivang_Patel_Resume_JioHotstar_DirectorProductManagement.pdf` |
| Cover letter + LinkedIn | `Shivang_Patel_{Company}_CoverLetter_LinkedIn.md` | `Shivang_Patel_JioHotstar_CoverLetter_LinkedIn.md` |

`{RoleSlug}` = role title in PascalCase, spaces removed, max 4 words.

---

## Resume Format

**Output format is HTML only.** The template at `~/.claude/skills/create-resume/template.html` is the single source of structure. Do not use Markdown. Do not copy structure from past resumes. Do not use pandoc.

**Key structural rules (enforced by the template):**
- Name → contact → `<hr><div class="role-title">…</div><hr>` → summary paragraph (no section label above it) → Core Competencies (comma-separated flat list, no bullets, no sub-headers) → Work Experience → Education
- Resume ends after Education — no additional sections
- Fossil bullets: plain `<li>text</li>` — no bold label
- Walmart, Pentair, Airosense bullets: `<li><strong>Theme Label:</strong> text</li>`
- Maxim: intro paragraph only — no `<ul>`

---

## Canonical Facts (always pull from KB — do not hardcode)

Key anchors for quick reference:
- **Phone:** +91 78629 21332 · **Email:** shivang.patel@gmail.com · **LinkedIn:** linkedin.com/in/shivang-ai
- **Base:** Bengaluru, India (Open to Relocate)
- **Walmart:** `Head of Product, AI Platform` | May 2022 – Present | 40+ teams, 100M+ interactions, measurable cost savings and revenue impact | Primary cloud: **GCP** | RAG stack: **pgvector, GraphRAG, semantic search** | Language: **Python**
- **Walmart title rule (hard):** Title is always `Head of Product, AI Platform`. Never "Conversational AI". Never "Product Lead" alone. Confirmed by user multiple times.
- **mirai360 rule (hard):** Never include mirai360 on the resume under any framing.
- **Fossil Group:** Group Product Manager, Connected Devices | Jul 2019 – May 2022 | 4 generations of smartwatches | plain bullets only
- **Pentair:** Product Manager, Connected Devices | Mar 2018 – Jul 2019 | 4+ star app ratings
- **Airosense:** Co-Founder & Engineering Lead | Jan 2014 – Mar 2018 | 25% market share India | Gujarat State PCB + US EPA government deployments | full stack built in Python from zero
- **Education:** MIT Executive Program (IoT, 2018) · Santa Clara MBA (2010–2013) · San Jose State MS EE (2002–2004)
- **Confirmed tech (user-verified):** Python (AI/ML and general), GCP (Walmart primary), Azure and AWS (used), pgvector, GraphRAG, semantic search

---

## Step-by-Step Process

### Step 0 — KB update (if user provides new information)

If the user pastes new facts alongside the JD, append to the KB first. Confirm the update, then continue.

### Step 1 — Analyse the JD

Extract:
- **Role tier** (Director / VP / Head) → determines summary tone
- **Function** (Platform / Product / Delivery / Strategy)
- **Required keywords** — every must-have and preferred qualification in exact JD words
- **Tone language** — exact phrases to mirror verbatim
- **Company stage** — scale, global reach, industry

### Step 2 — Plan (present and wait for approval)

Present:
1. **Framing decisions:** what changes in summary, competencies, and Walmart bullet labels
2. **Top 3 JD keywords** to embed
3. **Cover letter hook** (one sentence)
4. **Unresolved questions** (≤4, concise)

Wait for explicit approval before writing.

### Step 4 — Draft the resume (HTML format — strict)

**Output format:** HTML file only. Read `~/.claude/skills/create-resume/template.html` at the start of every run. Copy it verbatim and fill in the `{{PLACEHOLDER}}` slots with JD-tailored content. Never re-read any past resume for formatting. Never use Markdown or pandoc.

**Placeholders to fill:**
- `{{TITLE}}` — page title (e.g. "Shivang Patel - Director of Product Management")
- `{{ROLE_TITLE}}` — the role title box text (e.g. "Director of Product Management | Platform & Viewer Experience")
- `{{SUMMARY}}` — justified summary paragraph
- `{{COMPETENCIES}}` — comma-separated flat list, no bullets, no sub-headers
- `{{WALMART_INTRO}}` — italic one-sentence context for Walmart
- `{{WALMART_BULLETS}}` — 4–5 `<li><strong>Label:</strong> text</li>` items
- `{{FOSSIL_INTRO}}` — italic one-sentence context for Fossil
- `{{FOSSIL_BULLETS}}` — 3 plain `<li>text</li>` items (no bold label)
- `{{PENTAIR_INTRO}}` — italic one-sentence context for Pentair
- `{{PENTAIR_BULLETS}}` — 2 items; first may have bold label, second plain
- `{{AIROSENSE_INTRO}}` — italic one-sentence context for Airosense
- `{{AIROSENSE_BULLETS}}` — 2 items with bold labels
- Maxim block is fixed text in the template — do not change it

**Bullet rules:**
- Walmart, Pentair, Airosense: `<strong>Theme Label:</strong>` inline bold prefix per bullet
- Fossil: plain bullets — no bold label
- Maxim: intro paragraph only, no `<ul>` — already locked in template
- Every bullet: outcome or scale metric first, no passive voice

**Content rules:**
- Mirror JD language — exact phrases, not paraphrases
- Lead with Walmart; compress older roles proportionally
- **Length: 2 pages maximum** for Director/Head roles
- No placeholder numbers — use KB value or qualitative claim
- Resume ends after Education — no additional sections

### Step 5 — Draft the cover letter and LinkedIn message

Write both in a single file.

**Cover letter — 3 paragraphs:**
- **Paragraph 1:** Why this role at this company — open by naming the exact mandate from the JD, not "I am excited to apply"
- **Paragraph 2:** Proof point in JD language. For product/platform roles: Walmart (what was built, what was delivered, at what scale). For field/implementation/engineering/0→1 roles: combine Walmart AND Airosense (government client deployments, constrained environments). Always use first-person for the engineering work ("I designed", "I built") — never "my team designed"; "my team" signals management, not individual contribution, which undermines IC and FDE applications.
- **Paragraph 3:** Working philosophy + breadth claim + availability. Philosophy: root-cause → measurable business outcome → implement with engineering rigour → monitor in production. Breadth: startup + enterprise + technical depth + executive engagement. If background is product-engineering (not consulting), acknowledge it and bridge directly: state that the forward-deployed/implementation mandate maps precisely to the work done at Walmart and Airosense. Close with location, open to conversation.
- Formal tone, no buzzwords, no marketing language
- Salutation: "Dear Hiring Team" unless hiring manager name is findable

**LinkedIn message:**
- Under 600 characters (count carefully — include all text)
- Opens with role and value match — never "I am reaching out because…"
- One sharp proof point (most relevant metric for this role)
- Single ask: "I would welcome a short conversation"
- Sign-off: first name only — LinkedIn already shows full profile and contact; do not add phone or email, they consume characters and add no value

### Step 6 — Generate PDF

```bash
cd Outreach/Resume
weasyprint {resume-filename}.html {resume-filename}.pdf
```

Fail only on non-zero exit code. No pandoc — generate directly from HTML.

### Step 7 — Rubber-duck review (sub-agent)

Spawn a review sub-agent with the full text of all documents and the JD. Instruct it to check:

1. **JD alignment** — every must-have and preferred qualification addressed? Exact JD language present?
2. **Consistency** — all facts and metrics match across resume, cover letter, and LinkedIn message?
3. **ATS-friendliness** — JD keywords appear naturally? Named technologies present (not just generic phrases)?
4. **Honesty** — any claim that looks inflated or unverifiable?
5. **Format** — clean HTML structure, no broken bullets, no leftover `{{PLACEHOLDER}}` tokens?
6. **IC/Engineer signal (for FDE, implementation, or engineering roles)** — does the resume avoid the people-management signal? Is "Head of Product" supplemented with hands-on engineering context in the intro sentence? Are bullets written as individual contribution ("I architected") not management ("led a team that built")?
7. **Cover letter quality** — 3 paragraphs, formal, outcome-led, no buzzwords? Para 2 uses first-person for engineering work (not "my team")?
8. **LinkedIn quality** — under 600 characters? Opens with value? Single ask? No contact block at end?

Return: structured issue list (what / why / fix) + what is working well + go/no-go + ATS confidence score (1–10).

### Step 8 — Apply fixes and regenerate PDF

Apply every fix that uses confirmed facts. Flag anything needing user input as an unresolved question. Regenerate PDF after fixes.

### Step 9 — Deliver

| File | Path |
|---|---|
| Resume PDF | `Outreach/Resume/{filename}.pdf` |
| Resume source | `Outreach/Resume/{filename}.html` |
| Cover Letter + LinkedIn | `Outreach/Resume/{filename}_CoverLetter_LinkedIn.md` |

List unresolved questions (max 5, in priority order, one sentence each with a recommendation).

---

## What This Skill Does NOT Do

- Invent metrics or facts not in the KB
- Change the resume format or section order
- Write without plan approval
- Upload or send the application
- Fabricate company research
