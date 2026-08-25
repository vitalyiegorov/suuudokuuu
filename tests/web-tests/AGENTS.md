# Web Tests Package

Playwright E2E flows for the Expo web export of Suuudokuuu. Mirrors the Maestro suite in
`tests/app-tests` in scenario coverage, selector strategy, and flow-design discipline, against the
real static build (`packages/app/dist`), not the Metro dev server.

## Commands

```bash
yarn workspace @suuudokuuu/app expo export --platform=web
yarn build --filter=@suuudokuuu/landing
yarn workspace @suuudokuuu/web-tests playwright install chromium
yarn workspace @suuudokuuu/web-tests test:e2e
yarn workspace @suuudokuuu/web-tests ts
yarn workspace @suuudokuuu/web-tests lint
```

`test:e2e` starts `serve --single` over `packages/app/dist` on port 4173 and a plain `serve` over
`packages/landing/out` on port 4174, and reuses already running servers outside CI.
`playwright.config.ts` fails fast with an actionable message if `packages/app/dist/index.html` or
`packages/landing/out/index.html` is missing; run both builds above first.

## Robustness Rules

1. Wait for the destination screen's strongest identity once via a helper's own
   `expect(...).toBeVisible()`. Do not stack redundant assertions on top of the same wait.
2. No blanket `waitForTimeout` calls. The only timed waits in this suite are the pause/resume
   timer-comparison waits in `06.resume-game.spec.ts`, where wall-clock time passing is the
   behavior under test, not a workaround for flakiness.
3. Use exact `data-testid` selectors (via `page.getByTestId`) for stable controls. Use text only
   for user-visible copy that is itself the behavior under test.
4. Keep specs pinned to English (`locale: 'en-US'` in `playwright.config.ts`). The single exception is
   `10.localized-quit-game.spec.ts`, which sets `test.use({ locale: 'uk-UA' })` because the translated
   app language _is_ the behavior under test (see the `Alert` note under Known App Issues). Do not copy
   this override into other specs.
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
- `infinitySharedPuzzleEncodedConstant`: a `Puzzle`-kind share of a real Infinity-corpus puzzle (21
  clues) with the encoder's metadata trailer carrying an explicit `Infinity` difficulty (wire code
  `6`) and its curated SE rating (`11.9`, non-ceiling), so it decodes as Infinity instead of
  colliding with Nightmare's blank-count inference. Generated with `GameStateSerializer.encodeState`
  against `pickInfinityPuzzle`'s output. Regenerate it whenever the Infinity corpus or the metadata
  trailer format changes: decode the current constant with `GameStateSerializer.decodeState`, then
  re-encode the same field through `gameStateToString` with `difficulty: DifficultyEnum.Infinity`,
  `rating: 11.9`, and `SharedPayloadKindEnum.Puzzle`, and keep
  `tests/app-tests/flows/14.infinity-difficulty-run.flow.yaml` in sync with the new string.
