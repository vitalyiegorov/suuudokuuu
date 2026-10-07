# Store artwork design

This directory holds the caption strings, the screenshot composer, and the
Play feature-artwork generator. Final store files are committed beside the
Fastlane metadata and reviewed like other product assets. Raw simulator and
emulator captures are temporary inputs under `screenshots/raw/` and are
gitignored.

## Current screenshot sets

The iOS manifests in `compose-screenshots.sh` produce the same story in both
appearance variants. Each of the 11 Apple locales has 9 iPhone screenshots at
1320×2868 and 6 landscape iPad screenshots at 2752×2064. Output is staged and
replaces a committed set only after every scene for that variant succeeds.
The `all` command also composes the Play sets: 8 phone screenshots at
1080×1920 for each of 13 Google Play locales. There is currently no tablet
screenshot set.

The iPhone order is:

1. `01-hero-board` — airy Nightmare board with pencil marks.
2. `02-hell` — a real forcing-chain puzzle.
3. `06-rival` — challenge acceptance and the competitive premise.
4. `14-challenge-live` — the matching mid-race story beat.
5. `05-customization` — the two-phone theme editor and Ukrainian theme list.
6. `07-replay` — move-by-move replay.
7. `10-stats` — progress and technique statistics.
8. `08_iphone_infinity.png` — the bundled extreme-difficulty Infinity tier.
9. `01-hero-board` — the same board in the opposite appearance.

The iPad set contains `01-hero-board`, `02-hell`, `14-challenge-live`,
`04-editor`, `25_ipad_infinity.png`, and `26_ipad_home.png`. It omits the
two-phone combo and uses the solo editor. The Android set follows the iPhone story through the
first four scenes, uses the solo editor in the customization slot, then replay
and stats, and closes with the hero board in light appearance. The exact
manifests, filenames, appearance choices, and layouts are authoritative in
`compose-screenshots.sh`.

The two iOS variants mirror each other scene for scene. Only the closing
iPhone shot switches appearance, so selecting the deployed variant is a brand
choice rather than a different gallery. `deployed-variant.json` currently
selects dark for iOS; `SCREENSHOT_VARIANT=light|dark` overrides it for a
one-off upload. Google Play uses one dark-first set with a light-mode closer.

## Visual system

- Near-flat canvas with a very subtle vertical tone shift: light `#F7F7F7` to
  `#F1F1F1`, dark `#141414` to `#0E0E0E`. The composer renders this as a
  gradient; the restrained shift keeps the canvas quiet beside the device
  shadow.
- Two-tier centered captions: Inter Black headline and smaller descriptor,
  sized to fit within 90% of the canvas width. Text is near-black on light and
  near-white on dark, with no accent bar.
- Real frameit device-frame PNGs provide the bezels and screen cutouts. The
  capture fills the cutout; the composed output retains the capture's exact
  dimensions so App Store Connect assigns it to the intended device slot.
- Soft device shadow and alternating text-top/device-bottom layouts provide
  depth and scroll rhythm. The challenge acceptance/live pair intentionally
  shares one layout.
- The customization image pairs the colorful editor with the Ukrainian theme
  list. The hero stays airy and early in the story; there is no win/confetti
  image.

Captions live in `design/<locale>/title.strings` and
`design/<locale>/subtitle.strings`, keyed by scene. The composer uses the
package-local font at
`packages/app/node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf`.
The Sudoku numerals are committed SVG outlines from bundled Inter Medium;
the renderer adds the wordmark using bundled Inter Black, so rendering needs
no system fonts.
`Framefile.json` and `background.png` remain historical frameit references;
the current output is made by `compose-screenshots.sh`.

## Regeneration

From the repository root, after installing dependencies and downloading the
frameit assets once:

```bash
fastlane frameit download_frames
bash packages/app/fastlane/screenshots/design/compose-screenshots.sh en-US all
```

The first command caches frame images under `~/.fastlane/frameit/latest`.
`compose-screenshots.sh <locale> [light|dark|android|all]` defaults to `all`.
Use `android` to compose only that locale's Play set when iOS raw captures are
unavailable. Its `all` mode composes both iOS variants and Android. Capture
instructions, seed setup, device configuration, and visual verification live
in `tests/app-tests/docs/store-screenshot-capture.md`.

The shared Play feature artwork is language-neutral by design: the wordmark
and numeric Sudoku grid carry the brand without translated prose. The Play
icon is a 512px resize of the existing app icon, including its Ukrainian
blue-and-yellow flag. Generate both separately:

```bash
bash packages/app/fastlane/screenshots/design/compose-play-artwork.sh
```

It writes a 1024×500 RGB feature graphic and a 512×512 RGBA app icon under
each of the 13 `metadata/android/<locale>/images/` directories. Review the
output before committing it. Store-art generation is manual; CI uploads only
committed assets when the screenshot checkbox is selected.

## Store requirements and scope

- App Store screenshots: up to 10 per device size and localization. The
  committed iPhone set is 1320×2868; iPad is 2752×2064 landscape. Apple
  requires an iPhone Dynamic Island medium-display screenshot and, for an
  iPad app, a 13-inch iPad screenshot. When the UI is consistent, App Store
  Connect scales screenshots from the highest required resolution down. The
  committed sizes are accepted 6.9-inch iPhone and 13-inch iPad resolutions.
- Google Play phone screenshots: 1080×1920. Feature graphic: 1024×500. The
  composer writes the feature graphic and icon under each Play locale; no
  tablet artwork is currently included.
- App previews are optional store media and are not currently recorded or
  committed. Create them as a separate capture and review task if desired.

Primary references: [Apple screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications),
[Apple app preview specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/app-preview-specifications),
and [Google Play preview asset specifications](https://support.google.com/googleplay/android-developer/answer/9866151).
