# App Package

Main Sudoku game application built with Expo 57, React Native 0.86, React 19.2, React Compiler, Expo Router, Redux Toolkit, Lingui 6, Reanimated 4, and React Native `StyleSheet` theme modules.

## Commands

```bash
yarn start
yarn ios
yarn ios:device
yarn android
yarn web
yarn prebuild

yarn export:web
yarn build:vercel

yarn i18n:sync
yarn ts
yarn lint
yarn test
yarn test:coverage
```

After modifying user-facing text, run:

```bash
yarn i18n:sync
```

## Structure

```text
src/
├── @generic/           # Store setup, shared components, hooks, styles, utils
├── app/                # Expo Router routes and root layout
├── challenge/          # Challenge result/accept/progress UI and utilities
├── game/               # Game context, Redux slice, board UI, hooks, serializers
├── history/            # Completed game history and replay UI
├── i18n/locales/       # Lingui catalogs: en, uk, fr, de, es
├── scoring/            # SudokuScoring and score explanation UI
├── screens/            # Screen-level components used by routes
├── settings/           # Preferences, settings UI, settings slice
└── theme/              # Theme context, enums, interfaces, and theme objects
```

## React 19 Rules

1. Let React Compiler handle ordinary memoization. Do not add `React.memo`, `useMemo`, or `useCallback` by default.
2. Use manual memoization only for APIs that require stable callback identity, such as `useFocusEffect`.
3. Do not use `forwardRef` for new components. Accept `ref` as a regular prop when a component needs it.
4. Do not add `displayName`.
5. Keep derived render values as local constants instead of storing duplicate state.

## Component Patterns

1. Keep one component per folder: `component-name/component-name.tsx`.
2. Each component file exports exactly one component. Context files may export context objects, and provider components live in their own component folders.
3. Keep route files thin. Routes should select and render screen components from `screens/components` or feature modules.
4. Extract repeated JSX rows/items into named components instead of render functions.
5. Extract complex JSX prop logic to named variables before the return.
6. Use named `handle*` functions for non-trivial handlers.
7. For many props, destructure inside the function body. For small components, destructuring in the signature is fine.
8. Keep component internals ordered as props, framework hooks, state/refs, external hooks, handlers, derived values, effects, return.
9. Use composition and explicit variant components instead of boolean-heavy mode props.
10. Prefer `children` for primary composed content instead of `render*` props or named content props.
11. Pure helpers used by components live in the owning module's `utils/` folder. Component files may keep module-level data constants, but not named behavior helpers.
12. Component props are always declared inline as `interface Props`. Do not use `type Props`, `*PropsInterface`, or inline object parameter types for a single component. Promote a shared props interface only when the exact same shape is consumed by multiple components.

## Styling And Themes

1. This app uses React Native `StyleSheet` modules, not NativeWind or CVA.
2. Keep style objects in nearby `*.styles.ts` files when the style is owned by a component.
3. Use theme tokens from `theme/` and shared generic styles instead of duplicating raw colors.
4. Preserve the existing theme contract in `ThemeInterface` from `@suuudokuuu/ui` (`packages/ui/src/theme/interface/theme.interface.ts`).
5. Keep test selectors in nearby `*.selectors.ts` files when a screen or component is targeted by Maestro.

## State And Persistence

1. Redux slices live in the owning module's `store` folder.
2. Use `useAppDispatch` and `useAppSelector` from `@generic/hooks`.
3. When persisted state shape changes, bump the Redux Persist version and add a migration in `@generic/app-root.store.ts`.
4. Persisted-state migrations are the only place where legacy unknown shapes may need narrow escape hatches. Do not spread that pattern into normal app code.
5. Keep puzzle invariants in `@suuudokuuu/generator`.

### Field state ownership

