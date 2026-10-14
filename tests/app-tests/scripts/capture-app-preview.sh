#!/usr/bin/env bash
# Records the scripted real-play preview on an owned simulator and cuts it to human pacing with tap indicators.

set -euo pipefail

: "${APP_ID:?Set APP_ID to the installed capture build bundle identifier}"
: "${SIMULATOR_UDID:?Set SIMULATOR_UDID to the owned iPhone 17 Pro Max simulator}"

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
capture_directory="$repository_root/.scratch/app-preview-$(date -u +%Y%m%dT%H%M%SZ)"
preview_directory="$repository_root/packages/app/fastlane/app-previews/en-US"
recording_pid=""

stop_recording() {
    if [[ -n "$recording_pid" ]]; then
        kill -INT "$recording_pid" 2>/dev/null || true
        wait "$recording_pid" || true
        recording_pid=""
    fi
}

trap stop_recording EXIT
mkdir -p "$capture_directory" "$preview_directory"
export TMPDIR="$capture_directory"

for executable in xcrun maestro node ffmpeg ffprobe; do
    command -v "$executable" >/dev/null
done

xcrun simctl ui "$SIMULATOR_UDID" appearance dark
xcrun simctl status_bar "$SIMULATOR_UDID" override --time '9:41' --dataNetwork wifi --wifiMode active --wifiBars 3 --batteryState charged --batteryLevel 100
xcrun simctl terminate "$SIMULATOR_UDID" "$APP_ID" || true
node "$repository_root/tests/app-tests/scripts/seed-app-state.ts" --app-id="$APP_ID" --udid="$SIMULATOR_UDID" --language=en --appearance=dark --scene-state=preview --difficulty=Medium

cat > "$capture_directory/prepare.yaml" <<'FLOW'
appId: ${APP_ID}
---
- launchApp:
      clearState: false
- openLink: 'suuudokuuu://game'
- repeat:
      times: 3
      while:
          visible: '^Open$'
      commands:
          - tapOn: '^Open$'
- tapOn:
      text: 'Continue'
      optional: true
- extendedWaitUntil:
      visible:
          id: 'AvailableValueItemSelectors.Button.1'
      timeout: 10000
FLOW

maestro --device "$SIMULATOR_UDID" test -e APP_ID="$APP_ID" --debug-output "$capture_directory/prepare" "$capture_directory/prepare.yaml"
xcrun simctl io "$SIMULATOR_UDID" recordVideo --codec=h264 "$capture_directory/gameplay.mov" > "$capture_directory/recording.log" 2>&1 &
recording_pid="$!"
sleep 2
maestro --device "$SIMULATOR_UDID" test -e APP_ID="$APP_ID" --debug-output "$capture_directory/gameplay" "$repository_root/tests/app-tests/flows/screenshots/app-preview.flow.yaml"
sleep 2
stop_recording

driver_log="$(find "$capture_directory/gameplay" -name 'xctest_runner*.log' | head -1)"
node "$repository_root/tests/app-tests/scripts/compose-app-preview.ts" --recording="$capture_directory/gameplay.mov" --driver-log="$driver_log" --output="$capture_directory/01_IPHONE_67.mp4"
ffprobe -v error -show_format -show_streams -of json "$capture_directory/01_IPHONE_67.mp4" > "$capture_directory/ffprobe.json"
mv "$capture_directory/01_IPHONE_67.mp4" "$preview_directory/01_IPHONE_67.mp4"
printf 'Preview: %s\nCapture evidence: %s\n' "$preview_directory/01_IPHONE_67.mp4" "$capture_directory"
