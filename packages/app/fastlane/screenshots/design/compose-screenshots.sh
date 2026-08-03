#!/usr/bin/env bash
#
# Compose framed, captioned App Store screenshots with ImageMagick, using
# fastlane frameit's real device frame PNGs (Apple Design Resources, via
# facebook/design) instead of a hand-drawn rounded rectangle.
#
# fastlane frameit's own `run`/`ios` commands target a fixed 1320x2868 canvas
# (the iPhone 6.9" slot) and letterbox/pad every capture into it, but our raw
# captures are native-resolution shots from an iPhone 17 simulator
# (1206x2622) and an iPad Pro 13" landscape simulator (2752x2064). `deliver`
# assigns screenshots to App Store Connect device slots by matching the
# *exact* pixel dimensions of the uploaded file, so this script cannot run
# frameit's own pipeline unmodified. Instead it borrows frameit's downloaded
# frame assets and offset data directly: it composites each raw capture into
# the frame PNG's own transparent screen cutout (so the frame's real bezel,
# not a synthetic radius, decides what covers the screenshot's corners), then
# scales that framed unit down onto a same-resolution #F5F5F5 canvas with a
# two-tier headline/descriptor caption stack, a soft drop shadow, and a fixed
# brand accent mark. See README.md's "Framing" section and design/README.md's
# "Design system" section for the full reasoning.
#
# One-time setup: download the frame assets fastlane frameit uses (~280
# files, one-time, cached at ~/.fastlane/frameit/latest):
#
#   fastlane frameit download_frames
#
# Usage:
#   packages/app/fastlane/screenshots/design/compose-screenshots.sh [locale]
#
# `locale` defaults to en-US and must have a design/<locale>/title.strings
# and design/<locale>/subtitle.strings file. The scene manifest (which raw
# captures to use, in which order, with which appearance, layout variant, and
# device size) is curated below in SCENES — it is a store-listing decision,
# not something to infer from the raw capture directory, so it is not read
# from a config file.
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
SUBTITLES="$DESIGN_DIR/$LOCALE/subtitle.strings"
OUT_DIR="$APP_DIR/fastlane/screenshots/ios/$LOCALE"

if [[ ! -f "$TITLES" ]]; then
  echo "error: no title.strings for locale '$LOCALE' at $TITLES" >&2
  exit 1
fi
if [[ ! -f "$SUBTITLES" ]]; then
  echo "error: no subtitle.strings for locale '$LOCALE' at $SUBTITLES" >&2
  exit 1
fi

if ! command -v magick >/dev/null 2>&1; then
  echo "error: ImageMagick 7 ('magick') is required on PATH" >&2
  exit 1
fi
if [[ ! -f "$FONT" ]]; then
  echo "error: font not found at $FONT — run 'yarn install' at the repo root" >&2
  exit 1
fi

# fastlane moved its frameit cache from ~/.frameit to ~/.fastlane/frameit at
# some point; accept either so this keeps working on older fastlane installs.
FRAMES_DIR=""
for candidate in "$HOME/.fastlane/frameit/latest" "$HOME/.frameit/latest"; do
  if [[ -d "$candidate" ]]; then
    FRAMES_DIR="$candidate"
    break
  fi
done
if [[ -z "$FRAMES_DIR" ]]; then
  echo "error: fastlane frameit device frames not found. Run 'fastlane frameit download_frames' first (downloads to ~/.fastlane/frameit/latest)." >&2
  exit 1
fi

IPHONE_FRAME="$FRAMES_DIR/Apple iPhone 17 Black.png"
# The 13" M4 iPad Pro isn't in frameit-frames yet (it's a community-maintained
# asset set); the 12.9" iPad Pro (4th generation) is the closest match — same
# edge-to-edge Face ID design with no home button, same 4:3-ish panel ratio,
# just a slightly smaller/older panel. See README.md "Framing" for the
# comparison against the (older, home-button) generic "iPad Pro" frame.
IPAD_FRAME_PORTRAIT="$FRAMES_DIR/Apple iPad Pro (12.9-inch) (4th generation) Space Gray.png"
for frame_file in "$IPHONE_FRAME" "$IPAD_FRAME_PORTRAIT"; do
  if [[ ! -f "$frame_file" ]]; then
    echo "error: missing frame asset '$frame_file' — re-run 'fastlane frameit download_frames'" >&2
    exit 1
  fi