1. `@suuudokuuu/field-core` owns interactive field state: the `Sudoku` grid of record, the selected cell, notes/candidates, input mode, the auto-candidates flag, mistake counting, and completion detection. `GameProvider` creates the `FieldEngine` and `GameContext` exposes `{ create, createFromState, engine, isCreatingGame, snapshot }`.
2. Read the board through `snapshot` (`snapshot.field`, `snapshot.selectedCell`, `snapshot.inputMode`, `snapshot.candidates`) and through `engine.Sudoku` predicates. `engine.Sudoku` is not reference-stable across undo, so never store it in state or a ref.
3. Board input goes through `engine.selectCell`, `engine.inputValue` and `engine.toggleCandidate`. Scoring, the timeline log, haptics, confetti and routing stay app-side and are driven by the `moveApplied`, `mistake` and `completed` engine events subscribed in `game.screen.tsx`.
4. The game slice keeps `candidates`, `inputMode` and `showAutoCandidates` as a persistence mirror written by the same actions that already carry timeline and scoring data. Every engine mutation that changes one of them dispatches its matching action in the same handler, and `game.field-engine-mirror.spec.ts` proves the mirror stays identical to `engine.serialize()`.
5. The persisted `sudokuString` format is the unchanged `Sudoku.toString()` grid. Saved games, share links and replays depend on it, so it must never change shape.

### Undo and redo

1. `@suuudokuuu/field-core` owns the history itself. `UndoButton`, `RedoButton` and the web `Cmd/Ctrl+Z` shortcut all go through `useGameHistoryControls`, which calls `engine.undo()` / `engine.redo()` and, only when the engine reports a step was taken, dispatches `gameUndoAction` / `gameRedoAction` with `gameGetFieldStatePayload(engine)`. That payload is the mirror update, so the persisted `sudokuString` and `candidates` are written by the same handler that moved the engine.
2. The reducers derive what happened by comparing the payload grid to the persisted one. A different grid means a placement was taken back or replayed; an identical grid means it was a note edit, which is free and touches nothing but the mirror.
3. A wrong value never reaches the board — it is counted as a mistake and discarded — so the engine never records it in history and undo can never erase a mistake. `mistakes` is what happened, not what is on the board, and undo leaves it alone.
4. Every `save` writes the awarded points onto its `TimelineEventKindEnum.Cell` event as `score`, next to `technique`. Undoing a placement removes that event from the timeline, returns its `score`, and charges `SudokuScoring.calculateUndoPenalty`. Returning the award is what stops a place/undo/place loop from farming points; redo pops the event back with a fresh think-time delta and re-awards it. `techniqueUsageCounts` follows the same event through `gameApplyTechniqueUsageDelta`.
5. Removing a Cell event carries its `ts` into the following event, so the accumulated deltas and every later absolute timestamp stay exact. This keeps the encoder invariant that the timeline replays into the persisted grid, which `applyCellEventsToField` relies on for handoff payloads. Nothing was added to `TimelineEventKindEnum`: undo is not a recorded event, it unrecords one.
6. `undoneMoves` is the redo stack. `save`, `hint` and `toggleCellCandidate` clear it because each of them pushes engine history, which truncates the engine's own future.
7. Undo and redo are hidden during a challenge run, and the shortcut is inert there. A challenge payload is a faithful record of the run, and neither an un-recorded note edit nor a re-recorded placement can be represented in it without extending the append-only encoder enum.
8. History is never serialized, so it does not survive a restart or a handoff. `createFromState` rebuilds the engine without it and `canUndo` is false again.

### Comfort primitives

