#!/usr/bin/env bash
# mobile-ci pre-flow-command: installs the seeded database a flow names in its `seed-<fixture>` tag.

set -euo pipefail

fixture="$(sed -n 's/^    - seed-//p' "$FLOW_PATH" | head -n 1)"

if [[ -z "$fixture" ]]; then
    exit 0
fi

SEED_FIXTURE="$fixture" pnpm --filter ./tests/app-tests seed:flow
