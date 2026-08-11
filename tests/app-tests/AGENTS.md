# App Tests Package

Maestro E2E flows for Suuudokuuu. Current coverage checks home start/quit, shared-puzzle win, shared-puzzle loss, statistics with replay, settings navigation, resume-after-settings persistence, background/foreground pause behavior, and `Play again` setup preservation.

## Commands

Pass `APP_ID` for the installed app under test. For local dev-client testing, load the project once before running the suite:

```bash
maestro test -e APP_ID=<installed-app-id> -e DEV_CLIENT_LINK='suuudokuuu://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8082' tests/app-tests/launch-dev-client.flow.yaml
APP_ID=<installed-app-id> SIMULATOR_UDID=<simulator-udid> tests/app-tests/scripts/run-maestro-suite.sh
```

Use a freshly rebuilt and reinstalled app when validating code, selector, deep-link, app-config, or native changes. CI installs an embedded Release E2E app, so it does not use `launch-dev-client.flow.yaml` or depend on Metro. The suite runner primes the iOS custom-scheme confirmation once in a separate Maestro session, then runs every selected numbered scenario in its own Maestro/XCTest session while preserving the installed app container. After a failed flow, the runner clears app state and re-primes deep links so leftover in-progress state cannot cascade into later flows.

## Robustness Rules

1. Wait for the next screen's strongest identity once. Do not stack extra `assertVisible` calls on top of the same wait.
2. Prefer positive-state flow control: `tapOn` followed by `extendedWaitUntil` for the destination.
3. Keep retries only for real native instability such as app launch or OS handoff.
4. Use exact `testID` selectors for stable controls. Use text only when no stable id exists.
5. Use `3000` as the default `extendedWaitUntil` timeout. Increase only for clearly slow native work.
6. If a step is expected in the happy path, do not hide it behind `runFlow when:`. Wait for it explicitly and fail there if it does not appear.
7. Keep flows pinned to English. If a flow changes language, switch back to English before it ends.
8. Do not use coordinate taps in committed flows. Add or fix app selectors instead.
9. Do not take screenshots or run `maestro hierarchy` during an active Maestro run. Inspect after failure or outside the run.
10. Do not use `hideKeyboard` unless a specific native flow proves it is required.
11. If a guard proves load-bearing, keep the smallest specific guard instead of reintroducing blanket waits.
12. After `scrollUntilVisible` on a tappable card or button, settle once only if needed, then tap once. Do not retry normal taps.
13. Do not open the dev-client URL from business scenarios. Bootstrap owns project loading, and `setup/prime-deep-links.flow.yaml` owns the one-time native custom-scheme confirmation.
14. Do not probe for native Open prompts in business flows. Those probes are slow and can deliver delayed confirmation dialogs into later app interactions.
15. Keep Expo dev tools disabled in the test build. If external debug chrome appears, fix the build configuration instead of moving it with coordinates.
16. Do not change app behavior solely to satisfy E2E tests. Add selectors or accessibility metadata only when they preserve or improve real UI semantics; otherwise fix the Maestro flow, fixture, or harness.
17. Before `inputText`, focus the actual input with `tapOn`. After selecting an option from a native sheet, wait for the sheet search field or root to disappear before interacting with the underlying form.
18. Do not combine `optional: true` with an `extendedWaitUntil` timeout above `5000`, because absence silently consumes the full timeout.

## Flow Design

1. Keep numbered flows as user scenarios. One-time native handoff setup belongs in `flows/setup`; reusable app interactions belong in `flows/subflows`.
2. Keep navigation coverage in dedicated flows.
3. Keep business flows focused on one behavior.
4. Shared subflows must have one clear responsibility. Delete thin wrappers that only rename another subflow.
5. Prefer plain step sequences over nested `runFlow` blocks when the steps are linear and expected.
6. Use `subflows/navigation/launch-home.flow.yaml` for normal scenario launches and `subflows/navigation/relaunch-home.flow.yaml` when stop-and-relaunch is the behavior under test. Both assert the Home contract without URL handoffs. Every scenario must leave the app at Home before stopping.
7. Use `subflows/game/start-new-game.flow.yaml`, `subflows/game/open-settings-from-game.flow.yaml`, and `subflows/game/quit-current-game.flow.yaml` for repeated game setup and teardown.
8. Use `subflows/shared/open-shared-challenge.flow.yaml` for shared links, `subflows/shared/accept-shared-challenge.flow.yaml` for the native accept transition, `subflows/shared/open-shared-handoff.flow.yaml` when a flow needs a handoff payload to land straight on the game screen, and `subflows/shared/complete-winning-shared-challenge.flow.yaml` when a flow needs a completed win as data setup.
9. Deep-link fixtures should be stable and should decode through the same app path users hit.
10. Some fixtures are pinned to an older payload on purpose, and a failing assertion is not a reason to re-encode them. The rival link in `08.challenge-accept-preview` predates both the rating trailer and the technique trailer, so it is the only end-to-end coverage of the legacy path: the unknown-rating chip and the `getChallengeTechniqueEvents` replay that derives the rival arsenal when the payload carries no stored techniques. Re-encoding it would silently delete that coverage and rewrite the arsenal it asserts. Verify a fixture's payload with `GameStateSerializer.decodeState` from `packages/encoder/dist/esm` before assuming a fixture is stale.
11. Do not merge win, loss, settings, stats, and resume flows into one giant flow. Merge only duplicated setup through subflows.

## Selector Rules

1. Prefer selector constants from app `*.selectors.ts` files.
2. When a flow needs a new selector, add it in the app next to the component or screen it targets.
3. Keep selector names stable and descriptive, such as `GameScreenSelectors.Score`. Prefer selectors that uniquely and stably identify an element over positional `index:` matches — a selection/highlight-dependent id (the board cells expose a stable `CellSelectors.Cell.<y>-<x>`, value buttons `AvailableValueItemSelectors.Button.<value>`) makes index-based selection diverge across platforms.
4. Do not assert unrounded internal values when the UI renders rounded text.
5. Export new selector files from `packages/app/src/selectors.ts` so test authors have one discoverable selector surface.
6. Use selectors for app-owned pressable controls and screen roots. Text assertions are acceptable for user-visible copy that is itself the behavior under test.
7. Native sheets and OS surfaces may not expose React wrapper ids. Prefer the strongest visible app-owned selector inside the sheet when Maestro can see one. If an Expo native sheet is visible in screenshots but absent from `maestro hierarchy`, test the stable app-owned trigger and dismissal path instead of asserting unreachable sheet internals.

## Build Rules

1. Preserve the `suuudokuuu://` URL scheme. Shared-puzzle flows depend on it.
2. Preserve associated domain behavior when touching app config.
3. Disable animations through Maestro config for deterministic tests.
4. Re-run affected flows after changing app code, selectors, native config, deep-link encoding, score text, win/lose screens, or settings that affect startup state.
5. Treat dev-client recovery as local convenience only. Valid release evidence comes from a freshly rebuilt and reinstalled app.
6. Run numbered flows through `scripts/run-maestro-suite.sh`; it creates a fresh Maestro/XCTest session per flow and merges their JUnit reports. Pass explicit flow paths to run a CI shard or focused subset.
