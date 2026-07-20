#!/bin/bash
# Kills host-side xcodebuild XCTest driver processes attached to one
# Simulator UDID. Best-effort: exits 0 when nothing matches. Never touches
# other lanes' drivers (match is scoped to the UDID in the command line).
set -euo pipefail

# bash's `kill` is a shell builtin that shadows any PATH-provided kill (e.g.
# a test stub), and even `command kill` still prefers the builtin. Disable
# it so this script always resolves kill via PATH, in production and tests.
enable -n kill 2>/dev/null || true

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <simulator-udid>" >&2
    exit 1
fi

SIMULATOR_UDID="$1"
driver_pids="$(pgrep -f "xcodebuild.*$SIMULATOR_UDID" || true)"

if [ -z "$driver_pids" ]; then
    exit 0
fi

echo "Recycling stale iOS driver processes for $SIMULATOR_UDID: $driver_pids"
for pid in $driver_pids; do
    kill -TERM "$pid" 2>/dev/null || true
done
sleep 1
for pid in $driver_pids; do
    kill -KILL "$pid" 2>/dev/null || true
done
exit 0
