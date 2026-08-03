#!/usr/bin/env bash
#
# Compose framed, captioned App Store screenshots with ImageMagick.
#
# fastlane frameit's Framefile.json targets a fixed 1320x2868 canvas (the
# iPhone 6.9" slot), but our raw captures are native-resolution shots from an
# iPhone 17 simulator (1206x2622) and an iPad Pro 13" landscape simulator
# (2752x2064). `deliver` assigns screenshots to App Store Connect device
# slots by matching the *exact* pixel dimensions of the uploaded file, so the
# output here must stay at the source resolution rather than being
# letterboxed or padded into frameit's canvas. This script composes each
# screenshot onto a same-resolution #F5F5F5 canvas with a simple rounded
# rounded-corner + thin-border device treatment and a caption rendered in
# Inter Black, instead of using frameit.
#
# Usage:
#   packages/app/fastlane/screenshots/design/compose-screenshots.sh [locale]
#
# `locale` defaults to en-US and must have a design/<locale>/title.strings
# file. The scene manifest (which raw captures to use, in which order, with
# which appearance) is curated below in SCENES — it is a store-listing
# decision, not something to infer from the raw capture directory, so it is
# not read from a config file.
#
# Requires ImageMagick 7 (`magick`) on PATH.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../.." && pwd)"
APP_DIR="$REPO_ROOT/packages/app"
DESIGN_DIR="$APP_DIR/fastlane/screenshots/design"
RAW_DIR="$APP_DIR/fastlane/screenshots/raw/ios"
FONT="$REPO_ROOT/node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf"

LOCALE="${1:-en-US}"
TITLES="$DESIGN_DIR/$LOCALE/title.strings"
OUT_DIR="$APP_DIR/fastlane/screenshots/ios/$LOCALE"

if [[ ! -f "$TITLES" ]]; then
  echo "error: no title.strings for locale '$LOCALE' at $TITLES" >&2
  exit 1
fi

if ! command -v magick >/dev/null 2>&1; then
  echo "error: ImageMagick 7 ('magick') is required on PATH" >&2
  exit 1
fi

BACKGROUND_HEX="#F5F5F5"
TEXT_HEX="#0A0A0A"
ACCENT_HEX="#0057B7"
DEVICE_BORDER_HEX="#1A1A1A"

DEVICE_WIDTH_FRACTION="0.78"
RADIUS_FRACTION="0.06"
BORDER_FRACTION="0.008"
BOTTOM_MARGIN_FRACTION="0.015"
TOP_MARGIN_FRACTION="0.05"
CAPTION_GAP_FRACTION="0.015"
SIDE_PADDING_FRACTION="0.10"

caption_for() {
  local scene="$1"
  local line
  line="$(grep -F "\"$scene\" = " "$TITLES" || true)"
  if [[ -z "$line" ]]; then
    echo "error: no caption for scene '$scene' in $TITLES" >&2
    exit 1
  fi
  echo "$line" | sed -E 's/^"[^"]+" = "(.*)";$/\1/'
}

