#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

export PATH="/home/manhdev/.n/bin:/home/manhdev/.npm-global/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
unset ELECTRON_RUN_AS_NODE NODE_OPTIONS

if [[ -f ../.env ]]; then
  set -a
  source ../.env
  set +a
fi

exec /home/manhdev/.n/bin/node ./node_modules/next/dist/bin/next build
