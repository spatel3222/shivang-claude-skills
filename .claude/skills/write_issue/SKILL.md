---
name: write_issue
description: Create GitHub issues using structured framework with repo confirmation, assignee support, batch mode, and raw console log passthrough.
---

# write_issue

Create GitHub issues with structured format. Supports batch creation and assignees.

## When to Use
- Creating bug reports
- Feature requests
- Test issues
- Any GitHub issue creation

## Issue Naming Convention

| Level | Format | Example |
|-------|--------|---------|
| Epic (L1) | `[Module] Epic - Title` | `[Research] Epic - AI Legal Research` |
| Feature (L2) | `[Module][Feature] Title` | `[Research][Chat] Chat Interface` |
| Sub-feature (L3) | `[Module][Feature][Sub] Title` | `[Research][Chat][CoT] Chain of Thought Display` |

**Known Modules:** `onboarding`, `case`, `prepare`, `timeline`, `research`

## Labels

| Category | Labels | Usage |
|----------|--------|-------|
| **Level** | `L1`, `L2`, `L3` | Epic, Feature, Sub-feature |
| **Module** | `onboarding`, `case`, `prepare`, `timeline`, `research` | Feature area |
| **Priority** | `H`, `M`, `L` | High, Medium, Low |
| **Team** | `BE`, `FE`, `AI`, `UX` | Responsible team(s) |

**Example:** `--label "research,L2,BE,AI,H"`

## Epic Template

When creating Epics (L1), use task list to link child issues:

```markdown
# [Module] Epic - Title

## Overview
[Description]

## Child Issues (L2/L3)
- [ ] #XX [Module][Feature] L2 Feature
  - [ ] #XX [Module][Feature][Sub] L3 Sub-feature
- [ ] #XX [Module][Feature2] Another L2 Feature

## PRD Reference
[Link to PRD if available]
```

## Handling Existing Issues

Before creating new issues, check for duplicates:
```bash
gh issue list --repo [repo] --state all --limit 100
```

**If similar issue exists:**
- Update title with naming convention
- Add proper labels
- Update body with PRD reference

```bash
gh issue edit [#] --repo [repo] --title "[New Title]" --add-label "labels"
```

**Close duplicates:**
```bash
gh issue close [#] --repo [repo] --comment "Closing as duplicate of #XX"
```

## PRD References

Link to PRD when available. PRD folder: `/Docs/Product/PRD/Lawyer/`

| Module | PRD File |
|--------|----------|
| Onboarding | UserOnboarding_MVP_02012026_PRD.md |
| Case | CaseManagement_MVP_08122025_PRD.md |
| Prepare | Prepare_TabularView_01122025_PRD.md |
| Research | Research_MVP_01122025_PRD.md |

## Execution Framework

### Phase 1: Repository Confirmation (First Use Per Session)
**Default repo:** `mirai360-ai/legalai-backend-cloudrun-`

ASK USER:
```
Create issue in `mirai360-ai/legalai-backend-cloudrun-`? (Y/n)
```

- If "Y" or "y" → use default repo
- If "n" → ASK: "Which repo? (owner/repo format)"
- Store confirmed repo for remainder of session

### Phase 2: Issue Information Collection

**MANDATORY: Never fabricate information. If user doesn't provide, ASK explicitly.**

Collect the following:

| Field | Required | Prompt |
|-------|----------|--------|
| Title | Yes | "Issue title?" |
| Issue Description | Yes | "What is the issue?" |
| Expected Behavior | Yes | "What is expected?" |
| Screenshot/Video | No | "Screenshot/Video link? (or N/A)" |
| Testing Assets | No | "Testing doc/material/asset location? (or N/A)" |
| Assignee | No | "Assign to? (GitHub username or skip)" |

### Phase 2.5: Sub-Task Breakdown (For Feature Requests)

**When:** If issue is a feature request or complex task, break it down into sub-tasks by team.

**Process:**

1. **Analyze the task** and identify which teams are needed:
   - **UX** → UI design, wireframes, user flows (Cyrus)
   - **BE** → APIs, database, server logic (Arpan)
   - **FE** → UI implementation, components (Harsh)
   - **AI** → LLM, agents, ML features (Khush)
   - **Arch** → Infrastructure, system design (Abdul)

