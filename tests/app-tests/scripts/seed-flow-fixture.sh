#!/usr/bin/env bash
# mobile-ci pre-flow-command: installs the fixtures/databases file a flow names in its `seed-<fixture>` tag, and removes it before the next untagged flow.

set -euo pipefail

fixture="$(sed -n 's/^    - seed-//p' "$FLOW_PATH" | head -n 1)"
marker="${RUNNER_TEMP:-/tmp}/seed-flow-fixture-${SIMULATOR_UDID:-${ANDROID_SERIAL:-default}}"
database="$(dirname "${BASH_SOURCE[0]}")/../fixtures/databases/$fixture.db"

if [[ -z "$fixture" && ! -e "$marker" ]]; then
    exit 0
fi

if [[ -n "$fixture" && ! -f "$database" ]]; then
    echo "::error::Unknown seed fixture '$fixture': $database does not exist." >&2
    exit 1
fi

if [[ -n "${SIMULATOR_UDID:-}" ]]; then
    xcrun simctl terminate "$SIMULATOR_UDID" "$APP_ID" || true
    installed="$(xcrun simctl get_app_container "$SIMULATOR_UDID" "$APP_ID" data)/Library/suuudokuuu.db"
    rm -f "$installed" "$installed-wal" "$installed-shm"

    if [[ -n "$fixture" ]]; then
        cp "$database" "$installed"
    fi
else
    adb -s "$ANDROID_SERIAL" shell am force-stop "$APP_ID"
    adb -s "$ANDROID_SERIAL" root >/dev/null || true
    adb -s "$ANDROID_SERIAL" wait-for-device

    if [[ "$(adb -s "$ANDROID_SERIAL" shell id)" != *uid=0* ]]; then
        echo "::error::adb root is unavailable on $ANDROID_SERIAL; use a rootable google_apis system image." >&2
        exit 1
    fi

    databases="/data/data/$APP_ID/databases"
    installed="$databases/suuudokuuu.db"
    adb -s "$ANDROID_SERIAL" shell "mkdir -p $databases && rm -f $installed $installed-wal $installed-shm"

    if [[ -n "$fixture" ]]; then
        adb -s "$ANDROID_SERIAL" push "$database" "$installed" >/dev/null
        adb -s "$ANDROID_SERIAL" shell "chown \$(stat -c %u:%g /data/data/$APP_ID) $databases $installed && restorecon $databases $installed"
    fi
fi

if [[ -n "$fixture" ]]; then
    touch "$marker"
else
    rm -f "$marker"
fi
