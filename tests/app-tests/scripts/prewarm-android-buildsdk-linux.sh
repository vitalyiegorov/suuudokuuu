#!/bin/bash
# Bake the Android BUILD toolchain into the linux CI guest image: JDK 17 +
# cmdline-tools + platform/build components for gradle APK builds. The
# emulator package does not exist for arm64 linux — device testing is
# Redroid's job (prewarm-redroid-linux.sh); this script only serves builds.
set -euo pipefail

CMDLINE_TOOLS_VERSION='13114758'
SDK_ROOT="$HOME/Android/Sdk"

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
export ANDROID_SDK_ROOT="$SDK_ROOT" ANDROID_HOME="$SDK_ROOT"

# 'yes' dies of SIGPIPE when sdkmanager stops reading; don't let pipefail
# turn that into a script failure — the install step below catches real errors.
yes 2>/dev/null | "$SDKMANAGER" --licenses >/dev/null || true
"$SDKMANAGER" --install 'platform-tools' 'platforms;android-35' 'build-tools;35.0.0' >/dev/null

test -x "$SDK_ROOT/platform-tools/adb"
echo "Android build SDK prewarm complete:"
"$SDKMANAGER" --list_installed | sed -n '1,8p'
