# App Store screenshot design

Caption copy for the iOS App Store screenshot set, plus a
[frameit](https://docs.fastlane.tools/actions/frameit/) configuration kept for
reference. This directory only holds design assets (`Framefile.json`,
per-locale `title.strings`, and the shared background). It does not contain
raw device captures, store metadata, or Fastlane lanes — see `../raw/` for
captures and `../../metadata/` for listing copy.

**The committed `en-US` set is actually produced by
`compose-screenshots.sh` (ImageMagick), not by running `fastlane frameit`
below.** `Framefile.json` targets a fixed 1320x2868 canvas (the iPhone 6.9"
slot), but the current raw captures are native-resolution iPhone 17
(1206x2622) and iPad Pro 13" landscape (2752x2064) shots, and `deliver`
assigns screenshots to store slots by exact pixel dimensions — see
`../README.md`'s "Framing" section for the full reasoning and the reproducible
command. The `frameit` instructions below remain accurate if a future capture
run targets the 6.9" canvas directly. The device *frame graphics* the script
composites with, however, are the real frameit-downloaded frame PNGs, not a
drawn shape — see "Frame source" below.

## Layout

```text
fastlane/screenshots/
├── raw/ios/<locale>/<appearance>/NN-scene.png   # captured device screenshots
└── design/
    ├── Framefile.json                            # frameit layout config (reference only, see "Brand")
    ├── background.png                            # shared #F5F5F5 backdrop (generate once, see below)
    ├── <locale>/title.strings                     # per-locale headlines, keyed by scene filename
    └── <locale>/subtitle.strings                  # per-locale descriptors, same keys as title.strings
```

Scenes, in gallery order: `01-hero-board`, `02-hell`, `06-rival`,
`14-challenge-live`, the two-device customization combo (`04-editor` +
`03-themes`, Ukrainian), `07-replay`, `01-hero-board` (dark). The iPad set
additionally uses `09-home`.

Locales: `en-US`, `ar-SA`, `de-DE`, `es-ES`, `fr-FR`, `hi`, `id`, `pt-BR`,
`sv`, `uk`, `zh-Hans` — matching `../../metadata/ios`.

## Brand

- Background: two mirrored palettes, one per variant. Light: `#F5F5F5`
  canvas with near-black `#0A0A0A` text. Dark (the deployed default):
  `#141414`-to-`#0E0E0E` canvas with near-white `#F5F5F5` text. Black
  device bezel in both. `set_variant_palette` in `compose-screenshots.sh`
  owns the mapping.
- Type: Inter, Black (900) weight, loaded straight from
  `@expo-google-fonts/inter` (the same family the app ships via
  `Inter_900Black.ttf` — see `packages/app/app.json`'s `expo-font` plugin
  config). `Framefile.json` points `title.font` at
  `node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf`,
  resolved relative to `Framefile.json`'s own directory (frameit's
  `config_parser.rb` resolves relative paths against the config file's
  location, not the working directory).
- Accent: none. An earlier version of this design rendered a fixed
  Ukraine-flag-colored underline mark below every headline; it was removed
  by design decision (it read as a decorative afterthought, not a premium
  brand signal) — see "Design system" below. Every headline renders in the
  same near-black `#0A0A0A`; typography hierarchy alone carries the brand
  now. `Framefile.json` (the reference-only frameit config, not what
  actually produces the committed set — see "The committed `en-US` set..."
  above) still uses the older single-caption, per-scene-color-override
  design; it has not been updated to match, since it is not exercised by any
  current pipeline.

## Design system

`compose-screenshots.sh` composes each screenshot from a researched,
ASO-oriented spec, not just "frame it and slap a caption on top." The rules
below are the deliberate design decisions baked into the script — change the
constants at the top of `compose-screenshots.sh` to retune them, but keep the
rules themselves unless the underlying research changes.

1. **Two-tier text.** Every scene gets a headline (`design/<locale>/title.strings`,
   2-4 words, Inter Black, auto-sized to 9-11% of canvas width and shrunk in
   4px steps — floor 60% of the starting size — until it fits inside the 90%
   text safe zone) plus a descriptor (`design/<locale>/subtitle.strings`,
   4-8 words, same font at 50-60% of the headline's final point size,
   rendered at 75% opacity). The descriptor is the single biggest upgrade
   over the old one-caption design: it lets the headline stay a short,
   punchy hook while the descriptor carries the supporting detail.
