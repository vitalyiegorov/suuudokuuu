# Store screenshots

`ios/<locale>/` holds the store-ready screenshots that `fastlane ios_screenshots`
uploads. They are committed to the repo on purpose: store media changes rarely,
so it is versioned and reviewed like any other asset instead of being rebuilt on
every release.

`raw/` is the Maestro capture output and is gitignored — it is the intermediate
input for curation, not a deliverable.

## Current set

English only, framed and captioned from the flows in
`tests/app-tests/flows/screenshots`:

| Prefix | Device | Resolution | App Store slot |
| ------ | ------ | ---------- | -------------- |
| `01`-`07` | iPhone 17 | 1206x2622 | iPhone 6.3" |
| `21`-`25` | iPad Pro 13" landscape | 2752x2064 | iPad 13" |

`deliver` assigns each image to a device slot by its exact pixel resolution, so
iPhone and iPad screenshots share one locale folder and the composed output
must stay at the source capture resolution — see "Framing" below for why that
ruled out `fastlane frameit`. Filenames sort into upload order, and the first
three carry the most weight in both stores.

## Curated store ordering

Apple shows roughly the first 3 screenshots before a user scrolls, so the set
leads with the most emotionally distinctive shots rather than the order the
flows happen to capture them in:

1. `01-hero-board` — the actual gameplay board, airy and uncluttered with
   pencil marks. Leads because it's the clearest single-frame pitch: this is
   what the app looks like, no marketing artifice.
2. `02-hell` — a real 17-clue Hell puzzle. The differentiator: not a
   marketing difficulty label but a visibly brutal board.
3. `06-rival` — "Get challenged.", the accept-challenge screen. First half of
   a two-shot challenge story: the live-race premise plus anticheat, still
   inside the guaranteed-visible first-3 zone.
4. `14-challenge-live` — "Race them live.", mid-race with the rival's live
   position and technique badges. Second half of the challenge story;
   composed with the *same* layout variant as shot 3 (see "Design system" in
   `design/README.md`) so the pair reads as one connected two-part scene
   instead of two unrelated shots that happen to be adjacent.
5. The customization combo — two framed iPhones side by side in one canvas,
   the colorful theme editor (English) and the localized theme list
   (Ukrainian), proving per-cell theming and language breadth in a single
   shot instead of two separate ones.
6. `07-replay` — move-by-move replay, a depth feature for engaged users.
7. `01-hero-board`, **dark appearance** — the closing note. Reuses the same
   airy board as shot 1 to prove the redesign holds up in dark mode too, with
   its own copy so it doesn't read as a repeat of the opener.

