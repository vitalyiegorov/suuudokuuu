#!/usr/bin/env bash
set -euo pipefail

design_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fixture="$design_dir/../../../../../e2e/support/suuudokuuu/import-photo.jpg"

magick "$design_dir/import-viewfinder-paper.jpg" -resize '1320x2868^' -gravity Center -extent 1320x2868 \
  -gravity NorthWest -crop 1320x2568+0+300 +repage -background '#111111' -extent 1320x2868 \
  \( "$fixture" -level '8%,72%' \
    \( +clone -fill black -colorize 100 -fill white -draw 'polygon 100,60 465,36 503,419 162,459' \) \
    -alpha off -compose CopyOpacity -composite -virtual-pixel transparent \
    -define distort:viewport=1320x2868+0+0 \
    -distort Perspective '100,60 181,270 465,36 1099,210 503,419 1142,1010 162,459 259,1130' \) \
  -compose Multiply -composite \
  -fill 'rgba(235,175,55,0.12)' -stroke '#F8C653' -strokewidth 5 \
  -draw 'polygon 173,262 1107,202 1150,1017 252,1139' \
  -fill none -strokewidth 18 \
  -draw "path 'M180,332 L173,262 L247,257 M1033,207 L1107,202 L1111,273 M1146,946 L1150,1017 L1079,1027 M323,1129 L252,1139 L246,1068'" \
  -fill 'rgba(9,9,9,0.88)' -stroke none -draw 'rectangle 0,2430 1320,2868' \
  -fill 'rgba(9,9,9,0.46)' -draw 'circle 142,208 196,208' \
  -stroke white -strokewidth 7 -draw 'line 125,191 159,225 line 125,225 159,191' \
  -fill none -strokewidth 9 -draw 'circle 405,2614 500,2614' \
  -fill white -stroke none -draw 'circle 405,2614 483,2614' \
  -alpha off -strip -define png:color-type=2 -depth 8 "$design_dir/import-viewfinder.png"
