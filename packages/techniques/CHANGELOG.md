# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.10.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v2.10.0...v2.10.1) (2026-08-30)

### Bug Fixes

- **app,field-core,techniques,landing:** rebuild hints around the reason a move works ([#382](https://github.com/vitalyiegorov/suuudokuuu/issues/382)) ([40518b2](https://github.com/vitalyiegorov/suuudokuuu/commit/40518b21b700d4ff4160607c36c376534fdeec9f))

# [2.9.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v2.8.0...v2.9.0) (2026-08-25)

### Features

- **landing:** technique hub and beginner technique pages with real solver worked examples ([74b7fc7](https://github.com/vitalyiegorov/suuudokuuu/commit/74b7fc7579a01b8c1735c969c5b5a1a6b2cf8231)), closes [#293](https://github.com/vitalyiegorov/suuudokuuu/issues/293)
- **puzzle-forge,techniques,app:** generate puzzles by required technique band ([7ed2e4f](https://github.com/vitalyiegorov/suuudokuuu/commit/7ed2e4fc5af62116ef90f69ae5560496d04ff1ab)), closes [#314](https://github.com/vitalyiegorov/suuudokuuu/issues/314)

# [2.6.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v2.5.1...v2.6.0) (2026-08-17)

### Bug Fixes

- **app:** classify bulk technique replays with the full registry ([4bb7108](https://github.com/vitalyiegorov/suuudokuuu/commit/4bb7108d6f2f637e42a61be1cc3117f283c55816))
- **techniques,rating:** make chain scan budgets transform-invariant and report search caps ([11e6225](https://github.com/vitalyiegorov/suuudokuuu/commit/11e62250ad273ce79ec0c27ac074013948b9eee7))
- **techniques:** apply the shortest chain first in X-Chain and XY-Chain results ([083fab0](https://github.com/vitalyiegorov/suuudokuuu/commit/083fab0fa7f65c7d1c055d4d6fd10877ee655d2f))

### Features

- **techniques,rating:** add BUG and Unique Rectangle detectors and raise the rating ceiling ([a4fe885](https://github.com/vitalyiegorov/suuudokuuu/commit/a4fe885c9c0cbd6ff3314c49b66b394cd8d67577)), closes [#276](https://github.com/vitalyiegorov/suuudokuuu/issues/276)
- **techniques,rating:** add shortest-chain search with length-based chain ratings ([48eca2e](https://github.com/vitalyiegorov/suuudokuuu/commit/48eca2e483aab2547c042eec265c2e979552fbdf)), closes [#277](https://github.com/vitalyiegorov/suuudokuuu/issues/277)
- **techniques,rating:** add the forcing-chain engine for the SE 8.0+ band ([c941530](https://github.com/vitalyiegorov/suuudokuuu/commit/c9415308d775484a29d19c8005811a7ce3064a3c)), closes [#278](https://github.com/vitalyiegorov/suuudokuuu/issues/278)
- **techniques:** add a logical-solve driver with persistent candidate state ([657eb36](https://github.com/vitalyiegorov/suuudokuuu/commit/657eb3647aace787de2a1dfb42769872f3006ae3)), closes [#268](https://github.com/vitalyiegorov/suuudokuuu/issues/268)

### Performance Improvements

- **app,encoder,techniques:** store per-move techniques and classify with an interactive ladder ([d19ac3e](https://github.com/vitalyiegorov/suuudokuuu/commit/d19ac3ea8dcbda9297636d609a0aa8d5a71a9782))

# [1.74.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.73.1...v1.74.0) (2026-08-01)

**Note:** Version bump only for package @suuudokuuu/techniques

## [1.68.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.68.0...v1.68.1) (2026-07-28)

### Bug Fixes

- **solver,app:** classify technique-enabled placements instead of Guess ([#229](https://github.com/vitalyiegorov/suuudokuuu/issues/229)) ([26a7981](https://github.com/vitalyiegorov/suuudokuuu/commit/26a7981d128e5861535bb1962039e22ed1bcc09a))

# [1.67.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.66.2...v1.67.0) (2026-07-26)

### Features

- **app,ui:** adaptive wide layout and responsive unistyles refactor ([#210](https://github.com/vitalyiegorov/suuudokuuu/issues/210)) ([23a9d56](https://github.com/vitalyiegorov/suuudokuuu/commit/23a9d56bff4abe41d6e19b910da5bb7cf13a450b))

## [1.66.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.66.1...v1.66.2) (2026-07-26)

**Note:** Version bump only for package @suuudokuuu/solver

# [1.66.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.65.0...v1.66.0) (2026-07-25)

### Features

- **app,solver:** challenge mode revamp with replay technique insights ([#135](https://github.com/vitalyiegorov/suuudokuuu/issues/135)) ([0d3dae6](https://github.com/vitalyiegorov/suuudokuuu/commit/0d3dae6ef2b7df10530932108381d71123d09a14))