1. `gameGetBoardGeometry` holds a `BoardCellSizeMinConstant` (44) floor. When the measured square cannot fit `9 × 44` plus the requested group gaps, the group gaps shrink first and the util returns the reduced `cellMargin` it actually spent. Only when `9 × 44` cannot fit at all do the cells drop below the floor; the board never scrolls or overflows, because full-board scanning is the mechanic.
2. The effective `cellMargin` flows from `useBoardGeometry` through `Field`/`ReplayField` into `useCellBorderStyles` and `gameGetCellHitSlop`. Never read `settingsCellMarginSelector` inside a cell again — the rendered margins must match the margins the geometry budgeted, or the board overflows its measured area.
3. Board `hitSlop` is per-edge and never larger than half the group gap, so two neighbouring cells cannot claim the same point. Numpad digits use `PanelControlHitSlopConstant`, half the smallest numpad gap.
4. `useReduceMotion` combines the OS setting (`SystemMotionProvider` subscribes to `reduceMotionChanged`) with the `motionPreference` setting (`system` | `full` | `reduced`). Use it instead of Reanimated's `useReducedMotion` so the player override is honored. Gated animations must still leave the state legible: selection colour changes instantly rather than fading, and a placed cell shows a static `FieldCellSuccessOutline` instead of the animated ring.
5. `calmMode` hides every score surface (in-game metric strip, pause stats) and swaps the winner hero for `WinnerCalmResultHero`, which reports the move count instead of a score. Scores are still recorded, so history and personal bests survive turning calm play off.

### Comfort mode preset

1. Comfort mode owns no rendering of its own. It writes the primitives above, so every screen keeps reading the individual settings and nothing needs a "comfort" branch. `ComfortModeSettings` in `settings/constant/comfort-mode.constant.ts` is the whole bundle; `ComfortModeSettingKeys` is its single source of truth for keys, and `Pick<SettingsState, …>` on the constant makes a drifted key or value a compile error.
2. `comfortMode` is a three-state status (`off` | `on` | `customized`), not a boolean. `settingsSlice.set` recomputes it after every write: while the preset is not `off`, matching the bundle means `on` and any divergence means `customized`. A later edit is never reverted and never fights the player, and re-matching the bundle silently returns the status to `on`.
3. `comfortModeRestore` stores the pre-preset values of the bundled keys plus `lastGameMaxMistakes`, and is captured only on the first enable — reapplying over a customized state keeps the original snapshot. Turning the preset off restores a key only when its current value is still the one the preset wrote, so an edit the player made in between survives.
4. `isDarkColorSchema` is deliberately outside the bundle: the preset switches to `ThemeEnum.HighContrast` and lets the theme resolve against the light or dark choice already in place. `showComboAnimation` and `keepExhaustedDigits` are outside it too, because the preset only turns guidance on and never turns a player's affordance off.
5. The mistake limit is a per-run Home-screen choice, not a setting the preset owns. Enabling comfort mode nudges `lastGameMaxMistakes` to `RelaxedMaxMistakesConstant` only while it still sits on the default, and the nudge is visible on the same screen. It is excluded from the `customized` computation, so choosing Hardcore for one run does not mark the preset as customized.
6. The Home offer (`HomeScreenComfortOffer`) is shown once and disappears for good: `comfortModeOfferDismissed` is persisted by both the dismiss action and by ever enabling the preset from anywhere.

### Hints

1. The hint feature is a teaching device, not an answer dispenser. `HintButton` runs `gameFindHintStepScript(engine.Sudoku)`, which wraps the unnarrowed `findStepScript` so the player always gets the simplest technique the position allows.
2. When no technique fires, or the only "technique" is `SolutionTechniqueEnum.Guess`, `gameFindHintStepScript` returns `null` and the button shows an honest alert. Nothing is revealed and no score is deducted.
3. Playback is engine state: `engine.startStepScript`, `stepScriptNext`, `stepScriptBack`, `applyStepScript` and `stopStepScript`. `HintPanel` renders `snapshot.stepScript` and `snapshot.stepIndex`; `@suuudokuuu/field-core`'s `buildStepScriptState` folds the played prefix of the script into pattern cells, revealed candidates and struck candidates that `Field` feeds into the existing cell highlight and candidate rendering.
4. Applying a hint dispatches `gameHintAction` with the script eliminations and then calls `engine.applyStepScript()`. The placement flows through the normal `moveApplied` event, so scoring, the timeline cell event and its technique classification are identical to a manual placement of the same value. `game.hint-integration.spec.ts` proves it.
5. Hint state is ephemeral. It is never persisted or serialized, abandoning a script simply discards it, and `HintPanel` stops any running script when it unmounts or when the engine is replaced by a new game.
6. Prose never lives in `@suuudokuuu/field-core`. `gameGetStepNarration` maps a step kind plus its structured narration payload to one generic Lingui message per kind, with the technique name interpolated from `techniqueLabelsConstant`.
7. `gameIsHintAvailable` is the only gate. `HintButton` renders `null` when it returns false: never during a challenge run, and never on `Nightmare`, `Hell` or `Infinity` unless the player turned on `allowHintsOnHardDifficulties` in the guidance settings. Those three tiers are the challenge tiers, so the button is hidden rather than disabled — a disabled control with an explanation is weaker than an honest absence, and the setting is where the explanation belongs.

