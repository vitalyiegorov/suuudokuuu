#!/usr/bin/env bash

set -euo pipefail

: "${APP_ID:?Set APP_ID to the installed capture build bundle identifier}"
: "${SIMULATOR_UDID:?Set SIMULATOR_UDID to the owned iPhone 17 Pro Max simulator}"

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
capture_directory="$repository_root/.scratch/app-preview-$(date -u +%Y%m%dT%H%M%SZ)"
preview_directory="$repository_root/packages/app/fastlane/app-previews/en-US"
recording_pid=""
original_content_size="$(xcrun simctl ui "$SIMULATOR_UDID" content_size)"

stop_recording() {
    if [[ -n "$recording_pid" ]]; then
        kill -INT "$recording_pid" 2>/dev/null || true
        wait "$recording_pid" || true
        recording_pid=""
    fi
}

restore_simulator() {
    stop_recording
    xcrun simctl ui "$SIMULATOR_UDID" content_size "$original_content_size"
}

trap restore_simulator EXIT
mkdir -p "$capture_directory" "$preview_directory"
export TMPDIR="$capture_directory"

for executable in xcrun maestro node ffmpeg ffprobe; do
    command -v "$executable" >/dev/null
done

xcrun simctl ui "$SIMULATOR_UDID" content_size large
xcrun simctl status_bar "$SIMULATOR_UDID" override --time '9:41' --dataNetwork wifi --wifiMode active --wifiBars 3 --batteryState charged --batteryLevel 100
app_container="$(xcrun simctl get_app_container "$SIMULATOR_UDID" "$APP_ID" data)"
mkdir -p "$app_container/Documents/SQLite"
node "$repository_root/tests/app-tests/scripts/seed-app-state.ts" --app-id="$APP_ID" --udid="$SIMULATOR_UDID" --language=en --appearance=dark --scene-state=hero --difficulty=Nightmare

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
- extendedWaitUntil:
      visible:
          id: 'AvailableValueItemSelectors.Button.1'
      timeout: 10000
FLOW

maestro --device "$SIMULATOR_UDID" test -e APP_ID="$APP_ID" --debug-output "$capture_directory/prepare" "$capture_directory/prepare.yaml"
xcrun simctl io "$SIMULATOR_UDID" recordVideo --codec=h264 "$capture_directory/gameplay.mov" > "$capture_directory/recording.log" 2>&1 &
recording_pid="$!"
recording_started="$(date +%s)"
maestro --device "$SIMULATOR_UDID" test -e APP_ID="$APP_ID" --debug-output "$capture_directory/gameplay" "$repository_root/tests/app-tests/flows/screenshots/app-preview.flow.yaml"
recording_elapsed="$(( $(date +%s) - recording_started ))"

if (( recording_elapsed < 27 )); then
    sleep "$(( 27 - recording_elapsed ))"
fi

stop_recording
ffmpeg -y -sseof -25 -i "$capture_directory/gameplay.mov" -f lavfi -i anullsrc=r=48000:cl=stereo -t 25 -map 0:v:0 -map 1:a:0 -vf setpts=PTS-STARTPTS,scale=886:1920,setsar=1,fps=30,tpad=stop_mode=clone:stop_duration=1 -c:v libx264 -profile:v high -level:v 4.0 -pix_fmt yuv420p -b:v 11M -minrate 11M -maxrate 11M -bufsize 22M -x264-params nal-hrd=cbr:force-cfr=1 -c:a aac -b:a 256k -movflags +faststart "$capture_directory/01_IPHONE_67.mp4" > "$capture_directory/encoding.log" 2>&1
ffprobe -v error -show_format -show_streams -of json "$capture_directory/01_IPHONE_67.mp4" > "$capture_directory/ffprobe.json"
mv "$capture_directory/01_IPHONE_67.mp4" "$preview_directory/01_IPHONE_67.mp4"
printf 'Preview: %s\nCapture evidence: %s\n' "$preview_directory/01_IPHONE_67.mp4" "$capture_directory"
