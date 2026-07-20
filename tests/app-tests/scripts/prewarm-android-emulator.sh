#!/bin/bash
# Image-build-time Android emulator prewarm for the shared macOS CI guest.
# Installs a pinned Android SDK, creates one AVD, boots it once so the
# quick-boot snapshot exists, and records the inventory. Requires the guest
# to run under nested virtualization (tart run --nested) so the emulator can
# use HVF; a software-rendered first boot is 10-20x slower and produces a
# snapshot that resumes equally slowly.
#
#   ANDROID_SDK_ROOT     override install root (default ~/Library/Android/sdk)
#   BOOT_TIMEOUT_SECONDS emulator first-boot budget (default 600)
set -euo pipefail

CMDLINE_TOOLS_VERSION='13114758'
SYSTEM_IMAGE='system-images;android-35;google_apis;arm64-v8a'
PLATFORM='platforms;android-35'
AVD_NAME='e2e'
DEVICE_PROFILE='pixel_7'
ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}"
BOOT_TIMEOUT_SECONDS="${BOOT_TIMEOUT_SECONDS:-600}"
RECORD_DIR="$HOME/.sudoku-ci"

if ! sysctl -n kern.hv_vmm_present >/dev/null 2>&1 || [ "$(sysctl -n kern.hv_support)" != "1" ]; then
    echo "warning: Hypervisor support not visible in this guest; the emulator will crawl without nested virtualization." >&2
fi

export ANDROID_SDK_ROOT ANDROID_HOME="$ANDROID_SDK_ROOT"

if [ ! -x "$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager" ]; then
    echo "Installing Android cmdline-tools $CMDLINE_TOOLS_VERSION"
    mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools"
    tmp_zip="$(mktemp -t cmdline-tools).zip"
    curl -fsSL "https://dl.google.com/android/repository/commandlinetools-mac-${CMDLINE_TOOLS_VERSION}_latest.zip" -o "$tmp_zip"
    unzip -q -o "$tmp_zip" -d "$ANDROID_SDK_ROOT/cmdline-tools"
    rm -f "$tmp_zip"
    mv "$ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools" "$ANDROID_SDK_ROOT/cmdline-tools/latest"
fi

SDKMANAGER="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager"
AVDMANAGER="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/avdmanager"
ADB="$ANDROID_SDK_ROOT/platform-tools/adb"
EMULATOR="$ANDROID_SDK_ROOT/emulator/emulator"

yes | "$SDKMANAGER" --licenses >/dev/null
"$SDKMANAGER" 'platform-tools' 'emulator' "$PLATFORM" "$SYSTEM_IMAGE"

if ! "$AVDMANAGER" list avd | grep -q "Name: $AVD_NAME"; then
    echo "Creating AVD $AVD_NAME ($DEVICE_PROFILE, $SYSTEM_IMAGE)"
    echo no | "$AVDMANAGER" create avd -n "$AVD_NAME" -k "$SYSTEM_IMAGE" -d "$DEVICE_PROFILE"
fi

avd_config="$HOME/.android/avd/$AVD_NAME.avd/config.ini"
for setting in 'hw.ramSize=2048' 'disk.dataPartition.size=6G' 'hw.keyboard=yes'; do
    key="${setting%%=*}"
    if grep -q "^$key=" "$avd_config"; then
        sed -i '' "s|^$key=.*|$setting|" "$avd_config"
    else
        printf '%s\n' "$setting" >> "$avd_config"
    fi
done

echo "First boot of $AVD_NAME (up to ${BOOT_TIMEOUT_SECONDS}s)"
"$EMULATOR" -avd "$AVD_NAME" -no-window -no-audio -no-boot-anim &
EMULATOR_PID=$!

"$ADB" wait-for-device
deadline=$(( $(date +%s) + BOOT_TIMEOUT_SECONDS ))
until [ "$("$ADB" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ]; do
    if [ "$(date +%s)" -ge "$deadline" ]; then
        echo "Emulator did not finish booting within ${BOOT_TIMEOUT_SECONDS}s." >&2
        kill "$EMULATOR_PID" 2>/dev/null || true
        exit 1
    fi
    sleep 5
done

# Animations off for deterministic UI tests; persisted in the AVD data image.
for scale in window_animation_scale transition_animation_scale animator_duration_scale; do
    "$ADB" shell settings put global "$scale" 0
done

# `adb emu kill` performs a clean shutdown that writes the quick-boot
# snapshot, so CI boots resume in seconds instead of re-running first boot.
"$ADB" emu kill
wait "$EMULATOR_PID" 2>/dev/null || true

mkdir -p "$RECORD_DIR"
printf '{"avd":"%s","systemImage":"%s","sdkRoot":"%s"}\n' \
    "$AVD_NAME" "$SYSTEM_IMAGE" "$ANDROID_SDK_ROOT" > "$RECORD_DIR/android-emulator.json"

echo "Prewarmed Android emulator:"
echo "  AVD: $AVD_NAME ($SYSTEM_IMAGE)"
