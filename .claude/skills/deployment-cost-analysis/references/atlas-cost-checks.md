# MongoDB Atlas Cost Checks

Atlas is frequently the second-largest cloud cost and is easy to miss because it is managed
outside GCP (at cloud.mongodb.com), yet billed **through GCP Marketplace** — so it appears on
the GCP report as `MongoDB Atlas (pay-as-you-go)` and the cost is **real**. In the Atlas invoice
itself a `-$X Credit` line is the Marketplace settling the bill (GCP pays Atlas, then charges
you); it is NOT free promotional credit. Do not dismiss Atlas spend on that basis.

## Authentication

```bash
# Interactive, like gcloud (preferred for a human who commits):
atlas auth login
# Headless / CI fallback — programmatic API key pair:
export MONGODB_ATLAS_PUBLIC_API_KEY=...  MONGODB_ATLAS_PRIVATE_API_KEY=...
```

If the CLI is absent: `brew install mongodb-atlas-cli`. If neither auth path is available,
emit the checks below as a **manual checklist** for the user to run in the Atlas console.

## The core norms

### 1. Tier vs. utilization — the big one

A dedicated cluster bills a fixed hourly rate for the instance **regardless of how little data
or traffic it holds**. The classic waste: an M20 (~$0.23/hr, ~$168/mo) serving 373 MB of data at
under 4 ops/sec. Compare the tier against actual load and downsize hard.

```bash
atlas clusters list
atlas clusters describe <cluster> --output json   # tier, disk, backup
atlas metrics processes <host> --granularity PT1H --period P2D \
  --type OPERATIONS_SCAN_AND_ORDER,CONNECTIONS,DISK_PARTITION_IOPS_READ   # utilization
```

Decision guide for low load: **M10** (~$0.10/hr) is a one-click in-place resize keeping the
replica set + backup; **Flex** (~$8-30/mo, pay-per-use) is cheaper still but needs a small
data migration (new cluster + `mongodump`/`mongorestore`). Match the tier to real load, not to a
"just in case" ceiling.

### 2. Uncapped tier auto-scaling — the silent climb

Atlas "Cluster Tier Scaling" ratchets the tier **up** under load and rarely comes back down. If
the **maximum tier is unset**, cost climbs month over month with no event (seen: $52 → $181 over
five months). After downsizing, **cap the max tier** (or disable tier auto-scaling) so it cannot
silently climb again.

### 3. Storage auto-expand — keep it ON

Disabling storage auto-expand saves **nothing** (storage bills by GB used, not by the cap) but
removes a safety net: if the disk fills, **writes fail — an outage**. Keep it on, and add a
disk-usage > 75% alert. This matters more when the app writes unbounded data (analytics events,
chunks, embeddings).

### 4. Don't share the prod cluster with dev/staging

Check which environments point at which cluster — repointing Cloud Run `MONGODB_URL` per env
(mask credentials when printing). If dev/staging ride the production cluster, they add cost and
risk (a dev query can affect prod). Move them to a Flex or free cluster.

```bash
# Mask credentials when surfacing the host:
gcloud run services describe "$SVC" --project="$P" --region="$REGION" \
  --format="json(spec.template.spec.containers[0].env)" \
  | python3 -c "import sys,json;e=json.load(sys.stdin)['spec']['template']['spec']['containers'][0]['env'];\
import re;[print(x['name'],'=',re.sub(r'(mongodb\+srv://)[^@]*@',r'\1***@',x.get('value',''))) for x in e if 'MONGO' in x['name'].upper()]"
```

### 5. Minor watch items

- **Continuous backup / PITR** scales with data — reduce retention on non-prod.
- **Cross-continent data transfer** (e.g. Mumbai → Americas) is the priciest egress SKU
  (~$0.12/GB) and can signal an unintended external reader — check Atlas access logs for source
  regions if this line appears.

## Reconciling the bill

Aggregate the Atlas usage CSV (Billing → Usage) by SKU to see the true driver — the dedicated
instance line is usually the bulk; backup and transfer are minor. Net invoice $0 with a matching
credit line means GCP Marketplace paid it, not that it was free.
