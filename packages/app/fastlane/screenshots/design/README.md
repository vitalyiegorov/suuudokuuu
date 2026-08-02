# App Store screenshot design

Caption copy and [frameit](https://docs.fastlane.tools/actions/frameit/)
configuration for the iOS App Store screenshot set. This directory only holds
design assets (`Framefile.json`, per-locale `title.strings`, and the shared
background). It does not contain raw device captures, store metadata, or
Fastlane lanes — see `../raw/` for captures and `../../metadata/` for listing
copy.

## Layout

```text
fastlane/screenshots/
├── raw/ios/<locale>/<appearance>/NN-scene.png   # captured device screenshots
└── design/
    ├── Framefile.json                            # frameit layout config
    ├── background.png                            # shared #F5F5F5 backdrop (generate once, see below)
    └── <locale>/title.strings                     # per-locale captions, keyed by scene filename
```

Scenes, in gallery order: `01-hero-board`, `02-hell`, `03-themes`,
`04-editor`, `05-win`, `06-rival`, `07-replay`, `08-settings`.

Locales: `en-US`, `ar-SA`, `de-DE`, `es-ES`, `fr-FR`, `hi`, `id`, `pt-BR`,
`sv`, `uk`, `zh-Hans` — matching `../../metadata/ios`.

## Brand

- Background: solid `#F5F5F5`, title text above the device frame, black
  `BLACK` device bezel.
- Type: Inter, Black (900) weight, loaded straight from
  `@expo-google-fonts/inter` (the same family the app ships via
  `Inter_900Black.ttf` — see `packages/app/app.json`'s `expo-font` plugin
  config). `Framefile.json` points `title.font` at
  `node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf`,
  resolved relative to `Framefile.json`'s own directory (frameit's
  `config_parser.rb` resolves relative paths against the config file's
  location, not the working directory).
- Accent: Ukrainian flag colors, used sparingly. `Framefile.json` applies it
  in exactly one place — the `02-hell` caption is set in flag blue
  (`#0057B7`) via a `data` override, deep-merged on top of the shared black
  `default.title` style. Every other caption stays near-black (`#0A0A0A`) on
  the light backdrop. Do not add further per-scene color overrides without a
  reason; the accent reads as a deliberate flourish only because it appears
  once.

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
