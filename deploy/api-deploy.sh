#!/usr/bin/env bash
# Deploys the guestbook API (CDK stack PortfolioApi), smoke-tests it and writes a log you can keep as evidence.
#
#   AWS_PROFILE=blaster aws login          # when the session has expired (interactive)
#   bash deploy/api-deploy.sh              # tests + cdk deploy + live smoke test, log in docs/evidence/
#
# Optional env: AWS_PROFILE (default blaster), ALERT_EMAIL (address for the CloudWatch alarms).
# The log masks the 12-digit account id.
set -euo pipefail
cd "$(dirname "$0")/.."

export AWS_PROFILE="${AWS_PROFILE:-blaster}"
export AWS_REGION=us-east-1 AWS_DEFAULT_REGION=us-east-1
# CDK needs Node 22+: use the nvm one if the default node is older.
if [ "$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)" -lt 22 ]; then
  NODE22="$(ls -d "$HOME"/.nvm/versions/node/v22* "$HOME"/.nvm/versions/node/v24* 2>/dev/null | tail -1)"
  [ -n "$NODE22" ] && export PATH="$NODE22/bin:$PATH"
fi
STAMP="$(date -u +%Y%m%d-%H%M%S)"
LOG="docs/evidence/api-deploy-${STAMP}.log"
mkdir -p docs/evidence
mask() { sed -E 's/[0-9]{12}/************/g'; }
say()  { printf '\n[%s] %s\n' "$(date -u +%H:%M:%SZ)" "$*"; }

{
  say "Guestbook API deploy  stack=PortfolioApi region=$AWS_REGION profile=$AWS_PROFILE node=$(node -v)"
  say "1/5  who am I (account id masked)"
  aws sts get-caller-identity --query '{UserArn:Arn}' --output json 2>&1 | mask

  say "2/5  unit tests (backend + infra)"
  npm test 2>&1 | grep -E "Test Files|Tests |✓|✗|FAIL" || true
  npm test >/dev/null 2>&1   # fail the script if any test fails

  say "3/5  cdk deploy"
  (cd infra && npx cdk deploy PortfolioApi --require-approval never --outputs-file ../deploy/cdk-outputs.json 2>&1 | mask)
  API="$(python3 -c 'import json; print(json.load(open("deploy/cdk-outputs.json"))["PortfolioApi"]["ApiUrl"].rstrip("/"))')"
  TABLE="$(python3 -c 'import json; print(json.load(open("deploy/cdk-outputs.json"))["PortfolioApi"]["TableName"])')"
  echo "ApiUrl: $API"

  say "4/5  live smoke test against $API"
  ORIGIN="https://main.d5w3zjhtyz0vy.amplifyapp.com"
  echo '$ POST /saves (valid)';          R="$(curl -s -w '\n%{http_code}' -X POST "$API/saves" -H 'content-type: application/json' -H "origin: $ORIGIN" -d '{"name":"Smoke test","message":"Hello from the terminal","color":"teal"}')"; echo "$R"
  echo '$ GET /saves';                   curl -s -w '\n%{http_code}\n' "$API/saves" -H "origin: $ORIGIN"
  echo '$ POST /saves (invalid: link)';  curl -s -w '\n%{http_code}\n' -X POST "$API/saves" -H 'content-type: application/json' -d '{"name":"Bot","message":"visit https://spam.example"}'
  echo '$ POST /saves (not JSON)';       curl -s -w '\n%{http_code}\n' -X POST "$API/saves" -H 'content-type: text/plain' -d 'x'
  echo '$ DELETE /saves';                curl -s -w '\n%{http_code}\n' -X DELETE "$API/saves"
  echo '$ GET /other';                   curl -s -w '\n%{http_code}\n' "$API/other"
  echo '$ OPTIONS /saves (CORS preflight from the Amplify site)'
  curl -s -D - -o /dev/null -X OPTIONS "$API/saves" -H "origin: $ORIGIN" -H 'access-control-request-method: POST' -H 'access-control-request-headers: content-type' | grep -i -E "^HTTP|access-control" || true
  echo '$ OPTIONS /saves from a stranger site (must get no allow-origin)'
  curl -s -D - -o /dev/null -X OPTIONS "$API/saves" -H 'origin: https://evil.example' -H 'access-control-request-method: POST' | grep -i -E "^HTTP|access-control-allow-origin" || echo "(no access-control-allow-origin header: blocked)"

  say "5/5  clean up the smoke-test save (new saves are PENDING until approved: see deploy/moderate.sh)"
  aws dynamodb query --table-name "$TABLE" --key-condition-expression 'pk = :p' --expression-attribute-values '{":p":{"S":"PENDING"}}' --output json \
    | python3 -c 'import sys,json
for i in json.load(sys.stdin)["Items"]:
    if i["name"]["S"]=="Smoke test": print(i["sk"]["S"])' \
    | while read -r SK; do aws dynamodb delete-item --table-name "$TABLE" --key "{\"pk\":{\"S\":\"PENDING\"},\"sk\":{\"S\":\"$SK\"}}" && echo "deleted PENDING / $SK"; done
  say "DONE"
} 2>&1 | tee "$LOG"

echo
echo "Log saved to $LOG"
