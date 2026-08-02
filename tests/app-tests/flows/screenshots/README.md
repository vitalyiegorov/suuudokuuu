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

## Device Matrix

| Slot | Device | Simulator | Resolution |
| ---- | ------ | --------- | ---------- |
| iPhone 6.9" (primary) | iPhone 17 Pro Max | boot an "iPhone 17 Pro Max" simulator | 1320×2868 |
| iPad 13" portrait | iPad Pro 13-inch (M4) | boot an "iPad Pro 13-inch (M4)" simulator (or closest available `iPad Pro 13-inch` device type — see `xcrun simctl list devicetypes \| grep -i iPad`) | 2064×2752 |
| iPad 13" landscape | iPad Pro 13-inch (M4) | same simulator, rotated automatically by the runner via serve-sim | 2752×2064 |

The iPhone stays portrait-only (the app locks phone orientation). The iPad supports
all orientations and the adaptive wide layout shines in landscape, so capture both:
`ORIENTATION=landscape` (or `--orientation=landscape`) with `DEVICE_CLASS=ipad`
writes to `raw/ios/ipad-landscape/…` and rotates the simulator before and after the
run. Recommended store curation: iPad set leads with landscape shots, one or two
portrait shots later in the set.

Final store assets must be captured on these exact simulator classes. Smaller/other
simulators produce differently sized/cropped screenshots that App Store Connect will reject
for these slots.

The runner picks a device class with `DEVICE_CLASS=iphone\|ipad` (env var) or
`--device-class=iphone\|ipad` (CLI flag); it defaults to `iphone`. Device class only changes
the output path and (together with `--udid`/`SIMULATOR_UDID`) which booted simulator gets
targeted — it does not change which flows run. Boot the matching simulator, install the target
build on it, and pass its UDID explicitly whenever more than one simulator may be booted (the
runner's auto-detection prefers a booted simulator whose name matches the requested device
class, but an explicit `--udid`/`SIMULATOR_UDID` is unambiguous and required in CI):

```bash
# iPhone (default device class)
APP_ID=<installed-app-id> SIMULATOR_UDID=<iphone-udid> \
    yarn workspace @suuudokuuu/app-tests screenshots:capture

# iPad
DEVICE_CLASS=ipad APP_ID=<installed-app-id> SIMULATOR_UDID=<ipad-udid> \
    yarn workspace @suuudokuuu/app-tests screenshots:capture
```

Android captures (when an emulator is available) use the same flows with
`--platform=android`; the runner falls back to `adb shell cmd uimode night` for the
light/dark toggle since there is no `simctl ui appearance` equivalent. Android device-size
requirements for the Play Store listing are unchanged from the existing `fastlane/metadata`
setup and are not covered by this pipeline. Android output paths do not carry a device-class
segment (device-class is an iOS simulator-selection concern only; there's a single Android
capture target).

## Runtime Parameters

