# Store Screenshot Flows

Maestro flows in this folder capture raw App Store / Play Store screenshots. They are
excluded from the regular E2E suite by directory placement: `config.yaml`'s `flows:` glob
(`flows/*.flow.yaml`) and `scripts/run-maestro-suite.sh`'s numbered-flow glob
(`flows/[0-9][0-9].*.flow.yaml`) are both non-recursive, so nothing here runs unless invoked
explicitly by path — the same convention already used for `flows/setup/` and
`flows/subflows/`. Each flow also carries `tags: [screenshots]` for an explicit
`--include-tags`/`--exclude-tags` opt-out if a future runner needs it.

Run the whole matrix with:

```bash
APP_ID=<installed-app-id> yarn workspace @suuudokuuu/app-tests screenshots:capture
```

For a locally connected dev client (not a freshly installed release/E2E build), connect it to
Metro once first — `clearState: false` means the app keeps whatever bundle URL it already has,
it does not open one:

```bash
xcrun simctl openurl booted "<bundle-id>://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"
```

Or invoke a single flow directly for debugging:

```bash
maestro test tests/app-tests/flows/screenshots/02.hell.flow.yaml \
    --config tests/app-tests/config.yaml \
    -e APP_ID=<installed-app-id> -e LOCALE=en -e APPEARANCE=light \
    --test-output-dir /tmp/suuudokuuu-screenshots
```

## Device Requirements

Final store assets for the iPhone 6.9" slot (1320x2868) must be captured on an **iPhone 17
Pro Max** simulator. Smaller iPhone simulators produce differently sized/cropped screenshots
that Apple's App Store Connect will reject for that slot. Boot an iPhone 17 Pro Max
simulator, install the target build, and pass its UDID to the runner
(`--udid=<udid>` or `SIMULATOR_UDID=<udid>`) before generating assets for submission.

Android captures (when an emulator is available) use the same flows with
`--platform=android`; the runner falls back to `adb shell cmd uimode night` for the
light/dark toggle since there is no `simctl ui appearance` equivalent. Android device-size
requirements for the Play Store listing are unchanged from the existing `fastlane/metadata`
setup and are not covered by this pipeline.

## Runtime Parameters

Each flow is parameterized by `LOCALE` (one of the 13 app languages: `en uk de es fr sv zh hi
ar bn pt id ur`) and `APPEARANCE` (`light` or `dark`). Every flow starts with `launchApp:
clearState: false` (like every other flow in this suite — `clearState: true` drops a locally
connected dev client's cached Metro URL, stranding it on the native launcher screen instead of
the app) and then makes state deterministic explicitly instead of relying on a fresh install:
`subflows/apply-appearance.flow.yaml` reads the Dark mode switch's `checked` accessibility
state and only taps it when it disagrees with `${APPEARANCE}`, so it is correct regardless of
whatever appearance the previous scene left behind. `subflows/apply-language.flow.yaml`
selects the target language by its per-row testID (`SettingsOptionSheetSelectors.Option.
<locale>`) so it works regardless of which language the sheet currently renders in.

Maestro's `--test-output-dir <dir>` writes screenshots to `<dir>/screenshots/<name>.png`, not
`<dir>/<name>.png` directly (verified empirically against Maestro 2.6.1). The runner flattens
that nested `screenshots/` folder into the target locale/appearance directory after every
flow run so the final layout matches `packages/app/fastlane/screenshots/raw/<platform>/
<locale>/<appearance>/<scene>.png` with no extra nesting.

Passing `--config tests/app-tests/config.yaml` is required, not optional: without it,
`disableAnimations` stays off and the option-sheet's `SettingsOptionSheetSelectors.Root` (and
everything inside it, including the per-locale rows) intermittently never registers in
Maestro's accessibility snapshot, even though the sheet is visibly on screen. The runner
always passes `--config`; if you invoke a flow manually for debugging, pass it too.

## Scenes

| # | Scene | Screen | Fixture / navigation |
| - | ----- | ------ | --------------------- |
| 01 | hero-board | Mid-game board, selected cell + pencil marks | Reuses the `02.game-screen-win` win fixture but pencils two candidates into the last empty cell instead of filling it, so the board reads "in progress". |
| 02 | hell | Home screen, Hell difficulty (ember gradient button) | Taps `DifficultyComplexityOptionSelectors.Option.Hell`, same setup step as `13.hell-difficulty-run`, without starting a game. |
| 03 | themes | Themes screen | `suuudokuuu://settings/themes` |
| 04 | editor | Theme editor | `suuudokuuu://settings/themes/editor` (self-seeds a draft from the active theme; no prior navigation needed) |
| 05 | win | Challenge-won result screen (confetti + score) | Reuses the same win fixture as `02.game-screen-win`/`04.statistics-screen`. See "Skipped/adapted scenes" below for why this isn't a plain `WinnerScreen`. |
| 06 | rival | Challenge accept-preview (rival stats, timeline, arsenal) | Reuses the fixture from `08.challenge-accept-preview`. |
| 07 | replay | Replay playback of a completed game | Completes the win fixture, then opens `suuudokuuu://history` and its testID-only Newbie difficulty card/replay button — avoids the localized "Stats" tab label and English-only scroll text used by `04.statistics-screen`. |
| 08 | settings | Main settings screen | `suuudokuuu://settings` |

## Skipped / Adapted Scenes

- **win**: no existing E2E fixture reaches a plain (non-challenge) `WinnerScreenSelectors.Root`
  with more than one empty cell. The only flow that reaches `WinnerScreenSelectors.Root`
  (`10.challenge-recording-summary`) does so through a challenge-recording Handoff fixture,
  which renders an extra `ChallengeRunSummary` block, not a plain win. Per the task's fallback,
  this scene captures the **challenge-won** result screen instead
  (`ChallengeResultScreenSelectors.Root`, reached via `complete-winning-shared-challenge`'s
  fixture pattern), which has the confetti/score composition the scene needs.
- **win/replay do not call `subflows/shared/complete-winning-shared-challenge.flow.yaml`
  directly**: that subflow asserts the English-only text `'Their time to beat'`, which fails
  once `LOCALE` is not `en`. Both scenes inline the same fixture link and interaction sequence
  (open → accept → fill cell `6-0` with `2`) without the brittle text assertion.
- **replay** does not reuse `04.statistics-screen.flow.yaml`'s navigation verbatim for the same
  reason: it taps the localized `'Stats'` tab label and scrolls to English `'.*completed
  game.*'`/`'Newbie.*'` text. This scene instead opens `suuudokuuu://history` directly and
  scrolls to the difficulty card by its testID, which is locale-independent.

## App Selectors Added For This Pipeline

- `SettingsScreenSelectors.DarkModeSwitch` (`packages/app/src/screens/components/settings-screen/settings-screen.selectors.ts`),
  threaded through `SettingsSwitch`/`AppToggle`'s existing `testID` prop — needed because the
  Dark mode row previously had no stable selector to toggle deterministically.
- `SettingsOptionSheetSelectors.Option.<locale>` per-row testIDs, threaded from
  `useSettingsOptionSheetConfig`'s `languageItems` through `SettingsOptionSheet` →
  `SettingsOptionSheetItem` → `SettingsOptionSheetRow` (all via a new optional `testID` prop
  that falls back to the existing shared `SettingsOptionSheetSelectors.Option` id for
  cell-margin/font-size rows) — needed because every option-sheet row previously shared one
  generic id, which cannot target a specific language independent of its (changing) label text.
