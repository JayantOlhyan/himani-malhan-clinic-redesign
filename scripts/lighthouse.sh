#!/usr/bin/env bash
# Lighthouse (mobile + desktop) against the static build. Usage: scripts/lighthouse.sh [/path ...]
# Needs: npm run build first; lighthouse available via npx.
set -euo pipefail
PORT=4180
PATHS=("${@:-/}")
CHROME_PATH=${CHROME_PATH:-$( [ -x /opt/pw-browsers/chromium-1194/chrome-linux/chrome ] && echo /opt/pw-browsers/chromium-1194/chrome-linux/chrome || true )}
export CHROME_PATH
npx --yes serve out -l $PORT >/dev/null 2>&1 & SERVER=$!
trap 'kill $SERVER' EXIT
sleep 2
mkdir -p qa-output/lighthouse
for p in "${PATHS[@]}"; do
  for preset in mobile desktop; do
    name="qa-output/lighthouse/$(echo "$p" | tr '/' '_')-$preset.json"
    flag=""; [ "$preset" = desktop ] && flag="--preset=desktop"
    npx --yes lighthouse@12 "http://localhost:$PORT$p" --quiet --chrome-flags="--headless=new --no-sandbox" $flag --output=json --output-path="$name" >/dev/null 2>&1 || true
    node -e 'const r=require(process.argv[1]);const a=r.audits;console.log(process.argv[2].padEnd(34),process.argv[3].padEnd(8),Object.values(r.categories).map(c=>c.id.slice(0,4)+" "+Math.round(c.score*100)).join("  "),"| LCP",a["largest-contentful-paint"].displayValue,"CLS",a["cumulative-layout-shift"].displayValue,"TBT",a["total-blocking-time"].displayValue)' "$PWD/$name" "$p" "$preset"
  done
done