done

# Pixel rectangle of each frame's transparent screen cutout, measured with a
# flood fill of the PNG's alpha channel (the cutout is the only fully
# transparent region not connected to the image's outer edge) and
# cross-checked against fastlane frameit's own offsets.json ('offset'/
# 'width' keys for "iPhone 17" and "iPad Pro (12.9 inch) (4th generation)").
# iPhone 17's cutout is an exact 1206x2622 pixel match for our capture
# resolution — no resize needed. The iPad cutout (2048x2732) is resized ~1%
# to our capture's 2732x2048 landscape resolution; the aspect ratio is
# already a 0.05% match, so that resize is imperceptible and never crops.
IPHONE_CUTOUT_X=72
IPHONE_CUTOUT_Y=69
IPHONE_CUTOUT_W=1206
IPHONE_CUTOUT_H=2622

# Same cutout, rotated: the portrait frame is 2048x2732 at offset +96+102 in
# a 2245x2930 canvas. Rotating that frame 90 clockwise (to match our
# landscape iPad captures) rotates the cutout to 2732x2048 at +96+96 in a
# 2930x2245 canvas — verified directly against the rotated PNG below rather
# than computed by hand, so a future frameit-frames asset change can't drift
# silently out of sync with this script.
IPAD_CUTOUT_X=96
IPAD_CUTOUT_Y=96
IPAD_CUTOUT_W=2732
IPAD_CUTOUT_H=2048

# --- Design system constants — see design/README.md "Design system" for the
# researched rationale behind each of these. --------------------------------

# Background: flat #F5F5F5 with an almost imperceptible top-to-bottom tone
# shift instead of a pure solid fill — reads as flat at a glance (a gradient
# would fight this app's minimalist black/white/red brand) but keeps the
# canvas from looking like a dead, printer-paper flat swatch next to the
# device shadow.
BACKGROUND_TOP_HEX="#F7F7F7"
BACKGROUND_BOTTOM_HEX="#F1F1F1"

TEXT_HEX="#0A0A0A"
ACCENT_BLUE_HEX="#0057B7"
ACCENT_YELLOW_HEX="#FFD700"

# Headline point size target: 9-11% of canvas width, but on a landscape
# canvas (iPad, wider than it is tall) sizing off the raw width produces a
# headline far too tall for the shallow vertical band left around the
# device. Both devices instead size off an "effective width" — the iPhone's
# own canvas width for portrait canvases, or the iPad canvas height rescaled
# to the iPhone's aspect ratio for landscape ones — so the iPad headline is
# visually calibrated to the exact same proportion as the iPhone's, just
# expressed against its own shorter vertical budget instead of its much
# wider horizontal one.
IPHONE_ASPECT_W_OVER_H="0.46003051"
HEADLINE_POINTSIZE_FRACTION="0.10"
HEADLINE_MIN_FRACTION="0.60"
HEADLINE_TARGET_WIDTH_FRACTION="0.90"
HEADLINE_SHRINK_STEP=4
DESCRIPTOR_SIZE_RATIO="0.55"
DESCRIPTOR_OPACITY="0.75"

TEXT_SIDE_MARGIN_FRACTION="0.05"
TEXT_EDGE_MARGIN_FRACTION="0.05"
STACK_GAP_FRACTION="0.012"

DEVICE_HEIGHT_FRACTION_DEFAULT="0.74"
DEVICE_HEIGHT_FRACTION_ENDPOINT="0.78"
DEVICE_EDGE_MARGIN_FRACTION="0.02"

# Fixed Ukraine-flag accent mark: a short bar directly under the headline,
# identical size/position relative to the text stack on every shot — the one
# consistent brand signal, replacing the old per-shot caption color swap.
ACCENT_BAR_WIDTH_FRACTION="0.12"
ACCENT_BAR_HEIGHT_FRACTION="0.0019"

# Soft drop shadow under the framed device — black, low opacity, blurred,
# offset down. Ratios are relative to canvas height so both devices get a
# proportionally similar shadow.
SHADOW_OPACITY="0.15"
SHADOW_BLUR_RATIO="0.01335"
SHADOW_OFFSET_RATIO="0.00953"