2. **First Pass:** Auto-identify required teams based on task:
```
Feature: "[Feature Name]"

Teams Required (my assessment):
| Team | Needed? | Reason |
|------|---------|--------|
| UX   | ✓/✗     | [why]  |
| BE   | ✓/✗     | [why]  |
| FE   | ✓/✗     | [why]  |
| AI   | ✓/✗     | [why]  |
| Arch | ✓/✗     | [why]  |

Confirm teams needed? (Y/modify)
```

3. **Break into Sub-Tasks by Team:**
```
Proposed Sub-Tasks for "[Parent Issue Title]":

| # | Sub-Task | Team | Assignee | Priority |
|---|----------|------|----------|----------|
| 1 | [UX task] | UX | @cyaborata | High |
| 2 | [BE task] | BE | @arpan8925 | High |
| 3 | [FE task] | FE | @ShikshaFinder | Med |

Questions:
- Add/remove/modify any sub-tasks?
- Change priority or assignees?
- Create as separate issues or checklist?
```

4. **User confirms** → proceed with creation

**Creation Options:**

| Option | When to Use | Format |
|--------|-------------|--------|
| **Checklist in Parent** | Simple tasks, same team | `- [ ] Sub-task 1` in body |
| **Separate Issues** | Cross-team tasks, different assignees | Individual issues linked to parent |
| **Hybrid** | Mix of both | Checklist + linked issues |

**If Separate Issues:**
- Create parent issue first
- Create sub-task issues with prefix: `[Parent #XX] [Team]`
- Example: `[#38] [BE] Implement Razorpay webhook handler`
- Link sub-tasks in parent issue body:
```markdown
## Sub-Tasks by Team
**UX:** #XX - Design payment flow
**BE:** #XX - Implement Razorpay API
**FE:** #XX - Build payment UI
```

### Phase 3: Issue Creation

1. Format issue body in markdown:
```markdown
**Issue:**
[user provided description]

**Expected:**
[user provided expected behavior]

**Screenshot/Video:**
[user provided or N/A]

**Testing document/material/asset location or file:**
[user provided or N/A]
```

2. Execute command:
```bash
gh issue create --repo [repo] --title "[title]" --body "[body]" --assignee "[username]"
```
(Omit `--assignee` if not provided)

3. **CRITICAL: Paste console output EXACTLY as returned. Never modify.**

4. **Add to Project Board (Auto):**
```bash
gh project item-add 1 --owner mirai360-ai --url [issue_url]
```
- Default project: `mirai360-ai` org, Project ID `1`
- Extract issue URL from step 2 output
- If auth scope error occurs, prompt user to run: `gh auth refresh -s read:project,project`

### Phase 4: Batch Mode

After each issue created, ASK:
```
Create another issue? (Y/n)
```

- If "Y" → repeat Phase 2-3
- If "n" → show summary of all created issues

### Phase 5: Summary

Display:
- Total issues created
- List of issue URLs
- Standard output format

## Team Members & Roles

| Name | GitHub Username | Role | Assign When |
|------|-----------------|------|-------------|
| Cyrus | cyaborata | UX Designer | UI components, wireframes, design systems |
| Arpan | arpan8925 | Backend (BE) | APIs, database, server logic, integrations |
| Harsh | ShikshaFinder | Frontend (FE) | UI implementation, React components, styling |
| Khush | khushpatel2002 | AI/Agentic | AI features, LLM integration, agents, ML |
| Abdul | abdulmirai360ai | Architecture | System design, infra, DevOps, architecture |

## Rules

1. **NEVER fabricate information** — always ask if missing
2. **Paste console log as-is** — no modifications to gh output
3. **Repo confirmation only once per session** — remember choice
4. **Markdown format** — issue body uses markdown bold headers

## Output Format

End every response with:
```
Skills: write_issue
Agents: [if used]
Tools: [tools used]
TimeStamp: [Date Time] (India Standard Time)
```

## Project Board Configuration

| Setting | Value |
|---------|-------|
| **Default Org** | mirai360-ai |
| **Default Project ID** | 1 |
| **Project URL** | https://github.com/orgs/mirai360-ai/projects/1 |

**Required Auth Scope:** `read:project,project`

If missing, run:
```bash
gh auth refresh -s read:project,project
```

---
Version: 1.3
Last Updated: Jan 3, 2026
