#!/usr/bin/env bash
# cloud_run_cost_scan.sh — enumerate Cloud Run services across one or more projects and flag
# always-on scaling config. Reads the SERVING revision (not the misleading console header).
#
# Usage: cloud_run_cost_scan.sh <project-id> [<project-id> ...]
#   REGION env var overrides the default region (asia-south1).
set -uo pipefail
REGION="${REGION:-asia-south1}"
[ "$#" -ge 1 ] || { echo "usage: $0 <project-id> [<project-id> ...]" >&2; exit 1; }

for P in "$@"; do
  echo "############ PROJECT: $P  (region $REGION) ############"
  svcs=$(gcloud run services list --project="$P" --region="$REGION" \
           --format="value(metadata.name)" 2>/dev/null | grep -v '^$')
  [ -z "$svcs" ] && { echo "  (no services / API disabled)"; continue; }
  printf "  %-30s %-6s %-14s %-10s %s\n" SERVICE MIN CPU-MODE SIZE FLAG
  while IFS= read -r SVC; do
    [ -z "$SVC" ] && continue
    rev=$(gcloud run services describe "$SVC" --project="$P" --region="$REGION" \
            --format="value(status.traffic[0].revisionName)" 2>/dev/null)
    read -r MIN THROTTLE CPU MEM < <(gcloud run revisions describe "$rev" \
            --project="$P" --region="$REGION" \
            --format="value(metadata.annotations['autoscaling.knative.dev/minScale'], \
                            metadata.annotations['run.googleapis.com/cpu-throttling'], \
                            spec.containers[0].resources.limits.cpu, \
                            spec.containers[0].resources.limits.memory)" 2>/dev/null)
    MIN="${MIN:-0}"
    case "$THROTTLE" in false) CPUMODE="always-on";; *) CPUMODE="per-request";; esac
    FLAG=""
    [ "${MIN:-0}" != "0" ] && FLAG="ALWAYS-ON(min=$MIN)"
    [ "$THROTTLE" = "false" ] && FLAG="$FLAG cpu-always"
    printf "  %-30s %-6s %-14s %-10s %s\n" "$SVC" "$MIN" "$CPUMODE" "${CPU:-?}/${MEM:-?}" "$FLAG"
  done <<< "$svcs"
  echo
done
echo "Legend: FLAG set => candidate for min=0 / per-request CPU."
echo "Verify worker trigger model (push vs poll) before zeroing a worker — see references/gcp-cost-checks.md."
