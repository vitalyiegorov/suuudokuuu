# Store screenshot capture

The canonical reference for producing the committed App Store and Play Store
screenshot sets. Read this before touching the e2e media capture
(`e2e/media.config.ts`, `e2e/media/`, `e2e/support/suuudokuuu/media.ts`), the
scene list in `tests/app-tests/scripts/screenshot-scenes.ts`, or
`packages/app/fastlane/screenshots/`. The store-media skill
(`.agents/skills/store-media/SKILL.md`) owns listing texts, captions, design
decisions, and publishing; this document owns the capture mechanics.

## TL;DR

Capture runs from Linux against devices leased from the simlock farm, with the
`e2e` project's media config. Set the project up once as `e2e/AGENTS.md`
"Running" describes (`npm ci` and the `@mobile-ci/e2e-simlock` fetch).

```bash
# 0. Non-negotiable: capture the current build. Take the apps from the newest
#    successful mobile-e2e.yml run on main and check its head SHA.
gh run list --workflow mobile-e2e.yml --branch main --status success -L 1 --json databaseId,headSha
gh run download <run> -n ios-e2e-app-e2e       # Base.app, inside a tar.gz
gh run download <run> -n android-e2e-app-e2e   # app-release.apk

# 1. iPhone, one locale, both appearances:
cd e2e
SIMLOCK_URL=https://simlock.vitaliiyehorov.dev SIMLOCK_TOKEN=<token> E2E_APP_PATH=<path>/Base.app E2E_WORKERS=2 \
  SCREENSHOT_DEVICE='iPhone 17 Pro Max' SCREENSHOT_LOCALES=de SCREENSHOT_APPEARANCES=light,dark \
  npx e2e run --config media.config.ts --target ios

# 2. Android (Pixel 6, API 35 google_apis):
SIMLOCK_URL=https://simlock.vitaliiyehorov.dev SIMLOCK_TOKEN=<token> E2E_APP_PATH=<path>/app-release.apk E2E_WORKERS=2 \
  SCREENSHOT_PLATFORM=android SCREENSHOT_LOCALES=de \
  npx e2e run --config media.config.ts --target android

# 3. Hand the raws to compose and compose the store sets (staging dir, swap-on-success):
cd .. && rsync -a e2e/.e2e/media/raw/ packages/app/fastlane/screenshots/raw/
bash packages/app/fastlane/screenshots/design/compose-screenshots.sh de-DE all
bash packages/app/fastlane/screenshots/design/compose-screenshots.sh de-DE duo   # from the iPhone raws
```

`SCREENSHOT_SCENES` narrows the scenes (default: every scene in `SCENES`),
`SCREENSHOT_LOCALES` the locales (default `en`), and `SCREENSHOT_APPEARANCES`
the appearances (default `dark`). `SCREENSHOT_DEVICE` picks the leased model
and, for an iPad, the `ipad` raw directory. `SCREENSHOT_PLATFORM=android`
must accompany `--target android`: it selects the `android` raw directory.
The cells are sharded over the four `media/capture-*.e2e.ts` files, so
`E2E_WORKERS` leases that many devices in parallel. Get a token as
`~/.agent-config/simlock.md` describes.

Raws land at `e2e/.e2e/media/raw/ios/{iphone,ipad}/<locale>/<appearance>/<NN-scene>.png`
and `e2e/.e2e/media/raw/android/<locale>/<appearance>/<NN-scene>.png`, the same
layout `compose-screenshots.sh` reads under the gitignored
`packages/app/fastlane/screenshots/raw/`.

CI's `store-screenshots.yml` runs the same capture with mobile-ci's
`SCREENSHOT_PLAN` (the cells and their output paths), and `store-media.yml`
captures the scenes outside the store set and records the App Store preview.

## How it works

Each cell is one e2e test (`Media.capture` in `media.ts`):

1. **Prepare the device once per lease.** `Suuudokuuu.start()` sets up the
   device (deep-link prompt, Reduce Motion, Android root); the media capture
   adds the clean status bar and, on Android, `wm size 1080x2340` and
   `wm density 440` for the 1080x1920 Play composition.