2. **Text safe zone.** All text is ≤90% of canvas width, centered, so both
   side margins are always ≥5%.
3. **Device sized by height, not width.** The framed device (bezel
   included) is sized to 74-78% of canvas *height*, horizontally centered.
   Sizing off height instead of width is what keeps the device
   consistently proportioned across the very different iPhone (portrait) and
   iPad (landscape) canvas aspect ratios. The raw capture always fills the
   frame's real transparent screen cutout exactly — nothing is cropped, and
   output dimensions always match the source capture exactly (1206x2622 /
   2752x2064).
4. **Soft drop shadow.** A blurred, ~15%-opacity black silhouette of the
   framed device, offset down, composited between the background and the
   device. Built by recoloring a clone of the device layer to solid black
   while keeping its real alpha shape (`-fill black -colorize 100%`), then
   scaling its opacity, blurring only the alpha channel, and translating it
   down — this is what makes the flat background read as intentional depth
   instead of a flat product photo pasted onto paper.
5. **Two alternating layouts.** Layout `A` is text-top / device-bottom;
   layout `B` flips it: device-top / text-bottom. The
   `SCENES_LIGHT`/`SCENES_DARK` arrays alternate `A`/`B` by position across
   the whole gallery (iPhone then iPad) so a full scroll through the store listing doesn't look like the
   same template repeated — with one deliberate exception: two shots that
   are a connected pair (the challenge accept/live shots) share the same
   layout on purpose, so the pair reads as one two-part scene rather than
   two unrelated shots that happen to be adjacent.
6. **Tight text-to-device gap.** The device is positioned directly relative
   to the caption stack's own rendered height plus one small fixed gap
   (`TEXT_DEVICE_GAP_FRACTION`, ~1.6% of canvas height) — not independently
   anchored to the opposite canvas edge, which used to leave a large,
   headline-length-dependent gap between the two blocks. `position_layout`
   in `compose-screenshots.sh` computes both the device's and the text's
   absolute position from this rule for both layout variants, so the
   composition reads as one cohesive unit instead of a caption-island
   floating apart from a device-island. No accent bar sits between the
   headline and descriptor: an earlier version of this design rendered a
   fixed Ukraine-flag-colored underline mark there as a brand signal, but it
   read as a decorative afterthought rather than a premium one and was
   removed — every headline renders in the variant's text color, and
   typography hierarchy alone carries the brand now.
7. **Flat background, barely-there depth.** The canvas stays flat in
   spirit — no gradient brand treatment, because a visible gradient would
   fight this app's minimalist black/white/red identity — but it's actually
   painted as an almost imperceptible vertical tone shift (light:
   `#F7F7F7` top to `#F1F1F1` bottom; dark: `#141414` top to `#0E0E0E`
   bottom) so it doesn't read as a dead flat swatch next to the device's
   drop shadow.
8. **Endpoint emphasis.** The first and last shots in the whole gallery use
   the top of the device height range (0.78); every shot in between uses the
   bottom of the range (0.74) — a small, deliberate difference, not visible
   as an inconsistency, that gives the opening and closing shots slightly
   more presence.
9. **Two-device combo scene.** One scene (`compose_combo` in
   `compose-screenshots.sh`) departs from the one-device template: it
   frames two raw captures — the colorful theme editor and the Ukrainian
   theme list — as separate framed iPhone 17s, each scaled to 50% of canvas
   height instead of the usual 74-78%, positioned edge to edge with just
   enough overlap (derived from the available canvas width, not a fixed
   constant) to fit. The second device composites on top, so its own
   content is always fully legible; only the first device's trailing edge
   is partly covered. This tells a "full customization" story — per-cell
   theming and language breadth — in a single shot instead of two.

Landscape-canvas note: rule 1's "9-11% of canvas width" is calibrated
against a portrait canvas. Applied literally to the iPad's landscape canvas
(2752 wide but only 2064 tall) it would sizes a headline far too tall for the
shallow vertical band left around the device. `fit_headline_pointsize`
instead sizes off an "effective width" — the real canvas width for portrait
canvases, or the canvas height rescaled to the iPhone's own aspect ratio for
landscape ones — so the iPad headline ends up visually calibrated to exactly
the same proportion as the iPhone's, just expressed against its own shorter
vertical budget.