WORK_ROOT="$(mktemp -d)"
trap 'rm -rf "$WORK_ROOT"' EXIT

IPAD_FRAME_LANDSCAPE="$WORK_ROOT/ipad-frame-landscape.png"
magick "$IPAD_FRAME_PORTRAIT" -rotate 90 -define png:color-type=6 -depth 8 "$IPAD_FRAME_LANDSCAPE"

landscape_w="$(magick identify -format "%w" "$IPAD_FRAME_LANDSCAPE")"
landscape_h="$(magick identify -format "%h" "$IPAD_FRAME_LANDSCAPE")"
expected_cutout_right=$((IPAD_CUTOUT_X + IPAD_CUTOUT_W))
expected_cutout_bottom=$((IPAD_CUTOUT_Y + IPAD_CUTOUT_H))
if (( expected_cutout_right > landscape_w || expected_cutout_bottom > landscape_h )); then
  echo "error: rotated iPad frame (${landscape_w}x${landscape_h}) is smaller than the expected cutout rectangle (+${IPAD_CUTOUT_X}+${IPAD_CUTOUT_Y} ${IPAD_CUTOUT_W}x${IPAD_CUTOUT_H}) — frameit-frames likely changed this asset, re-measure the cutout" >&2
  exit 1
fi

string_for() {
  local file="$1" scene="$2" label="$3"
  local line
  line="$(grep -F "\"$scene\" = " "$file" || true)"
  if [[ -z "$line" ]]; then
    echo "error: no $label for scene '$scene' in $file" >&2
    exit 1
  fi
  echo "$line" | sed -E 's/^"[^"]+" = "(.*)";$/\1/'
}

headline_for() {
  string_for "$TITLES" "$1" "headline"
}

descriptor_for() {
  string_for "$SUBTITLES" "$1" "descriptor"
}

# Renders `text` at `pointsize` as an unwrapped label and prints its pixel
# width — used by fit_headline_pointsize's shrink-to-fit loop.
label_width() {
  local pointsize="$1" text="$2"
  magick -font "$FONT" -pointsize "$pointsize" label:"$text" -format "%w" info:
}

# Shrinks the headline point size in 4px steps until it fits inside 90% of
# canvas width, never going below 60% of the starting (max) point size.
fit_headline_pointsize() {
  local effective_w="$1" canvas_w="$2" text="$3"
  local max_pt min_pt target_w pt width
  max_pt=$(awk -v w="$effective_w" -v f="$HEADLINE_POINTSIZE_FRACTION" 'BEGIN { printf "%d", w * f }')
  min_pt=$(awk -v m="$max_pt" -v f="$HEADLINE_MIN_FRACTION" 'BEGIN { printf "%d", m * f }')
  target_w=$(awk -v w="$canvas_w" -v f="$HEADLINE_TARGET_WIDTH_FRACTION" 'BEGIN { printf "%d", w * f }')
  pt="$max_pt"
  width="$(label_width "$pt" "$text")"
  while (( width > target_w && pt > min_pt )); do
    pt=$((pt - HEADLINE_SHRINK_STEP))
    if (( pt < min_pt )); then
      pt=$min_pt
    fi
    width="$(label_width "$pt" "$text")"
  done
  echo "$pt"
}

# Builds the black, blurred, low-opacity shadow silhouette of a
# transparent-canvas image (same pixel dimensions in and out) and shifts it
# down by the configured offset, ready to composite directly onto the
# background before the device itself.
build_shadow() {
  local device_on_canvas="$1" canvas_w="$2" canvas_h="$3" out="$4"
  local blur offset silhouette
  blur=$(awk -v h="$canvas_h" -v r="$SHADOW_BLUR_RATIO" 'BEGIN { printf "%d", h * r }')
  offset=$(awk -v h="$canvas_h" -v r="$SHADOW_OFFSET_RATIO" 'BEGIN { printf "%d", h * r }')
  silhouette="$WORK_ROOT/shadow-silhouette-$$-$RANDOM.png"
  magick "$device_on_canvas" -fill black -colorize 100% \
    -channel A -evaluate multiply "$SHADOW_OPACITY" +channel \
    -channel A -blur "0x${blur}" +channel \
    -define png:color-type=6 -depth 8 "$silhouette"
  magick -size "${canvas_w}x${canvas_h}" xc:none "$silhouette" \
    -gravity NorthWest -geometry "+0+${offset}" -compose Over -composite \
    -define png:color-type=6 -depth 8 "$out"
}

