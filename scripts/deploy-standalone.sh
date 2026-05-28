#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"
npm run build

rm -rf .next/standalone/.next/static
cp -a .next/static .next/standalone/.next/static

systemctl restart vod
systemctl is-active vod
systemctl show vod --property=MainPID --property=ExecMainStartTimestamp --no-pager
