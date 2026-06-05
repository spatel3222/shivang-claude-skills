---
name: deployment-cost-analysis
description: >-
  Post-deployment cloud cost guardrail for GCP Cloud Run + Cloud Scheduler + MongoDB Atlas.
  Use this skill whenever a deployment finishes, when handing off from /write_code, /fix-bug,
  or /run-tester, or when the user mentions cloud cost, a billing spike, "why is my GCP/Atlas
  bill high", Cloud Run scaling, min-instances, always-on instances, Cloud Scheduler frequency,
  or MongoDB Atlas cluster sizing. It audits scaling and DB config against known cost-control
  norms, validates real spend with billable instance-time (not the lagging dollar console),
  reports each cost driver with an estimated monthly saving, and — after user consent — applies
  low-risk fixes directly (min-instances, scheduler pause, Atlas tier resize) or hands code
  changes back to /write_code. Run it as the standard post-deploy step so cost spikes and bad
  scaling/DB decisions are caught before they accrue, not after the invoice.
---

# Deployment Cost Analysis

A guardrail that runs **after a deployment** to catch cost spikes and bad scaling/DB
decisions early, then fixes them with the user's consent. The norms here were learned the
hard way on a real system where a 95% cost reduction came purely from configuring scaling and
database tiers correctly — nothing was wrong with the code.

## Why this skill exists

Cloud platforms bill for *provisioned capacity*, not *useful work*. A service that serves zero
requests still costs money if it is told to keep an instance running. The expensive mistakes are
almost never in the application code — they are in three settings that deploys quietly carry
forward:

1. **Always-on instances** (`min-instances ≥ 1`) on environments with no traffic.
2. **Schedulers** pinging a service so often it never scales to zero.
3. **Databases** provisioned far larger than the data, often with uncapped auto-scaling that
   ratchets the tier up and never back down.

Because the dollar figure in the billing console **lags 24-48 hours**, these leaks run for days
before anyone notices. This skill closes that gap by reading the *near-real-time* metrics the
cost is computed from, so a regression is visible the same day it ships.

## When to run

- Immediately **after any deployment** that could change scaling or infrastructure (the
  `/write_code`, `/fix-bug`, and `/run-tester` skills hand off here).
- Whenever the user asks why a bill is high, or mentions Cloud Run scaling, min-instances,
  scheduler frequency, or Atlas cluster sizing.

Whoever has the ability to commit/deploy should invoke this skill as part of that act.

## Prerequisites

- **gcloud**: `gcloud auth login` (or an active service account). The skill reads Cloud Run,
  Cloud Scheduler, Cloud Monitoring, and Artifact Registry.
- **Atlas** (optional but recommended): the MongoDB Atlas CLI. If absent, instruct:
  `brew install mongodb-atlas-cli && atlas auth login` (a device/OAuth flow, like gcloud).
  For headless/CI runs, fall back to a programmatic API key pair in
  `MONGODB_ATLAS_PUBLIC_API_KEY` / `MONGODB_ATLAS_PRIVATE_API_KEY`. If neither is available,
  still produce the Atlas section as a **manual checklist** for the user to run in the console.

## Workflow

Run the steps in order. Steps 1-4 are read-only discovery; do not change anything until Step 6.

### Step 1 — Enumerate everything (never assume the list)

The single most common miss is auditing the service you just deployed while five always-on
services sit elsewhere. Enumerate **all** Cloud Run services across **all** relevant projects.

```
scripts/cloud_run_cost_scan.sh <project-id> [<project-id> ...]
```

This prints, per service, the **min-instances**, **CPU mode**, and size, and flags any service
that is always-on. Read `references/gcp-cost-checks.md` for what each flag means and the
verification gotchas (especially: read scaling from the **serving revision**, not the console
header — the header shows a stale service-level annotation and lies).

### Step 2 — Validate real spend with instance-time, not dollars

The billing console lags; `billable_instance_time` does not. Pull per-service instance-hours
per day to see which services are actually running 24/7:

