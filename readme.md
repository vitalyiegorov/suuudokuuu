[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://stand-with-ukraine.pp.ua)

# Suuudokuuu

An open-source Sudoku game for iOS, Android and the web, built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/). The app links to a donation page that supports Ukraine.

| [![Play in your browser](packages/app/assets/chrome.png)](https://www.suuudokuuu.com/) | [![Download on the App Store](packages/app/assets/appstore-badge.png)](https://apps.apple.com/app/suuudokuuu/id6449440933) | [![Get it on Google Play](packages/app/assets/google-play-badge.png)](https://play.google.com/store/apps/details?id=com.vitaliiyehorov.suuudokuuu) |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |

![Gameplay](packages/app/assets/gameplay.gif)

## Features

- **Seven difficulty tiers**: Newbie, Easy, Medium, Hard, Nightmare, Hell and Infinity. Each tier is defined by the solving techniques its puzzles need. Hell and Infinity come from bundled, verified puzzle collections.
- **A difficulty rating on every puzzle**, on the [Sudoku Explainer](https://www.suuudokuuu.com/guides/sudoku-difficulty-rating) scale.
- **Hints that teach**: a hint names the technique and walks through it step by step before it shows the answer.
- **Replay** of every finished game, move by move, with the techniques used.
- **Challenges**: share a puzzle and your recorded run as a link, and a friend plays the same grid against your time.
- **Daily puzzle** with a streak.
- **Import from a photo**: scan a printed puzzle with the camera, or pick a photo or screenshot. Recognition runs on the device and the image is not uploaded.
- **Themes**: built-in themes plus a theme editor, in light and dark.
- **13 languages**: Arabic, Bengali, Chinese, English, French, German, Hindi, Indonesian, Portuguese, Spanish, Swedish, Ukrainian and Urdu.
- **Offline play**: puzzles are generated on the device or taken from the bundled collections, and progress is stored locally.
- No ads and no account.

The website at [www.suuudokuuu.com](https://www.suuudokuuu.com/) also hosts guides such as [how to play](https://www.suuudokuuu.com/how-to-play), [solving techniques](https://www.suuudokuuu.com/techniques), [clues versus difficulty](https://www.suuudokuuu.com/guides/sudoku-clues-vs-difficulty) and [technique frequency by difficulty](https://www.suuudokuuu.com/guides/technique-frequency-by-difficulty).

## Quick start

Requirements: Node 26 (see [`.nvmrc`](.nvmrc)) and pnpm 12 (pinned in [`package.json`](package.json) `packageManager`).

```bash
pnpm install                               # also builds the workspace packages
pnpm --filter @suuudokuuu/app web          # the app in a browser
pnpm --filter @suuudokuuu/app ios          # or android; needs the native toolchain
pnpm --filter @suuudokuuu/landing start    # the website
```

Common root commands:

```bash
pnpm build          # build all packages (Turborepo)
pnpm test           # unit tests (Vitest)
pnpm format         # oxfmt
pnpm ts             # type check
pnpm lint           # type-aware oxlint
pnpm deadcode       # Knip
pnpm cpd            # copy-paste detection (jscpd)
pnpm i18n:sync      # extract and compile Lingui catalogs
```

Before you open a pull request, run the validation sequence from the repo root:

```bash
pnpm format && pnpm ts && pnpm lint && pnpm deadcode && pnpm cpd
```

Run `pnpm test` as well when you change behaviour, algorithms, serialization, persistence or scoring, and `pnpm i18n:check` when you change user-facing text.

## Packages

| Path                                                       | Purpose                                                                              |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`packages/app`](packages/app/AGENTS.md)                   | Expo game app: UI, routes, SQLite platform layers, app runtime                       |
| [`packages/ui`](packages/ui/AGENTS.md)                     | Shared React Native components, hooks and the theme contract                         |
| [`packages/progress`](packages/progress/AGENTS.md)         | Persisted SQL schema, migrations, repositories and player-progress services (Effect) |
| [`packages/landing`](packages/landing/AGENTS.md)           | Static Next.js content and SEO site for www.suuudokuuu.com                           |
| [`packages/generator`](packages/generator/AGENTS.md)       | Sudoku generation, gameplay state, navigation and scoring                            |
| [`packages/solver-core`](packages/solver-core)             | Shared solver contract, grid utilities and conformance helpers                       |
| [`packages/solver-dlx`](packages/solver-dlx)               | Dancing Links exact-cover solver                                                     |
| [`packages/solver-bitmask`](packages/solver-bitmask)       | Typed-array bitmask solver                                                           |
| [`packages/techniques`](packages/techniques/AGENTS.md)     | Solving-technique detection and the logical-solve driver                             |
| [`packages/rating`](packages/rating/AGENTS.md)             | Sudoku Explainer difficulty rating                                                   |
| [`packages/puzzle-forge`](packages/puzzle-forge/AGENTS.md) | Technique-aware puzzle sourcing per difficulty tier                                  |
| [`packages/field-core`](packages/field-core/AGENTS.md)     | Headless interactive field engine and technique step-script player                   |
| [`packages/field-dom`](packages/field-dom/AGENTS.md)       | React DOM board renderer                                                             |
| [`packages/encoder`](packages/encoder/AGENTS.md)           | Compact encoding of game state for share links and replays                           |
| [`packages/hell-corpus`](packages/hell-corpus)             | Bundled, verified Hell and Infinity puzzle corpora                                   |
| [`packages/grid-vision`](packages/grid-vision/AGENTS.md)   | On-device recognition of a Sudoku grid and its digits from an image                  |
| [`tests/test-kit`](tests/test-kit)                         | Shared Vitest config and in-memory SQLite test harness                               |
| [`tests/app-tests`](tests/app-tests/AGENTS.md)             | Store screenshot and app preview capture, and the E2E database fixtures              |
| [`tests/web-tests`](tests/web-tests/AGENTS.md)             | Playwright E2E tests against the Expo web export                                     |
| [`e2e`](e2e/AGENTS.md)                                     | iOS and Android E2E suite (standalone npm project, not a pnpm workspace)             |

Each linked `AGENTS.md` describes that package's rules and structure. The root [`AGENTS.md`](AGENTS.md) holds the engineering rules for the whole repo.

## Continuous integration and releases

- **Pull requests** ([`pr.yml`](.github/workflows/pr.yml)) run formatting, type checks, lint, dead-code and copy-paste detection, unit tests and a Lingui catalog check. When a change can affect the app, they also run mobile and web E2E and publish a Vercel web preview and an EAS Update preview. The PR title must follow [Conventional Commits](https://www.conventionalcommits.org/) ([`pr-title.yml`](.github/workflows/pr-title.yml)).
- **Merges to `main`** ([`main.yml`](.github/workflows/main.yml)) sync the Lingui catalogs, run `pnpm release` (Lerna bumps versions from the commit history, writes the changelog and creates a GitHub release) and deploy the web app and the website to Vercel.
- **Store builds** ([`native-publish.yml`](.github/workflows/native-publish.yml), manual) build the released version with EAS and upload it to App Store Connect and the Google Play internal track, together with the store metadata from [`packages/app/fastlane`](packages/app/fastlane).
- **Store release** ([`store-release.yml`](.github/workflows/store-release.yml), manual, dry run by default) submits the iOS build for App Review and promotes the Android build from internal to production.
- **Over-the-air updates** ([`ota-production.yml`](.github/workflows/ota-production.yml), manual, dry run by default) publish an EAS Update to the production channel only when the last store build has the same runtime version.

## Contributing

Bug reports, ideas and pull requests are welcome in [GitHub issues](https://github.com/vitalyiegorov/suuudokuuu/issues). Read the root [`AGENTS.md`](AGENTS.md) and the `AGENTS.md` of every package you touch, use Conventional Commits for commit messages and PR titles, and run the validation sequence above before you push.

To report a security issue, follow [`SECURITY.md`](SECURITY.md).

## Acknowledgements

Our Hell and Infinity difficulty levels stand on data curated by the wider Sudoku community over many years. Huge thanks to:

- [t-dillon/tdoku](https://github.com/t-dillon/tdoku) for the `puzzles2_17_clue` dataset (BSD 2-Clause licensed) behind our Hell-difficulty corpus, and to **Gordon Royle** of the University of Western Australia, who originally compiled the 17-clue collection; it was later completed and proven exhaustive by `champagne`, `blue`, and other members of the [Enjoy Sudoku forum](http://forum.enjoysudoku.com/).
- The [Enjoy Sudoku forum](http://forum.enjoysudoku.com/) community and `champagne`, who compiled the "hardest sudokus" database behind most of our Infinity-difficulty corpus.
- **Arto Inkala**, creator of Everest and AI Escargot, and the Enjoy Sudoku forum authors behind Golden Nugget, Kolk, Patience, Discrepancy, Fata Morgana, Cigarette, Imam Bayildi, Red Dwarf, Second Flush, Silver Plate, First Peak, and Platinum Blonde, the named world-record puzzles that round out our Infinity level.
- **Nicolas Juillerat**, creator of Sudoku Explainer, and the Enjoy Sudoku forum's Patterns Game community, whose SE rating methodology our difficulty scale follows.

## License

Suuudokuuu is licensed under the [O'SAASY License](LICENSE): an MIT-style license with one condition, that you may not offer the Software itself as a competing hosted or SaaS product. Learn more at [osaasy.dev](https://osaasy.dev).
