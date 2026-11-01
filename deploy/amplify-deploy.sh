#!/usr/bin/env bash
# Deploys deploy/dist.zip to AWS Amplify Hosting (manual deployment) and writes a log you can keep as evidence.
#
#   AWS_PROFILE=blaster aws login        # once, when the session has expired (interactive)
#   bash deploy/amplify-deploy.sh        # build + deploy + verify, log in docs/evidence/
#
# Optional env: AWS_PROFILE (default blaster), AWS_REGION (default us-east-1), APP_ID, BRANCH (default main).
# The log masks the 12-digit account id and never prints the presigned upload URL.
set -euo pipefail
cd "$(dirname "$0")/.."

export AWS_PROFILE="${AWS_PROFILE:-blaster}"
export AWS_REGION="${AWS_REGION:-us-east-1}"
export AWS_DEFAULT_REGION="$AWS_REGION"
APP_ID="${APP_ID:-d5w3zjhtyz0vy}"
BRANCH="${BRANCH:-main}"
STAMP="$(date -u +%Y%m%d-%H%M%S)"
LOG="docs/evidence/amplify-deploy-${STAMP}.log"
mkdir -p docs/evidence

mask() { sed -E 's/[0-9]{12}/************/g'; }
say()  { printf '\n[%s] %s\n' "$(date -u +%H:%M:%SZ)" "$*"; }
run()  { printf '$ %s\n' "$*"; "$@" 2>&1 | mask; }

{
  say "Amplify Hosting deploy  app=$APP_ID branch=$BRANCH region=$AWS_REGION profile=$AWS_PROFILE"
  say "1/6  who am I (account id masked)"
  aws sts get-caller-identity --query '{UserArn:Arn}' --output json 2>&1 | mask

  say "2/6  build + licence check"
  python3 deploy/build-dist.py

  say "3/6  create-deployment (the upload URL is not printed)"
  DEP="$(aws amplify create-deployment --app-id "$APP_ID" --branch-name "$BRANCH" --output json)"
  JOB="$(printf '%s' "$DEP" | python3 -c 'import sys,json; print(json.load(sys.stdin)["jobId"])')"
  URL="$(printf '%s' "$DEP" | python3 -c 'import sys,json; print(json.load(sys.stdin)["zipUploadUrl"])')"
  echo "jobId=$JOB"

  say "4/6  upload deploy/dist.zip"
  CODE="$(curl -s -o /dev/null -w '%{http_code}' -X PUT -T deploy/dist.zip "$URL")"
  echo "upload HTTP $CODE"; [ "$CODE" = "200" ]

  say "5/6  start-deployment and wait"
  run aws amplify start-deployment --app-id "$APP_ID" --branch-name "$BRANCH" --job-id "$JOB" --query 'jobSummary.{jobId:jobId,status:status}' --output json
  STATUS=""
  for _ in $(seq 1 40); do
    sleep 4
    STATUS="$(aws amplify get-job --app-id "$APP_ID" --branch-name "$BRANCH" --job-id "$JOB" --query 'job.summary.status' --output text)"
    echo "status: $STATUS"
    case "$STATUS" in SUCCEED|FAILED|CANCELLED) break;; esac
  done
  run aws amplify get-job --app-id "$APP_ID" --branch-name "$BRANCH" --job-id "$JOB" --query 'job.steps[].{step:stepName,status:status}' --output table
  [ "$STATUS" = "SUCCEED" ]

  say "6/6  verify the public URL"
  DOMAIN="$(aws amplify get-app --app-id "$APP_ID" --query 'app.defaultDomain' --output text)"
  SITE="https://${BRANCH}.${DOMAIN}"
  echo "SiteUrl: $SITE"
  for p in "" assets/intro/intro.webm assets/playstation_2GRANDE2.glb assets/crt_tvCC3.glb assets/props/potted_plant_04/potted_plant_04_1k.gltf; do
    printf '%-58s ' "/$p"; curl -s -o /dev/null -w '%{http_code} %{content_type}\n' -I "$SITE/$p"
  done
  say "DONE"
} 2>&1 | tee "$LOG"

echo
echo "Log saved to $LOG"
