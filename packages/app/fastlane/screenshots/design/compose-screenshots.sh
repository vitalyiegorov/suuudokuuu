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
# scales that framed unit down onto a same-resolution variant-palette canvas
# with a two-tier headline/descriptor caption stack and a soft drop shadow. See
# README.md's "Framing" section and design/README.md's "Design system"
# section for the full reasoning.
#
# One-time setup: download the frame assets fastlane frameit uses (~280
# files, one-time, cached at ~/.fastlane/frameit/latest):
#
#   fastlane frameit download_frames
#
# Usage:
#   packages/app/fastlane/screenshots/design/compose-screenshots.sh [locale] [variant]
#
# `locale` defaults to en-US and must have a design/<locale>/title.strings
# and design/<locale>/subtitle.strings file. `variant` is light, dark, or
# all (the default) and selects which appearance set(s) to compose into
# variants/<variant>/ios/<locale>. The scene manifests (which raw captures
# to use, in which order, with which appearance, layout variant, and device
# size) are curated below in SCENES_LIGHT/SCENES_DARK — they are a
# store-listing decision, not something to infer from the raw capture
# directory, so they are not read from a config file.
#
# Requires ImageMagick 7 (`magick`) on PATH.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../.." && pwd)"
APP_DIR="$REPO_ROOT/packages/app"
DESIGN_DIR="$APP_DIR/fastlane/screenshots/design"
RAW_DIR="$APP_DIR/fastlane/screenshots/raw/ios"
FONT="$REPO_ROOT/node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf"

LOCALE="${1:-en-US}"
VARIANT="${2:-all}"
TITLES="$DESIGN_DIR/$LOCALE/title.strings"
SUBTITLES="$DESIGN_DIR/$LOCALE/subtitle.strings"
OUT_DIR=""

if [[ "$VARIANT" != "all" && "$VARIANT" != "light" && "$VARIANT" != "dark" ]]; then
  echo "error: unknown variant '$VARIANT'. Use light, dark, or all." >&2
  exit 1
fi

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

# Background: near-flat canvas with an almost imperceptible top-to-bottom
# tone shift instead of a pure solid fill — reads as flat at a glance (a
# gradient would fight this app's minimalist black/white/red brand) but
# keeps the canvas from looking like a dead, printer-paper flat swatch next
# to the device shadow. Each variant gets its own canvas and text palette;
# set_variant_palette selects the active one before composing.
set_variant_palette() {
  local variant="$1"
  if [[ "$variant" == "dark" ]]; then
    BACKGROUND_TOP_HEX="#141414"
    BACKGROUND_BOTTOM_HEX="#0E0E0E"
    TEXT_HEX="#F5F5F5"
    DESCRIPTOR_RGB="245,245,245"
  else
    BACKGROUND_TOP_HEX="#F7F7F7"
    BACKGROUND_BOTTOM_HEX="#F1F1F1"
    TEXT_HEX="#0A0A0A"
    DESCRIPTOR_RGB="10,10,10"
  fi
  OUT_DIR="$APP_DIR/fastlane/screenshots/variants/$variant/ios/$LOCALE"
}

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

# Vertical gap between the caption stack and the device frame — deliberately
# tight so the composition reads as one cohesive unit instead of a
# caption-island floating above (or below) a separate device-island. Both
# layout variants place the device directly relative to the caption stack's
# actual rendered height (see position_layout below) using this fixed gap,
# instead of independently anchoring text and device to opposite canvas
# edges and letting whatever space happens to be left over become the gap.
TEXT_DEVICE_GAP_FRACTION="0.016"

DEVICE_HEIGHT_FRACTION_DEFAULT="0.74"
DEVICE_HEIGHT_FRACTION_ENDPOINT="0.78"
DEVICE_HEIGHT_FRACTION_COMBO="0.62"
DEVICE_EDGE_MARGIN_FRACTION="0.02"
COMBO_EDGE_MARGIN_FRACTION="0.015"

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