# Builds the two-tier caption stack (headline, fixed accent bar, descriptor)
# as one transparent PNG, `cap_w` wide and exactly as tall as its rendered
# content — no wasted vertical space, so both layout variants can anchor it
# precisely against the canvas edge instead of centering it in a fixed box.
build_text_stack() {
  local canvas_w="$1" canvas_h="$2" headline="$3" descriptor="$4" out="$5"
  local is_landscape effective_w headline_pt descriptor_pt
  local cap_w headline_png descriptor_png bar_png
  local headline_w headline_h descriptor_w descriptor_h
  local bar_w bar_h gap_total sub_gap bar_y descriptor_y stack_h
  local bar_half_w bar_half_w2

  if (( canvas_h >= canvas_w )); then
    effective_w="$canvas_w"
  else
    effective_w=$(awk -v h="$canvas_h" -v a="$IPHONE_ASPECT_W_OVER_H" 'BEGIN { printf "%d", h * a }')
  fi

  headline_pt="$(fit_headline_pointsize "$effective_w" "$canvas_w" "$headline")"
  descriptor_pt=$(awk -v p="$headline_pt" -v r="$DESCRIPTOR_SIZE_RATIO" 'BEGIN { printf "%d", p * r }')
  cap_w=$(awk -v w="$canvas_w" -v f="$HEADLINE_TARGET_WIDTH_FRACTION" 'BEGIN { printf "%d", w * f }')

  headline_png="$WORK_ROOT/$$-headline-$RANDOM.png"
  magick -background none -fill "$TEXT_HEX" -font "$FONT" -pointsize "$headline_pt" \
    label:"$headline" -trim +repage -define png:color-type=6 -depth 8 "$headline_png"
  headline_w="$(magick identify -format "%w" "$headline_png")"
  headline_h="$(magick identify -format "%h" "$headline_png")"

  descriptor_png="$WORK_ROOT/$$-descriptor-$RANDOM.png"
  magick -background none -fill "rgba(10,10,10,${DESCRIPTOR_OPACITY})" -font "$FONT" -pointsize "$descriptor_pt" \
    -gravity center -size "${cap_w}x" caption:"$descriptor" -trim +repage \
    -define png:color-type=6 -depth 8 "$descriptor_png"
  descriptor_w="$(magick identify -format "%w" "$descriptor_png")"
  descriptor_h="$(magick identify -format "%h" "$descriptor_png")"

  bar_w=$(awk -v w="$canvas_w" -v f="$ACCENT_BAR_WIDTH_FRACTION" 'BEGIN { printf "%d", w * f }')
  bar_h=$(awk -v h="$canvas_h" -v f="$ACCENT_BAR_HEIGHT_FRACTION" 'BEGIN { v = h * f; printf "%d", (v < 4 ? 4 : v) }')
  bar_half_w=$((bar_w / 2))
  bar_half_w2=$((bar_w - bar_half_w))
  bar_png="$WORK_ROOT/$$-bar-$RANDOM.png"
  magick \( -size "${bar_half_w}x${bar_h}" xc:"$ACCENT_BLUE_HEX" \) \( -size "${bar_half_w2}x${bar_h}" xc:"$ACCENT_YELLOW_HEX" \) \
    +append -define png:color-type=2 -depth 8 "$bar_png"

  gap_total=$(awk -v h="$canvas_h" -v f="$STACK_GAP_FRACTION" 'BEGIN { printf "%d", h * f }')
  sub_gap=$(( (gap_total - bar_h) / 2 ))
  if (( sub_gap < 2 )); then
    sub_gap=2
  fi

  bar_y=$((headline_h + sub_gap))
  descriptor_y=$((bar_y + bar_h + sub_gap))
  stack_h=$((descriptor_y + descriptor_h))

  magick -size "${cap_w}x${stack_h}" xc:none \
    "$headline_png" -gravity North -geometry "+0+0" -compose Over -composite \
    "$bar_png" -gravity North -geometry "+0+${bar_y}" -compose Over -composite \
    "$descriptor_png" -gravity North -geometry "+0+${descriptor_y}" -compose Over -composite \
    -define png:color-type=6 -depth 8 "$out"

  rm -f "$headline_png" "$descriptor_png" "$bar_png"
}