Each flow is parameterized by `LOCALE` (one of the 13 app languages: `en uk de es fr sv zh hi
ar bn pt id ur`) and `APPEARANCE` (`light` or `dark`). Every flow starts with
`subflows/reset-app.flow.yaml`, which mirrors every other flow in this suite (`launchApp:
clearState: false` — `clearState: true` drops a locally connected dev client's cached Metro
URL, stranding it on the native launcher screen instead of the app), retried once for the same
cold-relaunch race `subflows/navigation/relaunch-home.flow.yaml` already retries in the main
suite, and dismisses iOS's "Open in `<app>`?" custom-scheme confirmation if the dev client's
own reconnect-to-last-project handoff re-triggers it (observed on a freshly created iPad
simulator; a no-op on simulators where it doesn't appear). State is then made deterministic
explicitly instead of relying on a fresh install: `subflows/apply-appearance.flow.yaml` reads
the Dark mode switch's `checked` accessibility state and only taps it when it disagrees with
`${APPEARANCE}`, so it is correct regardless of whatever appearance the previous scene left
behind. `subflows/apply-language.flow.yaml` selects the target language by its per-row testID
(`SettingsOptionSheetSelectors.Option.<locale>`) so it works regardless of which language the
sheet currently renders in.

Maestro's `--test-output-dir <dir>` writes screenshots to `<dir>/screenshots/<name>.png`, not
`<dir>/<name>.png` directly (verified empirically against Maestro 2.6.1). The runner flattens
that nested `screenshots/` folder into the target directory after every flow run so the final
layout matches `packages/app/fastlane/screenshots/raw/<platform>/<device-class>/<locale>/
<appearance>/<scene>.png` (iOS) or `packages/app/fastlane/screenshots/raw/<platform>/<locale>/
<appearance>/<scene>.png` (Android, no device-class segment) with no extra nesting.

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
| 07 | replay | Replay playback of a completed game | Completes the win fixture via `subflows/complete-win-fixture-and-return-home.flow.yaml`, then opens `suuudokuuu://history` and its testID-only Newbie difficulty card/replay button — avoids the localized "Stats" tab label and English-only scroll text used by `04.statistics-screen`. |
| 08 | settings | Main settings screen | `suuudokuuu://settings` |
| 09 | home | Home/Play tab, difficulty slider at a normal ("Medium") level | Taps `DifficultyComplexityOptionSelectors.Option.Medium`, mirrors `02.hell`'s setup step without starting a game. |
| 10 | stats | Stats/history tab with a completed entry | Completes the win fixture via `subflows/complete-win-fixture-and-return-home.flow.yaml`, then opens `suuudokuuu://history` and scrolls to the Newbie difficulty card (same locale-independent approach as `07.replay`). |
| 11 | pause | Pause screen (board preview, time/score/mistakes) | Starts a real game (`subflows/game/start-new-game.flow.yaml`), backgrounds the app (`pressKey: Home`), waits, then foregrounds with `launchApp: { stopApp: false }` — the same background/foreground sequence the main suite's `07.background-foreground-game.flow.yaml` uses to reach `PauseScreenSelectors.Root`. Pause has no route params of its own to seed, so there's no deep-link shortcut. |
| 12 | scoring | "How Scoring Works" screen | `suuudokuuu://scoring`. Fully static content driven by `defaultScoringConfig`, so no fixture or prior navigation is needed. |
| 13 | history | History detail: completed games for one difficulty (Score/Time/Mistakes rows) | Completes the win fixture via `subflows/complete-win-fixture-and-return-home.flow.yaml`, opens `suuudokuuu://history`, then taps the Newbie difficulty card — one step deeper than `10.stats` and one step short of `07.replay`'s playback screen. |

`subflows/complete-win-fixture-and-return-home.flow.yaml` factors out the shared "open the win
fixture, accept it, fill the last cell, wait for the challenge result, return to Home" sequence
used by `07.replay`, `10.stats`, and `13.history`.

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
- **plain winner/loser** (`app/winner.tsx`/`app/loser.tsx` reached via a *non-challenge* single-
  player game): skipped. `gameScreenGetWonRoute`/`gameScreenGetLostRoute` only route there when
  `hasRival` is false *and* the run isn't a challenge recording, which every existing win/loss
  fixture in this suite is one or the other of. Reaching a plain win/loss deterministically
  would require actually solving (or deliberately failing) a full, non-fixture-able generated
  board — not a bounded, reproducible setup like the shared-link fixtures the other scenes use.
- **game-settings** (`app/game-settings.tsx`, settings opened mid-game via
  `subflows/game/open-settings-from-game.flow.yaml`): skipped. It renders the same
  `SettingsPageContent` as `08.settings` with no visually distinct composition — only the entry
  point (in-game vs. the Settings tab) differs, so a dedicated scene would be a near-duplicate
  screenshot.
- **the per-field option sheet** (`app/settings/[setting].tsx`, e.g. the language picker used
  by `subflows/apply-language.flow.yaml` itself): skipped as a standalone scene. It's a
  transient overlay/component rather than a distinct destination screen, and it's already
  visible as part of the interaction the app-store screenshots aren't trying to sell.

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
- `ScoringScreenSelectors.Root` (`packages/app/src/scoring/components/scoring-screen.selectors.ts`),
  threaded through `ScoringScreen`'s `CollapsibleChromePage` `testID` prop (the same pattern
  `ThemesScreenSelectors.Root` already uses) — needed because `12.scoring` had no stable root
  id to wait on.
