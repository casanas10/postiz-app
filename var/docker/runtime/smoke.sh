#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../.."
: "${POSTIZ_TEST_IMAGE:?Set the candidate image tag}"
project="postiz-runtime-smoke-${GITHUB_RUN_ID:-$(date +%s)}-${GITHUB_RUN_ATTEMPT:-1}"
compose=(docker compose -p "$project" -f var/docker/runtime/smoke.compose.yml)
# Only this script's ephemeral test project is removed, never shared Docker data.
cleanup() { "${compose[@]}" down --remove-orphans; }
trap cleanup EXIT
# Native checks need no network or database.
docker run --rm --network none --entrypoint node "$POSTIZ_TEST_IMAGE" /app/runtime/check.cjs
"${compose[@]}" up -d
ready=false
for attempt in $(seq 1 90); do
  if "${compose[@]}" exec -T app node /app/runtime/http-check.cjs 2>/dev/null; then
    ready=true
    break
  fi
  sleep 2
done
if [ "$ready" != true ]; then
  "${compose[@]}" logs --tail 100 app
  exit 1
fi
# PM2 'online' alone is insufficient: check stability after HTTP/database probes.
sleep 15
"${compose[@]}" exec -T app node /app/runtime/http-check.cjs
"${compose[@]}" exec -T app pm2 jlist | node -e '
let input="";process.stdin.on("data", c => input+=c);process.stdin.on("end",()=>{
const ps=JSON.parse(input);const expected=["backend","cron","frontend","workers"];
if(JSON.stringify(ps.map(p=>p.name).sort())!==JSON.stringify(expected))process.exit(1);
for(const p of ps){const e=p.pm2_env;console.log(p.name,e.status,"restarts",e.restart_time);
if(e.status!=="online"||e.restart_time!==0)process.exit(1);}
});'
# Exercise clean restart and persisted schema without dropping database state.
"${compose[@]}" restart app
sleep 20
"${compose[@]}" exec -T app node /app/runtime/http-check.cjs
printf 'PASS: isolated startup and restart with all four processes\n'