compose_one() {
  local device="$1" scene="$2" appearance="$3" layout="$4" height_fraction="$5" out_name="$6"
  local src="$RAW_DIR/$device/en/$appearance/$scene.png"
  local retries=0
  while [[ ! -f "$src" && $retries -lt 30 ]]; do
    echo "waiting for raw capture $src (concurrent capture run in progress)..." >&2
    sleep 2
    retries=$((retries + 1))
  done
  if [[ ! -f "$src" ]]; then
    echo "error: missing raw capture $src" >&2
    exit 1
  fi

  local headline descriptor
  headline="$(headline_for "$scene")"
  descriptor="$(descriptor_for "$scene")"

  # A concurrent capture run can rewrite a raw file mid-run; re-reading its
  # dimensions can otherwise briefly observe a stale or half-written file
  # with the wrong orientation for its device (e.g. a portrait iPad capture
  # from before a rotation fix). Wait for the orientation to match the
  # device's expected shape instead of trusting a single read.
  local canvas_w canvas_h orientation_retries=0
  while true; do
    canvas_w="$(magick identify -format "%w" "$src")"
    canvas_h="$(magick identify -format "%h" "$src")"
    case "$device" in
      iphone)
        if (( canvas_h > canvas_w )); then
          break
        fi
        ;;
      ipad-landscape)
        if (( canvas_w > canvas_h )); then
          break
        fi
        ;;
    esac
    if (( orientation_retries >= 30 )); then
      echo "error: raw capture $src has unexpected orientation (${canvas_w}x${canvas_h}) for device '$device' after waiting" >&2
      exit 1
    fi
    echo "waiting for raw capture $src to settle into the expected orientation (currently ${canvas_w}x${canvas_h}, concurrent capture run in progress)..." >&2
    sleep 2
    orientation_retries=$((orientation_retries + 1))
  done

  local frame_file cutout_x cutout_y cutout_w cutout_h
  case "$device" in
    iphone)
      frame_file="$IPHONE_FRAME"
      cutout_x=$IPHONE_CUTOUT_X
      cutout_y=$IPHONE_CUTOUT_Y
      cutout_w=$IPHONE_CUTOUT_W
      cutout_h=$IPHONE_CUTOUT_H
      ;;
    ipad-landscape)
      frame_file="$IPAD_FRAME_LANDSCAPE"
      cutout_x=$IPAD_CUTOUT_X
      cutout_y=$IPAD_CUTOUT_Y
      cutout_w=$IPAD_CUTOUT_W
      cutout_h=$IPAD_CUTOUT_H
      ;;
    *)
      echo "error: unknown device '$device'" >&2
      exit 1
      ;;
  esac

  local frame_native_w frame_native_h
  frame_native_w="$(magick identify -format "%w" "$frame_file")"
  frame_native_h="$(magick identify -format "%h" "$frame_file")"

  local work
  work="$(mktemp -d)"
  trap 'rm -rf "$work"' RETURN

  magick -size "${canvas_w}x${canvas_h}" "gradient:${BACKGROUND_TOP_HEX}-${BACKGROUND_BOTTOM_HEX}" \
    -define png:color-type=2 -depth 8 "$work/bg.png"

  # Resize the capture to exactly fill the frame's real screen cutout, place
  # it at the cutout's offset on a frame-sized transparent canvas, then lay
  # the frame PNG on top: its own opaque bezel (including the rounded-corner
  # overlap) covers the screenshot's square corners, so the corner radius
  # always matches the real device instead of an approximated one. Nothing
  # here crops the capture — resizing "!" fills the cutout exactly and the
  # frame only ever adds bezel around it.
  magick -size "${frame_native_w}x${frame_native_h}" xc:none \
    \( "$src" -resize "${cutout_w}x${cutout_h}!" \) -geometry "+${cutout_x}+${cutout_y}" -compose Over -composite \
    "$frame_file" -compose Over -composite \
    -define png:color-type=6 -depth 8 "$work/framed-device.png"

  local frame_h frame_w device_edge_margin frame_x frame_y
  frame_h=$(awk -v h="$canvas_h" -v f="$height_fraction" 'BEGIN { printf "%d", h * f }')
  frame_w=$(awk -v fh="$frame_h" -v nw="$frame_native_w" -v nh="$frame_native_h" 'BEGIN { printf "%d", (fh * nw) / nh }')
  device_edge_margin=$(awk -v h="$canvas_h" -v f="$DEVICE_EDGE_MARGIN_FRACTION" 'BEGIN { printf "%d", h * f }')
  frame_x=$(( (canvas_w - frame_w) / 2 ))
  if [[ "$layout" == "A" ]]; then
    frame_y=$((canvas_h - frame_h - device_edge_margin))
  else
    frame_y="$device_edge_margin"
  fi

  magick "$work/framed-device.png" -resize "${frame_w}x${frame_h}!" \
    -define png:color-type=6 -depth 8 "$work/framed-device-scaled.png"

  magick -size "${canvas_w}x${canvas_h}" xc:none "$work/framed-device-scaled.png" -geometry "+${frame_x}+${frame_y}" \
    -compose Over -composite -define png:color-type=6 -depth 8 "$work/device-on-canvas.png"

  build_shadow "$work/device-on-canvas.png" "$canvas_w" "$canvas_h" "$work/shadow.png"

  magick "$work/bg.png" "$work/shadow.png" -compose Over -composite \
    "$work/device-on-canvas.png" -compose Over -composite \
    -define png:color-type=2 -depth 8 "$work/with-device.png"

  build_text_stack "$canvas_w" "$canvas_h" "$headline" "$descriptor" "$work/text-stack.png"

  local text_edge_margin
  text_edge_margin=$(awk -v h="$canvas_h" -v f="$TEXT_EDGE_MARGIN_FRACTION" 'BEGIN { printf "%d", h * f }')

  mkdir -p "$OUT_DIR"
  if [[ "$layout" == "A" ]]; then
    magick "$work/with-device.png" "$work/text-stack.png" -gravity North -geometry "+0+${text_edge_margin}" \
      -compose Over -composite -define png:color-type=2 -depth 8 "$OUT_DIR/$out_name"
  else
    magick "$work/with-device.png" "$work/text-stack.png" -gravity South -geometry "+0+${text_edge_margin}" \
      -compose Over -composite -define png:color-type=2 -depth 8 "$OUT_DIR/$out_name"
  fi

  echo "wrote $OUT_DIR/$out_name (${canvas_w}x${canvas_h}), layout $layout, headline: \"$headline\""
}

