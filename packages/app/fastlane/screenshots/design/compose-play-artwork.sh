#!/usr/bin/env bash
set -euo pipefail

fail() {
  echo "error: $*" >&2
  exit 1
}

[[ "$#" -eq 0 ]] || fail 'Usage: bash compose-play-artwork.sh'
for dependency in magick rsvg-convert fc-match; do
  command -v "$dependency" >/dev/null 2>&1 || fail "required command not found: $dependency"
done

DESIGN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$DESIGN_DIR/../../.." && pwd)"
ANDROID_METADATA_DIR="$APP_DIR/fastlane/metadata/android"
FONT_DIR="$APP_DIR/node_modules/@expo-google-fonts/inter"
FONT="$FONT_DIR/900Black/Inter_900Black.ttf"
REGULAR_FONT="$FONT_DIR/400Regular/Inter_400Regular.ttf"
SCREENSHOT="$ANDROID_METADATA_DIR/en-US/images/phoneScreenshots/01_phone_hero-board.png"
ICON="$APP_DIR/assets/icon.png"

for source in "$FONT" "$REGULAR_FONT" "$SCREENSHOT" "$ICON"; do
  [[ -s "$source" && -r "$source" ]] || fail "required artwork source missing or unreadable: $source"
done
[[ "$(magick identify -format '%m %w %h' "$SCREENSHOT")" == 'PNG 1080 1920' ]] || fail 'hero screenshot must be a 1080x1920 PNG'
[[ "$(magick identify -format '%m %w %h' "$ICON")" == 'PNG 1024 1024' ]] || fail 'app icon source must be a 1024x1024 PNG'

