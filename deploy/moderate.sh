#!/usr/bin/env bash
# Moderation of the guestbook. New saves wait as PENDING; only approved ones are public.
#
#   bash deploy/moderate.sh list              # pending saves (and how many are public)
#   bash deploy/moderate.sh approve <id>      # make it public (also: approve all)
#   bash deploy/moderate.sh reject <id>       # delete it (also: reject all)
#   bash deploy/moderate.sh remove <id>       # take an already-public save down
#
# Needs a live session: AWS_PROFILE=blaster aws login. The id is the short code shown by `list`.
set -euo pipefail
export AWS_PROFILE="${AWS_PROFILE:-blaster}" AWS_REGION=us-east-1 AWS_DEFAULT_REGION=us-east-1
cd "$(dirname "$0")/.."
TABLE="$(python3 -c 'import json;d=json.load(open("deploy/cdk-outputs.json"));print(next(iter(d.values()))["TableName"])')"
SAVE_TTL=$((60*86400))

items() { aws dynamodb query --table-name "$TABLE" --key-condition-expression 'pk = :p' --expression-attribute-values "{\":p\":{\"S\":\"$1\"}}" --output json; }
pick() {  # pick <PENDING|SAVE> <id|all>  -> lines "sk<TAB>id", one per matching item
  items "$1" | python3 -c 'import json,sys
want=sys.argv[1]
for i in json.load(sys.stdin)["Items"]:
    if want=="all" or i["id"]["S"]==want: print(i["sk"]["S"]+"\t"+i["id"]["S"])' "$2"
}

cmd="${1:-list}"; id="${2:-}"
case "$cmd" in
  list)
    items PENDING | python3 -c 'import json,sys
rows=json.load(sys.stdin)["Items"]
print(f"{len(rows)} pending")
for i in rows:
    g = {k: v["S"] for k, v in i.items() if "S" in v}
    print("  %s  %s  [%s] %s: %s" % (g["id"], g["createdAt"], g["color"], g["name"], g["message"]))'
    echo "public: $(items SAVE | python3 -c 'import json,sys;print(len(json.load(sys.stdin)["Items"]))')" ;;
  approve)
    [ -n "$id" ] || { echo "usage: approve <id|all>"; exit 1; }
    pick PENDING "$id" | while IFS=$'\t' read -r sk sid; do
      item="$(aws dynamodb get-item --table-name "$TABLE" --key "{\"pk\":{\"S\":\"PENDING\"},\"sk\":{\"S\":\"$sk\"}}" --output json | python3 -c 'import json,sys,time
i=json.load(sys.stdin)["Item"]; i["pk"]={"S":"SAVE"}; i["expiresAt"]={"N":str(int(time.time())+'"$SAVE_TTL"')}; print(json.dumps(i))')"
      aws dynamodb put-item --table-name "$TABLE" --item "$item"
      aws dynamodb delete-item --table-name "$TABLE" --key "{\"pk\":{\"S\":\"PENDING\"},\"sk\":{\"S\":\"$sk\"}}"
      echo "approved $sid"
    done ;;
  reject|remove)
    [ -n "$id" ] || { echo "usage: $cmd <id|all>"; exit 1; }
    pk=PENDING; [ "$cmd" = remove ] && pk=SAVE
    pick "$pk" "$id" | while IFS=$'\t' read -r sk sid; do
      aws dynamodb delete-item --table-name "$TABLE" --key "{\"pk\":{\"S\":\"$pk\"},\"sk\":{\"S\":\"$sk\"}}"; echo "deleted $sid"
    done ;;
  *) echo "usage: $0 list | approve <id|all> | reject <id|all> | remove <id>"; exit 1 ;;
esac