# device | scene | appearance | layout | device height fraction | output filename
# Curated store order — see README.md "Curated store ordering" for
# rationale. Layout alternates A (text top / device bottom) and B (device
# top / text bottom) by position for scroll rhythm; the first and last shots
# use the taller end of the device height range (0.78), every other shot
# uses the shorter end (0.74) — see design/README.md "Design system".
SCENES=(
  "iphone|05-win|light|A|$DEVICE_HEIGHT_FRACTION_ENDPOINT|01_iphone_win.png"
  "iphone|02-hell|light|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|02_iphone_hell.png"
  "iphone|04-editor|light|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|03_iphone_editor.png"
  "iphone|06-rival|light|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|04_iphone_rival.png"
  "iphone|01-hero-board|light|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|05_iphone_hero-board.png"
  "iphone|07-replay|light|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|06_iphone_replay.png"
  "iphone|03-themes|light|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|07_iphone_themes.png"
  "iphone|08-settings|dark|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|08_iphone_dark_settings.png"
  "ipad-landscape|02-hell|light|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|21_ipad_hell.png"
  "ipad-landscape|03-themes|light|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|22_ipad_themes.png"
  "ipad-landscape|04-editor|light|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|23_ipad_editor.png"
  "ipad-landscape|06-rival|light|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|24_ipad_rival.png"
  "ipad-landscape|08-settings|dark|A|$DEVICE_HEIGHT_FRACTION_ENDPOINT|25_ipad_dark_settings.png"
)

rm -f "$OUT_DIR"/*.png
for entry in "${SCENES[@]}"; do
  IFS='|' read -r device scene appearance layout height_fraction out_name <<<"$entry"
  compose_one "$device" "$scene" "$appearance" "$layout" "$height_fraction" "$out_name"
done
