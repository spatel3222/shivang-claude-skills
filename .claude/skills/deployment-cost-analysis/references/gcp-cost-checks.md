# GCP Cost Checks — Cloud Run, Scheduler, Monitoring, Artifact Registry

## Cloud Run scaling audit

Cost on Cloud Run is driven by **instance-time**, which is set by `min-instances` and the CPU
allocation mode — not by traffic. Two settings cause almost all idle waste:

- **`min-instances` (minScale) ≥ 1** — the service keeps that many instances running 24/7
  regardless of traffic. On dev/staging with no users, this is pure waste. Target `min=0`
  (scale to zero). Cloud Run represents `min=0` as the **absence** of the `minScale` annotation.
- **`cpu-throttling=false`** (CPU always-allocated) — you pay for vCPU continuously, not only
  during requests. Use request-based CPU unless the service does background work between requests.

### The serving-revision gotcha (critical)

The Cloud Run console "Scaling: Auto (Min: X, Max: Y)" header reads a **stale service-level
annotation** (`run.googleapis.com/maxScale`) and frequently shows the wrong Min/Max. The value
that actually controls running instances is on the **serving revision**:

```bash
# WRONG to trust: the console header, and sometimes spec.template too.
# RIGHT: read the revision currently receiving traffic.
rev=$(gcloud run services describe "$SVC" --project="$P" --region="$REGION" \
        --format="value(status.traffic[0].revisionName)")
gcloud run revisions describe "$rev" --project="$P" --region="$REGION" \
        --format="value(metadata.annotations['autoscaling.knative.dev/minScale'])"
# empty output == min 0
```

Always confirm a change took effect on the serving revision, not the header.

### Enumerate across ALL projects

Do not audit only the service you deployed. List every service in every relevant project:

```bash
gcloud run services list --project="$P" --region="$REGION" --format="table(metadata.name,status.url)"
```

(A real audit found 9 services in one dev project where the team thought there were 2, and 17
total across dev/prod/ocr — most still always-on.)

### Workers — check the trigger model before zeroing

A worker is safe at `min=0` only if it is **push-triggered**; a continuous poller needs `min ≥ 1`
or jobs stop processing when it scales to zero.

```bash
# Push subscriptions naming the worker's HTTP endpoint => push-triggered => min=0 SAFE.
gcloud pubsub subscriptions list --project="$P" \
  --format="value(name,pushConfig.pushEndpoint)" | grep -i "run.app"
# Also check Eventarc / Cloud Tasks. If NO subscription targets the worker and it is not called
# synchronously over HTTP, it may be a poller — confirm in code before zeroing.
```

### Apply a fix

```bash
gcloud run services update "$SVC" --project="$P" --region="$REGION" --min-instances=0
# add --no-cpu-throttling / --cpu-throttling to flip CPU mode if needed
```

`min=0` is reversible: re-run with `--min-instances=1`. The first request after idle cold-starts
(a few seconds) — acceptable on dev/staging and on low-traffic prod; flag it for user-facing
prod frontends.

## Cloud Scheduler

A job that pings a service every few minutes keeps an instance warm 24/7 and defeats
scale-to-zero — the scheduler, not traffic, becomes the cost.

```bash
gcloud scheduler jobs list --project="$P" --location="$REGION" \
  --format="table(name.basename(),schedule,state,httpTarget.uri)"
# Pause (zero runs, reversible) or slow the cadence on idle environments:
gcloud scheduler jobs pause  "$JOB" --project="$P" --location="$REGION"
gcloud scheduler jobs resume "$JOB" --project="$P" --location="$REGION"
```

Before pausing, read what the job does — a cleanup job that genuinely clears stuck state or
expired data should be slowed (e.g. hourly) rather than fully paused on production.

## Billable instance-time (validation metric)

The dollar console lags 24-48h; this metric is near-real-time and is what the cost is computed
from. Use `scripts/billable_instance_hours.sh`, or directly:

```bash
TOKEN=$(gcloud auth print-access-token)
curl -s -G "https://monitoring.googleapis.com/v3/projects/$P/timeSeries" \
  --data-urlencode 'filter=metric.type="run.googleapis.com/container/billable_instance_time"' \
  --data-urlencode "interval.startTime=$START" --data-urlencode "interval.endTime=$END" \
  --data-urlencode "aggregation.alignmentPeriod=86400s" \
  --data-urlencode "aggregation.perSeriesAligner=ALIGN_SUM" \
  --data-urlencode "aggregation.crossSeriesReducer=REDUCE_SUM" \
  --data-urlencode "aggregation.groupByFields=resource.label.service_name" \
  -H "Authorization: Bearer $TOKEN"
```

~24 instance-hours/day for one always-on instance, ~48 for a 2-instance minimum. After a min=0
fix on an idle service, this drops to near 0 the same day — that is your validation.

## Artifact Registry (secondary driver)

Every deploy leaves Docker image layers; these accumulate (hundreds of GB seen in practice) and
bill ~$0.10/GB/mo. Check size and prune old/untagged images:

```bash
gcloud artifacts repositories list --project="$P" --format="table(name,format,sizeBytes)"
```

## Finding the actual billing breakdown

There is no clean `gcloud` cost-by-service command unless a **BigQuery billing export** exists
(`bq ls` to check). Without it, the breakdown lives in Console → Billing → Reports (group by
Service/SKU) or an exported CSV. Map the deployed projects to their billing accounts:

```bash
gcloud billing accounts list --format="table(name,displayName,open)"
gcloud billing projects list --billing-account="$BA" --format="table(projectId,billingEnabled)"
```
