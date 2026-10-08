#!/usr/bin/env bash
# mobile-ci pre-flow-command: installs the seeded database a flow names in its `seed-<fixture>` tag, and removes it before the next untagged flow.

set -euo pipefail

fixture="$(sed -n 's/^    - seed-//p' "$FLOW_PATH" | head -n 1)"
marker="${RUNNER_TEMP:-/tmp}/seed-flow-fixture-${SIMULATOR_UDID:-${ANDROID_SERIAL:-default}}"

if [[ -z "$fixture" && ! -e "$marker" ]]; then
    exit 0
fi

SEED_FIXTURE="$fixture" pnpm --filter ./tests/app-tests seed:flow

if [[ -n "$fixture" ]]; then
    touch "$marker"
else
    rm -f "$marker"
fi
