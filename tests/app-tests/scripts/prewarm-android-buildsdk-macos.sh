#!/bin/bash
# Bake the Android BUILD toolchain into the macOS CI base image: Temurin
# JDK 17 + cmdline-tools + platform/build components + NDK. The darwin NDK
# is a universal binary (arm64-native), unlike linux where Google ships
# x86_64 only — so APK builds live on the macOS builder while device
# testing runs on linux Redroid.
set -euo pipefail

CMDLINE_TOOLS_VERSION='13114758'
NDK_VERSION='27.1.12297006'
SDK_ROOT="$HOME/Library/Android/sdk"
JDK_DIR='/Library/Java/JavaVirtualMachines/temurin-17.jdk'

if [ ! -d "$JDK_DIR" ]; then
    echo "Installing Temurin JDK 17"
    tmp_tar=$(mktemp /tmp/jdk.XXXXXX.tar.gz)
    curl -fsSL 'https://api.adoptium.net/v3/binary/latest/17/ga/mac/aarch64/jdk/hotspot/normal/eclipse' -o "$tmp_tar"
    tmp_dir=$(mktemp -d /tmp/jdk.XXXXXX)
    tar -xzf "$tmp_tar" -C "$tmp_dir"
    echo admin | sudo -S mkdir -p "$JDK_DIR"
    echo admin | sudo -S cp -R "$tmp_dir"/jdk-*/Contents "$JDK_DIR/"
    rm -rf "$tmp_tar" "$tmp_dir"
fi
export JAVA_HOME="$JDK_DIR/Contents/Home"
"$JAVA_HOME/bin/java" -version 2>&1 | head -1

if [ ! -d "$SDK_ROOT/cmdline-tools/latest" ]; then
    echo "Installing Android cmdline-tools $CMDLINE_TOOLS_VERSION"
    tmp_zip=$(mktemp /tmp/cmdline-tools.XXXXXX.zip)
    curl -fsSL "https://dl.google.com/android/repository/commandlinetools-mac-${CMDLINE_TOOLS_VERSION}_latest.zip" -o "$tmp_zip"
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
"$SDKMANAGER" --install 'platform-tools' 'platforms;android-35' 'build-tools;35.0.0' "ndk;$NDK_VERSION" 'cmake;3.22.1' >/dev/null

test -x "$SDK_ROOT/platform-tools/adb"
test -x "$SDK_ROOT/ndk/$NDK_VERSION/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang" || \
  test -x "$SDK_ROOT/ndk/$NDK_VERSION/toolchains/llvm/prebuilt/darwin-arm64/bin/clang"
echo "ANDROID-BUILDSDK-MACOS-OK"
