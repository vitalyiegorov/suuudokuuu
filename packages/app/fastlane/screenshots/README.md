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
(`design/compose-screenshots.sh`), not `fastlane frameit`. `frameit`'s
`Framefile.json` in this directory targets a fixed 1320x2868 canvas (the
iPhone 6.9" slot), but the raw captures are native-resolution shots from an
iPhone 17 simulator (1206x2622, the 6.3" slot) and an iPad Pro 13" landscape
simulator (2752x2064). `deliver` assigns uploaded screenshots to App Store
Connect device slots by matching exact pixel dimensions, so the committed
output must stay at the source resolution rather than being letterboxed or
padded into frameit's canvas — ruling out frameit's fixed-canvas frame
database for this capture set. `Framefile.json` is kept for reference and for
any future capture run that targets the 6.9" slot directly.

Regenerate the English set from `packages/app`:

```bash
fastlane/screenshots/design/compose-screenshots.sh en-US
```

The script (requires ImageMagick 7, `magick` on `PATH`):

- Reads captions from `design/<locale>/title.strings`, keyed by scene name.
- Composes each raw capture onto a same-resolution `#F5F5F5` canvas with a
  rounded-corner, thin-dark-border device treatment (device scaled to ~78%
  of canvas width, bottom-anchored).
- Renders the caption above the device in Inter Black
  (`node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf` at the
  repo root — the same family the app ships), auto-fit and wrapped to the
  caption box by ImageMagick's `caption:` reader, dark near-black `#0A0A0A`
  by default.
- Applies the one intentional accent: `02-hell`'s caption renders in
  Ukraine-flag blue (`#0057B7`) instead of the default color, on both iPhone
  and iPad. No other scene overrides the caption color.
- Writes output at the exact source resolution so `deliver` slots each image
  correctly, into `ios/<locale>/`, overwriting the locale's existing set.

The curated scene manifest (which raw capture, which appearance, which output
filename, in what order) is a store-listing decision and lives directly in
the `SCENES` array in `compose-screenshots.sh`, not in a separate config —
edit it there to change ordering or swap scenes.

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
  already exist under `design/`; run
  `compose-screenshots.sh <locale>` against the matching raw captures to
  curate them once the raw captures exist for that locale.
- No Android screenshots yet: `supply` expects them under
  `metadata/android/<locale>/images/phoneScreenshots/`, and no Android emulator
  capture has been run.