2. **Set the locale and appearance.** iOS writes `AppleLanguages` and
   `AppleLocale` to the simulator's global preferences and sets the simulator
   appearance (a native sheet's status bar follows it); Android runs
   `cmd locale set-app-locales` and `cmd uimode night`, because the app's
   `Appearance.setColorScheme` recreates the activity when the system night
   mode differs, which flashes the light window and pauses a running game.
   The app's own language comes from the seeded `settings.language`; the
   device locale aligns OS-derived strings with it.
3. **Seed state.** `sceneDatabase()` in `media.ts` copies the scene's
   committed database (`tests/app-tests/fixtures/databases/screenshot.db`, or
   `screenshot-<sceneState>.db` for a scene with a `sceneState`), writes the
   cell's language, appearance and seed difficulty into its `settings` row
   with `node:sqlite` (a challenge run keeps its stored wall clock of 0, which
   the app anchors to now when the game screen gains focus), and
   `Suuudokuuu.start()` installs the result as the app database (`suuudokuuu.db`
   in the iOS `Library` directory with E2EDrop, `databases/` on Android)
   through simlock's exec API, then launches the app. Every database carries a
   fully rated history for all seven difficulties; the scene databases add the
   in-progress run their scene shows.
4. **Drive the scene and shoot.** A deep-link scene opens its link and waits
   for the screen's root selector; `win`, `pause`, `import` and `app-preview`
   play, background, or pick a photo instead. The cell then settles for 6 s
   and takes the still.

Scene definitions live in `scripts/screenshot-scenes.ts`: each scene carries
its order (the `NN-` file prefix), its optional `deepLink`, `sceneState` (which
database it installs) and `seedDifficulty`. The `SCENES` map in `media.ts` decides how each
one is driven; a new scene needs an entry in both.

The App Store preview comes from `store-media.yml`: the e2e capture records the
scripted game and logs each tap, and `scripts/compose-app-preview.ts` cuts the
recording to human pacing with tap indicators, into the `app-store-preview`
artifact. Put its `01_IPHONE_67.mp4` at `fastlane/app-previews/en-US/` for the
`ios_app_previews` lane.

The capture does not produce the iPad landscape raws (`raw/ios/ipad-landscape`)
or the Play tablet raws (`raw/tablet7`, `raw/tablet10`) the compose script
reads for those sets: the simulator is not rotated and Android has one raw
root. Recapturing those sets needs that support added to `media.ts` first.

## Why it is built this way

The first pipeline drove every scene through the UI and switched language
through the in-app sheet, costing ~40 minutes per locale; the statistics
scene additionally needed complete games played through the UI at ~20 minutes
per game. Seeding the database makes a scene a few seconds. Three facts make it
possible, all verified on-device:

- The app's language is the persisted `settings.language`, not an OS setting.
  The old set-OS-language + uninstall + reinstall + re-prime + re-seed ritual
  for below-the-fold locales (ar, bn, id, pt, ur) was never necessary.
- Every deep-link screenshot scene is a pure function of the app database.
- The database is directly writable while the app is terminated.

**Do not migrate this to fastlane `snapshot`/`screengrab`.** They require a
UI-test target inside the native project, but `packages/app/ios` and
`packages/app/android` are gitignored under continuous native generation, so
a target would be destroyed on every `expo prebuild` and need a config plugin
to re-inject, plus Swift and Espresso scene code. The fastlane lanes in this
repo only upload. `snapshot`'s one real trick, per-locale launch arguments, is
what step 2 above already does.

## Prerequisites and invariants

- **Verify the build first.** A stale binary produces plausible screenshots
  with outdated UI; an entire 10-locale set was once shot on a 2.1.0 build
  while the repo was at 2.5.1 and had to be redone. Check the head SHA of the
  run the app came from before every session.
- **The win scene needs the rating prompt off.** A production-variant capture
  build must be built with `STORE_CAPTURE=1`: the store rating prompt after a
  won puzzle would otherwise fire on the win scene. The flag sets
  `extra.isE2E` and skips it; `store-screenshots.yml` exports it through
  `build-env`. The E2E build that `mobile-e2e.yml` publishes already has it.
- **Android leases the API 35 `google_apis` image**: it is rootable, which the
  state write needs, while the ATD image's screenshots are black.
- **Android Hell scrolls Home.** At the initial scroll position the floating
  tabs cover the Start puzzle button, so the `hell` scene scrolls it clear on
  Android before the still.
- **iOS leases a full simulator** (`deviceMode: 'full'` in `media.config.ts`):
  a slimmed one has no photo library for the `import` scene. Stills come from
  the XCTest runner, which draws no Dynamic Island.
- **Status bar:** the capture applies `simctl status_bar override` (9:41, full
  bars, 100% battery) and Android SystemUI demo mode once per lease.
  `SCREENSHOT_STATUS_BAR=real` keeps the device clock. Mixing overridden and
  real-clock shots in one committed set looks broken; recapture the whole set
  when changing this.
- **Settle time:** every cell waits 6 s before its still. One second caught
  Android's result screen mid-fade, because a screen's entry fade outlasts its
  testIDs appearing.
- A cell's locale is written into `settings.language` as is, so the capture
  plan rejects any locale outside `AllLocales` in `screenshot-scenes.ts` (the
  app's thirteen languages) before a device is leased.

## The seed fixture

`scripts/seed-database-fixtures.ts` builds the screenshot databases next to the
e2e fixtures, through the same `packages/progress` migrations and services the
app runs, so they always match the current schema:

- `fixtures/screenshot-backup.json` is a `BackupService` backup (version 1): ten
  completed games, the rated stats of all seven difficulties, and player stats
  with the solver profile the stats scene shows. The Newbie game completed at
  `SeededReplayCompletedAt` (`screenshot-scenes.ts`) is the one the `replay`
  scene opens. The seed imports it into every screenshot database.
- `screenshotSettings` in the seed script is the settings row (the
  `black-and-white` theme); the capture overwrites its language, appearance
  and last difficulty per cell.
- Each scene database adds one `current_run`: `screenshot-hero` the airy
  Nightmare board with pencil marks, `screenshot-challenge-live` an accepted
  challenge mid-race against the rival link it stores (its timeline and time
  are decoded from that link), `screenshot-infinity` an Infinity board, and
  `screenshot-preview` the Medium board the App Store preview plays, with the
  timer hidden. `screenshot` has no run.

Change the data there, regenerate with
`pnpm --filter ./tests/app-tests seed:fixtures`, and commit the databases;
`seed:check` in PR CI fails when a committed database no longer matches what
the seed produces. A new schema migration only needs the regeneration.

## Compose and verify

`compose-screenshots.sh` frames iOS raws in fastlane frameit device frames,
uses frameless Android captures, applies the two-tier captions, and writes the committed sets. It composes
into a temporary staging directory and swaps the committed set only after
every scene of the variant succeeds. **Never reintroduce an up-front
`rm -f "$OUT_DIR"/*.png`** — the script runs under `set -e`, and the old
clear-then-compose order deleted committed screenshots whenever a scene
failed midway. The second argument accepts `light`, `dark`, `all`, or
`android` (Play set only, for when iOS raws are absent).

Before committing a set, verify — do not eyeball only:

- Counts and dimensions: iPhone 1320x2868, iPad 2752x2064, Play 1080x1920,
  iPhone Duo 1398x2034 and 2007x2853 (`sips -g pixelWidth -g pixelHeight`).
- Zero `composing from en` notes in the compose output. Native-language
  screens are a release requirement; English fallbacks are banned.
- For non-Latin locales, crop a caption band and check shaping: Arabic must
  show joined cursive forms in right-to-left order, Devanagari its conjuncts
  and shirorekha, CJK no tofu. The rsvg/pango caption path handles all
  scripts; isolated Latin-order Arabic letters mean a font regression.
- Statistics shots must show a fully seeded Solver Profile (SE spectrum,
  arsenal with counts) — a "Hardest solve 1.0" hero means the seed did not
  apply.

## Publishing

Committed sets upload through the "Build and Publish to Stores" workflow
(screenshots checkbox) or the fastlane lanes. Apple locks screenshots once a
version is submitted for review ("Can't Delete Screenshot After Submit"), so
sets that miss a release train ship with the next one; Play has no such
lock.