# Blocks until `path` exists, tolerating a concurrent capture run still
# writing raw captures to disk.
wait_for_capture() {
  local path="$1"
  local retries=0
  while [[ ! -f "$path" && $retries -lt 30 ]]; do
    echo "waiting for raw capture $path (concurrent capture run in progress)..." >&2
    sleep 2
    retries=$((retries + 1))
  done
  if [[ ! -f "$path" ]]; then
    echo "error: missing raw capture $path" >&2
    exit 1
  fi
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

# Builds the two-tier caption stack (headline, descriptor) as one
# transparent PNG, `cap_w` wide and exactly as tall as its rendered content —
# no wasted vertical space, so position_layout can place the device directly
# beneath (or above) it with a fixed, tight gap instead of centering it in a
# fixed box. Every headline renders in the variant's $TEXT_HEX with no
# per-scene accent — a two-color underline mark used to live here but read
# as a decorative afterthought rather than a premium brand signal, so it was
# removed; typography hierarchy alone now carries the brand.
build_text_stack() {
  local canvas_w="$1" canvas_h="$2" headline="$3" descriptor="$4" out="$5"
  local effective_w headline_pt descriptor_pt
  local cap_w headline_png descriptor_png
  local headline_w headline_h descriptor_w descriptor_h
  local sub_gap descriptor_y stack_h

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
  magick -background none -fill "rgba(${DESCRIPTOR_RGB},${DESCRIPTOR_OPACITY})" -font "$FONT" -pointsize "$descriptor_pt" \
    -gravity center -size "${cap_w}x" caption:"$descriptor" -trim +repage \
    -define png:color-type=6 -depth 8 "$descriptor_png"
  descriptor_w="$(magick identify -format "%w" "$descriptor_png")"
  descriptor_h="$(magick identify -format "%h" "$descriptor_png")"

  sub_gap=$(awk -v h="$canvas_h" -v f="$STACK_GAP_FRACTION" 'BEGIN { printf "%d", h * f }')
  if (( sub_gap < 2 )); then
    sub_gap=2
  fi

  descriptor_y=$((headline_h + sub_gap))
  stack_h=$((descriptor_y + descriptor_h))

  magick -size "${cap_w}x${stack_h}" xc:none \
    "$headline_png" -gravity North -geometry "+0+0" -compose Over -composite \
    "$descriptor_png" -gravity North -geometry "+0+${descriptor_y}" -compose Over -composite \
    -define png:color-type=6 -depth 8 "$out"

  rm -f "$headline_png" "$descriptor_png"
}

# Given the layout variant and the actual rendered heights of the caption
# stack and the device block, returns "device_y text_y" (both absolute,
# North-anchored pixel offsets from the canvas top). Layout A is
# text-top/device-bottom: text sits at the fixed outer edge margin, and the
# device starts immediately after it (stack height + one fixed gap) — not at
# a fixed distance from the opposite canvas edge, which is what used to leave
# a large, variable, uncontrolled gap between the two blocks. Layout B
# mirrors this: the device sits at the fixed outer edge margin, and the text
# starts immediately after it.
position_layout() {
  local canvas_h="$1" layout="$2" device_h="$3" stack_h="$4"
  local edge_margin gap device_y text_y
  edge_margin=$(awk -v h="$canvas_h" -v f="$TEXT_EDGE_MARGIN_FRACTION" 'BEGIN { printf "%d", h * f }')
  gap=$(awk -v h="$canvas_h" -v f="$TEXT_DEVICE_GAP_FRACTION" 'BEGIN { printf "%d", h * f }')
  if [[ "$layout" == "A" ]]; then
    text_y="$edge_margin"
    device_y=$((text_y + stack_h + gap))
  else
    device_y="$edge_margin"
    text_y=$((device_y + device_h + gap))
  fi
  echo "$device_y $text_y"
}

# Resizes a raw capture into a frame PNG's real transparent screen cutout and
# layers the frame on top, so the frame's own bezel (including the rounded-
# corner overlap) covers the screenshot's square corners. Nothing crops the
# capture — resizing "!" fills the cutout exactly and the frame only ever
# adds bezel around it. Output is at the frame's own native resolution.
# The screen cutout's bounding box overlaps the frame's transparent outer
# corner region (the device's outer corner radius is larger than the
# screen's), so a square capture composited at the cutout offset pokes past
# the bezel at all four corners. Clip the capture to the frame's enclosed
# screen cutout: flood-fill the border-connected transparent region out of
# the alpha mask so only the screen opening (the one transparent region not
# touching the image edge) keeps capture pixels.
frame_capture() {
  local src="$1" frame_file="$2" cutout_x="$3" cutout_y="$4" cutout_w="$5" cutout_h="$6" out="$7"
  local frame_native_w frame_native_h cutout_mask
  frame_native_w="$(magick identify -format "%w" "$frame_file")"
  frame_native_h="$(magick identify -format "%h" "$frame_file")"
  cutout_mask="$WORK_ROOT/cutout-mask-$$-$RANDOM.png"
  magick "$frame_file" -alpha extract -fuzz 50% -fill white -floodfill +0+0 black -negate \
    \( -size "${frame_native_w}x${frame_native_h}" xc:black -fill white \
      -draw "rectangle ${cutout_x},${cutout_y} $((cutout_x + cutout_w - 1)),$((cutout_y + cutout_h - 1))" \) \
    -compose Multiply -composite -define png:color-type=0 -depth 8 "$cutout_mask"
  magick -size "${frame_native_w}x${frame_native_h}" xc:none \
    \( "$src" -resize "${cutout_w}x${cutout_h}!" \) -geometry "+${cutout_x}+${cutout_y}" -compose Over -composite \
    "$cutout_mask" -compose CopyOpacity -composite \
    "$frame_file" -compose Over -composite \
    -define png:color-type=6 -depth 8 "$out"
}

compose_one() {
  local device="$1" scene="$2" appearance="$3" layout="$4" height_fraction="$5" out_name="$6" caption_key="${7:-$scene}"
  local src="$RAW_DIR/$device/en/$appearance/$scene.png"
  wait_for_capture "$src"

  local headline descriptor
  headline="$(headline_for "$caption_key")"
  descriptor="$(descriptor_for "$caption_key")"

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
  work="$(mktemp -d "$WORK_ROOT/compose-XXXXXX")"

  magick -size "${canvas_w}x${canvas_h}" "gradient:${BACKGROUND_TOP_HEX}-${BACKGROUND_BOTTOM_HEX}" \
    -define png:color-type=2 -depth 8 "$work/bg.png"

  frame_capture "$src" "$frame_file" "$cutout_x" "$cutout_y" "$cutout_w" "$cutout_h" "$work/framed-device.png"

  local frame_h frame_w frame_x
  frame_h=$(awk -v h="$canvas_h" -v f="$height_fraction" 'BEGIN { printf "%d", h * f }')
  frame_w=$(awk -v fh="$frame_h" -v nw="$frame_native_w" -v nh="$frame_native_h" 'BEGIN { printf "%d", (fh * nw) / nh }')
  frame_x=$(( (canvas_w - frame_w) / 2 ))

  magick "$work/framed-device.png" -resize "${frame_w}x${frame_h}!" \
    -define png:color-type=6 -depth 8 "$work/framed-device-scaled.png"

  build_text_stack "$canvas_w" "$canvas_h" "$headline" "$descriptor" "$work/text-stack.png"
  local stack_h
  stack_h="$(magick identify -format "%h" "$work/text-stack.png")"

  local device_y text_y
  read -r device_y text_y <<<"$(position_layout "$canvas_h" "$layout" "$frame_h" "$stack_h")"

  magick -size "${canvas_w}x${canvas_h}" xc:none "$work/framed-device-scaled.png" -geometry "+${frame_x}+${device_y}" \
    -compose Over -composite -define png:color-type=6 -depth 8 "$work/device-on-canvas.png"

  build_shadow "$work/device-on-canvas.png" "$canvas_w" "$canvas_h" "$work/shadow.png"

  magick "$work/bg.png" "$work/shadow.png" -compose Over -composite \
    "$work/device-on-canvas.png" -compose Over -composite \
    "$work/text-stack.png" -gravity North -geometry "+0+${text_y}" -compose Over -composite \
    -define png:color-type=2 -depth 8 "$work/final.png"

  mkdir -p "$OUT_DIR"
  cp "$work/final.png" "$OUT_DIR/$out_name"

  echo "wrote $OUT_DIR/$out_name (${canvas_w}x${canvas_h}), layout $layout, headline: \"$headline\""
}

# Special two-device scene for the "full customization" story: the colorful
# theme editor (English) and the localized theme list (Ukrainian) side by
# side in one iPhone-sized canvas, as a single combined proof of both
# per-cell theming and language breadth instead of two separate shots. Both
# devices are real framed iPhone 17s scaled to the same height, positioned
# so they fit the canvas width edge-to-edge with the minimum overlap needed
# — the right (Ukrainian) device is composited on top, so its own content is
# always fully legible; only the left device's right edge is partly covered.
compose_combo() {
  local layout="$1" height_fraction="$2" out_name="$3" caption_key="$4" appearance="${5:-light}"
  local left_src="$RAW_DIR/iphone/en/$appearance/04-editor.png"
  local right_src="$RAW_DIR/iphone/uk/$appearance/03-themes.png"
  wait_for_capture "$left_src"
  wait_for_capture "$right_src"

  local headline descriptor
  headline="$(headline_for "$caption_key")"
  descriptor="$(descriptor_for "$caption_key")"

  local canvas_w canvas_h
  canvas_w="$(magick identify -format "%w" "$left_src")"
  canvas_h="$(magick identify -format "%h" "$left_src")"

  local work
  work="$(mktemp -d "$WORK_ROOT/compose-XXXXXX")"

  magick -size "${canvas_w}x${canvas_h}" "gradient:${BACKGROUND_TOP_HEX}-${BACKGROUND_BOTTOM_HEX}" \
    -define png:color-type=2 -depth 8 "$work/bg.png"

  frame_capture "$left_src" "$IPHONE_FRAME" "$IPHONE_CUTOUT_X" "$IPHONE_CUTOUT_Y" "$IPHONE_CUTOUT_W" "$IPHONE_CUTOUT_H" "$work/framed-left.png"
  frame_capture "$right_src" "$IPHONE_FRAME" "$IPHONE_CUTOUT_X" "$IPHONE_CUTOUT_Y" "$IPHONE_CUTOUT_W" "$IPHONE_CUTOUT_H" "$work/framed-right.png"

  local frame_native_w frame_native_h
  frame_native_w="$(magick identify -format "%w" "$IPHONE_FRAME")"
  frame_native_h="$(magick identify -format "%h" "$IPHONE_FRAME")"

  local device_h device_w edge_margin
  device_h=$(awk -v h="$canvas_h" -v f="$height_fraction" 'BEGIN { printf "%d", h * f }')
  device_w=$(awk -v dh="$device_h" -v nw="$frame_native_w" -v nh="$frame_native_h" 'BEGIN { printf "%d", (dh * nw) / nh }')
  edge_margin=$(awk -v h="$canvas_h" -v f="$COMBO_EDGE_MARGIN_FRACTION" 'BEGIN { printf "%d", h * f }')

  magick "$work/framed-left.png" -resize "${device_w}x${device_h}!" \
    -define png:color-type=6 -depth 8 "$work/framed-left-scaled.png"
  magick "$work/framed-right.png" -resize "${device_w}x${device_h}!" \
    -define png:color-type=6 -depth 8 "$work/framed-right-scaled.png"

  # Both devices span the canvas width edge-to-edge (minus the outer
  # margins) at their target height; on a portrait canvas, two portrait
  # phones at a legible height only fit that width with real overlap, so the
  # overlap is derived from the available width rather than picked as an
  # arbitrary constant — it is exactly the overlap needed to fit, no more.
  local available_w total_pair_w overlap_px left_x right_x
  available_w=$((canvas_w - 2 * edge_margin))
  total_pair_w=$((2 * device_w))
  overlap_px=$((total_pair_w - available_w))
  if (( overlap_px < 0 )); then
    overlap_px=0
  fi
  left_x="$edge_margin"
  right_x=$((left_x + device_w - overlap_px))

  build_text_stack "$canvas_w" "$canvas_h" "$headline" "$descriptor" "$work/text-stack.png"
  local stack_h
  stack_h="$(magick identify -format "%h" "$work/text-stack.png")"

  local gap block_h block_top device_y text_y
  gap=$(awk -v h="$canvas_h" -v f="$TEXT_DEVICE_GAP_FRACTION" 'BEGIN { printf "%d", h * f }')
  block_h=$((device_h + gap + stack_h))
  block_top=$(((canvas_h - block_h) / 2))
  device_y="$block_top"
  text_y=$((block_top + device_h + gap))

  magick -size "${canvas_w}x${canvas_h}" xc:none \
    "$work/framed-left-scaled.png" -gravity NorthWest -geometry "+${left_x}+${device_y}" -compose Over -composite \
    "$work/framed-right-scaled.png" -gravity NorthWest -geometry "+${right_x}+${device_y}" -compose Over -composite \
    -define png:color-type=6 -depth 8 "$work/device-on-canvas.png"

  build_shadow "$work/device-on-canvas.png" "$canvas_w" "$canvas_h" "$work/shadow.png"

  magick "$work/bg.png" "$work/shadow.png" -compose Over -composite \
    "$work/device-on-canvas.png" -compose Over -composite \
    "$work/text-stack.png" -gravity North -geometry "+0+${text_y}" -compose Over -composite \
    -define png:color-type=2 -depth 8 "$work/final.png"

  mkdir -p "$OUT_DIR"
  cp "$work/final.png" "$OUT_DIR/$out_name"

  echo "wrote $OUT_DIR/$out_name (${canvas_w}x${canvas_h}), layout $layout, headline: \"$headline\" (combo: 04-editor en + 03-themes uk)"
}

# device | scene | appearance | layout | device height fraction | output filename | caption key (optional, defaults to scene)
# Curated store order — see README.md "Curated store ordering" for
# rationale. Layout alternates A (text top / device bottom) and B (device
# top / text bottom) by position for scroll rhythm, with one deliberate
# exception: the challenge pair (03, 04) shares layout A on purpose — same
# composition, complementary copy, so the two shots read as a connected
# two-part story instead of two unrelated scenes that happen to be adjacent.
# The very first and very last shots in the whole gallery use the taller end
# of the device height range (0.78), every other shot uses the shorter end
# (0.74) — see design/README.md "Design system". The combo scene (device
# field "combo") is dispatched to compose_combo instead of compose_one; its
# appearance field selects which captures the combo pulls, its scene field
# is an unused placeholder. The two variant manifests mirror each other:
# every shot uses its own variant's appearance, and the closing iPhone shot
# flips to the opposite appearance as the "also does the other mode" proof
# (dark closer in the light set, light closer in the dark set).
SCENES_LIGHT=(
  "iphone|01-hero-board|light|A|$DEVICE_HEIGHT_FRACTION_ENDPOINT|01_iphone_hero-board.png"
  "iphone|02-hell|light|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|02_iphone_hell.png"
  "iphone|06-rival|light|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|03_iphone_challenge-accept.png"
  "iphone|14-challenge-live|light|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|04_iphone_challenge-live.png"
  "combo|-|light|B|$DEVICE_HEIGHT_FRACTION_COMBO|05_iphone_customization.png|05-customization"
  "iphone|07-replay|light|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|06_iphone_replay.png"
  "iphone|01-hero-board|dark|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|07_iphone_hero-board-dark.png|01-hero-board-dark"
  "ipad-landscape|01-hero-board|light|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|21_ipad_hero-board.png"
  "ipad-landscape|02-hell|light|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|22_ipad_hell.png"
  "ipad-landscape|14-challenge-live|light|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|23_ipad_challenge-live.png"
  "ipad-landscape|04-editor|light|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|24_ipad_editor.png"
  "ipad-landscape|09-home|light|A|$DEVICE_HEIGHT_FRACTION_ENDPOINT|25_ipad_home.png"
)

SCENES_DARK=(
  "iphone|01-hero-board|dark|A|$DEVICE_HEIGHT_FRACTION_ENDPOINT|01_iphone_hero-board.png"
  "iphone|02-hell|dark|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|02_iphone_hell.png"
  "iphone|06-rival|dark|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|03_iphone_challenge-accept.png"
  "iphone|14-challenge-live|dark|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|04_iphone_challenge-live.png"
  "combo|-|dark|B|$DEVICE_HEIGHT_FRACTION_COMBO|05_iphone_customization.png|05-customization"
  "iphone|07-replay|dark|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|06_iphone_replay.png"
  "iphone|01-hero-board|light|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|07_iphone_hero-board-light.png|01-hero-board-light"
  "ipad-landscape|01-hero-board|dark|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|21_ipad_hero-board.png"
  "ipad-landscape|02-hell|dark|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|22_ipad_hell.png"
  "ipad-landscape|14-challenge-live|dark|A|$DEVICE_HEIGHT_FRACTION_DEFAULT|23_ipad_challenge-live.png"
  "ipad-landscape|04-editor|dark|B|$DEVICE_HEIGHT_FRACTION_DEFAULT|24_ipad_editor.png"
  "ipad-landscape|09-home|dark|A|$DEVICE_HEIGHT_FRACTION_ENDPOINT|25_ipad_home.png"
)

run_variant() {
  local variant="$1"
  local -a scenes
  set_variant_palette "$variant"
  if [[ "$variant" == "dark" ]]; then
    scenes=("${SCENES_DARK[@]}")
  else
    scenes=("${SCENES_LIGHT[@]}")
  fi

  mkdir -p "$OUT_DIR"
  rm -f "$OUT_DIR"/*.png
  local entry device scene appearance layout height_fraction out_name caption_key
  for entry in "${scenes[@]}"; do
    IFS='|' read -r device scene appearance layout height_fraction out_name caption_key <<<"$entry"
    if [[ "$device" == "combo" ]]; then
      compose_combo "$layout" "$height_fraction" "$out_name" "$caption_key" "$appearance"
    else
      compose_one "$device" "$scene" "$appearance" "$layout" "$height_fraction" "$out_name" "$caption_key"
    fi
  done
}

if [[ "$VARIANT" == "all" ]]; then
  run_variant "light"
  run_variant "dark"
else
  run_variant "$VARIANT"
fi
