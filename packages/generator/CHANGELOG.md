# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.44.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.43.0...v1.44.0) (2025-09-24)

### Features

- expo 54 migration ([#102](https://github.com/vitalyiegorov/suuudokuuu/issues/102)) ([52c26a9](https://github.com/vitalyiegorov/suuudokuuu/commit/52c26a93541a9e8d7b464894119376b0953495dd))

# [1.43.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.42.0...v1.43.0) (2025-09-17)

### Features

- **app:** refactor game and history state, add solution steps ([05f8983](https://github.com/vitalyiegorov/suuudokuuu/commit/05f898307e04b697f4ffce2e7f64bee26b7546b4))
- **app:** refactor game and history state, add solution steps ([30688f8](https://github.com/vitalyiegorov/suuudokuuu/commit/30688f8d9dc69e699f2db31409d23ea379f910fd))

### Performance Improvements

- **generator:** limit DLX solver unique solutions count ([cbd0dc2](https://github.com/vitalyiegorov/suuudokuuu/commit/cbd0dc25a406b3aa48e6d093861c0b0c9c47e779))

# [1.33.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.32.1...v1.33.0) (2025-07-28)

### Features

- **app,generator:** avoid passing solved puzzle as string ([c456d7a](https://github.com/vitalyiegorov/suuudokuuu/commit/c456d7a760be20ceb35601263dbc60f59a2b6027))
- **generator:** fix tests ([dd5257a](https://github.com/vitalyiegorov/suuudokuuu/commit/dd5257a4504b9ea289711b700c9eef3313901854))

# [1.23.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.8...v1.23.0) (2025-07-22)

### Features

- **app,generator:** added candidate mode ([e064aa4](https://github.com/vitalyiegorov/suuudokuuu/commit/e064aa4f978975a9f6375a157e25477a030af85f))

## [1.22.8](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.7...v1.22.8) (2025-07-22)

**Note:** Version bump only for package @suuudokuuu/generator

## [1.22.7](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.6...v1.22.7) (2025-07-22)

### Bug Fixes

- correct failing test in sudoku-navigation.spec.ts ([0929507](https://github.com/vitalyiegorov/suuudokuuu/commit/09295074816cdd04ac96a90f437379b58889dcc7))
- resolve TypeScript compilation errors in sudoku-navigation.spec.ts ([4016a03](https://github.com/vitalyiegorov/suuudokuuu/commit/4016a0303cbe1597e163775d70b45779459abba4))

## [1.22.5](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.4...v1.22.5) (2025-07-22)

**Note:** Version bump only for package @suuudokuuu/generator

## [1.22.3](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.2...v1.22.3) (2025-07-21)

### Bug Fixes

- **app:** fix text animation ([e182ad6](https://github.com/vitalyiegorov/suuudokuuu/commit/e182ad62f9ec4924d9400fbb44d2852f9561b11f))
- **generator:** replace protected config access with defaultSudokuConfig in tests ([c789b26](https://github.com/vitalyiegorov/suuudokuuu/commit/c789b26bc58646b6f11d6d8b0369a7e2f21ad9d1))
- isCellWrong test to ensure wrong value is actually different from correct value ([3060eae](https://github.com/vitalyiegorov/suuudokuuu/commit/3060eae1ab2d1da3c6e9f61d738c487955c43df4))
- **tests:** resolve ESLint failures in sudoku.spec.ts ([1e2307a](https://github.com/vitalyiegorov/suuudokuuu/commit/1e2307a7a68d7a1db477342fb9dad27b670dbb5c))

## [1.22.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.0...v1.22.1) (2025-07-21)

### Bug Fixes

- **generator:** fix possible/available values calculation ([0d177a4](https://github.com/vitalyiegorov/suuudokuuu/commit/0d177a49f76c8b0ecf8fdcb7a7d5796075660fb5))

# [1.22.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.21.0...v1.22.0) (2025-07-20)

### Features

- **app,generator:** implement keyboard controls ([787c478](https://github.com/vitalyiegorov/suuudokuuu/commit/787c4782ce1cf7793fc95ceac268bb1800bdc430))
- **app,generator:** implement keyboard controls ([360e4a8](https://github.com/vitalyiegorov/suuudokuuu/commit/360e4a8f4036522f21bd5a558b99f4beab2cb1fd))

# [1.21.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.20.3...v1.21.0) (2025-07-20)

### Features

- **generator:** added DLX algorithm ([3803c16](https://github.com/vitalyiegorov/suuudokuuu/commit/3803c16fe60d745a7c9e7eabfcd83cb41e96a8d3))
- **generator:** added DLX algorithm ([19b579b](https://github.com/vitalyiegorov/suuudokuuu/commit/19b579be201770e74d6383502df34d40674ed59c))
- **generator:** added DLX algorithm ([f0ac98f](https://github.com/vitalyiegorov/suuudokuuu/commit/f0ac98fa57c6896752935d23d97277fab0215c1b))
- **generator:** added DLX algorithm ([0df8247](https://github.com/vitalyiegorov/suuudokuuu/commit/0df82474824c3e9e88a03e0c1c872bf80378c2ce))
- **generator:** added DLX algorithm ([112455a](https://github.com/vitalyiegorov/suuudokuuu/commit/112455a8f41305cf1e95d4f0efbc25febcce982f))
- **generator:** added DLX algorithm ([280acef](https://github.com/vitalyiegorov/suuudokuuu/commit/280acef19a19140f230863c0cd1fd58eef4220f5))
- **generator:** added DLX algorithm ([32958c0](https://github.com/vitalyiegorov/suuudokuuu/commit/32958c0c60ee7e702df683f6b16d98e84fe00bad))
- **generator:** added DLX algorithm ([11a1223](https://github.com/vitalyiegorov/suuudokuuu/commit/11a122388fe3cee3c05b06b83e8dac7a5e9fd34a))
- **generator:** added DLX algorithm ([f8dbcfa](https://github.com/vitalyiegorov/suuudokuuu/commit/f8dbcfa07112f89881ceace29b037bd4e6baa9cb))
- **generator:** added DLX algorithm ([53f443d](https://github.com/vitalyiegorov/suuudokuuu/commit/53f443dea1c672ebb2d2848f3d876b6590fd6a95))
- **generator:** added DLX algorithm ([ef18c23](https://github.com/vitalyiegorov/suuudokuuu/commit/ef18c239c838f68ab3a1d8213672e4466a217f7a))
- **generator:** added DLX algorithm ([34af3a1](https://github.com/vitalyiegorov/suuudokuuu/commit/34af3a1e0171475479d1e6ee52c1581631e05ff8))
- **generator:** added DLX algorithm ([a45f48d](https://github.com/vitalyiegorov/suuudokuuu/commit/a45f48d086503a6555ae89fc8308be45f3123115))
- **generator:** added DLX algorithm ([a57c56d](https://github.com/vitalyiegorov/suuudokuuu/commit/a57c56d5950c91e52799593be2d6c0ab1fbf791a))

## [1.20.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.20.1...v1.20.2) (2025-07-20)

**Note:** Version bump only for package @suuudokuuu/generator

## [1.20.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.20.0...v1.20.1) (2025-07-20)

**Note:** Version bump only for package @suuudokuuu/generator

# [1.20.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.19.0...v1.20.0) (2025-07-20)

**Note:** Version bump only for package @suuudokuuu/generator

# [1.19.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.18.5...v1.19.0) (2025-07-20)

**Note:** Version bump only for package @suuudokuuu/generator

## [1.18.5](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.18.4...v1.18.5) (2025-07-20)

**Note:** Version bump only for package @suuudokuuu/generator

## [1.18.4](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.18.3...v1.18.4) (2025-07-20)

**Note:** Version bump only for package @suuudokuuu/generator

## [1.18.3](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.18.2...v1.18.3) (2025-07-20)

**Note:** Version bump only for package @suuudokuuu/generator

## [1.18.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.18.1...v1.18.2) (2025-07-20)

**Note:** Version bump only for package @suuudokuuu/generator
