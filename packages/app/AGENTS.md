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

### Comfort primitives

1. `gameGetBoardGeometry` holds a `BoardCellSizeMinConstant` (44) floor. When the measured square cannot fit `9 × 44` plus the requested group gaps, the group gaps shrink first and the util returns the reduced `cellMargin` it actually spent. Only when `9 × 44` cannot fit at all do the cells drop below the floor; the board never scrolls or overflows, because full-board scanning is the mechanic.
2. The effective `cellMargin` flows from `useBoardGeometry` through `Field`/`ReplayField` into `useCellBorderStyles` and `gameGetCellHitSlop`. Never read `settingsCellMarginSelector` inside a cell again — the rendered margins must match the margins the geometry budgeted, or the board overflows its measured area.
3. Board `hitSlop` is per-edge and never larger than half the group gap, so two neighbouring cells cannot claim the same point. Numpad digits use `PanelControlHitSlopConstant`, half the smallest numpad gap.
4. `useReduceMotion` combines the OS setting (`SystemMotionProvider` subscribes to `reduceMotionChanged`) with the `motionPreference` setting (`system` | `full` | `reduced`). Use it instead of Reanimated's `useReducedMotion` so the player override is honored. Gated animations must still leave the state legible: selection colour changes instantly rather than fading, and a placed cell shows a static `FieldCellSuccessOutline` instead of the animated ring.
5. `calmMode` hides every score surface (in-game metric strip, pause stats) and swaps the winner hero for `WinnerCalmResultHero`, which reports the move count instead of a score. Scores are still recorded, so history and personal bests survive turning calm play off.

### Hints

1. The hint feature is a teaching device, not an answer dispenser. `HintButton` runs `gameFindHintStepScript(engine.Sudoku)`, which wraps the unnarrowed `findStepScript` so the player always gets the simplest technique the position allows.
2. When no technique fires, or the only "technique" is `SolutionTechniqueEnum.Guess`, `gameFindHintStepScript` returns `null` and the button shows an honest alert. Nothing is revealed and no score is deducted.
3. Playback is engine state: `engine.startStepScript`, `stepScriptNext`, `stepScriptBack`, `applyStepScript` and `stopStepScript`. `HintPanel` renders `snapshot.stepScript` and `snapshot.stepIndex`; `@suuudokuuu/field-core`'s `buildStepScriptState` folds the played prefix of the script into pattern cells, revealed candidates and struck candidates that `Field` feeds into the existing cell highlight and candidate rendering.
4. Applying a hint dispatches `gameHintAction` with the script eliminations and then calls `engine.applyStepScript()`. The placement flows through the normal `moveApplied` event, so scoring, the timeline cell event and its technique classification are identical to a manual placement of the same value. `game.hint-integration.spec.ts` proves it.
5. Hint state is ephemeral. It is never persisted or serialized, abandoning a script simply discards it, and `HintPanel` stops any running script when it unmounts or when the engine is replaced by a new game.
6. Prose never lives in `@suuudokuuu/field-core`. `gameGetStepNarration` maps a step kind plus its structured narration payload to one generic Lingui message per kind, with the technique name interpolated from `techniqueLabelsConstant`.

### Hint scoring policy

1. A hint costs `hintCoefficient` (0.5) of one plain correct placement at the current difficulty and max-mistakes setting, floored at `correctMinValue`. `SudokuScoring.calculateHintPenalty` reuses the same difficulty and hardcore multipliers as `calculate`, so the cost scales with the rest of the model.
2. The magnitude is anchored to a mistake. A mistake is a permanent `mistakesCoefficient` (5%) tax on every remaining placement, so a mid-game mistake on a Medium board drains roughly one placement's worth of score. Half a placement is therefore about half a mistake, paid once and without compounding, which is the right price for an honest learning action.
3. Applying a hint appends a `TimelineEventKindEnum.Hint` marker. The enum is append-only because encoded challenge and handoff payloads carry the numeric codes.

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
