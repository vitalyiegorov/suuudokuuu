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
| `01`-`08` | iPhone 17 | 1206x2622 | iPhone 6.3" |
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

1. `05-win` — the "Challenge won" confetti screen. Unique payoff moment, nothing
   else in the set is this emotionally strong, so it leads.
2. `02-hell` (flag-blue caption) — a real 17-clue Hell puzzle. This is the
   differentiator: not a marketing difficulty label but a visibly brutal board.
3. `03-themes` — the theme picker, the "make it yours" hook, still inside the
   guaranteed-visible first-3 zone.
4. `06-rival` — challenge-a-friend, the social/competitive hook.
5. `01-hero-board` — the actual gameplay board. Deliberately not first: it's
   the correct screen to prove the app works, but it is the least
   differentiated shot in the set, so it sits mid-gallery instead of leading.
6. `07-replay` — move-by-move replay, a depth feature for engaged users.
7. `04-editor` — the per-color theme editor, paired with `03-themes` as the
   second half of the customization story.
8. `08-settings`, **dark appearance** — the one dark-mode shot in the set,
   placed last so theming support reads as a closing note rather than
   fragmenting the gallery's visual rhythm by alternating light/dark
   throughout.

The iPad set reuses the same five scenes that already have captions
(`02-hell`, `03-themes`, `04-editor`, `06-rival`, `08-settings`) in the same
priority order, with `08-settings` again the single dark-appearance shot —
consistent theming coverage across both device families without inventing new
copy.

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
  soft blurred drop shadow composited beneath it.
- Alternates two layouts by scene position — text-top/device-bottom and
  device-top/text-bottom — so the gallery has scroll rhythm instead of one
  repeated template.
- Renders one fixed brand accent: a small Ukraine-flag-colored bar directly
  under every headline, identical position and proportions on every shot.
  Every headline renders in the same near-black `#0A0A0A` — no per-scene
  caption color overrides.
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
