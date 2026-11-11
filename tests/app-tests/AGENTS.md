# App Tests Package

This package hosts the store-screenshot scene list
(`scripts/screenshot-scenes.ts`) that the `e2e` media capture uses, the App
Store preview composer (`scripts/compose-app-preview.ts`), and the database
fixtures the `e2e` suite and the media capture install. Read
`docs/store-screenshot-capture.md` before touching the capture or capturing
store screenshots. UI scenarios and the capture itself live in `e2e`.

## Database fixtures

`fixtures/databases/<fixture>.db` are app databases the `e2e` suite installs through `Suuudokuuu.start(fixture)`: finished-game databases for the scenarios, and `screenshot*.db` for the media capture, which imports the `BackupService` backup `fixtures/screenshot-backup.json` and adds each scene's run (`docs/store-screenshot-capture.md` describes them). `scripts/seed-database-fixtures.ts` builds them through the `packages/progress` migrations and services: add fixtures to its `fixtures` map, regenerate with `pnpm --filter ./tests/app-tests seed:fixtures`, and commit the result. `seed:check` in PR CI fails when a committed database no longer matches what the current migrations produce.

## Selector Rules

1. Prefer selector constants from app `*.selectors.ts` files.
2. When a test needs a new selector, add it in the app next to the component or screen it targets.
3. Keep selector names stable and descriptive, such as `GameScreenSelectors.Score`. Prefer selectors that uniquely and stably identify an element over positional `index:` matches — a selection/highlight-dependent id (the board cells expose a stable `CellSelectors.Cell.<y>-<x>`, value buttons `AvailableValueItemSelectors.Button.<value>`) makes index-based selection diverge across platforms.
4. Do not assert unrounded internal values when the UI renders rounded text.
5. Export new selector files from `packages/app/src/selectors.ts` so test authors have one discoverable selector surface.
6. Use selectors for app-owned pressable controls and screen roots. Text assertions are acceptable for user-visible copy that is itself the behavior under test.
7. Native sheets and OS surfaces may not expose React wrapper ids. Prefer the strongest visible app-owned selector inside the sheet. If an Expo native sheet is visible in screenshots but absent from the accessibility tree, test the stable app-owned trigger and dismissal path instead of asserting unreachable sheet internals.
