# App Tests Package

This package hosts the store-screenshot capture pipeline
(`scripts/capture-store-screenshots.ts` and friends), the App Store preview
composer (`scripts/compose-app-preview.ts`), and the database fixtures the `e2e`
suite installs. Read `docs/store-screenshot-capture.md` before touching the
capture pipeline or capturing store screenshots. UI scenarios live in `e2e`.

The Android store capture smoke job in `mobile-e2e.yml` runs only when the workflow is started manually (`gh workflow run mobile-e2e.yml --ref <branch>`), never on pull requests or pushes to main, because a second emulator per run overloads the Linux runner host. It downloads the E2E APK,
boots a rootable API 34 emulator, and captures all thirteen direct-link scenes
in English and dark appearance. Its five-minute timeout starts after APK
installation and emulator warm-up. `--verify` fails on an unknown or empty
scene selection, a changed or missing app process, AndroidRuntime errors, or
an invalid or blank screenshot. Raw captures and the JSON report are CI
artifacts only; the job never composes or commits store assets. The win and
pause scenes are not direct-link scenes: the `e2e` media capture drives them. Verification uses the app PID, per-scene logcat,
and ImageMagick image statistics without a UI hierarchy, so running game
clocks do not block capture.

## Database fixtures

`fixtures/databases/<fixture>.db` are finished-game databases the `e2e` suite installs through `Suuudokuuu.start(fixture)`. `scripts/seed-database-fixtures.ts` builds them through the `packages/progress` migrations and services: add fixtures to its `fixtures` map, regenerate with `pnpm --filter ./tests/app-tests seed:fixtures`, and commit the result. `seed:check` in PR CI fails when a committed database no longer matches what the current migrations produce.

## Selector Rules

1. Prefer selector constants from app `*.selectors.ts` files.
2. When a test needs a new selector, add it in the app next to the component or screen it targets.
3. Keep selector names stable and descriptive, such as `GameScreenSelectors.Score`. Prefer selectors that uniquely and stably identify an element over positional `index:` matches — a selection/highlight-dependent id (the board cells expose a stable `CellSelectors.Cell.<y>-<x>`, value buttons `AvailableValueItemSelectors.Button.<value>`) makes index-based selection diverge across platforms.
4. Do not assert unrounded internal values when the UI renders rounded text.
5. Export new selector files from `packages/app/src/selectors.ts` so test authors have one discoverable selector surface.
6. Use selectors for app-owned pressable controls and screen roots. Text assertions are acceptable for user-visible copy that is itself the behavior under test.
7. Native sheets and OS surfaces may not expose React wrapper ids. Prefer the strongest visible app-owned selector inside the sheet. If an Expo native sheet is visible in screenshots but absent from the accessibility tree, test the stable app-owned trigger and dismissal path instead of asserting unreachable sheet internals.
