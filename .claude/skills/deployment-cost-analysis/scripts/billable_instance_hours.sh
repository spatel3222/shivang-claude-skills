#!/usr/bin/env bash
# billable_instance_hours.sh — per-service Cloud Run billable instance-hours per day, from
# Cloud Monitoring. This is near-real-time (unlike the dollar console, which lags 24-48h), so it
# is the metric to validate a cost fix the same day it ships.
#
# Usage: billable_instance_hours.sh <project-id> [days_back]   (default days_back=5)
set -uo pipefail
P="${1:?usage: $0 <project-id> [days_back]}"
DAYS="${2:-5}"
TOKEN=$(gcloud auth print-access-token 2>/dev/null) || { echo "gcloud auth required: gcloud auth login" >&2; exit 1; }
[ -n "$TOKEN" ] || { echo "gcloud auth required: gcloud auth login" >&2; exit 1; }

# macOS and GNU date both supported for the start timestamp.
START=$(date -u -v-"${DAYS}"d +%Y-%m-%dT00:00:00Z 2>/dev/null || date -u -d "${DAYS} days ago" +%Y-%m-%dT00:00:00Z)
END=$(date -u +%Y-%m-%dT%H:%M:%SZ)

curl -s -G "https://monitoring.googleapis.com/v3/projects/$P/timeSeries" \
  --data-urlencode 'filter=metric.type="run.googleapis.com/container/billable_instance_time"' \
  --data-urlencode "interval.startTime=$START" \
  --data-urlencode "interval.endTime=$END" \
  --data-urlencode "aggregation.alignmentPeriod=86400s" \
  --data-urlencode "aggregation.perSeriesAligner=ALIGN_SUM" \
  --data-urlencode "aggregation.crossSeriesReducer=REDUCE_SUM" \
  --data-urlencode "aggregation.groupByFields=resource.label.service_name" \
  -H "Authorization: Bearer $TOKEN" | python3 -c "
import sys,json
from collections import defaultdict
d=json.load(sys.stdin)
ts=d.get('timeSeries',[])
if not ts:
    print('No data.', d.get('error',{}).get('message','')[:200]); sys.exit()
rows=defaultdict(dict)
for s in ts:
    svc=s['resource']['labels'].get('service_name','?')
    for p in s['points']:
        day=p['interval']['endTime'][:10]
        v=p['value']; val=float(v.get('doubleValue',0) or v.get('int64Value',0))
        rows[svc][day]=val/3600.0
days=sorted({x for v in rows.values() for x in v})
print('service'.ljust(30)+''.join(x[5:].rjust(8) for x in days)+'   (instance-hours/day; ~24=1 always-on, ~48=2)')
for svc in sorted(rows):
    print(svc.ljust(30)+''.join(f'{rows[svc].get(x,0):8.1f}' for x in days))
print('\\nNote: the latest day is partial. A near-0 row on an idle service = scaling to zero (good).')
"
