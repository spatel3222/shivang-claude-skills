# YC lenses → graph queries

Each lens below is a way YC partners pressure-test an idea. For each, the lens names
the question, the graph nodes to pull, and the query to run. Pick the 2–3 lenses the
idea actually turns on — do not run all of them. Node labels are drawn from the local
graph built over the YC startup-library and AI-services corpus; if a label has moved,
run `graphify query` with the concept words and follow the closest node.

## How to use this file

1. Read the idea, decide which lenses it lives or dies on.
2. Run the listed query to ground the lens in the corpus.
3. Quote `src=` / `loc=` from the output when you cite.
4. Translate the founder's words into the graph's vocabulary before querying — a
   wording mismatch collapses the traversal to noise.

---

## 1. Founder-market fit — "Why you?"
The first thing YC funds is the team's unfair relationship to the problem. A great
idea with no founder edge loses to a worse idea with a founder who lives the problem.
- Nodes: `Founder-Market Fit`, `Recipe 1: Team Unfair Advantage`, `Idea Quality Score Formula`
- Query: `graphify query "founder-market fit"` · `graphify explain "Idea Quality Score Formula"`
- Sharp question: "What do you understand about this problem that almost no one else does?"

## 2. Is this a real problem? — idea quality
Most startups solve a problem the founder doesn't actually have, or help users they
don't care about. The graph catalogs these failure modes explicitly.
- Nodes: `Finding a Promising Idea`, `Schlep Blindness`, `Solving a Problem You Don't Care About`,
  `Solution In Search of a Problem (SISP)`, `Real Trends vs Fake Trends`
- Query: `graphify query "how to get startup ideas"` · `graphify query "schlep blindness"`
- Sharp question: "Did this idea come from a problem you hit, or an idea you liked?"

## 3. Do things that don't scale — early traction
The defining YC mindset: the first 100 users are recruited by hand. If the plan is
"we'll grow by viral/word-of-mouth/ads", that is usually a tell that the founder
hasn't done the unscalable work yet.
- Nodes: `Do Things That Don't Scale`, `Manual User Acquisition`, `Collison Installation`,
  `Delighting Users`, `Contained Fire Strategy`
- Query: `graphify query "do things that don't scale"` · `graphify explain "Collison Installation"`
- Sharp question: "What's your version of Airbnb shooting apartments door to door?"

## 4. MVP & the startup curve — shipping
What is the smallest thing you can put in a user's hands this week, and are you
braced for the trough of sorrow after launch?
- Nodes: `Minimum Viable Product (MVP)`, `The Startup Curve`, `Trough of Sorrow`, `Bias Toward Action`
- Query: `graphify query "minimum viable product"` · `graphify query "build an MVP"`
- Sharp question: "What can a real user touch on Friday? If the answer is months away, why?"

## 5. Market & business model — size and money
Is the market big or fast-growing, and does the model actually print money? YC favours
markets growing fast over markets merely large today.
- Nodes: `YC Guide to Business Models`, `Marketplaces`, `Network Effects`,
  `Competitive Advantage / Monopoly Effect`, `Transactional Business Model`,
  `Exponential Market Growth`, `Why Startups Win`
- Query: `graphify query "business models"` · `graphify query "marketplaces network effects"`
- Sharp question: "Why is this market about to get much bigger, fast — not just large?"

## 6. AI-services economics — services as software
For AI-services / "services as software" ideas, the graph holds a specific thesis:
pick the right market, make the human the interface (not the product), and let AI
operating leverage drive software-like margins. Sell outcomes, not seats or tokens.
- Nodes: `Services as Software`, `Four Market Traits (Low Trust, Low Judgment, High
  Intelligence Threshold, Regulation)`, `Human Is the Interface, Not the Product`,
  `AI Operating Leverage`, `P&L Margin Opportunity`, `Sell Outcomes, Not Seats or Tokens`,
  `Variance Is the Existential Problem`
- Query: `graphify query "services as software"` · `graphify explain "Four Market Traits"`
- Sharp question: "Are you selling an outcome, or a co-pilot the buyer has to operate?"

## 7. AI-native company — the company brain
For ideas about how the company itself runs (not the product), the graph has the
"legible company / closed-loop / company brain" thesis: copilots are the wrong mental
model, middle management compresses, the org becomes a self-improving loop.
- Nodes: `AI-Native Company`, `Closed-Loop System`, `Company Brain`,
  `Copilots Are the Wrong Mental Model`, `Middle Management Is Over`,
  `Burn Tokens, Not Headcount`, `Revenue Per Employee`
- Query: `graphify query "AI-native company closed loop"` · `graphify explain "Company Brain"`
- Sharp question: "Is AI a feature bolted on, or the operating system of how this runs?"

## 8. First customers & distribution — getting to revenue
How do the first paying users actually appear, and is there a real sales funnel with
early adopters and a money-back guarantee, or just hope?
- Nodes: `How to Get Your First Customers`, `Early Adopters`, `Sales Funnel`,
  `Money-Back Guarantee`, `Talk to Users First`
- Query: `graphify query "first customers"` · `graphify query "early adopters sales funnel"`
- Sharp question: "Name the first ten customers. Real names. How do you reach each one?"

## 9. Pitch deck — the seed narrative
For a deck, map the slides to the YC template and find the weak or missing slide.
The market slide and the "why now" are the usual failure points.
- Nodes: `Seed Round Pitch Deck Template`, `Problem Slide`, `Market Slide`,
  `Solution Slide`, `Business Model Slide`, `The Ask Slide`, `Secret Sauce / Insights Slide`
- Query: `graphify query "seed pitch deck template"` · `graphify explain "Market Slide"`
- Sharp question: "Which slide will an investor poke first — and is it your weakest?"

## 10. Fundraising mechanics — the round
If the ask is about raising, ground the instrument and terms in the seed-fundraising
material rather than guessing.
- Nodes: `Seed Capital`, `Simple Agreement for Future Equity (SAFE)`, `Convertible Debt`,
  `Equity Round`, `Valuation`, `Traction`, `Angel Investor`, `Venture Capitalist`
- Query: `graphify query "seed fundraising SAFE"` · `graphify explain "Simple Agreement for Future Equity (SAFE)"`
- Sharp question: "What does this round buy you — which milestone, and is it fundable after?"

## 11. First-time-founder mistakes — the meta-check
Before you finish, scan the idea against the catalogued first-time-founder traps.
- Nodes: `Common Mistakes First-Time Founders Make`, `Cargo Cult Startup`,
  `Not Launching`, `Choosing Co-Founders You Don't Know Well`,
  `Not Having Transparent Conversations with Your Co-Founders`
- Query: `graphify query "common mistakes first-time founders"`
- Sharp question: "Which of the classic first-timer traps are you closest to right now?"

---

## Picking lenses fast

| The input is… | Lead with lenses |
|---|---|
| A raw idea / "is this worth building" | 1, 2, 5 |
| A pre-product founder unsure of direction | 1, 2, 11 |
| A growth / GTM plan | 3, 8, 5 |
| An AI-services / agency-style idea | 6, 5, 8 |
| An AI-native company / org-design idea | 7, 6 |
| A pitch deck | 9, 5, 1 |
| A fundraising question | 10, 5 |
| "We have users but we're stuck" | 4, 3, 8 |