shopt -s nullglob
LOCALE_DIRS=("$ANDROID_METADATA_DIR"/*/)
[[ "${#LOCALE_DIRS[@]}" -eq 13 ]] || fail 'expected 13 Android metadata locales'
for locale_dir in "${LOCALE_DIRS[@]}"; do
  [[ -f "$locale_dir/title.txt" && -w "$locale_dir" ]] || fail "Android metadata locale missing title or not writable: $locale_dir"
  if [[ -e "$locale_dir/images" && (! -d "$locale_dir/images" || ! -w "$locale_dir/images") ]]; then
    fail "Android images destination is not a writable directory: $locale_dir/images"
  fi
done

STAGE_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/suuudokuuu-play-artwork.XXXXXX")"
trap 'rm -rf "$STAGE_ROOT"' EXIT
mkdir -p "$STAGE_ROOT/fonts"
cp "$FONT" "$REGULAR_FONT" "$STAGE_ROOT/fonts/"
for family in 'Noto Sans Arabic' 'Noto Nastaliq Urdu' 'Noto Sans Devanagari' 'Noto Sans Bengali' 'Noto Sans CJK SC'; do
  for weight in 80 210; do
    [[ "$(fc-match -f '%{family[0]}' "$family:weight=$weight")" == "$family" ]] || fail "required script font unavailable: $family"
    cp "$(fc-match -f '%{file}' "$family:weight=$weight")" "$STAGE_ROOT/fonts/"
  done
done
cat > "$STAGE_ROOT/fonts.conf" <<EOF
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig><dir>$STAGE_ROOT/fonts</dir><cachedir>$STAGE_ROOT/font-cache</cachedir></fontconfig>
EOF
export FONTCONFIG_FILE="$STAGE_ROOT/fonts.conf"

magick "$SCREENSHOT" -crop 648x648+213+624 +repage -resize 300x300 "$STAGE_ROOT/board.png"
magick "$SCREENSHOT" -crop 630x200+225+1520 +repage -resize 300x "$STAGE_ROOT/numpad.png"
magick -background none -fill '#FFFFFF' -font "$FONT" -pointsize 22 label:suuudokuuu -trim +repage "$STAGE_ROOT/brand.png"
magick "$ICON" -resize 512x512 -colorspace sRGB -alpha on -depth 8 -strip -define png:color-type=6 "$STAGE_ROOT/icon.png"
[[ "$(magick identify -format '%m %w %h %z %[png:IHDR.color_type]' "$STAGE_ROOT/icon.png")" == 'PNG 512 512 8 6 (RGBA)' ]] || fail 'Play icon must be a 512x512 8-bit RGBA PNG'
[[ "$(wc -c < "$STAGE_ROOT/icon.png")" -le 1048576 ]] || fail 'Play icon exceeds 1 MiB'

render_text() {
  local text="$1"
  local pointsize="$2"
  local weight="$3"
  local color="$4"
  local output="$5"
  text="${text//&/\&amp;}"
  text="${text//</\&lt;}"
  text="${text//>/\&gt;}"
  cat > "$STAGE_ROOT/text.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="400">
<text x="2000" y="200" text-anchor="middle" direction="$DIRECTION" font-family="$FAMILY" font-weight="$weight" font-size="$pointsize" fill="$color" xml:space="preserve">$text</text>
</svg>
EOF
  rsvg-convert -o "$STAGE_ROOT/text.png" "$STAGE_ROOT/text.svg"
  magick "$STAGE_ROOT/text.png" -trim +repage -depth 8 -define png:color-type=6 "$output"
}

render_locale() {
  local locale_dir="$1"
  local locale
  local design_locale
  local line
  local headline_first=''
  local headline_second=''
  local values=''
  local entries=0
  local pointsize=58
  local values_pointsize=22
  local second_position=220
  local first_height
  local second_height
  local expression='^"([a-z-]+)" = "([^"\\]+)";$'
  locale="$(basename "$locale_dir")"
  design_locale="$locale"
  case "$locale" in
    ar) design_locale='ar-SA' ;;
    hi-IN) design_locale='hi' ;;
    sv-SE) design_locale='sv' ;;
    zh-CN) design_locale='zh-Hans' ;;
  esac
  [[ -s "$DESIGN_DIR/$design_locale/feature.strings" ]] || fail "localized feature copy missing: $design_locale"
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" ]] && continue
    [[ "$line" =~ $expression ]] || fail "invalid feature.strings entry for $design_locale"
    case "${BASH_REMATCH[1]}" in
      headline-first) [[ -z "$headline_first" ]] || fail "duplicate headline-first for $design_locale"; headline_first="${BASH_REMATCH[2]}" ;;
      headline-second) [[ -z "$headline_second" ]] || fail "duplicate headline-second for $design_locale"; headline_second="${BASH_REMATCH[2]}" ;;
      values) [[ -z "$values" ]] || fail "duplicate values for $design_locale"; values="${BASH_REMATCH[2]}" ;;
      *) fail "unknown feature.strings key for $design_locale" ;;
    esac
    entries=$((entries + 1))
  done < "$DESIGN_DIR/$design_locale/feature.strings"
  [[ "$entries" -eq 3 && -n "$headline_first" && -n "$headline_second" && -n "$values" ]] || fail "feature.strings requires all three keys: $design_locale"
  FAMILY='Inter'
  DIRECTION='ltr'
  case "$locale" in
    ar) FAMILY='Noto Sans Arabic'; DIRECTION='rtl' ;;
    ur) FAMILY='Noto Nastaliq Urdu'; DIRECTION='rtl' ;;
    hi-IN) FAMILY='Noto Sans Devanagari' ;;
    bn-BD) FAMILY='Noto Sans Bengali' ;;
    zh-CN) FAMILY='Noto Sans CJK SC' ;;
  esac
  while true; do
    render_text "$headline_first" "$pointsize" 900 '#FFFFFF' "$STAGE_ROOT/first.png"
    render_text "$headline_second" "$pointsize" 900 '#FFFFFF' "$STAGE_ROOT/second.png"
    first_height="$(magick identify -format '%h' "$STAGE_ROOT/first.png")"
    second_height="$(magick identify -format '%h' "$STAGE_ROOT/second.png")"
    second_position=$((145 + first_height + 16))
    [[ "$second_position" -ge 220 ]] || second_position=220
    if [[ "$(magick identify -format '%w' "$STAGE_ROOT/first.png")" -le 480 && "$(magick identify -format '%w' "$STAGE_ROOT/second.png")" -le 480 && "$((second_position + second_height))" -le 315 ]]; then
      break
    fi
    pointsize=$((pointsize - 1))
    [[ "$pointsize" -ge 36 ]] || fail "headline cannot fit without becoming too small: $design_locale"
  done
  while true; do
    render_text "$values" "$values_pointsize" 400 '#A0A0A0' "$STAGE_ROOT/values.png"
    [[ "$(magick identify -format '%w' "$STAGE_ROOT/values.png")" -le 480 ]] && break
    values_pointsize=$((values_pointsize - 1))
    [[ "$values_pointsize" -ge 18 ]] || fail "values cannot fit without wrapping: $design_locale"
  done
  mkdir -p "$STAGE_ROOT/$locale"
  magick -size 1024x500 xc:'#010101' "$STAGE_ROOT/brand.png" -geometry +64+65 -composite \
    "$STAGE_ROOT/first.png" -geometry +64+145 -composite \
    "$STAGE_ROOT/second.png" -geometry "+64+$second_position" -composite \
    "$STAGE_ROOT/values.png" -geometry +64+340 -composite \
    "$STAGE_ROOT/board.png" -geometry +630+52 -composite \
    "$STAGE_ROOT/numpad.png" -geometry +630+355 -composite \
    -alpha off -colorspace sRGB -depth 8 -strip -define png:color-type=2 "$STAGE_ROOT/$locale/featureGraphic.png"
  [[ "$(magick identify -format '%m %w %h %z %[png:IHDR.color_type]' "$STAGE_ROOT/$locale/featureGraphic.png")" == 'PNG 1024 500 8 2 (Truecolor)' ]] || fail "invalid rendered feature graphic: $locale"
}

for locale_dir in "${LOCALE_DIRS[@]}"; do
  render_locale "$locale_dir"
done
for locale_dir in "${LOCALE_DIRS[@]}"; do
  mkdir -p "$locale_dir/images"
  cp "$STAGE_ROOT/$(basename "$locale_dir")/featureGraphic.png" "$STAGE_ROOT/icon.png" "$locale_dir/images/"
done

echo "Rendered and installed localized feature graphic and icon for ${#LOCALE_DIRS[@]} Play locales."
