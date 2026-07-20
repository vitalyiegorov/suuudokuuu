#!/bin/bash
# Prewarm an Android emulator inside the LINUX CI guest image.
# Requires the guest to be booted with nested virtualization (/dev/kvm).
# Installs pinned cmdline-tools + system image, creates AVD 'e2e', boots it
# once headless to capture a quick-boot snapshot, and records a manifest.
set -euo pipefail

CMDLINE_TOOLS_VERSION='13114758'
SYSTEM_IMAGE='system-images;android-35;google_apis;arm64-v8a'
AVD_NAME='e2e'
SDK_ROOT="$HOME/Android/Sdk"
MANIFEST_DIR="$HOME/.sudoku-ci"

if [ ! -e /dev/kvm ]; then
    echo "FATAL: /dev/kvm missing - guest not booted with --nested" >&2
    exit 1
fi
sudo chmod 666 /dev/kvm

sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq openjdk-17-jdk-headless unzip curl >/dev/null

if [ ! -d "$SDK_ROOT/cmdline-tools/latest" ]; then
    echo "Installing Android cmdline-tools $CMDLINE_TOOLS_VERSION"
    tmp_zip=$(mktemp /tmp/cmdline-tools.XXXXXX.zip)
    curl -fsSL "https://dl.google.com/android/repository/commandlinetools-linux-${CMDLINE_TOOLS_VERSION}_latest.zip" -o "$tmp_zip"
    mkdir -p "$SDK_ROOT/cmdline-tools"
    unzip -qo "$tmp_zip" -d "$SDK_ROOT/cmdline-tools"
    mv "$SDK_ROOT/cmdline-tools/cmdline-tools" "$SDK_ROOT/cmdline-tools/latest"
    rm -f "$tmp_zip"
fi

SDKMANAGER="$SDK_ROOT/cmdline-tools/latest/bin/sdkmanager"
AVDMANAGER="$SDK_ROOT/cmdline-tools/latest/bin/avdmanager"
export ANDROID_SDK_ROOT="$SDK_ROOT" ANDROID_HOME="$SDK_ROOT"

yes | "$SDKMANAGER" --licenses >/dev/null
"$SDKMANAGER" --install 'platform-tools' 'emulator' "$SYSTEM_IMAGE" 'platforms;android-35' >/dev/null

echo "no" | "$AVDMANAGER" create avd --force --name "$AVD_NAME" --package "$SYSTEM_IMAGE" --device pixel_7 >/dev/null
AVD_CONFIG="$HOME/.android/avd/${AVD_NAME}.avd/config.ini"
{
    echo 'hw.ramSize=2048'
    echo 'hw.keyboard=yes'
    echo 'disk.dataPartition.size=6G'
} >> "$AVD_CONFIG"

EMULATOR="$SDK_ROOT/emulator/emulator"
ADB="$SDK_ROOT/platform-tools/adb"
echo "Booting $AVD_NAME once to capture the quick-boot snapshot"
"$EMULATOR" -avd "$AVD_NAME" -no-window -no-audio -gpu swiftshader_indirect -accel on &
EMU_PID=$!
"$ADB" wait-for-device
for _ in $(seq 1 120); do
    [ "$("$ADB" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ] && break
    sleep 5
done
[ "$("$ADB" shell getprop sys.boot_completed | tr -d '\r')" = "1" ] || { echo "FATAL: emulator never finished booting" >&2; exit 1; }

"$ADB" shell settings put global window_animation_scale 0
"$ADB" shell settings put global transition_animation_scale 0
"$ADB" shell settings put global animator_duration_scale 0

echo "Saving quick-boot snapshot"
"$ADB" emu kill
wait "$EMU_PID" 2>/dev/null || true

mkdir -p "$MANIFEST_DIR"
cat > "$MANIFEST_DIR/android-emulator.json" <<JSON
{
  "avd": "$AVD_NAME",
  "systemImage": "$SYSTEM_IMAGE",
  "cmdlineToolsVersion": "$CMDLINE_TOOLS_VERSION",
  "sdkRoot": "$SDK_ROOT",
  "quickBootSnapshot": true,
  "animationsDisabled": true
}
JSON
echo "Android emulator prewarm complete:"
cat "$MANIFEST_DIR/android-emulator.json"