- `ratedWinningSharedChallengeEncodedConstant`: the same one-empty-cell win as
  `winningSharedChallengeEncodedConstant` (cell `y=6, x=0`, value `2`), re-encoded with a real
  `rating`/`isRatingCeiling`/`difficulty` trailer instead of the legacy fixture's unknown rating, so
  completing it produces a genuinely rated Newbie completed game. Regenerate by decoding
  `winningSharedChallengeEncodedConstant` with `GameStateSerializer.decodeState`, rating its
  `field` with `ratePuzzle` from `@suuudokuuu/rating`, then re-encoding the same decoded payload
  through `GameStateSerializer.encodeState` with `rating: Math.round(rated.rating * 10)`,
  `isRatingCeiling: rated.isCeiling`, and `difficulty: 0` (Newbie's wire code). Run the snippet from
  inside `packages/app` so the workspace `@suuudokuuu/encoder`/`@suuudokuuu/rating` packages
  resolve, and delete the scratch script afterward instead of committing it.
- `ratedLosingSharedChallengeEncodedConstant`: the same three-mistake loss as
  `losingSharedChallengeEncodedConstant` (cell `y=0, x=4`'s correct value is not `4`), re-encoded
  with the same real rating trailer as `ratedWinningSharedChallengeEncodedConstant` (regenerate the
  same way, decoding `losingSharedChallengeEncodedConstant` instead).

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
- The landing specs (`specs/landing/*.spec.ts`, `landing-chromium` project) run
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

## Browser Projects

`chromium` and `mobile-chromium` run the whole suite. `mobile-webkit` (iPhone 14) is scoped via
`testMatch` to `10.localized-quit-game.spec.ts` and `11.backdrop-recomposite.spec.ts` only, so the
suite gains real WebKit coverage of the browser both bugs were reported on without adopting the whole
suite's WebKit gaps. Two existing specs fail on WebKit for reasons unrelated to the code under test,
and must be resolved before the project can be widened:

- `06.resume-game.spec.ts` — `HomeScreenSelectors.ResumeButton` never appears after `page.reload()`.
  wa-sqlite/OPFS persistence does not survive a reload in Playwright's WebKit, unlike Chromium.
- `08.challenge-hud-layout.spec.ts` — the rival-race HUD's `x` is `0` on the iPhone 14 viewport, so
  the "HUD sits right of the board" geometry assertion does not hold at that breakpoint.

## Landing Specs

`specs/landing/**` is the whole `landing-chromium` scope: the static Next.js export in
`packages/landing/out`, served on port 4174. The app projects exclude it with `testIgnore:
/landing\//u`, so an app spec never hits the landing server and a landing spec never hits the app
export. Number landing specs from `01` inside that folder; they are a separate ladder from the app
specs at `specs/`.

| Spec                             | What it pins                                                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `01.technique-embed.spec.ts`     | The intent-gated playable island: static table stays in the DOM, the engine chunk only loads on click, the step script walks and applies.              |
| `02.crawlability.spec.ts`        | Zero-JS contracts: static worked example and candidate grid, guide measured-data tables, one `<h1>`/canonical/exported `og:image` per sampled family, and the `Article.headline === <h1>` invariant (absent on home, which ships `WebSite` + `SoftwareApplication`). |
| `03.indexing-consistency.spec.ts`| One URL enumeration: every `sitemap.xml` `<loc>` is unique, same-origin and served with 200; `robots.txt` advertises the sitemap; `llms.txt` lists exactly the sitemap set. |
| `04.comfort-text-size.spec.ts`   | The comfort scale: three steps in the header, `aria-pressed`, root font size and board cell growth, `localStorage` persistence across a reload, and the pre-paint inline script in raw HTML. |
| `05.navigation-chains.spec.ts`   | Header and footer links resolve, the technique prev/next chain navigates both ways, breadcrumbs mark the current page, and the hub's visible list equals its `ItemList` structured data (26 techniques). |
| `06.solver-flow.spec.ts`         | The solver island: static shell in raw HTML, a sample puzzle narrates into technique-linked steps with a live replay board, empty grid reports multiple solutions, contradictory grid reports none, no console errors. |
| `07.printables.spec.ts`          | The printable hub lists six tiers plus the extras, and every `.pdf` link answers 200 with the `%PDF-` magic bytes.                                     |
| `08.faq-rendering.spec.ts`       | A `FaqPage` renders one `<details>` per entry and the visible summaries are exactly the `FAQPage` schema questions, in order.                          |
| `09.not-found.spec.ts`           | An unknown path answers 404 with the landing 404 document and its site chrome.                                                                         |

Rules specific to this scope:

1. Use the `request` fixture for anything provable from the exported bytes (markup, structured data,
   sitemap, PDFs). Reach for `page` only where hydration or interaction is the behavior under test.
   Half of this scope is a view-source contract, and `page` would hide a regression that only shows
   up before JavaScript runs.
2. Import landing constants from the source of truth by deep import (`@suuudokuuu/landing/src/...`),
   the way `01.technique-embed.spec.ts` imports `SITE_PLAY_URL`. The landing package ships no
   `data-testid` attributes; its stable handles are semantic roles, `aria-label`s and the `class`
   names in `src/app/global.css`, which is why these specs use CSS/role selectors rather than
   `getByTestId`. That is a deliberate exception to Robustness Rule 3, not a shortcut.
3. Never assert a number that `yarn workspace @suuudokuuu/landing generate:rating-sample` can move.
   Clue counts, SE ranges and technique frequencies are regenerable data: assert that a numeric cell
   renders and that the row count matches the tier count, not the value. Counts that come from
   source enumerations (26 technique pages, 6 difficulty tiers) are fair to pin literally.
4. `readJsonLdSchema` (`src/utils/json-ld.util.ts`) locates a schema block by its serialized
   `{"@context":…,"@type":…}` prefix and returns `null` when the page does not publish it, so a spec
   can assert both presence and absence. Assert against it with `toMatchObject` rather than reading
   properties off the parsed value: the parsed payload is `unknown`, and `toMatchObject` keeps the
   spec free of type assertions and index access.
5. `llms.txt` is written into `packages/landing/public` by `scripts/generate-indexing-files.ts`,
   which the package's own `build` script runs before `next build`. Both the local build and the CI
   `yarn build --filter=@suuudokuuu/landing` step therefore always produce it, so
   `03.indexing-consistency.spec.ts` asserts it unconditionally. The IndexNow key file is the
   opposite case — it only exists when `INDEXNOW_KEY` is set, so nothing here asserts it.

## Backdrop Recomposite Spec

`11.backdrop-recomposite.spec.ts` pins the _mechanism_ of an unverified iOS Safari mitigation, not a
user-visible symptom. The reported "black screen after returning to Safari" could not be reproduced in
any headless engine (see the note below), so there is no symptom to assert. Instead the spec installs a
`MutationObserver` on every element whose computed `backdrop-filter` is not `none`, drives
`visibilitychange` and `pageshow`/`persisted`, and asserts the inline `backdrop-filter` was set to
`none` and then removed across frames — proving `useBackdropRecomposite` actually ran. It fails if the
hook is unwired from `EdgeFade` or `FloatingTabBar`. Do not rewrite it to assert pixels; headless
WebKit never reproduces the compositor fault this guards against.

## Known Landing Issues Affecting This Suite

- **The 404 document carries two conflicting `robots` meta tags.** `packages/landing/out/404.html`
  and `_not-found.html` emit both `<meta name="robots" content="noindex"/>` (Next's own not-found
  metadata) and `<meta name="robots" content="index, follow"/>` (from `buildRootMetadata`, which the
  root layout applies to every document). Crawlers resolve conflicting directives to the most
  restrictive one, so the page is still de-indexed and the behavior is correct today;
  `09.not-found.spec.ts` asserts the `noindex` tag rather than the absence of the other. Fixing it
  means scoping the root `robots` metadata so the not-found route can override it.
- **The home canonical and the home sitemap entry differ by a trailing slash.**
  `sitemap.ts` publishes `https://www.suuudokuuu.com/` (`buildLocaleUrl` concatenates the `/` path)
  while the rendered `<link rel="canonical">` is `https://www.suuudokuuu.com`, because Next resolves
  canonical URLs against `metadataBase` and normalizes the empty path away. The two are the same URL
  per RFC 3986 and Google treats them identically, so `02.crawlability.spec.ts` asserts the canonical
  shares the site origin rather than pinning an exact string.

## Known App Issues Affecting This Suite

- **The web `Alert` wrapper matched button labels against hardcoded English.**
  `packages/app/src/@generic/components/alert/alert.web.ts` selected its confirm/cancel handlers with
  `button.text === 'OK'` / `button.text === 'Cancel'`, but every call site builds those labels with the
  Lingui `t` macro. In the six locales that translate "OK" (`ar`, `bn`, `hi`, `uk`, `ur`, `zh`) the
  lookup returned `undefined`, so accepting the browser `confirm()` ran no handler at all and quitting a
  game silently did nothing. The wrapper now selects by `AlertButton.style` (`'cancel'` versus the first
  non-cancel button), which is locale-independent. Because this suite pins `locale: 'en-US'`, the whole
  suite stayed green while the bug shipped — that is exactly why `10.localized-quit-game.spec.ts`
  overrides the locale.
- **`packages/app/src/selectors.ts` was missing an export.** `challenge-result-screen.selectors.ts`
  existed but was not re-exported from the barrel, so `ChallengeResultScreenSelectors` deep-imported
  as `undefined`. Added the missing `export *` line; this is a barrel-only change (no runtime
  behavior change) consistent with `tests/app-tests/AGENTS.md` Selector Rule 5.
- **Hint selectors were not barrel-exported.** `HintButtonSelectors`, `HintPanelSelectors` and
  `HintStepNarrationSelectors` exist under `packages/app/src/game/components/hint-*/`. Added the
  three missing `export *` lines to `packages/app/src/selectors.ts`, consistent with Selector Rule 5,
  and switched `09.hint-flow.spec.ts` from deep-importing the three `*.selectors.ts` files to the
  barrel import.