### Hint scoring policy

1. A hint costs `hintCoefficient` (0.5) of one plain correct placement at the current difficulty and max-mistakes setting, floored at `correctMinValue`. `SudokuScoring.calculateHintPenalty` reuses the same difficulty and hardcore multipliers as `calculate`, so the cost scales with the rest of the model.
2. The magnitude is anchored to a mistake. A mistake is a permanent `mistakesCoefficient` (5%) tax on every remaining placement, so a mid-game mistake on a Medium board drains roughly one placement's worth of score. Half a placement is therefore about half a mistake, paid once and without compounding, which is the right price for an honest learning action.
3. Applying a hint appends a `TimelineEventKindEnum.Hint` marker. The enum is append-only because encoded challenge and handoff payloads carry the numeric codes.
4. An undo costs `undoCoefficient` (0.25) of the same placement, on top of returning the points the undone placement earned. It is priced below a hint because it reveals nothing; the return is bookkeeping rather than a penalty, so a replayed cell can never be paid for twice. Both fractions are documented in the Assists section of the scoring screen.

## Move Classification

Every correct placement is classified exactly once, at the moment it is played, by `classifyTimelineMove`. The result rides the timeline event as `technique`, and `gameStateToString` writes those techniques into the encoded state as the encoder's technique trailer, so a finished game keeps its labels without a migration: `encodedState` is opaque to the persisted shape, and a record written by an older build simply lacks the stream.

Consumers therefore prefer the stored technique and only fall back to re-deriving it:

- `getRunTechniqueEvents` returns the stored stream when the decoded timeline carries one, and replays through `TechniqueManager` only for legacy records. The completed-game chips, the rival arsenal on the challenge accept screen, and the rival run summary all go through it.
- `getSudokuAtStep` shows the stored technique for the replayed step and reclassifies only when it is missing.

`interactiveTechniqueOrder` from `@suuudokuuu/techniques` is for classification that has to answer inside a frame, not for every derivation:

- `classifyTimelineMove` uses it. It runs on the tap that plays a cell, so the full registry would block the JS thread for most of a second on a hard board.
- `getSudokuAtStep` uses it for the one step being scrubbed, for the same reason.
- `getChallengeTechniqueEvents` does not. It is the legacy-record fallback: a whole run replayed once per screen open, off any tap budget, so it uses the full registry and keeps the labels a legacy link deserves.

That split matters because the interactive ladder is a fidelity trade, not a free win. A move that only an AIC or a forcing chain could justify records `Guess`; measured over twelve replayed Infinity games that is about 7 % of moves. Nothing else changes meaning, so scoring, challenge tiers, and the technique tiles keep theirs.

The trade also does not pay off in a bulk replay. Replaying the 59-move Nightmare rival of `08.challenge-accept-preview` costs 139 ms on the full registry against 198 ms on the interactive ladder, because a move the full ladder settles at `AIC` instead falls through the whole direct pass and then the whole enabling pass. Only the hardest boards invert that: a 60-move Infinity replay costs 0.6-1.4 s full against 0.3-0.5 s interactive, and both of those are already too slow to hide, for legacy records only. Rating and solving still use the full registry.

## Routing And Deep Links

