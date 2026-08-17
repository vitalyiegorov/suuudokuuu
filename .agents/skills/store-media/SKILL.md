---
name: store-media
description: Regenerate, extend, or publish Suuudokuuu's App Store / Play Store listing assets - screenshots, metadata, release notes. Use when touching packages/app/fastlane/**, store screenshots, store texts, release notes, or the capture/compose pipelines.
---

# Store media and metadata

Everything store-facing is repo-committed and regenerated manually - CI only
publishes what is committed. Media changes rarely; nothing is generated on
release.

## File map

- `packages/app/fastlane/metadata/{ios,android}/<locale>/` - listing texts.
  11 App Store locales (no bn/ur - unsupported by Apple), 13 Play locales.
  Char limits: name/title 30, subtitle 30, promo 170, description 4000,
  keywords 100, App Store notes 4000, Play changelog 500.
- `packages/app/fastlane/metadata/release-notes-state.json` - records base
  tag + commit of the last release-notes generation; the publish workflow
  warns when user-facing commits landed after it.
- `packages/app/fastlane/screenshots/design/` - compose pipeline:
  `compose-screenshots.sh` (ImageMagick 7), `<locale>/title.strings` +
  `subtitle.strings` (captions), frameit design kit README.
- `packages/app/fastlane/screenshots/raw/{ios,android}/` - gitignored Maestro
  captures.
- `packages/app/fastlane/metadata/android/<locale>/images/phoneScreenshots/` -
  the committed, framed Play set (7 shots at 1080x1920), written by the same
  compose script. Play carries one set rather than a light/dark pair, so it
  mirrors the deployed dark App Store story.
- `packages/app/fastlane/screenshots/variants/{dark,light}/ios/en-US/` -
  the committed, framed, store-ready sets, one full mirrored set per
  appearance variant (same scenes/order/layouts; only the closing shot
  flips to the opposite appearance).
- `packages/app/fastlane/screenshots/deployed-variant.json` - selects which
  variant the `ios_screenshots` lane uploads (currently `dark`; dark-first
  is a user decision). `SCREENSHOT_VARIANT=light|dark` env-overrides it.
- `packages/app/fastlane/{Fastfile,Appfile}` - lanes: `store_preflight`,
  `ios_metadata`, `android_metadata`, `ios_screenshots`,
  `android_screenshots`. Address lanes as `fastlane <platform> <lane>`; a
  bare name resolves against `default_platform(:ios)`. Lane bodies run from
  `fastlane/` while actions run from `packages/app/`, so plain-Ruby paths are
  anchored on the `FASTLANE_DIR`/`APP_DIR` constants, never on the working
  directory. `store_preflight` needs no credentials and gates both publish
  jobs before the build. The Android lanes read the track from
  `submit.production.android.track` in `eas.json` (not supply's `production`
  default) and resolve the submitted release's version code with
  `google_play_track_version_codes`, because supply cannot infer one when it
  uploads no binary.
- `tests/app-tests/flows/screenshots/` - capture flows (13+ scenes),
  `tests/app-tests/scripts/capture-store-screenshots.ts` - runner,
  `bake-landscape-screenshot.ts` - physical rotation bake.
- `.github/workflows/native-publish.yml` - store publish; `fastlane
store_preflight` gates both jobs up front; metadata pushes after each
  `eas submit`; screenshots upload only with the `push_screenshots`
  checkbox; release-notes freshness check runs
  `node scripts/generate-store-release-notes.ts --check`.

## Workflows

Release notes (local-first, never CI): run
`yarn workspace @suuudokuuu/app store:notes` in a PR that finishes
user-facing work, commit the result. With `ANTHROPIC_API_KEY` in the shell it
writes Claude-authored notes for all 13 locales (model `claude-opus-5`,
override `STORE_NOTES_MODEL`); without it, plain English fallback.

Screenshots, end to end:

1. Capture: `APP_ID=<bundle-id> SIMULATOR_UDID=<udid> yarn workspace
@suuudokuuu/app-tests screenshots:capture --locales=en --scenes=...`
   (add `DEVICE_CLASS=ipad ORIENTATION=landscape` for iPad landscape; the
   runner recycles the XCUITest driver, retries failures once, and bakes
   landscape pixels to 2752x2064 without EXIF).
   1b. Android capture: create an AVD, boot it, then
   `adb shell wm size 1080x2340` and `adb shell wm density 440` so the capture
   exactly matches the Pixel 5 frame cutout. Install the app, then
   `yarn workspace @suuudokuuu/app-tests screenshots:capture
--platform=android --serial=<adb-serial> --locales=en ...`. The runner's
   progress label prints `[iphone/...]` on Android; that is cosmetic, the
   output path is `raw/android/`.