The iPad set (`21`-`25`) skips the two-device combo (framing two devices at a
legible size only works on the iPhone's narrower canvas) and reuses five
scenes that already have captions: `01-hero-board`, `02-hell`,
`14-challenge-live`, `04-editor` (the theme editor solo, since the combo
shot doesn't exist on iPad), and `09-home` (the play/difficulty-picker
screen) as the closing shot.

The "Challenge won" confetti shot, the solo theme-picker shot, and the
dark-appearance settings/language shot from the previous set were dropped:
confetti didn't earn its own slot once the challenge pair told a stronger,
two-shot story; the solo theme picker is now folded into the customization
combo (with the Ukrainian list already proving localization, a separate
"speaks your language" shot was redundant); and the closing dark note now
uses the hero board instead, which better showcases the actual redesign this
set exists to show off.

## Framing

Screenshots are composed with ImageMagick
(`design/compose-screenshots.sh`), not `fastlane frameit`'s own `run`/`ios`
commands. `frameit`'s `Framefile.json` in this directory targets a fixed
1320x2868 canvas (the iPhone 6.9" slot), but the raw captures are
native-resolution shots from an iPhone 17 simulator (1206x2622, the 6.3"
slot) and an iPad Pro 13" landscape simulator (2752x2064). `deliver` assigns
uploaded screenshots to App Store Connect device slots by matching exact
pixel dimensions, so the committed output must stay at the source resolution
rather than being letterboxed or padded into frameit's canvas — ruling out
frameit's own fixed-canvas pipeline for this capture set. `Framefile.json` is
kept for reference and for any future capture run that targets the 6.9" slot
directly.

The device frame itself, however, *is* a real frameit asset: the script reads
the same downloaded frame PNGs and offset data frameit's own `editor.rb`
uses, and composites the raw capture directly into each frame's real,
transparent screen cutout — see `design/README.md`'s "Frame source" for the
device models, provenance, and how the cutout rectangles were measured.

One-time setup — download frameit's device frame assets (~280 files, cached
at `~/.fastlane/frameit/latest`):

```bash
fastlane frameit download_frames
```

Regenerate the English set from `packages/app`:

```bash
fastlane/screenshots/design/compose-screenshots.sh en-US
```

The script (requires ImageMagick 7, `magick` on `PATH`, and the frame assets
above) implements the researched, conversion-oriented design system
documented in full in `design/README.md`'s "Design system" section — the
short version:

- Reads a headline from `design/<locale>/title.strings` and a matching
  descriptor from `design/<locale>/subtitle.strings`, both keyed by scene
  name. The headline is Inter Black, auto-sized to 9-11% of canvas width and
  shrunk to fit a 90% text safe zone; the descriptor is the same font at
  50-60% of the headline's size, rendered at 75% opacity.
- Resizes each raw capture to exactly fill the real device frame's
  transparent screen cutout, then layers the frame PNG on top so its own
  bezel — including the real rounded-corner overlap — covers the
  screenshot's square corners. Nothing is cropped: the capture always fills
  the cutout exactly, and the frame only ever adds bezel around it.
- Scales that framed device (bezel and all) to 74-78% of canvas *height*
  (not width — see "Design system" for why), horizontally centered, with a
  soft blurred drop shadow composited beneath it. The two-device combo scene
  scales each device to 50% instead, positioned edge to edge with just
  enough overlap to fit the canvas width.
- Alternates two layouts by scene position — text-top/device-bottom and
  device-top/text-bottom — so the gallery has scroll rhythm instead of one
  repeated template, except where two shots are a deliberate connected pair
  (the challenge shots), which share a layout on purpose.
- Places the device directly against the caption stack with a small, fixed
  gap instead of independently anchoring text and device to opposite canvas
  edges — the composition reads as one cohesive unit, not a caption-island
  floating apart from a device-island.
- Every headline renders in the same near-black `#0A0A0A` with no per-scene
  accent. An earlier version of this design rendered a small two-color
  underline bar under every headline as a fixed brand mark; it read as a
  decorative afterthought rather than a premium signal and was removed —
  typography hierarchy alone now carries the brand.
- Writes output at the exact source resolution so `deliver` slots each image
  correctly, into `ios/<locale>/`, overwriting the locale's existing set.

The curated scene manifest (which raw capture, which appearance, which
layout variant, which device height fraction, which output filename, in
what order) is a store-listing decision and lives directly in the `SCENES`
array in `compose-screenshots.sh`, not in a separate config — edit it there
to change ordering, swap scenes, or change the layout rhythm.

## Refreshing them

1. Capture (see `tests/app-tests/flows/screenshots/README.md`). The current
   set was captured on an iPhone 17 simulator (6.3" slot) and an iPad Pro 13"
   landscape simulator; capture on an iPhone 17 Pro Max simulator instead if
   you need to fill the 6.9" slot (1320x2868).
2. Run `fastlane/screenshots/design/compose-screenshots.sh en-US` from
   `packages/app` to frame and caption the curated set.
3. Review the output in `ios/en-US/` and commit it.
4. Upload by dispatching "Build and Publish to Stores" with
   "Also upload the committed store screenshots" checked, or run
   `fastlane ios_screenshots` locally.

## Gaps

- Only `en-US` is composed and committed. Other locales' `title.strings`
  already exist under `design/`, but `subtitle.strings` (the descriptor
  copy) currently only exists for `en-US` — write a `subtitle.strings` for
  each other locale (same scene keys, 4-8 words) before running
  `compose-screenshots.sh <locale>` against the matching raw captures to
  curate them once the raw captures exist for that locale.
- No Android screenshots yet: `supply` expects them under
  `metadata/android/<locale>/images/phoneScreenshots/`, and no Android emulator
  capture has been run.
