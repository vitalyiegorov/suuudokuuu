#!/usr/bin/env bash
set -euo pipefail

if [[ "$#" -ne 0 ]]; then
  echo "Usage: bash compose-play-artwork.sh" >&2
  exit 1
fi

for dependency in magick rsvg-convert; do
  if ! command -v "$dependency" >/dev/null 2>&1; then
    echo "error: required command not found: $dependency" >&2
    exit 1
  fi
done

DESIGN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$DESIGN_DIR/../../.." && pwd)"
ANDROID_METADATA_DIR="$APP_DIR/fastlane/metadata/android"
FONT="$APP_DIR/node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf"
BOARD="$DESIGN_DIR/feature-graphic.svg"
ICON="$APP_DIR/assets/icon.png"

for source in "$FONT" "$BOARD" "$ICON"; do
  if [[ ! -s "$source" || ! -r "$source" ]]; then
    echo "error: required artwork source missing or unreadable: $source" >&2
    exit 1
  fi
done

if [[ "$(magick identify -format '%m %w %h' "$ICON")" != 'PNG 1024 1024' ]]; then
  echo "error: app icon source must be a 1024x1024 PNG" >&2
  exit 1
fi

shopt -s nullglob
LOCALE_DIRS=("$ANDROID_METADATA_DIR"/*/)
if [[ "${#LOCALE_DIRS[@]}" -eq 0 ]]; then
  echo "error: Android metadata locales are missing" >&2
  exit 1
fi

for locale_dir in "${LOCALE_DIRS[@]}"; do
  if [[ ! -f "$locale_dir/title.txt" || ! -w "$locale_dir" ]]; then
    echo "error: Android metadata locale missing title or not writable: $locale_dir" >&2
    exit 1
  fi
  if [[ -e "$locale_dir/images" && (! -d "$locale_dir/images" || ! -w "$locale_dir/images") ]]; then
    echo "error: Android images destination is not a writable directory: $locale_dir/images" >&2
    exit 1
  fi
done

STAGE_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/suuudokuuu-play-artwork.XXXXXX")"
trap 'rm -rf "$STAGE_ROOT"' EXIT

rsvg-convert --width 1024 --height 500 --output "$STAGE_ROOT/board.png" "$BOARD"
magick -background none -fill '#FFF9F2' -font "$FONT" -pointsize 120 \
  label:suuu -trim +repage "$STAGE_ROOT/wordmark-first.png"
magick -background none -fill '#FFF9F2' -font "$FONT" -pointsize 120 \
  label:dokuuu -trim +repage "$STAGE_ROOT/wordmark-second.png"
magick "$STAGE_ROOT/board.png" "$STAGE_ROOT/wordmark-first.png" \
  -geometry +72+135 -composite "$STAGE_ROOT/wordmark-second.png" \
  -geometry +72+230 -composite -background '#E52431' -alpha remove -alpha off \
  -colorspace sRGB -depth 8 -strip -define png:color-type=2 "$STAGE_ROOT/featureGraphic.png"
magick "$ICON" -resize 512x512 -colorspace sRGB -alpha on -depth 8 -strip \
  -define png:color-type=6 "$STAGE_ROOT/icon.png"

if [[ "$(magick identify -format '%m %w %h %z %[png:IHDR.color_type]' "$STAGE_ROOT/featureGraphic.png")" != 'PNG 1024 500 8 2 (Truecolor)' ]]; then
  echo "error: feature graphic must be a 1024x500 8-bit RGB PNG" >&2
  exit 1
fi
if [[ "$(magick identify -format '%m %w %h %z %[png:IHDR.color_type]' "$STAGE_ROOT/icon.png")" != 'PNG 512 512 8 6 (RGBA)' ]]; then
  echo "error: Play icon must be a 512x512 8-bit RGBA PNG" >&2
  exit 1
fi
if [[ "$(wc -c < "$STAGE_ROOT/icon.png")" -gt 1048576 ]]; then
  echo "error: Play icon exceeds 1 MiB" >&2
  exit 1
fi

for locale_dir in "${LOCALE_DIRS[@]}"; do
  mkdir -p "$locale_dir/images"
  cp "$STAGE_ROOT/featureGraphic.png" "$STAGE_ROOT/icon.png" "$locale_dir/images/"
done

echo "Rendered and installed feature graphic and icon for ${#LOCALE_DIRS[@]} Play locales."