### Fast capture path (default: `--capture-mode=fast`)

Maestro is NOT used for store capture any more. Driving the UI cost ~40 min
per locale because every command dumps the accessibility hierarchy over the
81-cell grid, and the statistics scene needed complete games played through
the UI at ~20 min per game. Measured on the same simulator and build:
`themes` 47s -> 6s, `stats` 99s -> 6s, and a full locale (8 scenes x
dark+light = 16 captures) 40 min -> **1 min 37 sec**.

The whole mechanism is three steps per scene, with no accessibility tree at
all:

1. `scripts/seed-app-state.ts` writes the persisted redux blob directly.
2. `xcrun simctl launch <udid> <app> -AppleLanguages "(<lang>)" -AppleLocale
<id>` (Android: `adb shell cmd locale set-app-locales <pkg> --locales
<lang>` then `am start -n <pkg>/.MainActivity`).
3. `simctl openurl` the scene's deep link, then `simctl io screenshot`
   (Android: `adb exec-out screencap -p`).

Facts this depends on, all verified:

- **The app's language comes from persisted redux `settings.language`, not
  from the OS.** Writing that field switches every locale, including the five
  (ar, bn, id, pt, ur) that sit below the language sheet's fold. The old
  ritual - set `AppleLanguages` globally, uninstall, reinstall, re-prime deep
  links, re-seed history - was never necessary. `OS_LANGUAGE_MODE` is forced
  on in fast mode purely to skip the sheet subflow.
- **Persistence is `expo-sqlite`**, one `persist:root` row in a plain
  `storage(key, value)` table. iOS: `<data container>/Documents/SQLite/
ExpoSQLiteStorage` via `simctl get_app_container <udid> <app> data`.
  Android: `/data/data/<pkg>/files/SQLite/ExpoSQLiteStorage`. redux-persist
  stores each top-level reducer as a JSON string inside an outer JSON object,
  so every slice is double-encoded.
- **Terminate the app before writing.** A running app holds the SQLite WAL and
  overwrites the seed on exit. The seeder force-stops first.
- The persist version is read out of `app-root-migrations.ts` and the language
  list out of `languages.constant.ts` at run time, so a migration bump or a
  new locale cannot silently drift from the fixture.
- **Android needs a rootable emulator** for the state write: `adb root` is
  refused on `google_apis_playstore` images and `run-as` is refused on release
  builds. Create the AVD from a **`google_apis`** system image. Language
  switching alone (`cmd locale set-app-locales`, API 33+) needs no root.
- Launch arguments only reach the app; the **system status bar** is
  unaffected. The runner therefore applies `simctl status_bar override`
  (9:41, full bars, 100% battery) and the SystemUI demo-mode equivalent on
  Android. `--status-bar=real` restores the device clock.

`fixtures/screenshot-seed-state.json` holds the seed: the real
`historyByDifficulty` for all 7 difficulties (rated, with technique counts)
plus `sceneStates` for the two scenes that used to need real gameplay -
`hero` (an in-progress Nightmare board with pencil marks) and `challengeLive`
(an accepted challenge mid-race). Both blobs were captured from state the app
itself persisted, so they cannot drift from the reducers. To regenerate one,
strip the flow's trailing teardown so it leaves the state on the device
(`sed -e '/quit-current-game/d' -e '/^- stopApp$/d' 01.hero-board.flow.yaml >
/tmp/bake.flow.yaml`), run it once through Maestro, then read the row back:
`sqlite3 "$(xcrun simctl get_app_container <udid> <app> data)/Documents/SQLite/
ExpoSQLiteStorage" "select value from storage where key='persist:root';"` and
copy the `game` slice into `sceneStates`. Seed a clean state first - if a game
is already in progress the flow hits a "Stop current run?" confirmation and
never reaches the board.

13 of 14 scenes are pure deep link + screenshot. Only `05.win` still has no
seedable route. Scenes carry their own `deepLink`, `sceneState` and
`seedDifficulty` in `AllScenes`; a scene with no `deepLink` falls back to its
Maestro flow automatically, so mixing the two is supported.

