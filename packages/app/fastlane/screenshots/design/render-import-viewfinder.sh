#!/usr/bin/env bash
set -euo pipefail

design_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fixture="$design_dir/../../../../../e2e/support/suuudokuuu/import-photo.jpg"

magick "$design_dir/import-viewfinder-paper.jpg" -resize '1320x2868^' -gravity Center -extent 1320x2868 \
  \( "$fixture" -level '8%,72%' \
    \( +clone -fill black -colorize 100 -fill white -draw 'polygon 100,60 465,36 503,419 162,459' \) \
    -alpha off -compose CopyOpacity -composite -virtual-pixel transparent \
    -define distort:viewport=1320x2868+0+0 \
    -distort Perspective '100,60 134,775 465,36 1142,700 503,419 1190,1675 162,459 219,1818' \) \
  -compose Multiply -composite \
  -fill 'rgba(235,175,55,0.12)' -stroke '#F8C653' -strokewidth 5 \
  -draw 'polygon 126,767 1150,692 1198,1682 212,1827' \
  -fill none -strokewidth 18 \
  -draw "path 'M132,840 L126,767 L207,761 M1070,698 L1150,692 L1154,770 M1194,1602 L1198,1682 L1119,1694 M291,1816 L212,1827 L205,1748'" \
  -fill 'rgba(9,9,9,0.88)' -stroke none -draw 'rectangle 0,2430 1320,2868' \
  -fill 'rgba(9,9,9,0.46)' -draw 'circle 142,208 196,208' \
  -stroke white -strokewidth 7 -draw 'line 125,191 159,225 line 125,225 159,191' \
  -fill none -strokewidth 9 -draw 'circle 660,2614 755,2614' \
  -fill white -stroke none -draw 'circle 660,2614 738,2614' \
  -alpha off -strip -define png:color-type=2 -depth 8 "$design_dir/import-viewfinder.png"