1. Expo Router routes live under `src/app`.
2. Shared puzzle links enter through `shared/[url].tsx`.
3. Keep `suuudokuuu://` and associated domain behavior working when touching app config, router files, encoder payloads, or sharing hooks.
4. Prefer route files that delegate to screen components instead of embedding large screen logic directly.

## i18n

1. Use `t` from Lingui macros for string props, alerts, toasts, labels, and non-JSX strings.
2. Use `<Trans>` for direct JSX text children.
3. Do not pass `<Trans>` where a component prop expects `string`.
4. Prefer `<Trans>` in JSX: `<Trans>Score</Trans>` instead of `{t\`Score\`}`.
5. Use `plural(...)` from Lingui macros for count-sensitive user-facing text instead of concatenating counts with fixed singular/plural labels.
6. Do not call `i18n.t()`. Use `t`, `<Trans>`, `msg`, or `plural` macros so extraction stays static.
7. After text changes, run `yarn i18n:sync`.
8. Before finishing i18n work, run `yarn i18n:check` from the repo root.
9. Keep every locale's `messages.po` and compiled `messages.ts` under `src/i18n/locales` in sync.

## Vercel Web Deploy

1. `vercel-functions/api/beta/*.ts` are web-standard `{ fetch }` endpoints; `vercel-functions/shared/create-node-handler.util.ts` bridges them to the Node `(request, response)` signature the Vercel Node launcher calls.
2. `scripts/build-vercel-output.ts` (`yarn build:vercel`) emits a Build Output API v3 tree in `.vercel/output`: `static/` composed from the Expo web export and the `@suuudokuuu/landing` static export, one esbuild bundle per endpoint in `functions/api/beta/<name>.func`, and `config.json`. It needs both `dist/index.html` (`yarn export:web`) and `packages/landing/out/index.html` (`yarn build --filter=@suuudokuuu/landing`).
3. `vercel.json` stays the single source of truth for routes; the build script reads them from it.
4. CI deploys the prebuilt tree with `vercel deploy --prebuilt` from `packages/app`, so the functions are never installed or compiled on Vercel.

### Same-domain split with the landing