Descriptor copy in `subtitle.strings` is written short enough to stay on one
line at each device's actual descriptor point size (verified against the
iPhone's ~1085px text safe-zone width, the tighter of the two canvases) —
the layout tolerates a two-line descriptor without overlapping the device
(there's generous vertical slack in every scene), but a one-line descriptor
reads cleaner.

## Frame source

`compose-screenshots.sh` frames screenshots with real device frame PNGs, not
a drawn rounded rectangle. The frames come from
[frameit-frames](https://github.com/fastlane/frameit-frames) — the same
Apple Design Resources / facebook/design-derived asset set `fastlane
frameit` itself downloads — fetched once with:

```bash
fastlane frameit download_frames
```

This caches ~280 device frame PNGs plus an `offsets.json` (cutout rectangle
per device, in the format `{"offset": "+x+y", "width": w}`) at
`~/.fastlane/frameit/latest`. The script does not run frameit's own
compositing pipeline (frameit's `editor.rb#put_into_frame` sizes its output
canvas to the *frame*, not the screenshot, which would break the exact-source-
resolution requirement in `../README.md`'s "Framing" section). Instead it
reads the frame PNG and offset data directly and composites the raw capture
into the frame's own transparent screen cutout at native frame resolution,
before scaling the whole framed unit down onto the `#F5F5F5` canvas.

Frame files in use:

- **iPhone** — `Apple iPhone 17 Black.png`. `offsets.json` gives this frame's
  cutout as `+72+69`, width `1206` — an exact pixel match for our iPhone 17
  capture resolution (1206x2622), so the capture fills the cutout with no
  resize. Verified directly against the PNG's alpha channel: the transparent
  cutout's bounding box (found with a flood fill from the image border, so it
  excludes the frame's own outer transparent margin) is exactly
  `(72, 69)`–`(1278, 2691)`, i.e. 1206x2622.
- **iPad** — `Apple iPad Pro (12.9-inch) (4th generation) Space Gray.png`.
  frameit-frames does not yet ship a frame for the 13" M4 iPad Pro (the
  device the capture simulator models); the generic `Apple iPad Pro
  *.png` frames in the same download are an *older*, Touch ID /
  home-button iPad Pro model (visibly wrong industrial design for a current
  iPad Pro screenshot), while the "(12.9-inch) (4th generation)" frame is the
  edge-to-edge Face ID design with no home button — the closest available
  match to the 13" M4's silhouette, just an older/smaller panel generation.
  Its measured portrait cutout is `(96, 102)`–`(2144, 2834)`, i.e.
  2048x2732, at offset `+96+102` (matches `offsets.json`'s "iPad Pro (12.9
  inch) (4th generation)" entry). The script rotates this frame 90° at
  runtime to match the landscape iPad captures, which rotates the cutout to
  2732x2048 at `+96+96` in the rotated canvas (verified by re-running the
  same flood fill against the rotated PNG, not computed by hand). The
  capture (2752x2064) is resized ~0.7% to exactly fill that cutout — the
  aspect ratio is already a 0.05% match, so nothing is visibly stretched or
  cropped.

Both cutout rectangles were measured with a Python/Pillow flood fill of the
frame PNG's alpha channel (transparent pixels reachable from the image
border are the frame's own outer margin; the enclosed transparent region is
the screen cutout) and cross-checked against `offsets.json`'s reference
values before being hardcoded as constants in `compose-screenshots.sh`. If
`fastlane frameit download_frames` ever ships a native 13" iPad Pro frame,
swap `IPAD_FRAME_PORTRAIT` to it and re-measure the cutout with the same
method — do not assume the new frame's offsets fall at the same pixel
coordinates.

## One-time setup: background.png

frameit's `background` key must point at a real image file — it does not
accept a bare hex value (`frameit/lib/frameit/editor.rb#generate_background`
opens the path with MiniMagick and crops/resizes it to fit each screenshot,
so a single oversized portrait background covers every target canvas).
Generate it once with ImageMagick (already a frameit dependency) sized to the
largest target canvas, 1320x2868:

```bash
convert -size 1320x2868 xc:'#F5F5F5' packages/app/fastlane/screenshots/design/background.png
```

Regenerate it only if the brand backdrop color changes.

## Running frameit

frameit expects one directory whose immediate children are locale folders,
each holding both the screenshots to frame and that locale's `title.strings`.
Raw captures live under `raw/ios/<locale>/<appearance>/`, split by
light/dark appearance; `design/<locale>/` only holds captions. Stage the two
together per appearance before invoking frameit, once per appearance, from
`packages/app`:

```bash
cd packages/app

for appearance in light dark; do
  stage="fastlane/screenshots/.stage/$appearance"
  rm -rf "$stage"
  mkdir -p "$stage"
  cp fastlane/screenshots/design/Framefile.json "$stage/"
  cp fastlane/screenshots/design/background.png "$stage/"

  for locale_dir in fastlane/screenshots/raw/ios/*/; do
    locale="$(basename "$locale_dir")"
    mkdir -p "$stage/$locale"
    cp "$locale_dir/$appearance"/*.png "$stage/$locale/"
    cp "fastlane/screenshots/design/$locale/title.strings" "$stage/$locale/"
  done

  fastlane frameit --path "$stage"
done
```

Framed output is written next to each source screenshot inside
`fastlane/screenshots/.stage/<appearance>/<locale>/`. Copy the frames you
want to publish into your App Store Connect screenshot upload set (or a
`metadata/ios/<locale>/`-style screenshots folder if you wire `deliver` up to
upload them later — this directory intentionally does not touch `Fastfile` or
`deliver`'s config). `.stage/` is scratch output; delete it between runs.

Raw captures must already be at the exact native pixel resolution of the
target device (frameit identifies the device by matching the screenshot's
pixel dimensions against its offsets database) — capture on the simulator or
device that produces the final asset size below, not a scaled-down proxy.

## Curated store ordering

Apple shows roughly the first 3 screenshots before a user scrolls, so lead
with the strongest, clearest shots and vary composition after that:

1. `01-hero-board` — light appearance. The board itself, the cleanest single
   frame, is the whole pitch in one screenshot.
2. `02-hell` — light appearance. Differentiator: a real 17-clue Hell puzzle,
   not a marketing difficulty label.
3. `03-themes` — light appearance. The most-loved customization surface,
   still in the "safe" first-3 zone.
4. `04-editor` — dark appearance. First dark-mode shot in the set; place it
   right after the light-mode run so the gallery reads as one coherent scroll
   rather than alternating every frame.
5. `05-win` — light appearance. Payoff/outcome shot.
6. `06-rival` — light appearance. Social/competitive hook.
7. `07-replay` — light appearance. Depth feature for engaged users.
8. `08-settings` — light appearance. Localization breadth, lowest priority,
   last.

Keep dark appearance to one clearly-placed shot (position 4) rather than
alternating light/dark throughout — a single dark frame signals theming
support without fragmenting the visual rhythm of the gallery.

## Final asset specs

**iOS App Store** (this directory's frameit output target):
- 6.9" (iPhone 17 Pro Max / 16 Pro Max class): **1320 × 2868 px**, portrait,
  PNG or JPEG, no alpha.
- Up to 10 screenshots per localization; only the first 3 are guaranteed
  visible without scrolling.

**Google Play** (framed separately — this Framefile targets iOS only; Play
listings are typically full-bleed UI without a device bezel):
- Phone screenshots: **1080 × 1920 px** (9:16), PNG or JPEG, 24-bit, no
  alpha, min 320 px / max 3840 px on any side.
- Feature graphic: **1024 × 500 px**, required for featuring, no device
  frame or caption text baked in — Play overlays its own UI on top of it.

**App Preview video** (both stores, captured separately from these static
screenshots):
- **886 × 1920 px**, portrait, H.264, **15–30 seconds**.
- Stereo audio track is required even if the app itself is silent — export
  silent stereo rather than omitting the audio track, since a video with no
  audio track at all is rejected by App Store Connect.
- Structure: hook/outcome in the first 3s, 2-3 feature beats, end on the app
  icon.
