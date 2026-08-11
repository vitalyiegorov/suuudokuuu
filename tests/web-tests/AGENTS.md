# Web Tests Package

Playwright E2E flows for the Expo web export of Suuudokuuu. Mirrors the Maestro suite in
`tests/app-tests` in scenario coverage, selector strategy, and flow-design discipline, against the
real static build (`packages/app/dist`), not the Metro dev server.

## Commands

```bash
yarn workspace @suuudokuuu/app expo export --platform=web
yarn workspace @suuudokuuu/web-tests playwright install chromium
yarn workspace @suuudokuuu/web-tests test:e2e
yarn workspace @suuudokuuu/web-tests ts
yarn workspace @suuudokuuu/web-tests lint
```

`test:e2e` starts `serve --single` over `packages/app/dist` on port 4173 and reuses an already
running server outside CI. `playwright.config.ts` fails fast with an actionable message if
`packages/app/dist/index.html` is missing; run the export above first.

## Robustness Rules

1. Wait for the destination screen's strongest identity once via a helper's own
   `expect(...).toBeVisible()`. Do not stack redundant assertions on top of the same wait.
2. No blanket `waitForTimeout` calls. The only timed waits in this suite are the pause/resume
   timer-comparison waits in `06.resume-game.spec.ts`, where wall-clock time passing is the
   behavior under test, not a workaround for flakiness.
3. Use exact `data-testid` selectors (via `page.getByTestId`) for stable controls. Use text only
   for user-visible copy that is itself the behavior under test.
4. Keep specs pinned to English (`locale: 'en-US'` in `playwright.config.ts`).
5. Prefer positive-state flow control: perform the action, then assert the destination.
6. Helpers in `src/utils` mirror Maestro subflows one-to-one and keep a single responsibility.
   Do not add thin wrappers that only rename another helper.
7. Do not change app behavior solely to satisfy these tests. If a control lacks a `data-testid` on
   web, report it back instead of hacking around it with positional or CSS selectors.
8. `expo-router`'s tab navigator and `react-native-unistyles`' `Hide`/`Display` responsive
   components keep multiple copies of a screen or a metrics row mounted at once (one hidden via
   `display: none`, shown/hidden by breakpoint or by tab). Plain `getByText`/`getByTestId` can
   match the hidden copy and either strict-mode-violate or click a non-interactive element. Scope
   text assertions to the current screen's root testid (`page.getByTestId(ScreenSelectors.Root).getByText(...)`),
   and use `getVisibleByTestId` from `src/utils/visible-locator.util.ts` for controls (such as
   `HeaderBackButtonSelectors.Root`) that are duplicated across responsive/tab states.

## Selector Rules

1. Import selector enums from the app source of truth via the deep import
   `@suuudokuuu/app/src/selectors` (the barrel re-exports only pure-enum `*.selectors.ts` files).
   `react-native-web` renders `testID` as `data-testid`, which is Playwright's default
   `testIdAttribute`.
2. Board cell and value-button test ids are a coordinate/value string convention, not enum
   members: use `cellTestId(y, x)` and `valueButtonTestId(value)` from `src/utils/test-id.util.ts`
   instead of hand-building the string.
3. Deep-link fixtures live in `src/constants/shared-challenge-links.constant.ts` and reuse the
   exact encoded payloads from the Maestro flows so both suites exercise the same decode path.

## Fixture Notes

- `winningSharedChallengeEncodedConstant`: exactly one empty cell at `y=6, x=0`; entering value `2`
  wins immediately.
- `losingSharedChallengeEncodedConstant`: cell `y=0, x=4`'s correct value is not `4`; entering `4`
  three times registers three mistakes and loses the challenge.

## Known Platform Notes

- Escape does not deselect the active cell on web. `GameScreen` wires the keyboard hook's `onExit`
  callback to the same "Stop current run?" confirmation used by the Quit button (a native
  `window.confirm()`), not to cell deselection. `07.keyboard-controls.spec.ts` asserts the actual
  behavior (the dialog opens) rather than the deselection originally assumed during design.
- The cell-spacing `SettingsOptionSheet` renders through `@expo/ui`'s web fallback (a `vaul`
  drawer), not a native bottom sheet, so it is a normal DOM overlay reachable with
  `page.getByTestId` / `page.getByText`.
- `06.resume-game.spec.ts` reloads the page and re-visits `/` to prove the in-session pause/resume
  timer behavior, then asserts the persisted game survives the reload via `HomeScreenSelectors.ResumeButton`.
  This passed reliably in this harness (wa-sqlite/OPFS persistence survives a full page reload), so
  the full scenario is kept. If it proves flaky elsewhere, trim to the in-session pause/resume
  assertions only and update this note.
- Keyboard navigation (`07.keyboard-controls.spec.ts`) must not click any element before the first
  arrow-key press. `page.getByTestId(GameScreenSelectors.Root).click()` clicks at the center of that
  element's bounding box, which lands on whatever board cell happens to sit there and pre-selects
  it — silently invalidating the "first press starts from Field[0][0]" assumption the keyboard hook
  relies on. Dispatch `page.keyboard.press(...)` directly against the page; the hook's `window`
  keydown listener receives it without any prior click.
- The landing technique embeds (`specs/techniques/*.spec.ts`, `landing-chromium` project) run
  against `packages/landing/out` on a second `serve` instance and a second `webServer`/`project`
  pair in `playwright.config.ts`, not the app export. `TechniqueLiveBoard` constructs its
  `FieldEngine` with `showAutoCandidates: true`. In that mode `field-dom`'s `getFieldCellCandidates`
  recomputes each cell's candidates from row/column/box occupancy and then subtracts the engine's
  `eliminatedCandidates`, which `FieldEngine.removeCandidate` now records whenever auto candidates
  are enabled. Applying an elimination-only step script (`engine.applyStepScript()`) therefore
  removes the struck value from the rendered candidate grid, not just from the walkthrough overlay
  (`data-pattern`, `data-eliminated`, the narration and step controls). Assert both: the overlay
  clearing and the candidate's `data-present` attribute flipping to `false`, when a spec applies an
  elimination-only technique's step script.

## Known App Issues Affecting This Suite

- **`packages/app/src/selectors.ts` was missing an export.** `challenge-result-screen.selectors.ts`
  existed but was not re-exported from the barrel, so `ChallengeResultScreenSelectors` deep-imported
  as `undefined`. Added the missing `export *` line; this is a barrel-only change (no runtime
  behavior change) consistent with `tests/app-tests/AGENTS.md` Selector Rule 5.
- **Hint selectors were not barrel-exported.** `HintButtonSelectors`, `HintPanelSelectors` and
  `HintStepNarrationSelectors` exist under `packages/app/src/game/components/hint-*/`. Added the
  three missing `export *` lines to `packages/app/src/selectors.ts`, consistent with Selector Rule 5,
  and switched `09.hint-flow.spec.ts` from deep-importing the three `*.selectors.ts` files to the
  barrel import.
