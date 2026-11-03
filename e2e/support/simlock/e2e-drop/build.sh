#!/bin/sh
# Builds E2EDrop.app for the iOS simulator (arm64). Needs Xcode; run on a Mac:
#   sh support/simlock/e2e-drop/build.sh
# The built app is committed next to this script, so Linux runners need no Mac to use it.
set -eu
here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
app="$here/E2EDrop.app"
rm -rf "$app" && mkdir -p "$app"
xcrun -sdk iphonesimulator swiftc -target arm64-apple-ios17.0-simulator -O "$here/main.swift" -o "$app/E2EDrop"
cat > "$app/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleIdentifier</key><string>dev.e2e.simlock.drop</string>
<key>CFBundleExecutable</key><string>E2EDrop</string>
<key>CFBundleName</key><string>E2EDrop</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleShortVersionString</key><string>1.0</string>
<key>CFBundleVersion</key><string>1</string>
<key>CFBundleSupportedPlatforms</key><array><string>iPhoneSimulator</string></array>
<key>MinimumOSVersion</key><string>17.0</string>
<key>UIDeviceFamily</key><array><integer>1</integer><integer>2</integer></array>
</dict></plist>
PLIST
codesign --force --sign - "$app"
echo "built $app"