```
scripts/billable_instance_hours.sh <project-id> [days_back]
```

A dev/staging service showing ~24 instance-hours/day (or ~48 for a 2-instance minimum) with no
traffic is pure waste. After a fix, the same metric drops the same day — this is how you
*validate* an optimization without waiting for the invoice.

### Step 3 — Check the schedulers

List Cloud Scheduler jobs and their frequency. A job hitting a service every few minutes keeps
it warm 24/7 and defeats scale-to-zero. See `references/gcp-cost-checks.md` → Schedulers.

### Step 4 — Audit MongoDB Atlas

Read `references/atlas-cost-checks.md` and run the cluster audit: tier vs. actual utilization
(ops/sec, connections, disk), uncapped tier auto-scaling, storage auto-expand, and whether
dev/staging share the production cluster. Atlas billed through GCP Marketplace is **real cost**
that appears on the GCP console — do not dismiss it as "credits."

### Step 5 — Report cost drivers with estimated savings

Produce the report in the exact structure below. Lead with the biggest driver. Attach an
estimated monthly saving to each finding so the user can prioritise. Never invent numbers — if a
rate is unknown, label it clearly or pull it live (Step 7).

### Step 6 — Get consent, then apply or hand off

Present the recommendations and **wait for consent**. Then, per finding:

- **Apply low-risk infra fixes directly** (the user has seen this work): `min-instances`,
  pausing/slowing a scheduler, resizing an Atlas tier, capping auto-scale. These are reversible
  and need no code change.
- **Hand code changes back to `/write_code`** (e.g., adding a data-retention job, fixing an
  unbounded write, moving a connection string). Describe the change precisely for that skill.

Verify every applied change on the **serving revision** / live config, then re-run Step 2 to
confirm instance-time actually dropped.

### Step 7 — Keep the norms current

Cloud pricing and tiers change. Before quoting a rate or recommending a tier, confirm current
GCP Cloud Run pricing and Atlas tier options (Flex, M-tiers) via context7 or a quick web check,
and update the reference files if something material changed (e.g., a new tier, a pricing-model
change). Stale cost advice is worse than none.

## Safety rules

- **Read-only until consent.** Steps 1-5 change nothing.
- **One concern at a time on prod.** Prod services kept warm by real traffic are not waste —
  do not zero them blindly; a frontend at min=0 cold-starts the first user.
- **Workers need a trigger check.** A worker is safe at min=0 only if it is push-triggered
  (Pub/Sub push / Cloud Tasks / HTTP). A continuous queue-poller needs min ≥ 1, or jobs stall.
  Verify before zeroing — see `references/gcp-cost-checks.md` → Workers.
- **Never delete data to save cost** without explicit, separate confirmation. Resizing and
  pausing are reversible; dropping a database is not.

## Report structure

Always use this template:

```
# Deployment Cost Analysis — <date>

## Verdict
<one line: is anything bleeding cost? biggest driver?>

## Cost drivers (largest first)
| Driver | Where | Evidence | Est. saving/mo | Fix | Risk |
|--------|-------|----------|----------------|-----|------|

## Recommended actions (need your consent)
1. <action> — <direct-apply | hand to /write_code> — <reversible?>

## Validation plan
<which metric/command confirms the saving, and when (instance-time now; dollars in 24-48h)>

## Deferred / watch
<smaller items: artifact-registry bloat, unbounded writes, cross-region egress>
```

## Reference files

- `references/gcp-cost-checks.md` — Cloud Run scaling audit, the serving-revision gotcha,
  worker trigger model, schedulers, billable instance-time, Artifact Registry, commands.
- `references/atlas-cost-checks.md` — Atlas CLI auth, tier-vs-utilization, auto-scale cap,
  storage auto-expand, shared-cluster check, Flex migration, billing reconciliation.

## Scripts

- `scripts/cloud_run_cost_scan.sh` — enumerate services + scaling config across projects, flag always-on.
- `scripts/billable_instance_hours.sh` — per-service billable instance-hours/day from Cloud Monitoring.