1. `www.suuudokuuu.com` serves the landing at `/` and at every content path; the game SPA keeps its own paths on the same domain.
2. The Expo export is copied to the static root except for `index.html`, which becomes the SPA shell at `static/_app/index.html`. The landing export is copied on top, so the landing owns `/index.html`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` and `_next/**`, while the app keeps `_expo/**`, `assets/**`, `.well-known/**` and `/manifest.json`. Overlapping file names are reported by the script and resolved in favor of the landing.
3. The SPA route prefixes in `vercel.json` are matched before `{ "handle": "filesystem" }` and rewrite to `/_app/index.html`, so a landing page can never shadow a game route. Everything else falls through to the filesystem and then to the landing `404.html`.
4. Landing pages are exported as `<route>.html` (`trailingSlash: false`). The build script emits Build Output API `overrides` so each one is served at its extensionless path; root `index.html` and `404.html` are excluded because they are addressed directly.
5. `/` belongs to the landing, so `/play` is the SPA entry that renders the difficulty-select home. It is `noIndex` and is also the PWA `start_url` in `public/manifest.json`. In-app navigation to `/` stays client-side and keeps working.
6. When adding a game route, add it to the SPA prefixes in `vercel.json`, otherwise a direct URL hit returns the landing 404.

## Web Platform Notes

1. `Alert` resolves to `@generic/components/alert/alert.web.ts` on web, which maps a React Native
   `Alert.alert` call onto a single `window.confirm()`. It selects handlers by `AlertButton.style`
   (`'cancel'` versus the first non-cancel button). Never match on `button.text` — every call site
   builds those labels with the Lingui `t` macro, so text matching silently breaks in every locale that
   translates the label.
2. `enableScreens()` is called only when `Platform.OS !== 'web'` in `src/app/_layout.tsx`.
   `react-native-screens` assigns `ENABLE_SCREENS` _before_ its `isNativePlatformSupported` guard, so
   calling it unconditionally flips `screensEnabled()` to `true` on web and diverts the tab navigator
   from react-navigation's `ResourceSavingView` into `Screen.web.js`, the only component in the web
   tree that applies `hidden` + `display: none`. `enableFreeze()` returns before its assignment and is
   a genuine no-op on web, so it is guarded alongside purely for symmetry.
3. Board cells pass `tabIndex={-1}` to their `Pressable`. `react-native-web` always emits a `tabIndex`
   from `Pressable` (`0` unless `disabled`), so `focusable={false}` is silently ignored there and
   `tabIndex` is the only prop that works. Without it all 81 cells become tab stops. Cells are selected
   by click and arrow keys, and the green selection highlight is their indicator, so the
   `outline: none` rule for `[data-testid^='CellSelectors.Cell.']` in
   `@generic/utils/game-controls-interactions.css` removes a ring that could never track the real
   selection anyway. Tab therefore moves between genuine controls (numpad, candidate input), which keep
   their themed `:focus-visible` ring. `tests/web-tests/specs/13.cell-focus-ring-alignment.spec.ts` pins
   both halves of this.
4. Blurred chrome on web (`EdgeFade`, the `FloatingTabBar` `BlurView` surface) attaches
   `useBackdropRecomposite` from `@suuudokuuu/screen-chrome`. Keep that ref attached to an existing
   wrapper element; do not introduce a new wrapper View for it, which would change tab bar layout.

## Error Handling

1. Use `getErrorMessage(error)` for unknown errors.
2. Keep user-facing error messages localized.
3. Avoid catch-and-ignore unless the failure is intentionally recoverable and the caller has a clear fallback.

## Verification

Run app-level checks after app changes:

```bash
yarn ts && yarn lint
```

Run `yarn test` when scoring, reducers, persistence, or deterministic app logic changes. Run Maestro flows from `tests/app-tests` when routes, selectors, deep links, sharing, or end screens change.

## Running On A Local Simulator

1. JavaScript and TypeScript changes need only Metro. Do not run `expo run:ios` for them.
2. Start Metro from the worktree you are editing, then confirm the port it actually bound. It does not always land on 8081, and the dev client remembers whatever port it used last. A port mismatch looks exactly like "my changes did nothing", so check the port before suspecting the build or the worktree.
3. Verify Metro is serving before debugging the app: `curl -s -o /dev/null -w '%{http_code}' http://localhost:<port>/status` returns 200.
4. Both the release and dev builds register the `suuudokuuu` scheme, so `simctl openurl` with the dev-launcher URL is ambiguous and may reach the wrong app. The reliable route is to launch the dev client directly and use its own UI:

```bash
xcrun simctl terminate booted com.vitalyiegorov.suuudokuuu
xcrun simctl launch booted com.vitalyiegorov.suuudokuuu.dev
```

Then tap **Enter URL manually**, type `http://localhost:<port>`, and tap **Connect**. The launcher's "Recently opened" list shows which port the client used previously.

5. The dev client resumes a cached bundle when launched plain, so an unchanged screen does not prove Metro is unreachable. Metro logging no bundle request is the signal that nothing fetched.
6. Native rebuilds work through `yarn ios`, `yarn ios:device` and `yarn prebuild`, which pin `LANG` and `LC_ALL` to `en_US.UTF-8`. Only native dependency or app-config changes need that path.
7. Do not call `expo run:ios`, `expo prebuild` or `pod install` directly unless the shell exports a UTF-8 locale. With `LANG` unset, Ruby resolves the filesystem encoding to US-ASCII, `Dir.pwd` comes back as ASCII-8BIT, and CocoaPods dies in `Pod::Config#installation_root` with `Unicode Normalization not appropriate for ASCII-8BIT`, which then fails `xcodebuild` with "sandbox is not in sync with the Podfile.lock". Prefer the package scripts, which already set the locale.
