# App Tests Package

Maestro E2E flows for Suuudokuuu. Current coverage checks home start/quit, shared-puzzle win, shared-puzzle loss, statistics with replay, settings navigation, resume-after-settings persistence, and background/foreground pause behavior.

## Commands

This package contains Maestro YAML flows and config only. Pass `APP_ID` for the installed app under test and `DEV_CLIENT_LINK` for the Expo dev-client project URL with Maestro's `-e` flag, for example:

```bash
maestro test -e APP_ID=<installed-app-id> -e DEV_CLIENT_LINK='suuudokuuu://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8082' tests/app-tests/launch-dev-client.flow.yaml
maestro test --config tests/app-tests/config.yaml -e APP_ID=<installed-app-id> -e DEV_CLIENT_LINK='suuudokuuu://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8082' tests/app-tests/flows
```

Use a freshly rebuilt and reinstalled app when validating code, selector, deep-link, app-config, or native changes.
Always run `launch-dev-client.flow.yaml` once on a fresh simulator before the scenario suite. It proves the preloaded dev-client project reached Home without adding a second URL handoff to that Maestro/XCTest session. Every shared deep-link boundary must use `subflows/navigation/accept-open-link-prompt.flow.yaml` because iOS can request confirmation in the session that performs the handoff.

## Robustness Rules

1. Wait for the next screen's strongest identity once. Do not stack extra `assertVisible` calls on top of the same wait.
2. Prefer positive-state flow control: `tapOn` followed by `extendedWaitUntil` for the destination.
3. Keep retries only for real native instability such as app launch or OS handoff.
4. Use exact `testID` selectors for stable controls. Use text only when no stable id exists.
5. Use `3000` as the default `extendedWaitUntil` timeout. Increase only for clearly slow native work.
6. If a step is expected in the happy path, do not hide it behind `runFlow when:`. Wait for it explicitly and fail there if it does not appear.
7. Keep flows pinned to English. If a flow changes language, switch back to English before it ends.
8. Do not use coordinate taps in committed flows. Add or fix app selectors instead. The only coordinate gesture exception is the shared Expo dev-client floating tools recovery, because that overlay is external native debug chrome and not app UI.
9. Do not take screenshots or run `maestro hierarchy` during an active Maestro run. Inspect after failure or outside the run.
10. Do not use `hideKeyboard` unless a specific native flow proves it is required.
11. If a guard proves load-bearing, keep the smallest specific guard instead of reintroducing blanket waits.
12. After `scrollUntilVisible` on a tappable card or button, settle once only if needed, then tap once. Do not retry normal taps.
13. Dev-client recovery belongs in shared launch or deep-link subflows. Do not duplicate the recovery blocks in scenario flows.
14. If the Expo dev menu is visible during local dev-client runs, close it through `subflows/navigation/close-dev-menu-if-visible.flow.yaml` before interacting with app UI.
15. If the Expo floating tools button appears in local dev-client runs, move it away through `subflows/navigation/move-dev-tools-button-away-if-visible.flow.yaml` before tapping top-right game controls. Rebuilt clients should also set `toolsButton: false` in app config.

## Flow Design

1. Keep numbered flows as user scenarios. Setup and native handoff recovery belongs in `flows/subflows`.
2. Keep navigation coverage in dedicated flows.
3. Keep business flows focused on one behavior.
4. Shared subflows must have one clear responsibility. Delete thin wrappers that only rename another subflow.
5. Prefer plain step sequences over nested `runFlow` blocks when the steps are linear and expected.
6. Use `subflows/navigation/launch-home.flow.yaml` for normal scenario launches and `subflows/navigation/relaunch-home.flow.yaml` when a stop-and-relaunch is the behavior under test. Neither launch subflow reinstalls the app. Scenarios must leave active gameplay through the shared teardown path. Keep home recovery in `subflows/navigation/ensure-home-visible.flow.yaml`, native confirmation handling in `subflows/navigation/accept-open-link-prompt.flow.yaml`, dev-menu recovery in `subflows/navigation/close-dev-menu-if-visible.flow.yaml`, and floating-tools recovery in `subflows/navigation/move-dev-tools-button-away-if-visible.flow.yaml`.
7. Use `subflows/game/start-new-game.flow.yaml`, `subflows/game/open-settings-from-game.flow.yaml`, and `subflows/game/quit-current-game.flow.yaml` for repeated game setup and teardown.
8. Use `subflows/shared/open-shared-challenge.flow.yaml` for shared links, `subflows/shared/accept-shared-challenge.flow.yaml` for the native accept transition, and `subflows/shared/complete-winning-shared-challenge.flow.yaml` when a flow needs a completed win as data setup.
9. Deep-link fixtures should be stable and should decode through the same app path users hit.
10. Do not merge win, loss, settings, stats, and resume flows into one giant flow. Merge only duplicated setup through subflows.

## Selector Rules

1. Prefer selector constants from app `*.selectors.ts` files.
2. When a flow needs a new selector, add it in the app next to the component or screen it targets.
3. Keep selector names stable and descriptive, such as `CellSelectors.Root` or `GameScreenSelectors.Score`.
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
