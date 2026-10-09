# Store screenshots

`variants/<variant>/ios/<locale>/` holds the store-ready screenshots, one
full set per appearance variant: `variants/dark/` and `variants/light/`.
Both are committed to the repo on purpose: store media changes rarely, so it
is versioned and reviewed like any other asset instead of being rebuilt on
every release.

Only one variant is ever uploaded — stores have no per-user appearance
switch for listing media, so the deployed set is a single deliberate brand
choice. `deployed-variant.json` records that choice per platform (currently
`dark` for iOS, matching the app's dark-first identity); the
`ios_screenshots` lane reads it and points `deliver` at
`variants/<variant>/ios`. Set `SCREENSHOT_VARIANT=light|dark` when invoking
the lane to override without editing the file. Switching the store to the
other variant is a one-line JSON change plus a screenshot upload dispatch.

`raw/` holds temporary simulator and emulator captures and is gitignored. The
capture workflow seeds app state and captures with platform tools; see
`tests/app-tests/docs/store-screenshot-capture.md`.

## Current sets

Both iOS appearance variants are committed for all 11 App Store locales. Each
locale has nine iPhone screenshots at 1320×2868 and six landscape iPad
screenshots at 2752×2064:

| Prefix    | Device                 | Resolution | App Store slot |
| --------- | ---------------------- | ---------- | -------------- |
| `01`-`09` | iPhone 17 Pro Max      | 1320×2868  | iPhone 6.9"    |
| `21`-`26` | iPad Pro 13" landscape | 2752×2064  | iPad 13"       |

`deliver` assigns each image to a device slot by its exact pixel resolution, so
iPhone and iPad screenshots share one locale folder and the composed output
stays at the source capture resolution. Filenames sort into upload order.

## Curated store ordering

Apple shows roughly the first 3 screenshots before a user scrolls, so the set
leads with the most emotionally distinctive shots rather than the order the
flows happen to capture them in:

1. `01-hero-board` — the actual gameplay board, airy and uncluttered with
   pencil marks. Leads because it's the clearest single-frame pitch: this is
   what the app looks like, no marketing artifice.
2. `02-hell` — a real forcing-chain Hell puzzle. The differentiator: not a
   marketing difficulty label but a visibly brutal board.
3. `06-rival` — "Get challenged.", the accept-challenge screen. First half of
   a two-shot challenge story: the live-race premise plus anticheat, still
   inside the guaranteed-visible first-3 zone.
4. `14-challenge-live` — "Race them live.", mid-race with the rival's live
   position and technique badges. Second half of the challenge story;
   composed with the _same_ layout variant as shot 3 (see "Design system" in
   `design/README.md`) so the pair reads as one connected two-part scene
   instead of two unrelated shots that happen to be adjacent.
5. `05-customization` — two framed iPhones side by side in one canvas,
   the colorful theme editor (English) and the localized theme list
   (Ukrainian), proving per-cell theming and language breadth in a single
   shot instead of two separate ones.
6. `07-replay` — move-by-move replay, a depth feature for engaged users.
7. `10-stats` — personal progress and solving-technique statistics.
8. `08_iphone_infinity.png` — the bundled extreme-difficulty Infinity tier.
9. The opposite-mode hero closes the set: `09_iphone_hero-board-light.png`
   in the dark variant, and `09_iphone_hero-board-dark.png` in the light
   variant. It reuses the airy board from shot 1 with its own copy to show the
   design in the other mode.

The two variants mirror each other exactly: the same nine iPhone and six
iPad scenes in the same order and layouts, each shot using its own variant's
appearance for both the app capture and the canvas palette, with only the
closing shot and its caption flipped. That keeps a variant switch a pure brand
decision — no re-curation or different story.

The iPad set (`21`-`26`) skips the two-device combo and includes six scenes:
`01-hero-board`, `02-hell`,
`14-challenge-live`, `04-editor` (the theme editor solo, since the combo
shot doesn't exist on iPad), `25_ipad_infinity.png` (the bundled
extreme-difficulty Infinity tier), and `26_ipad_home.png` (the
play/difficulty-picker screen) as the closing shot.

The "Challenge won" confetti shot, the solo theme-picker shot, and the
dark-appearance settings/language shot from the previous set were dropped:
confetti didn't earn its own slot once the challenge pair told a stronger,
two-shot story; the solo theme picker is now folded into the customization
combo (with the Ukrainian list already proving localization, a separate
"speaks your language" shot was redundant); and the closing dark note now
uses the hero board instead, which better showcases the actual redesign this
set exists to show off.

## Composition

`design/compose-screenshots.sh` uses ImageMagick and downloaded frameit device
frame PNGs. It fits each raw capture into the frame's transparent screen
cutout, adds a two-tier caption, a quiet canvas, and a soft shadow, then writes
the final image at the original capture dimensions. The frame assets are real;
the current pipeline does not run `fastlane frameit` to produce the composed
screenshots. See `design/README.md` for the visual system and regeneration
details.

One-time setup — download frameit's device frame assets (~280 files, cached
at `~/.fastlane/frameit/latest`):