compose_one() {
  local device="$1" scene="$2" appearance="$3" text_hex="$4" out_name="$5"
  local src="$RAW_DIR/$device/en/$appearance/$scene.png"
  if [[ ! -f "$src" ]]; then
    echo "error: missing raw capture $src" >&2
    exit 1
  fi

  local caption
  caption="$(caption_for "$scene")"

  local canvas_w canvas_h
  canvas_w="$(magick identify -format "%w" "$src")"
  canvas_h="$(magick identify -format "%h" "$src")"

  local work
  work="$(mktemp -d)"
  trap 'rm -rf "$work"' RETURN

  local device_w device_h radius border frame_w frame_h frame_radius
  local bottom_margin frame_x frame_y top_margin gap cap_h side_pad cap_w
  device_w=$(awk -v w="$canvas_w" -v f="$DEVICE_WIDTH_FRACTION" 'BEGIN { printf "%d", w * f }')
  device_h=$(awk -v w="$canvas_w" -v h="$canvas_h" -v dw="$device_w" 'BEGIN { printf "%d", (h * dw) / w }')
  radius=$(awk -v dw="$device_w" -v f="$RADIUS_FRACTION" 'BEGIN { printf "%d", dw * f }')
  border=$(awk -v dw="$device_w" -v f="$BORDER_FRACTION" 'BEGIN { v = dw * f; printf "%d", (v < 3 ? 3 : v) }')
  frame_w=$((device_w + 2 * border))
  frame_h=$((device_h + 2 * border))
  frame_radius=$((radius + border))
  bottom_margin=$(awk -v h="$canvas_h" -v f="$BOTTOM_MARGIN_FRACTION" 'BEGIN { printf "%d", h * f }')
  frame_x=$(( (canvas_w - frame_w) / 2 ))
  frame_y=$((canvas_h - frame_h - bottom_margin))
  top_margin=$(awk -v h="$canvas_h" -v f="$TOP_MARGIN_FRACTION" 'BEGIN { printf "%d", h * f }')
  gap=$(awk -v h="$canvas_h" -v f="$CAPTION_GAP_FRACTION" 'BEGIN { printf "%d", h * f }')
  cap_h=$((frame_y - top_margin - gap))
  side_pad=$(awk -v w="$canvas_w" -v f="$SIDE_PADDING_FRACTION" 'BEGIN { printf "%d", w * f }')
  cap_w=$((canvas_w - 2 * side_pad))

  magick -size "${canvas_w}x${canvas_h}" xc:"$BACKGROUND_HEX" \
    -define png:color-type=2 -depth 8 "$work/bg.png"

  magick "$src" -resize "${device_w}x${device_h}!" \
    \( +clone -alpha extract -fill black -colorize 100 -fill white \
       -draw "roundrectangle 0,0,$((device_w - 1)),$((device_h - 1)),$radius,$radius" \) \
    -alpha off -compose CopyOpacity -composite \
    -define png:color-type=6 -depth 8 "$work/device.png"

  magick -size "${frame_w}x${frame_h}" xc:none -fill "$DEVICE_BORDER_HEX" \
    -draw "roundrectangle 0,0,$((frame_w - 1)),$((frame_h - 1)),$frame_radius,$frame_radius" \
    -define png:color-type=6 -depth 8 "$work/frame.png"

  magick "$work/frame.png" "$work/device.png" -geometry "+${border}+${border}" \
    -compose Over -composite -define png:color-type=6 -depth 8 "$work/framed-device.png"

  magick "$work/bg.png" "$work/framed-device.png" -geometry "+${frame_x}+${frame_y}" \
    -compose Over -composite -define png:color-type=2 -depth 8 "$work/with-device.png"

  magick -background none -fill "$text_hex" -font "$FONT" -gravity center \
    -size "${cap_w}x${cap_h}" caption:"$caption" \
    -define png:color-type=6 -depth 8 "$work/caption.png"

  mkdir -p "$OUT_DIR"
  magick "$work/with-device.png" "$work/caption.png" -gravity North -geometry "+0+${top_margin}" \
    -compose Over -composite -define png:color-type=2 -depth 8 "$OUT_DIR/$out_name"

  echo "wrote $OUT_DIR/$out_name (${canvas_w}x${canvas_h}), caption: \"$caption\""
}

# device | scene | appearance | text color | output filename
# Curated store order — see README.md "Curated store ordering" for rationale.
SCENES=(
  "iphone|05-win|light|$TEXT_HEX|01_iphone_win.png"
  "iphone|02-hell|light|$ACCENT_HEX|02_iphone_hell.png"
  "iphone|04-editor|light|$TEXT_HEX|03_iphone_editor.png"
  "iphone|06-rival|light|$TEXT_HEX|04_iphone_rival.png"
  "iphone|01-hero-board|light|$TEXT_HEX|05_iphone_hero-board.png"
  "iphone|07-replay|light|$TEXT_HEX|06_iphone_replay.png"
  "iphone|03-themes|light|$TEXT_HEX|07_iphone_themes.png"
  "iphone|08-settings|dark|$TEXT_HEX|08_iphone_dark_settings.png"
  "ipad-landscape|02-hell|light|$ACCENT_HEX|21_ipad_hell.png"
  "ipad-landscape|03-themes|light|$TEXT_HEX|22_ipad_themes.png"
  "ipad-landscape|04-editor|light|$TEXT_HEX|23_ipad_editor.png"
  "ipad-landscape|06-rival|light|$TEXT_HEX|24_ipad_rival.png"
  "ipad-landscape|08-settings|dark|$TEXT_HEX|25_ipad_dark_settings.png"
)

rm -f "$OUT_DIR"/*.png
for entry in "${SCENES[@]}"; do
  IFS='|' read -r device scene appearance text_hex out_name <<<"$entry"
  compose_one "$device" "$scene" "$appearance" "$text_hex" "$out_name"
done
