# Store screenshot capture

The canonical reference for producing the committed App Store and Play Store
screenshot sets. Read this before touching
`tests/app-tests/scripts/capture-store-screenshots.ts`, the screenshot flows,
or `packages/app/fastlane/screenshots/`. The store-media skill
(`.agents/skills/store-media/SKILL.md`) owns listing texts, captions, design
decisions, and publishing; this document owns the capture mechanics.

## TL;DR

```bash
# 0. Non-negotiable: the installed app must be the current build.
xcrun simctl listapps <udid> | grep -A4 <bundle-id>   # compare against packages/app/package.json version

# 1. Capture one locale, both appearances (iPhone):
APP_ID=<bundle-id> SIMULATOR_UDID=<udid> \
  yarn workspace @suuudokuuu/app-tests screenshots:capture --locales=de --appearances=light,dark

# 2. iPad landscape:
DEVICE_CLASS=ipad ORIENTATION=landscape APP_ID=<bundle-id> SIMULATOR_UDID=<udid> \
  yarn workspace @suuudokuuu/app-tests screenshots:capture --locales=de

# 3. Android (rootable google_apis AVD, wm size 1080x2340, density 440):
APP_ID=<package> yarn workspace @suuudokuuu/app-tests screenshots:capture \
  --platform=android --serial=<adb-serial> --locales=de

# 4. Compose framed store sets (staging dir, swap-on-success):
bash packages/app/fastlane/screenshots/design/compose-screenshots.sh de-DE all
```

A full locale (both appearances) takes ~1.6 minutes. All 13 locales across
iPhone, iPad, and Android fit in well under an hour.

## How it works

Capture is three `simctl`/`adb` calls per scene, with no UI driving and no
accessibility tree:

1. **Seed state.** `scripts/seed-app-state.ts` writes the persisted redux
   blob straight into the app's storage: one `persist:root` row in a plain
   `storage(key, value)` SQLite table (`expo-sqlite`), at
   `<data container>/Documents/SQLite/ExpoSQLiteStorage` on iOS
   (`simctl get_app_container <udid> <app> data`) and
   `/data/data/<pkg>/files/SQLite/ExpoSQLiteStorage` on Android. Each
   top-level reducer is a JSON string inside the outer JSON object
   (double-encoded, redux-persist convention). The blob carries the language,
   the appearance, a fully rated history for all seven difficulties, and
   per-scene game states.
2. **Launch with the locale.**
   `xcrun simctl launch <udid> <app> -AppleLanguages "(<lang>)" -AppleLocale <id>`
   (Android: `adb shell cmd locale set-app-locales <pkg> --locales <lang>`,
   then `am start`). The app's own language comes from the seeded
   `settings.language`; the launch arguments align the _device_ locale so
   OS-derived strings match too.
3. **Deep-link and shoot.** `simctl openurl` the scene's deep link, settle
   briefly, `simctl io screenshot` (Android: `adb exec-out screencap -p`).

Scene definitions live in `scripts/screenshot-scenes.ts`: each scene carries
its `deepLink`, optional `sceneState`/`seedDifficulty`, and its legacy Maestro
flow file. A scene without a `deepLink` (currently only the win scene)
automatically falls back to its Maestro flow, so the two mechanisms mix
freely. Device commands are in `scripts/capture-device.ts`, the Maestro
fallback in `scripts/maestro-scene.ts`.

## Why it is built this way

The previous pipeline drove every scene through Maestro and switched language
through the in-app sheet, costing ~40 minutes per locale; the statistics
scene additionally needed complete games played through the UI at ~20 minutes
per game. Measured on the same simulator and build, the current path runs
`themes` in 6s (was 47s) and `stats` in 6s (was 99s). Three facts make it
possible, all verified on-device:

- The app's language is persisted redux `settings.language`, not an OS
  setting. The old set-OS-language + uninstall + reinstall + re-prime +
  re-seed ritual for below-the-fold locales (ar, bn, id, pt, ur) was never
  necessary.
- Every screenshot scene is a pure function of the `persist:root` row.
- The row is directly writable while the app is terminated.

**Do not migrate this to fastlane `snapshot`/`screengrab`.** They require a
UI-test target inside the native project, but `packages/app/ios` and
`packages/app/android` are gitignored under continuous native generation, so
a target would be destroyed on every `expo prebuild` and need a config plugin
to re-inject, plus Swift and Espresso scene code. The fastlane lanes in this
repo only upload. `snapshot`'s one real trick — per-locale launch arguments —
is exactly what step 2 above already does.

## Prerequisites and invariants

- **Verify the installed build first.** A stale binary produces plausible
  screenshots with outdated UI; an entire 10-locale set was once shot on a
  2.1.0 build while the repo was at 2.5.1 and had to be redone. Compare the
  installed version against `packages/app/package.json` before every session.