**Do not use fastlane `snapshot` here.** It drives XCUITest, which needs a UI
test target inside the Xcode project - but `packages/app/ios` and
`packages/app/android` are gitignored with zero tracked files (continuous
native generation), so any target is destroyed on every `expo prebuild` and
would need a config plugin to re-inject it, plus Swift scene code and an
Espresso equivalent for `screengrab`. The five fastlane lanes here only
upload. `snapshot`'s actual advantage is the per-locale
`-AppleLanguages`/`-AppleLocale` launch arguments, which the runner now uses
directly at no cost, and it would still pay XCUITest query time per step
against the 6s/scene the simctl path already achieves. 2. Compose: `bash packages/app/fastlane/screenshots/design/compose-screenshots.sh en-US all` - composes into a temp staging dir and only swaps the committed set in
once every scene of that variant succeeded. The script runs under
`set -e`, so the old "clear the output dir, then compose into it"
order destroyed committed screenshots whenever a scene failed midway
(it ate de-DE/light's iPad shots once). Keep composition
non-destructive; never reintroduce an up-front `rm -f "$OUT_DIR"/*.png`. - second arg also accepts `android`, which composes only the Play set -
use it when a device class's iOS raws are missing and the iOS stages of
`dark` would abort before reaching the Play set. - frames captures in real fastlane frameit device frames, applies
two-tier captions, writes both variant sets (second arg: light|dark|all).
Scene manifests are `SCENES_LIGHT`/`SCENES_DARK` in the script; palettes
live in `set_variant_palette` (light #F7F7F7->#F1F1F1 / #0A0A0A text;
dark #141414->#0E0E0E / #F5F5F5 text). Keep the manifests mirrored. 3. Review visually (downscale with sips and look), commit both sets. 4. Upload: dispatch "Build and Publish to Stores" with the screenshots
checkbox, or run the fastlane lanes locally.

## Design system (user-approved decisions - do not regress)

- Two-tier captions: dominant Inter Black headline + smaller descriptor at
  ~0.75 opacity; copy lives in `title.strings`/`subtitle.strings`.
- Flat near-flat background, mirrored per variant (light #F7F7F7->#F1F1F1,
  dark #141414->#0E0E0E). No gradients - they fight the minimalist
  black/white/red brand.
- No accent underline/flag bar - was tried, user rejected as not premium.
  Uniform variant text color (#0A0A0A light / #F5F5F5 dark); typography
  carries hierarchy.
- Real frameit frames (Apple iPhone 16 Pro Max Black Titanium is a
  pixel-perfect 1320x2868 cutout at +75+66, the 6.9" slot, and stays black
  because Apple ships no black 17 Pro Max; iPad uses the 12.9" 4th-gen frame
  scaled 0.7%). Soft drop shadow.
- Tight caption-device gap (1.6% canvas height), text within 90% width.
- Two alternating layouts (text-top / device-top); the challenge pair
  (accept + live) intentionally shares one layout to read as a story.
- Output dims must EXACTLY match capture dims - deliver assigns App Store
  slots by resolution.
- Set curation (user decisions): NO win/confetti shot; hero = airy
  fresh Nightmare board with pencil marks (not a nearly-solved board);
  challenge = two-shot story with anticheat + technique + live wording;
  themes + languages merged into one two-device combo (EN editor + UK
  themes); replay uses the redesigned screen; one closing opposite-mode
  shot per variant (dark closer in the light set, light closer in the dark
  set - caption keys `01-hero-board-dark`/`01-hero-board-light`).
- Captures are clipped to the frame's enclosed screen cutout (flood-fill
  mask in `frame_capture`) - the cutout bounding box overlaps the frame's
  transparent outer corners, so an unmasked square capture pokes past the
  bezel at all four corners.

## Store requirements (learned the hard way, all verified live)

- **The App Store version must exceed the released one.** `packages/app/package.json`
  is the only version that matters: `app.config.js` stamps the binary from it and
  the fastlane lanes pass it to `deliver`. It silently diverged once - the store
  went live on 2.0.0 while the repo kept building 1.74.x - so every metadata push
  created a version _below_ the released one, which Apple will never accept. Before
  publishing, check the repo version against the live one (`itunes.apple.com/lookup?id=6449440933`
  needs no credentials) and bump `packages/app/package.json` plus `lerna.json` if
  the store is ahead.
- **A wrong version cannot be deleted.** App Store Connect refuses with "Only the
  first version of any platform can be deleted" and "A version cannot be deleted if
  any build has been uploaded for the platform". The only correction is to fix
  `package.json` and re-run the lane: `deliver`'s `ensure_version!` renames the
  editable version in place.
- **Copyright must carry the current year** or precheck fails. `store_preflight`
  guards it, so a January rollover fails in seconds instead of at review time.
- **Support URL is per locale.** Setting only `en-US` leaves every other locale
  empty and precheck flags each one. Every field under `metadata/ios/<locale>/`
  must exist for all 11 App Store locales.
- **Screenshot slots are assigned by resolution, not by filename or order.** A set
  captured at the wrong size uploads into its own slot and leaves the current store
  images untouched - the listing looks unchanged. `store_preflight` prints the slot
  each committed screenshot maps to, fails on any size Apple does not recognise, and
  warns when the primary iPhone 6.9" (1320x2868) set is missing. iPad 13" is
  2064x2752 portrait / 2752x2064 landscape.
- **The screenshot lane needs `metadata_path` even with `skip_metadata: true`.**
  `deliver` validates the metadata root's subdirectories as locale names
  regardless, and the default `./fastlane/metadata` holds `ios/` and `android/`,
  so it aborts with "Unsupported directory name(s) for screenshots/metadata".
  Both iOS lanes therefore pass `metadata_path: IOS_METADATA_PATH`.
- **1320x2868 uploads land in `APP_IPHONE_67`**, Apple's largest iPhone slot -
  there is no separate 6.9" set. With `overwrite_screenshots: true` the upload
  also clears the legacy `APP_IPHONE_65` set, so the listing ends up with one
  iPhone set instead of three stale ones.
- **`deliver` can leave duplicate screenshots behind.** Its post-upload
  verification sometimes reports a freshly uploaded file as "missing on App
  Store Connect", retries it, and both copies survive. Check the set count
  after uploading and delete extras by `file_name`.
- **Screenshots lock the moment the version is submitted for review.** Once the
  editable version enters the review queue (a manual "Submit for Review" in App
  Store Connect is enough - `eas submit` only uploads the binary), the ASC API
  refuses screenshot deletion with "Can't Delete Screenshot After Submit for
  review", so `ios_screenshots`' `overwrite_screenshots: true` fails after
  retries. Metadata pushes still go through; Google Play has no such lock.
  Push screenshots before submitting the version for review, or after approval
  to the next editable version; the only same-version escape is cancelling the
  review submission.
- **precheck only warns.** It runs at the end of `ios_metadata` and never fails the
  lane, so read its output - it is the only place these problems surface before a
  human review rejection.
- **Nothing reaches the public listing until the version is submitted and approved.**
  Metadata pushes land on the editable version page; the live listing is unchanged.
  Screenshots are opt-in: the publish workflow only uploads them when the
  `push_screenshots` checkbox is ticked at dispatch.

## Environment gotchas (hard-won, verified)

- Before ANY capture session, verify the installed app version matches the
  repo: `xcrun simctl listapps <udid> | grep -A2 <bundle-id>` (or launch and
  check Settings) against `packages/app/package.json`. An entire 10-locale
  iOS set was once captured on a stale 2.1.0 build while the repo was at
  2.5.1 — every shot showed untranslated pre-release UI and the SE-rating
  fixtures could not seed, and the whole set had to be recaptured. A stale
  build is invisible in the screenshots themselves until a native speaker or
  a missing feature exposes it.
- Store copy must use the app's own translated terms. Audit listing text
  against `packages/app/src/i18n/locales/<locale>/messages.po` for difficulty
  names (Infinity is translated per locale), technique labels (X-Wing and
  Swordfish stay Latin everywhere; Naked Pair et al. are translated), theme
  names, and the statistics vocabulary ("Hardest solve", "Your arsenal").
  A first-pass translation left "arsenal" untranslated in ur/hi/bn, invented
  "salto de rana"/"Schwertfisch" for Swordfish, and inverted "the grids the
  community made famous" in 10 locales — audit per locale against the
  catalogs, never trust a bulk pass.
- SE values always render with a dot (`formatSeRatingValue` uses `toFixed`),
  so store copy must write `SE 6.6`, never a locale decimal comma.
- fastlane overwrites `fastlane/README.md` with its generated lane docs after
  every local lane run, destroying the hand-written doc. The Fastfile calls
  `skip_docs` to prevent that; do not remove it.
- Metro file watching is broken in t3 worktrees: after ANY app-source edit,
  kill the port-8081 process and cold-start Metro, or the app serves stale
  code. Fast Refresh never fires.
- The DerivedData "Debug" prebuild app has EAS Updates enabled and silently
  runs the PUBLISHED bundle instead of Metro. Build a real dev client with
  `yarn ios` for local iteration; connect via
  `xcrun simctl openurl <udid> "<bundle-id>://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"`.
- Do not reboot simulators mid-pipeline: the dev client loses its Metro
  connection and lands on the launcher, failing every flow.
- Maestro XCUITest driver wedges (instant connection-refused): run
  `tests/app-tests/scripts/recycle-ios-driver.sh <udid>`; the runner now
  does this automatically. If it persists, uninstall
  `dev.mobile.maestro-driver-iosUITests.xctrunner` from the sim.
- Maestro on iPad wide layout: ~19s per interaction, so gameplay-fixture
  scenes (win/replay/stats/pause/history) are iPhone-only.
- Parent-`.Root` testIDs may never register in the iOS accessibility
  snapshot while child testIDs do - assert on a child element.
- ImageMagick here has ZERO registered fonts: always pass
  `-font <abs path>` (Inter Black at repo-root
  `node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf`).
- ImageMagick silently degrades composites to grayscale when a flat
  neutral layer is involved: force `-define png:color-type=2|6` on writes.
- Maestro writes landscape screenshots in the portrait framebuffer with a
  PNG eXIf orientation-6 hint; stores need baked pixels - the runner's
  bake handles it.
- iPad GameScreen captures show a stray iPadOS predictive-text toolbar
  (suspected hidden hardware-keyboard listener in-app). Still unfixed, and
  present in every committed iPad shot - verified byte-for-byte identical
  framing against the pre-6.9" set, so it is not a capture regression.
- The iPad simulator queues iOS's "Open in <app>?" custom-scheme dialog and it
  survives relaunch, stranding every scene on the dialog. `simctl erase` the
  iPad, reinstall, then run `flows/setup/prime-deep-links.flow.yaml` against it
  once before capturing; the iPhone target does not need this.
- The iPhone set must be captured on an iPhone 17 Pro Max simulator for the
  6.9" store slot (1320x2868). This machine ships zero simulators by default -
  create one with `xcrun simctl create`. Capture needs a real installed build,
  so `expo run:ios --configuration Release` with `APP_VARIANT=production` has
  to finish first; there is no prebuilt app to reuse.

## Current state / open items

- Framed sets committed in both variants (7 iPhone at 1320x2868, the 6.9"
  slot, + 5 iPad at 2752x2064, the 13" slot) for en-US, uk, de-DE, es-ES,
  fr-FR, pt-BR, sv, and id under screenshots/variants/{dark,light}/ios/;
  dark is the deployed variant (deployed-variant.json). Two-tier captions
  exist for all 11 iOS locales in design/<locale>/{title,subtitle}.strings.
- Caption rendering for non-Latin scripts is solved: `set_caption_engine`'s
  case sends ar-SA, ur, hi, bn-BD and zh-Hans through `rsvg-convert` (pango +
  harfbuzz + fribidi shape and bidi them properly) instead of ImageMagick's
  glyph-less Inter Black freetype path. Needs `brew install librsvg`. Latin
  and Cyrillic locales keep the freetype path, so previously composed sets
  stay pixel-identical.
- The language sheet (@expo/ui bottom sheet) ignores synthetic Maestro
  scroll gestures, so languages below its fold (ar, bn, id, pt, ur) cannot
  be selected through the UI in a flow. This no longer matters for capture:
  the fast path writes `settings.language` into the persisted blob, which
  reaches every locale. The old workaround (set the simulator's OS language,
  uninstall, reinstall, re-prime deep links, re-seed) is obsolete - do not
  reintroduce it.
- Two strings on Home - the Infinity difficulty label and
  `homeScreenGetDifficultyDescription`'s subtitle - render from the DEVICE
  locale rather than the app language, because `_layout` activates
  `i18nGetOSLocale()` at module scope and the component calling that plain
  util does not subscribe to the Lingui context, so it never re-renders when
  the persisted language activates. Passing `-AppleLanguages` alongside the
  seeded language makes both agree, which is why the fast path always sets
  both. This is a real app bug, still unfixed.
- Per-locale Play sets now capture natively: the fast path seeds the Android
  container and switches language with `cmd locale set-app-locales`, so the
  "composing from en" fallback should no longer fire. If it does, that locale's
  raw capture is genuinely missing - fix the capture rather than shipping the
  English screens.
- Play phone screenshots captured and uploaded (7 at 1080x1920). Still
  missing: the 1024x500 featureGraphic, which is design artwork rather than a
  capture, and the seven/ten-inch tablet sets.
- App Preview video (886x1920 H.264 15-30s) not produced; GIFs are not
  accepted by either store.