```bash
fastlane frameit download_frames
```

Regenerate both iOS variants and the Android phone set for a locale:

```bash
bash packages/app/fastlane/screenshots/design/compose-screenshots.sh en-US all
```

The second argument selects `light`, `dark`, `android`, `tablet`, or `all` (the
default). `all` composes both iOS variants and the Play phone screenshots;
`android` composes only the Play phone set and `tablet` only the Play 7" and 10"
sets. There are 11 iOS locales and 13 Play locales; the script maps the locale
names between the app, Apple, and Google Play. Each Play locale has eight
phone screenshots and five 7" and five 10" tablet screenshots at 1080×1920.

The script (requires ImageMagick 7, `magick` on `PATH`, and the frame assets
above) uses Inter Black from
`packages/app/node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf`
and implements the researched design system
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
- Scales that framed device (bezel and all) to 74-78% of canvas _height_
  (not width — see "Design system" for why), horizontally centered, with a
  soft blurred drop shadow composited beneath it. The two-device combo scene
  scales each device to 62% instead, positioning the pair with enough overlap
  to fit the canvas width.
- Alternates two layouts by scene position — text-top/device-bottom and
  device-top/text-bottom — so the gallery has scroll rhythm instead of one
  repeated template, except where two shots are a deliberate connected pair
  (the challenge shots), which share a layout on purpose.
- Places the device directly against the caption stack with a small, fixed
  gap instead of independently anchoring text and device to opposite canvas
  edges — the composition reads as one cohesive unit, not a caption-island
  floating apart from a device-island.
- Every headline renders in the variant's text color (near-black `#0A0A0A`
  on the light canvas, near-white `#F5F5F5` on the dark one) with no
  per-scene accent. An earlier version of this design rendered a small
  two-color underline bar under every headline as a fixed brand mark; it
  read as a decorative afterthought rather than a premium signal and was
  removed — typography hierarchy alone now carries the brand.
- Writes output at the exact source resolution so `deliver` slots each image
  correctly, into `variants/<variant>/ios/<locale>/`, overwriting that
  variant's existing locale set.

The curated scene manifests (which raw capture, which appearance, which
layout variant, which device height fraction, which output filename, in
what order) are a store-listing decision and live directly in the
`SCENES_LIGHT`/`SCENES_DARK` arrays in `compose-screenshots.sh`, not in a
separate config — edit them there to change ordering, swap scenes, or
change the layout rhythm, and keep the two manifests mirrored.

## Refreshing them

1. Capture (see `tests/app-tests/docs/store-screenshot-capture.md`). The current
   iOS set uses iPhone 17 Pro Max captures (6.9" slot) and iPad Pro 13"
   landscape captures. Android uses Pixel 5-sized emulator captures.
2. From the repository root, run
   `bash packages/app/fastlane/screenshots/design/compose-screenshots.sh en-US all`
   to compose both iOS variants and the Android phone set. Run
   `bash packages/app/fastlane/screenshots/design/compose-play-artwork.sh` to
   generate localized Play feature graphics and the icon for all 13 locales.
3. Review `variants/{dark,light}/ios/en-US/`, all locale screenshot outputs,
   and the generated `metadata/android/<locale>/images/{featureGraphic,icon}.png`
   files before committing them.
4. Upload by dispatching "Build and Publish to Stores" with
   "Also upload the committed store screenshots" checked, or run
   `fastlane ios_screenshots` locally. Both paths upload the variant named
   in `deployed-variant.json` unless `SCREENSHOT_VARIANT` overrides it.

Store artwork is regenerated manually and reviewed before upload; generation
does not run in CI. Generate localized Play feature graphics and the icon with
`bash packages/app/fastlane/screenshots/design/compose-play-artwork.sh`.
The feature graphic uses a dark `#101010` canvas, the small white
`suuudokuuu` wordmark, and the existing statistics promise “Know your real
level.” / “Rated solves. Tracked techniques.” It pairs actual framed
gameplay and statistics phones cropped from the dark App Store screenshots.
Eleven locales use matching UI captures; Bengali and Urdu use English phone
captures with localized copy. The 13 `design/<locale>/feature.strings` files
reuse the localized `10-stats` titles and subtitles. Crop dimensions and
positions are documented in `design/README.md`.
Recorded app preview videos are not part of the current committed set.