- **Terminate the app before seeding.** A running app holds the SQLite WAL
  and overwrites the seed on exit. The seeder force-stops first; keep it so.
- **Android needs a rootable emulator** for the state write: build the AVD
  from a `google_apis` system image (`adb root` is refused on
  `google_apis_playstore`, and `run-as` is refused on release builds). Set
  `wm size 1080x2340` and `wm density 440` so captures match the frame
  cutout. Locale switching alone needs no root (API 33+).
- **Status bar:** launch arguments do not touch the system status bar, so the
  runner applies `simctl status_bar override` (9:41, full bars, 100%
  battery) and Android SystemUI demo mode. `--status-bar=real` restores the
  device clock. Mixing overridden and real-clock shots in one committed set
  looks broken — recapture the whole set when changing this.
- The seeder reads the persist version from `app-root-migrations.ts` and the
  language list from `languages.constant.ts` at run time, so a migration bump
  or a new locale fails loudly instead of drifting silently.
- **Prime deep links once on every fresh simulator, iPhone and iPad.** iOS's
  "Open in <app>?" custom-scheme dialog strands every scene until it is
  primed once, on either device class - on iOS 26.2 the iPhone 17 Pro Max
  simulator stranded every scene on the dialog exactly like the iPad. A
  single tap on "Open" via a UI driver (`npx serve-sim tap`) or one run of
  `flows/setup/prime-deep-links.flow.yaml` primes it. The iPad additionally
  queues the dialog across relaunch, so `simctl erase` it and reinstall
  before priming.
- `CAPTURE_LAUNCH_SETTLE_MS` and `CAPTURE_SCENE_SETTLE_MS` override the
  post-launch and post-deep-link settle delays; both exist because a loaded
  macstudio needed longer settles than the ~3.5s/~2s defaults.

## The seed fixture

`tests/app-tests/fixtures/screenshot-seed-state.json` holds the rated
seven-difficulty history plus `sceneStates` for the scenes that used to need
real gameplay (`hero`: in-progress Nightmare board with pencil marks;
`challengeLive`: accepted challenge mid-race). Both blobs were captured from
state the app itself persisted, so they cannot drift from the reducers.

To regenerate one after a persisted-shape change: strip the trailing teardown
from the scene's Maestro flow so it leaves state on the device, run it once,
then read the row back:

```bash
sed -e '/quit-current-game/d' -e '/^- stopApp$/d' \
  flows/screenshots/01.hero-board.flow.yaml > /tmp/bake.flow.yaml
maestro --udid <udid> test -e APP_ID=<bundle-id> /tmp/bake.flow.yaml
sqlite3 "$(xcrun simctl get_app_container <udid> <app> data)/Documents/SQLite/ExpoSQLiteStorage" \
  "select value from storage where key='persist:root';"
```

Copy the relevant slice into the fixture. Seed a clean state first — an
in-progress game makes the flow hit the "Stop current run?" confirmation and
never reach the board.

The fixture is not, and cannot be, kept in sync with every `SettingsState`
field by hand: it once fell three fields behind (`allowHintsOnHardDifficulties`,
`motionPreference`, `calmMode`), crashing `DailyScreen` on every tab route
until it was hand-patched mid-session. `packages/app/src` cannot be imported
from the seeder — its relative imports lack extensions, which plain `node`
rejects, and the `settings` slice additionally pulls in the real
`react-native` package, which neither plain `node` nor `tsx` can parse. So
the seeder instead stamps the written `_persist.version` at a fixed baseline
(`SeedFixtureBaselinePersistVersion` in `seed-app-state.ts`, currently 40,
one below the migration that backfills `settings` against the live
`initialSettingsState`) rather than the live `appRootPersistVersion`. This
makes redux-persist run every migration newer than the baseline against the
fixture on the app's first launch after seeding, the same way it would for a
real upgrading user, so newly added fields backfill automatically. Bump the
baseline only past a migration you have checked is a no-op for this fixture's
actual values (`resetBestScores` at 15 and the daily-streak reset inside
`backfillStatsPackAndDailyRecord` at 41 are destructive in general — they are
safe here only because the fixture's `bestScore` and daily-streak fields
already hold values those migrations would produce anyway).

## Compose and verify

`compose-screenshots.sh` frames raws in fastlane frameit device frames,
applies the two-tier captions, and writes the committed sets. It composes
into a temporary staging directory and swaps the committed set only after
every scene of the variant succeeds. **Never reintroduce an up-front
`rm -f "$OUT_DIR"/*.png`** — the script runs under `set -e`, and the old
clear-then-compose order deleted committed screenshots whenever a scene
failed midway. The second argument accepts `light`, `dark`, `all`, or
`android` (Play set only, for when iOS raws are absent).

Before committing a set, verify — do not eyeball only:

- Counts and dimensions: iPhone 1320x2868, iPad 2752x2064, Play 1080x1920
  (`sips -g pixelWidth -g pixelHeight`).
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
