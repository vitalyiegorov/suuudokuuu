# E2E Suite

The E2E suite for both platforms: one [tester-army e2e](https://github.com/tester-army/e2e) test per user scenario. CI (`mobile-e2e.yml`, mobile-ci's `ios-maestro.yml` and `android-maestro.yml` with `test-framework: e2e`) runs it from Linux runners against devices leased from the simlock farm (iPhone 17 Pro simulators, arm64 Pixel 6 emulators) on the repacked E2E app.

It is a standalone npm project, not a pnpm workspace member: mobile-ci hashes this directory into its result-cache key and installs it with `npm ci`.

## Layout

- `e2e.config.ts`: the `ios` and `android` targets (`--target`), each leasing from the farm with `simlockDevices` from `@mobile-ci/e2e-simlock`, and the app under test (`E2E_APP_PATH`, `E2E_APP_ID`).
- `@mobile-ci/e2e-simlock` is not in `package.json`: the provider, its steps (`byId`, `scrollTo`) and the iOS exec/E2EDrop helpers ship with mobile-ci, and the e2e jobs install them from the workflow's own tag. Keep the mobile-ci pins in `mobile-e2e.yml` and the `e2e-simlock-install` step in `pr.yml` on one tag.
- `support/suuudokuuu/core.ts`: locators and assertions, and `Suuudokuuu.start(fixture?)`, which prepares the leased device once (iOS: English, Reduce Motion, the deep-link prompt; Android: root, animations off), removes the app database, installs `tests/app-tests/fixtures/databases/<fixture>.db` when given (through the package's exec helper, `simctl` on iOS and `adb` on Android, with E2EDrop for iOS files), and launches to Home.
- `support/suuudokuuu/game.ts`: the shared game steps.
- `tests/<scenario>.e2e.ts`: one per scenario.
- `media.config.ts`, `media/capture-*.e2e.ts`, `support/suuudokuuu/media.ts`: the store media capture, its own config so the PR suite never collects it. `store-screenshots.yml` runs it with mobile-ci's `SCREENSHOT_PLAN`; `store-media.yml` runs the scenes outside the store set (`win`, `pause`) and records the App Store preview. Without a plan, `SCREENSHOT_SCENES`, `SCREENSHOT_LOCALES`, `SCREENSHOT_APPEARANCES` and `SCREENSHOT_PLATFORM` pick the cells, written to `.e2e/media/raw` at the layout the store compose script reads. A new `test` scene goes in that file's `SCENES`.
    - Stills come from the XCTest runner, which draws no Dynamic Island. Android leases the API 35 `google_apis` image, because the ATD image's screenshots are black and its recordings never finalize.
    - Every capture settles for 6 s before its still: one second caught Android's result screen mid-fade, because a screen's entry fade outlasts its testIDs appearing.
    - The preview holds each tap longer than the longest gap `compose-app-preview.ts` cuts to, so every cut has footage.
    - `store-media.yml` runs on the E2E build the warm-up keeps a base for. These screens show nothing that differs from the production variant, and `STORE_CAPTURE` sets the same `isE2E` flag this build has.

## Rules

1. Every test starts from `suuudokuuu.start()`: tests share devices and run in any order, so none may rely on another's state.
2. React Native exposes every testID twice; select by testID with `byId` (`.first()`).
3. Text matches the whole string case-insensitively: `byText`/`expectText` with a string; pass a `RegExp` for a partial match.
4. Nothing host-side may need device tools (`xcrun`, `adb`, `sqlite3`): the suite runs on Linux. Reach the device through simlock's exec API.
5. A scenario passes on both platforms: platform differences live in `core.ts`, never in a test.
6. A new test is done when it passes twice in a row with `E2E_RETRIES=0` on each platform.
7. Some fixtures are pinned to an older payload on purpose, and a failing assertion is not a reason to re-encode them. The rival link in `08.challenge-accept-preview` predates both the rating trailer and the technique trailer, so it is the only end-to-end coverage of the legacy path: the unknown-rating chip and the `getChallengeTechniqueEvents` replay that derives the rival arsenal when the payload carries no stored techniques. Verify a fixture's payload with `GameStateSerializer.decodeState` from `packages/encoder/dist/esm` before assuming a fixture is stale.

## Running

```bash
cd e2e && npm ci
curl -fsSLO https://raw.githubusercontent.com/rnw-community/mobile-ci/v4.11.0/scripts/fetch-e2e-simlock.sh && bash fetch-e2e-simlock.sh v4.11.0 . && rm fetch-e2e-simlock.sh
SIMLOCK_URL=https://simlock.vitaliiyehorov.dev SIMLOCK_TOKEN=<token> E2E_APP_PATH=<path>/Base.app E2E_WORKERS=4 npx e2e run --target ios
SIMLOCK_URL=https://simlock.vitaliiyehorov.dev SIMLOCK_TOKEN=<token> E2E_APP_PATH=<path>/app-release.apk E2E_WORKERS=2 npx e2e run --target android
```

Download the app from a run of `mobile-e2e.yml`: `gh run download <run> -n ios-e2e-app-e2e` or `-n android-e2e-app-e2e` (arm64-v8a). A failure's `.e2e/results/*/trace.md` holds every step and the accessibility tree at the failure.
