# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.2.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v2.2.0...v2.2.1) (2026-08-08)

**Note:** Version bump only for package @suuudokuuu/root

# [2.2.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v2.1.2...v2.2.0) (2026-08-08)

### Features

- **app:** add contextual replay sharing and a touch-draggable step scrubber ([#258](https://github.com/vitalyiegorov/suuudokuuu/issues/258)) ([7e09a48](https://github.com/vitalyiegorov/suuudokuuu/commit/7e09a48124cb1e0f8d5389128e16e43af4aeaddd))

## [2.1.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v2.1.1...v2.1.2) (2026-08-06)

### Bug Fixes

- **app:** use standard game actions header on the replay screen ([#254](https://github.com/vitalyiegorov/suuudokuuu/issues/254)) ([cd8030f](https://github.com/vitalyiegorov/suuudokuuu/commit/cd8030fd5d214f57898c4fcb3bc3b4f78ee6f69a))

## [2.1.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.74.5...v2.1.1) (2026-08-05)

### Bug Fixes

- **app:** repair the store metadata push for both stores ([#252](https://github.com/vitalyiegorov/suuudokuuu/issues/252)) ([080620f](https://github.com/vitalyiegorov/suuudokuuu/commit/080620f296409cc30a0d6e6a72de98bba8c8ba02))

## [1.74.5](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.74.4...v1.74.5) (2026-08-05)

### Bug Fixes

- **app:** target the released version when pushing store metadata ([#251](https://github.com/vitalyiegorov/suuudokuuu/issues/251)) ([b99b094](https://github.com/vitalyiegorov/suuudokuuu/commit/b99b094db6d88d0c95afb365ce2f8203e9515bda))

## [1.74.4](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.74.3...v1.74.4) (2026-08-05)

**Note:** Version bump only for package @suuudokuuu/root

## [1.74.3](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.74.2...v1.74.3) (2026-08-05)

### Bug Fixes

- **app:** patch unistyles shadow tree use-after-free crash ([#248](https://github.com/vitalyiegorov/suuudokuuu/issues/248)) ([1c2035e](https://github.com/vitalyiegorov/suuudokuuu/commit/1c2035edc61d975d9ec58a7e8cdfbd1d13de8c9c)), closes [jpudysz/react-native-unistyles#1191](https://github.com/jpudysz/react-native-unistyles/issues/1191) [jpudysz/react-native-unistyles#1217](https://github.com/jpudysz/react-native-unistyles/issues/1217) [#1179](https://github.com/vitalyiegorov/suuudokuuu/issues/1179)

## [1.74.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.74.1...v1.74.2) (2026-08-04)

### Bug Fixes

- **app,ui:** restore themes page, polish web sheet, add store listing automation ([#246](https://github.com/vitalyiegorov/suuudokuuu/issues/246)) ([9ff5485](https://github.com/vitalyiegorov/suuudokuuu/commit/9ff54850a28cbfd852fb2f2d4bdeaa7376ff677b))

## [1.74.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.74.0...v1.74.1) (2026-08-02)

### Bug Fixes

- **app:** block restricted media permissions in the Android manifest ([1ad1146](https://github.com/vitalyiegorov/suuudokuuu/commit/1ad1146ef033d5ab09734c5ec9b2ffaf48b1ac61))

# [1.74.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.73.1...v1.74.0) (2026-08-01)

### Bug Fixes

- **app,generator:** close per-file coverage gaps in difficulty helpers ([f3b1770](https://github.com/vitalyiegorov/suuudokuuu/commit/f3b1770198e68aa9f5641cfdf2701c155bf33daa))
- **app:** resolve the ember static glow unistyle for reduced motion ([e6ac2c3](https://github.com/vitalyiegorov/suuudokuuu/commit/e6ac2c3719ea96cc500637eb26e81dee51c60d45))
- **app:** score with the authoritative stored difficulty ([3e2374f](https://github.com/vitalyiegorov/suuudokuuu/commit/3e2374fcd21a73a474530705f1f25d43d1726ad7))
- **app:** trigger Hell refill at the low-water mark ([17c3d12](https://github.com/vitalyiegorov/suuudokuuu/commit/17c3d12d42408f4456941a442275acdb59fdc602))
- **generator:** handle degenerate walk states in HellGenerator cell selection ([45e9ffa](https://github.com/vitalyiegorov/suuudokuuu/commit/45e9ffa2109e01220223f9fe9b1a260e3072b73d))
- **generator:** make HellGenerator digit-assignment failure explicit ([631e3ee](https://github.com/vitalyiegorov/suuudokuuu/commit/631e3eef3395f2c02c23520406ed4a58f38ec19a))
- **solver-core:** validate digit range and tighten coverage gate ([40c0aa4](https://github.com/vitalyiegorov/suuudokuuu/commit/40c0aa462ee1ff569cd8a33a05e41a4c9a75e315))
- **solver-dlx:** cap countSolutions at the requested limit ([b2afeea](https://github.com/vitalyiegorov/suuudokuuu/commit/b2afeeacfee7cea1eec86e2acd9307359dd384fb))

### Features

- **app:** add guarded E2E seeding hook for the Hell queue ([1eea69d](https://github.com/vitalyiegorov/suuudokuuu/commit/1eea69d544e8eddccbddbd4252682bfda0f16230))
- **app:** add Hell difficulty Home card with queued puzzle consumption ([b65d3e4](https://github.com/vitalyiegorov/suuudokuuu/commit/b65d3e49ca1745e2d0750726268e752a45ed9787))
- **app:** add Hell queue technique gate and background refill worker ([5d84b1c](https://github.com/vitalyiegorov/suuudokuuu/commit/5d84b1c4a7d7b51c8c96b09fadbb59908841dc32))
- **app:** add Hell scoring, history plumbing, and persisted hell queue ([640f67c](https://github.com/vitalyiegorov/suuudokuuu/commit/640f67c6477c70b9fac5cc4ea613387ce3d3480f))
- **app:** add Hell to the difficulty slider with an ember start button ([f52045c](https://github.com/vitalyiegorov/suuudokuuu/commit/f52045c87b522246a66a48e6db1e7e5c2a7cb6d9))
- **app:** refine the Hell start button with a gradient ember treatment ([be6cd05](https://github.com/vitalyiegorov/suuudokuuu/commit/be6cd052a88863668b8bee7222cccf721db0be94))
- **generator:** add Hell difficulty enum and blank-cell threshold ([7c9b8b7](https://github.com/vitalyiegorov/suuudokuuu/commit/7c9b8b7e033ff3ec9345dded8b08be65dce6522c))
- **generator:** add HellGenerator minimal-puzzle neighborhood walk ([881151c](https://github.com/vitalyiegorov/suuudokuuu/commit/881151c30afce3d4b37a8facfe2829c2ce1396b3))
- **generator:** add solved-grid fill and minimal-puzzle reduction utilities ([1a663e0](https://github.com/vitalyiegorov/suuudokuuu/commit/1a663e00e913661c6a79ce9dde7e314130a6c789))
- **hell-corpus:** bundle the verified 49158-puzzle 17-clue corpus ([ec73c3f](https://github.com/vitalyiegorov/suuudokuuu/commit/ec73c3ff731c3f8fec25843f277cc2e4151ff823))
- **hell-corpus:** scaffold package with decoder, isomorphism transform, and build CLI ([2194420](https://github.com/vitalyiegorov/suuudokuuu/commit/21944205a9ebdfa76520cb1a3d298cb7e51f3c5a))
- **solver-bitmask:** add typed-array MRV solver with singles propagation ([b210dc4](https://github.com/vitalyiegorov/suuudokuuu/commit/b210dc4d07d4bcaf1e22472df4ed382ccd33e185))
- **solver-core:** add conformance cases and differential-test helpers ([9588b6d](https://github.com/vitalyiegorov/suuudokuuu/commit/9588b6d69480c41afdc558bf3cf6e2b17e6eca63))
- **solver-core:** add machine-solver contract, grid utils, and seeded PRNG ([345d455](https://github.com/vitalyiegorov/suuudokuuu/commit/345d45531260461f2953049d75f68355a84d2001))

### Performance Improvements

- **generator:** adopt benchmark-selected bitmask solver engine ([1fce3b6](https://github.com/vitalyiegorov/suuudokuuu/commit/1fce3b628d998bebe025b315ae0e43d2c164140e))
- **solver-bitmask:** remove per-call allocations from grid-state hot paths ([ada2818](https://github.com/vitalyiegorov/suuudokuuu/commit/ada2818537dd3f5ada0b51e75f02ac20f7906794))

## [1.73.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.73.0...v1.73.1) (2026-08-01)

**Note:** Version bump only for package @suuudokuuu/root

# [1.73.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.72.0...v1.73.0) (2026-08-01)

### Bug Fixes

- **app:** skip the native screenshot listener on web ([bcd6b80](https://github.com/vitalyiegorov/suuudokuuu/commit/bcd6b806f4bbb238143abc13d09cc4dbdbc1d102))

### Features

- **app:** celebrate game wins with a reanimated CSS confetti burst ([b07a32f](https://github.com/vitalyiegorov/suuudokuuu/commit/b07a32fc3d5da9f1ef7456e4b8e8464f6c4d5649))

# [1.72.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.71.1...v1.72.0) (2026-07-31)

### Features

- **app:** bump the custom theme schema to v2 with a persist migration ([b39caaa](https://github.com/vitalyiegorov/suuudokuuu/commit/b39caaa7e529a0f71b4d2d4a0f2dfc4c51aac944))

## [1.71.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.71.0...v1.71.1) (2026-07-31)

### Bug Fixes

- **app:** use explicit ESM import extensions in Vercel beta functions ([4abefc8](https://github.com/vitalyiegorov/suuudokuuu/commit/4abefc8d35f69fc0a1b83b62e83711661e34fccb))

# [1.71.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.70.2...v1.71.0) (2026-07-31)

### Bug Fixes

- **app:** calibrate contrast minimums against all theme presets ([47f4e95](https://github.com/vitalyiegorov/suuudokuuu/commit/47f4e950fe9363c4d5fad5b4b05f94a3e03d1645))
- **app:** correct colorful dark overlay inversion and highlight contrast ([62ab280](https://github.com/vitalyiegorov/suuudokuuu/commit/62ab280d526acf680a27ca94df941508fa1f3b2e))
- **app:** keep theme rows stable and anchor editor actions in footer ([1e51b2c](https://github.com/vitalyiegorov/suuudokuuu/commit/1e51b2cab43277e4571750de68c288420d558042))
- **app:** parse uppercase rgb color strings ([830690d](https://github.com/vitalyiegorov/suuudokuuu/commit/830690dafeea9c73bb88b1f43325dd2804f31814))
- **app:** render themes pages with collapsible page chrome ([fdb659f](https://github.com/vitalyiegorov/suuudokuuu/commit/fdb659fda1bdbd8b01607c7ce12fb3ec316d22ec))

### Features

- **app:** add color string parsing utility ([db93e54](https://github.com/vitalyiegorov/suuudokuuu/commit/db93e5477f15e7059d14876955ac739efba7c67b))
- **app:** add contrast validation for custom theme colors ([5d09e3a](https://github.com/vitalyiegorov/suuudokuuu/commit/5d09e3aafe3a1029cc25630305587a6212ccece4))
- **app:** add custom theme editor screen ([e24cef2](https://github.com/vitalyiegorov/suuudokuuu/commit/e24cef2761adfdbbc1f53071ccc23bc73462113e))
- **app:** add custom theme id type and type guard ([1b7fa5c](https://github.com/vitalyiegorov/suuudokuuu/commit/1b7fa5c9e954b23fa2a8d4ed9612df42d4aff680))
- **app:** add custom themes slice with factory utilities ([552657d](https://github.com/vitalyiegorov/suuudokuuu/commit/552657d852cf8e622f604c8ba5db81cd4b82b4e3))
- **app:** add live theme preview board ([97b0716](https://github.com/vitalyiegorov/suuudokuuu/commit/97b0716fe1b6cf8c29c02c2fd901391d4a3140f3))
- **app:** add theme editor color row and picker sheet ([1712f80](https://github.com/vitalyiegorov/suuudokuuu/commit/1712f80a42598539ffd933822822f2a9d110ffb7))
- **app:** add theme editor token descriptors and labels ([ce194ef](https://github.com/vitalyiegorov/suuudokuuu/commit/ce194ef6ec63a743725bc30793140bdc52ae9864))
- **app:** add themes list page with preset and custom sections ([de950a0](https://github.com/vitalyiegorov/suuudokuuu/commit/de950a03064ef21dbdb2d2a7c3e115e872a0eb40))
- **app:** add unistyles custom theme slots with runtime application ([2c9479e](https://github.com/vitalyiegorov/suuudokuuu/commit/2c9479e16ce3a45a49c00115593ae4999ad24927))
- **app:** add versioned custom theme schema and interface ([705ac42](https://github.com/vitalyiegorov/suuudokuuu/commit/705ac42df98236f203905ab0593f5830ec59dc49))
- **app:** add WCAG contrast ratio and alpha compositing utilities ([50fb38a](https://github.com/vitalyiegorov/suuudokuuu/commit/50fb38afd56aa298a9f689842eb8c7a849dd6b93))
- **app:** expose validated runtime brand configuration with docs ([062ee0c](https://github.com/vitalyiegorov/suuudokuuu/commit/062ee0ce4731c19310a896902b308f3c40b83294))
- **app:** persist custom themes with redux-persist migration v29 ([1342966](https://github.com/vitalyiegorov/suuudokuuu/commit/13429663c8586b723d302c41b27db2ca968d476b))
- **app:** polish themes page with active highlight and sticky create button ([a8b0cc3](https://github.com/vitalyiegorov/suuudokuuu/commit/a8b0cc363939057dc6dd7070d931bc453068eac9))
- **app:** resolve custom themes in theme provider ([7025b90](https://github.com/vitalyiegorov/suuudokuuu/commit/7025b9062b9a80e259d62690c7eb7086bc54ff45))
- **app:** route theme setting to the new themes page ([365d011](https://github.com/vitalyiegorov/suuudokuuu/commit/365d011cb166c76274cedcc96088f7045ea489f3))
- **app:** seed initial theme from brand configuration ([6dc8c38](https://github.com/vitalyiegorov/suuudokuuu/commit/6dc8c38e47b9e6b471c286edfae859a34cbd1d57))
- **app:** unify theme row actions into a pencil icon button ([9fe6006](https://github.com/vitalyiegorov/suuudokuuu/commit/9fe6006714ec64ecf630a99613a4bdbc58a35d05))
- **app:** widen theme setting to support custom theme ids ([e96c053](https://github.com/vitalyiegorov/suuudokuuu/commit/e96c0534529ee03277406e1ddf4f3885c4a4df03))

## [1.70.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.70.1...v1.70.2) (2026-07-30)

### Bug Fixes

- **app,ui:** gate the wide layout by aspect ratio instead of a viewport height cap ([79c17a0](https://github.com/vitalyiegorov/suuudokuuu/commit/79c17a0a81de2646cae92748b9a705539903cb29))

## [1.70.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.70.0...v1.70.1) (2026-07-30)

### Bug Fixes

- **app:** align the landscape side panel and keep the challenge HUD out of the board row ([#235](https://github.com/vitalyiegorov/suuudokuuu/issues/235)) ([25aac67](https://github.com/vitalyiegorov/suuudokuuu/commit/25aac67e481717d5fc587dd4679729d6b6bbce35))
- **app:** force a UTF-8 locale for native builds ([#234](https://github.com/vitalyiegorov/suuudokuuu/issues/234)) ([8de04fb](https://github.com/vitalyiegorov/suuudokuuu/commit/8de04fbfa66e8bb861eedfad8272c9c4bf59bb1d))

# [1.70.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.69.2...v1.70.0) (2026-07-29)

### Features

- **app,encoder:** unify challenge run analytics into stat tiles ([#233](https://github.com/vitalyiegorov/suuudokuuu/issues/233)) ([9d24d80](https://github.com/vitalyiegorov/suuudokuuu/commit/9d24d80b7ec88dbd0c44c7485ad35eaae4f74e7a))

## [1.69.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.69.1...v1.69.2) (2026-07-29)

### Bug Fixes

- **app:** preserve the complete game setup when playing again ([#231](https://github.com/vitalyiegorov/suuudokuuu/issues/231)) ([4779504](https://github.com/vitalyiegorov/suuudokuuu/commit/47795042002038f66092d1e0ea2d876d04787fec))

## [1.69.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.69.0...v1.69.1) (2026-07-29)

### Bug Fixes

- **app,ui:** make game generation single-flight across start and retry actions ([#232](https://github.com/vitalyiegorov/suuudokuuu/issues/232)) ([90881f2](https://github.com/vitalyiegorov/suuudokuuu/commit/90881f2691593d87a091c6ed39bdbfbcaeee25b5)), closes [#224](https://github.com/vitalyiegorov/suuudokuuu/issues/224)

# [1.69.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.68.1...v1.69.0) (2026-07-29)

### Features

- **app:** show a recorded challenge summary before sharing ([#230](https://github.com/vitalyiegorov/suuudokuuu/issues/230)) ([7f7c18e](https://github.com/vitalyiegorov/suuudokuuu/commit/7f7c18ee987b8fea17d944b30501c88c93782d79))

## [1.68.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.68.0...v1.68.1) (2026-07-28)

### Bug Fixes

- **solver,app:** classify technique-enabled placements instead of Guess ([#229](https://github.com/vitalyiegorov/suuudokuuu/issues/229)) ([26a7981](https://github.com/vitalyiegorov/suuudokuuu/commit/26a7981d128e5861535bb1962039e22ed1bcc09a))

# [1.68.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.67.0...v1.68.0) (2026-07-27)

### Features

- **app,encoder:** fair challenge mode with a typed timeline and recorded background events ([#222](https://github.com/vitalyiegorov/suuudokuuu/issues/222)) ([9619f27](https://github.com/vitalyiegorov/suuudokuuu/commit/9619f27326eb4d5d6008c7ad6f97d472b2631a00))

# [1.67.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.66.2...v1.67.0) (2026-07-26)

### Features

- **app,ui:** adaptive wide layout and responsive unistyles refactor ([#210](https://github.com/vitalyiegorov/suuudokuuu/issues/210)) ([23a9d56](https://github.com/vitalyiegorov/suuudokuuu/commit/23a9d56bff4abe41d6e19b910da5bb7cf13a450b))

## [1.66.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.66.1...v1.66.2) (2026-07-26)

**Note:** Version bump only for package @suuudokuuu/root

## [1.66.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.66.0...v1.66.1) (2026-07-25)

**Note:** Version bump only for package @suuudokuuu/root

# [1.66.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.65.0...v1.66.0) (2026-07-25)

### Features

- **app,solver:** challenge mode revamp with replay technique insights ([#135](https://github.com/vitalyiegorov/suuudokuuu/issues/135)) ([0d3dae6](https://github.com/vitalyiegorov/suuudokuuu/commit/0d3dae6ef2b7df10530932108381d71123d09a14))

# [1.65.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.64.0...v1.65.0) (2026-07-21)

### Bug Fixes

- **app:** drop deleted field-cell.selectors from the barrel + doc ([3066b5f](https://github.com/vitalyiegorov/suuudokuuu/commit/3066b5fcca0d582f809431559ae7be8d031263b2))
- binderfs kernels expose no host /dev/binder; check the module instead ([09452ef](https://github.com/vitalyiegorov/suuudokuuu/commit/09452efba5934f3f977071131c09181bb0be9670))
- **lint:** exclude testID from lingui unlocalized-strings check ([67c66e1](https://github.com/vitalyiegorov/suuudokuuu/commit/67c66e1702e030003594a26e2fa24e79f6e4d278))
- pin redroid to 15.0.0_64only - the tag verified against kernel 6.17 ([8f4091d](https://github.com/vitalyiegorov/suuudokuuu/commit/8f4091d1e1a58d050824e1d984854bc443ca3f5d))
- tolerate sdkmanager license SIGPIPE under pipefail ([5879ec0](https://github.com/vitalyiegorov/suuudokuuu/commit/5879ec001f2d27097f2122d20598a66d09baea59))
- use distro cmake/ninja on arm64 and bake the NDK into the base ([8c1b1f8](https://github.com/vitalyiegorov/suuudokuuu/commit/8c1b1f855712d56755b563c9ff56c8f48fd83e1b))
- use the Android application id for Maestro launches ([446d389](https://github.com/vitalyiegorov/suuudokuuu/commit/446d3891b92ccdefbbcfaf0a54c6a004391bcd15))

### Features

- **app:** stable per-cell and per-value E2E testIDs ([cd0a531](https://github.com/vitalyiegorov/suuudokuuu/commit/cd0a531566b230dedb24c1f868d6afb630cac27c))

# [1.64.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.63.0...v1.64.0) (2026-07-20)

### Bug Fixes

- **deps:** repair truncated expo-blur lockfile checksum ([97ad427](https://github.com/vitalyiegorov/suuudokuuu/commit/97ad427830d4ae0ea5e604d0a08a630b19100ef5))

### Features

- **app:** show challenge opponent attempts ([d6af397](https://github.com/vitalyiegorov/suuudokuuu/commit/d6af397441ef0b899c5b45e0c956da5422fff768))
- **ci:** Android Maestro on the macOS maestro runners ([c72771d](https://github.com/vitalyiegorov/suuudokuuu/commit/c72771d017d360d4452b04c408ea7e0f3eda2732)), closes [tart-runner-fleet#70](https://github.com/tart-runner-fleet/issues/70)

# [1.63.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.62.5...v1.63.0) (2026-07-17)

### Bug Fixes

- **app:** align development release metadata ([a8105d4](https://github.com/vitalyiegorov/suuudokuuu/commit/a8105d4dbf5672b70290f6e20f6a0a3ca5e3b6ac))
- **app:** bind OTA manifest to development build ([35fbc0c](https://github.com/vitalyiegorov/suuudokuuu/commit/35fbc0c8e806a8ab5aa45bde0c724cc5fc7084a7))
- **app:** bound development release resolution ([f52e867](https://github.com/vitalyiegorov/suuudokuuu/commit/f52e867557e3acf23fe8022ece7a021052fad64a))
- **app:** bound development release responses ([77649cf](https://github.com/vitalyiegorov/suuudokuuu/commit/77649cf68d9feaf69408452f9790007a98d71a16))
- **app:** clarify beta installation guidance ([72b29de](https://github.com/vitalyiegorov/suuudokuuu/commit/72b29de37cf4b819a9d9f1a7afa97c2f9304642b))
- **app:** preserve beta guidance translation ([41b1130](https://github.com/vitalyiegorov/suuudokuuu/commit/41b1130faa87d7fc64aa3379b793537f6f3a6671))
- **app:** preserve verified iOS build identity ([10a0a88](https://github.com/vitalyiegorov/suuudokuuu/commit/10a0a8828c989e72a51fcff2db7bbfef3b8d6255))
- close PR CI gating gaps ([f5e29ed](https://github.com/vitalyiegorov/suuudokuuu/commit/f5e29ed27bc080470a370cd691fac9fbd6c8ca48))
- make development release publishing retry-safe ([510135b](https://github.com/vitalyiegorov/suuudokuuu/commit/510135b7c7908a4c92662b4c84918ee476fee767))
- make development release reconciliation atomic ([93f9178](https://github.com/vitalyiegorov/suuudokuuu/commit/93f9178eff75d145c7fb9620d1b11ddab00dcb80))
- make development releases append-only ([dc829d9](https://github.com/vitalyiegorov/suuudokuuu/commit/dc829d929a73ae6648fce17bcfa8abb45b5ef2b6))
- protect development release retention ([a61c661](https://github.com/vitalyiegorov/suuudokuuu/commit/a61c6616ca888bd7c9316fdf7e753c26c28753d4))
- prune global development release history ([2e7c176](https://github.com/vitalyiegorov/suuudokuuu/commit/2e7c176669740c7384d8c8ef35a3522e1e26dd3d))
- verify development release provenance ([4b05bd9](https://github.com/vitalyiegorov/suuudokuuu/commit/4b05bd924dd61312bebea19d4a8eba1a847acaae))

### Features

- **app:** add development build install page ([9c8d534](https://github.com/vitalyiegorov/suuudokuuu/commit/9c8d5346f5ce3c2be47382c3d7381cf84c0d0455))
- **app:** add development build OTA route ([feae55b](https://github.com/vitalyiegorov/suuudokuuu/commit/feae55b66a38b948025786bfefb5bc5cfd5f3aab))
- **app:** resolve development releases ([c128b62](https://github.com/vitalyiegorov/suuudokuuu/commit/c128b62081fd4f75633ca2369d8f585bdce4f269))
- **app:** serve beta distribution endpoints ([7e3ab03](https://github.com/vitalyiegorov/suuudokuuu/commit/7e3ab0361b73eefd8eccc72b42efa607ec68c343))

## [1.62.5](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.62.4...v1.62.5) (2026-07-12)

**Note:** Version bump only for package @suuudokuuu/root

## [1.62.4](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.62.3...v1.62.4) (2026-07-11)

**Note:** Version bump only for package @suuudokuuu/root

## [1.62.3](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.62.2...v1.62.3) (2026-07-11)

### Bug Fixes

- **app:** expose game controls to ui tests ([d0e7a67](https://github.com/vitalyiegorov/suuudokuuu/commit/d0e7a676762c0f78d187a31e4b66b161c0fdca59))

## [1.62.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.62.1...v1.62.2) (2026-07-10)

**Note:** Version bump only for package @suuudokuuu/root

## [1.62.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.62.0...v1.62.1) (2026-07-04)

**Note:** Version bump only for package @suuudokuuu/root

# [1.62.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.61.0...v1.62.0) (2026-07-04)

### Features

- **encoder,app:** compact v2 share link encoding with legacy decode support ([#191](https://github.com/vitalyiegorov/suuudokuuu/issues/191)) ([a5f2501](https://github.com/vitalyiegorov/suuudokuuu/commit/a5f2501765ba0eb575fa2b66593924d3d2b36784))

# [1.61.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.60.1...v1.61.0) (2026-06-28)

### Features

- **app:** enable keepActiveCell by default to prevent mistap deselection ([#171](https://github.com/vitalyiegorov/suuudokuuu/issues/171)) ([063f672](https://github.com/vitalyiegorov/suuudokuuu/commit/063f6728fbb81f797a98ca1a3039fc86ad1c3e01))

## [1.60.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.60.0...v1.60.1) (2026-02-16)

**Note:** Version bump only for package @suuudokuuu/root

# [1.60.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.59.0...v1.60.0) (2026-02-15)

### Features

- **app:** increase InputModeButton hitSlop to 10px ([#167](https://github.com/vitalyiegorov/suuudokuuu/issues/167)) ([8745f22](https://github.com/vitalyiegorov/suuudokuuu/commit/8745f224d1ec0e1263a083ec7923ce020287007c))

# [1.59.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.58.0...v1.59.0) (2025-12-13)

### Features

- **app:** add keepActiveCell setting to control cell deselection on click outside ([888782c](https://github.com/vitalyiegorov/suuudokuuu/commit/888782cd643bb6d3f63f90b36d23eb6d6c3c970e))

# [1.58.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.57.0...v1.58.0) (2025-12-13)

### Features

- **app:** add multi-row support to ToggleSelect for scalable option layouts ([#165](https://github.com/vitalyiegorov/suuudokuuu/issues/165)) ([e96d970](https://github.com/vitalyiegorov/suuudokuuu/commit/e96d9708a03a4f4f4481109547e1db4ad483bc23))

# [1.57.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.56.2...v1.57.0) (2025-12-12)

### Features

- **app:** implement losing active cell focus when tapping outside field ([2c6f745](https://github.com/vitalyiegorov/suuudokuuu/commit/2c6f7457a79438601a292bdb8f2e171f8b86d90e))
- **app:** improve candidate and cell contrast with inverted colors ([b74c822](https://github.com/vitalyiegorov/suuudokuuu/commit/b74c82275d3f931ce6eccd382893280309fe928d))
- **app:** improve newspaper theme candidate contrast ([67ad4a3](https://github.com/vitalyiegorov/suuudokuuu/commit/67ad4a32979142b7a8c89a745f45f52f8c704e8e))

## [1.56.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.56.1...v1.56.2) (2025-12-08)

### Bug Fixes

- **app:** add cellBackgroundColor to useAnimatedStyle dependencies ([4fc9d63](https://github.com/vitalyiegorov/suuudokuuu/commit/4fc9d6385f77c6b0748c5495957aa1b6d6d48ed0))
- **app:** remove animation from useEffect deps and add eslint-disable ([f8ec530](https://github.com/vitalyiegorov/suuudokuuu/commit/f8ec530777aedca84feab032083c4ea038010275))
- **app:** replace useDerivedValue with useSharedValue for cell animation ([fcb6b0f](https://github.com/vitalyiegorov/suuudokuuu/commit/fcb6b0fbeac5096c734e26c87db2c16e839f3204))
- **app:** revert field-cell changes and fix available-values-item animation ([8e63960](https://github.com/vitalyiegorov/suuudokuuu/commit/8e6396090be9f7989fb8eb6f3bfb8228430b455a))

## [1.56.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.56.0...v1.56.1) (2025-12-08)

### Bug Fixes

- **app,encoder:** fix malformed game state ([#155](https://github.com/vitalyiegorov/suuudokuuu/issues/155)) ([4523c4c](https://github.com/vitalyiegorov/suuudokuuu/commit/4523c4c3821289266d940b76f4c8140c6bf4445d))

# [1.56.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.55.2...v1.56.0) (2025-12-07)

### Features

- **app:** add replay functionality for historical games ([#151](https://github.com/vitalyiegorov/suuudokuuu/issues/151)) ([6a94bad](https://github.com/vitalyiegorov/suuudokuuu/commit/6a94badf9b8d6f632181bc83be3a4d88a8c08252))

## [1.55.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.55.1...v1.55.2) (2025-12-07)

### Bug Fixes

- **app:** fix statistics page ([#154](https://github.com/vitalyiegorov/suuudokuuu/issues/154)) ([d115c42](https://github.com/vitalyiegorov/suuudokuuu/commit/d115c4224848f6f68b46ec4e52ae770f5350ae3a))

## [1.55.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.55.0...v1.55.1) (2025-12-06)

### Bug Fixes

- **app:** ensure nightmare difficulty records exist and correct averageTime calculation ([#153](https://github.com/vitalyiegorov/suuudokuuu/issues/153)) ([0bc8bda](https://github.com/vitalyiegorov/suuudokuuu/commit/0bc8bda6d1d92c8d272e890cd978d6c76b5b53f1))

# [1.55.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.54.2...v1.55.0) (2025-12-05)

### Features

- **app:** fix history/statistics and add challenge statistics tracking ([#149](https://github.com/vitalyiegorov/suuudokuuu/issues/149)) ([993a00d](https://github.com/vitalyiegorov/suuudokuuu/commit/993a00d69fcd3845feec22b394d947056f39bcb6))

## [1.54.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.54.1...v1.54.2) (2025-12-03)

### Bug Fixes

- **app:** fix Android deeplinks ([#147](https://github.com/vitalyiegorov/suuudokuuu/issues/147)) ([a2216db](https://github.com/vitalyiegorov/suuudokuuu/commit/a2216dbd350f789ca42e0e05b5f39c62ce3096fc)), closes [#144](https://github.com/vitalyiegorov/suuudokuuu/issues/144)

## [1.54.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.54.0...v1.54.1) (2025-12-03)

### Bug Fixes

- **app:** fix iOS native permission ([#146](https://github.com/vitalyiegorov/suuudokuuu/issues/146)) ([5b06c54](https://github.com/vitalyiegorov/suuudokuuu/commit/5b06c5454bb9df78afbd13c933127fa97fe0119a)), closes [#144](https://github.com/vitalyiegorov/suuudokuuu/issues/144)

# [1.54.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.53.1...v1.54.0) (2025-12-02)

### Features

- **app:** improve share message ([#143](https://github.com/vitalyiegorov/suuudokuuu/issues/143)) ([d9178ad](https://github.com/vitalyiegorov/suuudokuuu/commit/d9178ad9b319615ca9a9e5813f439ff84a771eb0)), closes [#144](https://github.com/vitalyiegorov/suuudokuuu/issues/144)

## [1.53.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.53.0...v1.53.1) (2025-12-02)

### Bug Fixes

- **app:** challenge animation bug ([#145](https://github.com/vitalyiegorov/suuudokuuu/issues/145)) ([b6a07ee](https://github.com/vitalyiegorov/suuudokuuu/commit/b6a07eef4a3cbe74b42e8daa91894c9844e2d468))

# [1.53.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.52.1...v1.53.0) (2025-12-02)

### Features

- **app:** added www.suuudokuuu.com domain for deep links ([#142](https://github.com/vitalyiegorov/suuudokuuu/issues/142)) ([a3a9289](https://github.com/vitalyiegorov/suuudokuuu/commit/a3a9289099402d4d3cd89929c634fca8f6f4768d))

## [1.52.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.52.0...v1.52.1) (2025-12-02)

**Note:** Version bump only for package @suuudokuuu/root

# [1.52.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.51.1...v1.52.0) (2025-12-02)

### Features

- **app:** add Try Again and Challenge Back buttons to challenge end screens ([#133](https://github.com/vitalyiegorov/suuudokuuu/issues/133)) ([f09ffc3](https://github.com/vitalyiegorov/suuudokuuu/commit/f09ffc3c9c737d06418fba5a6092f0b3928bdbeb))

## [1.51.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.51.0...v1.51.1) (2025-12-01)

### Bug Fixes

- **app:** change url state sharing from get parameter to route parameter ([#138](https://github.com/vitalyiegorov/suuudokuuu/issues/138)) ([9a6d60e](https://github.com/vitalyiegorov/suuudokuuu/commit/9a6d60e48fd648b2afe8a8fdbfeab095b2ccd6cc))

# [1.51.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.50.0...v1.51.0) (2025-11-30)

### Features

- **app:** add challenge mode ([#129](https://github.com/vitalyiegorov/suuudokuuu/issues/129)) ([766e8b4](https://github.com/vitalyiegorov/suuudokuuu/commit/766e8b45962f5d7d991338eed7270cae36229ed0))

# [1.50.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.49.1...v1.50.0) (2025-11-30)

### Features

- **app:** optimize solution URL sharing with binary encoding ([#131](https://github.com/vitalyiegorov/suuudokuuu/issues/131)) ([0d71297](https://github.com/vitalyiegorov/suuudokuuu/commit/0d7129725ba60e582e7041d6d46455fa60bc12b7))

## [1.49.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.49.0...v1.49.1) (2025-11-29)

### Bug Fixes

- **app:** share puzzle improvements, mobile browser styles ([#127](https://github.com/vitalyiegorov/suuudokuuu/issues/127)) ([3d15cd0](https://github.com/vitalyiegorov/suuudokuuu/commit/3d15cd076a81912ef1d2aac0036f417b04738626))

# [1.49.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.48.5...v1.49.0) (2025-11-23)

### Features

- **app:** fixed queued animation, bump expo ([#125](https://github.com/vitalyiegorov/suuudokuuu/issues/125)) ([171c282](https://github.com/vitalyiegorov/suuudokuuu/commit/171c282c9ec0991609257eeaf8ae9779537c278e))

## [1.48.5](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.48.4...v1.48.5) (2025-11-23)

### Bug Fixes

- **app:** fix best score link, fix completing previous animation ([#124](https://github.com/vitalyiegorov/suuudokuuu/issues/124)) ([ecbb57c](https://github.com/vitalyiegorov/suuudokuuu/commit/ecbb57cc4a9b801a484784c092968ebed15cd9af))

## [1.48.4](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.48.3...v1.48.4) (2025-11-22)

**Note:** Version bump only for package @suuudokuuu/root

## [1.48.3](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.48.2...v1.48.3) (2025-11-22)

### Bug Fixes

- **app:** improve scoring ([#116](https://github.com/vitalyiegorov/suuudokuuu/issues/116)) ([a472503](https://github.com/vitalyiegorov/suuudokuuu/commit/a472503f74842ad35695d15a1e48843d9e5efc99))

## [1.48.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.48.1...v1.48.2) (2025-11-22)

### Bug Fixes

- **app:** reset game state when winner/loser screen is entered ([#118](https://github.com/vitalyiegorov/suuudokuuu/issues/118)) ([6f82325](https://github.com/vitalyiegorov/suuudokuuu/commit/6f823258219d15d6978fdf0cd95035ee92b22a00))

## [1.48.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.48.0...v1.48.1) (2025-11-20)

### Bug Fixes

- **app:** cancel ongoing animation before restarting to prevent stuck rotation ([#115](https://github.com/vitalyiegorov/suuudokuuu/issues/115)) ([8063a84](https://github.com/vitalyiegorov/suuudokuuu/commit/8063a84b2c5ddcb1217c3c456447f4f74bee9f29))

### Features

- add comprehensive copilot-instructions.md file ([051a115](https://github.com/vitalyiegorov/suuudokuuu/commit/051a1157f30a5fd27b2c3ce17ed33842cf19641c))

# [1.48.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.47.2...v1.48.0) (2025-11-17)

### Features

- **app:** added cell margin setting ([8ba2de8](https://github.com/vitalyiegorov/suuudokuuu/commit/8ba2de810857ebd958360554ce9d6b7a3dc1b8fe))

### Reverts

- style changes ([057737d](https://github.com/vitalyiegorov/suuudokuuu/commit/057737d89ae94595a23b248cc4dca4a119cca639))
- style changes ([e921e93](https://github.com/vitalyiegorov/suuudokuuu/commit/e921e93370d10a3d1ab21c25e09723a8c1ddd4f9))

## [1.47.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.47.1...v1.47.2) (2025-11-16)

### Bug Fixes

- **app:** fixed restoring correct difficulty ([b129c65](https://github.com/vitalyiegorov/suuudokuuu/commit/b129c6590783c9a1ddfe1b2630357e446a07699c))

## [1.47.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.47.0...v1.47.1) (2025-11-15)

### Bug Fixes

- **app:** disable auto candidates on resume in hardcore mode ([3336d3b](https://github.com/vitalyiegorov/suuudokuuu/commit/3336d3be03a4aa7f6f043ed91f61bedc1ed1af05))

# [1.47.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.46.0...v1.47.0) (2025-11-10)

### Features

- eslint 9 migration ([#106](https://github.com/vitalyiegorov/suuudokuuu/issues/106)) ([6f05934](https://github.com/vitalyiegorov/suuudokuuu/commit/6f05934438680b1884985ca6e361cea2da6dfd5a))

# [1.46.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.45.0...v1.46.0) (2025-11-09)

### Features

- **app:** clear impossible candidates on input ([#105](https://github.com/vitalyiegorov/suuudokuuu/issues/105)) ([3dce46b](https://github.com/vitalyiegorov/suuudokuuu/commit/3dce46b4c33fb648af2dfcf45baae211c17ea8bb))

# [1.45.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.44.1...v1.45.0) (2025-11-09)

### Features

- **app:** add manual candidate mode with enhanced keyboard controls ([#104](https://github.com/vitalyiegorov/suuudokuuu/issues/104)) ([6eeb270](https://github.com/vitalyiegorov/suuudokuuu/commit/6eeb270931b241aa081d3a133dc63324db4fa0ec))

## [1.44.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.44.0...v1.44.1) (2025-09-28)

### Bug Fixes

- **generator:** revert nightmare difficulty ([#103](https://github.com/vitalyiegorov/suuudokuuu/issues/103)) ([8ace4ec](https://github.com/vitalyiegorov/suuudokuuu/commit/8ace4ec544fe81e6c7a145651db55511789c3905))

# [1.44.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.43.0...v1.44.0) (2025-09-24)

### Features

- expo 54 migration ([#102](https://github.com/vitalyiegorov/suuudokuuu/issues/102)) ([52c26a9](https://github.com/vitalyiegorov/suuudokuuu/commit/52c26a93541a9e8d7b464894119376b0953495dd))

# [1.43.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.42.0...v1.43.0) (2025-09-17)

### Bug Fixes

- **app:** browser navigation back ([a273234](https://github.com/vitalyiegorov/suuudokuuu/commit/a273234f929578f3eef838141e4a7d2c4a31640b))
- **app:** browser navigation back ([5f0af99](https://github.com/vitalyiegorov/suuudokuuu/commit/5f0af997b36763ce9ca942d84e70fd2e2acc042f))

### Features

- **app:** fix android target 35 ([e894195](https://github.com/vitalyiegorov/suuudokuuu/commit/e8941954fcaa11ccca64ee03ee64f55ae9b14cfb))
- **app:** hide auto candidates for Nightmare + Hardcore ([588572b](https://github.com/vitalyiegorov/suuudokuuu/commit/588572b397d33670cbbcc803bfa7db266c33b1a1))
- **app:** refactor game and history state, add solution steps ([d970a35](https://github.com/vitalyiegorov/suuudokuuu/commit/d970a357d673b909ae66d77ebb64b32309aebc32))
- **app:** refactor game and history state, add solution steps ([05f8983](https://github.com/vitalyiegorov/suuudokuuu/commit/05f898307e04b697f4ffce2e7f64bee26b7546b4))
- **app:** refactor game and history state, add solution steps ([30688f8](https://github.com/vitalyiegorov/suuudokuuu/commit/30688f8d9dc69e699f2db31409d23ea379f910fd))
- **app:** refactor game and history state, add solution steps ([ec57ad6](https://github.com/vitalyiegorov/suuudokuuu/commit/ec57ad670ece61df5f63d6a3589322214af7a88b))

### Performance Improvements

- **generator:** limit DLX solver unique solutions count ([cbd0dc2](https://github.com/vitalyiegorov/suuudokuuu/commit/cbd0dc25a406b3aa48e6d093861c0b0c9c47e779))

# [1.42.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.41.3...v1.42.0) (2025-08-07)

### Bug Fixes

- **app:** fix field styling ([4e7be27](https://github.com/vitalyiegorov/suuudokuuu/commit/4e7be27da4a85e4f08cf7f09c07a0cf8f6cfad4f))

### Features

- **app:** make phone cell size dynamic to support more screens ([1c47dea](https://github.com/vitalyiegorov/suuudokuuu/commit/1c47dea8b35800fb4f8d00b2413decaafd833450))

## [1.41.3](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.41.2...v1.41.3) (2025-08-06)

### Bug Fixes

- **app:** fix styling ([ecc63c6](https://github.com/vitalyiegorov/suuudokuuu/commit/ecc63c6afa51f33f3f603ea2bbf9b4c8b6ded032))

## [1.41.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.41.1...v1.41.2) (2025-08-06)

### Bug Fixes

- **app:** fix styling ([9ff68b4](https://github.com/vitalyiegorov/suuudokuuu/commit/9ff68b476248fe2ab4abb22ce8196900d7476911))

## [1.41.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.41.0...v1.41.1) (2025-08-05)

**Note:** Version bump only for package @suuudokuuu/root

# [1.41.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.40.2...v1.41.0) (2025-08-05)

### Bug Fixes

- **app:** added gray color ([fdb6b1b](https://github.com/vitalyiegorov/suuudokuuu/commit/fdb6b1bcc9352bd00e2196e56ac50692326bd0c4))
- **app:** themes ([2fbbfb1](https://github.com/vitalyiegorov/suuudokuuu/commit/2fbbfb1d443b359ac95633a204c9e92f62fa4927))

### Features

- **app-tests:** added showFilledNumber settings ([11b90f3](https://github.com/vitalyiegorov/suuudokuuu/commit/11b90f3db8f1444faa23a7e356a2e1690775217d))
- **app-tests:** added showFilledNumber settings ([2b3da9e](https://github.com/vitalyiegorov/suuudokuuu/commit/2b3da9e1a3605ec82c46a860dd10d218463b5494))
- **app-tests:** added showFilledNumber settings ([4ec49de](https://github.com/vitalyiegorov/suuudokuuu/commit/4ec49def17aeb019a9031e990c644a5bf6740ee9))
- **app-tests:** added themes support ([4d0d131](https://github.com/vitalyiegorov/suuudokuuu/commit/4d0d1312fa2df45edde5fd4b2837cb01dbe677a7))
- **app-tests:** added themes support ([f3bdc3f](https://github.com/vitalyiegorov/suuudokuuu/commit/f3bdc3f94f657cbf9daf0c9fc6ee791cd5bdad9e))
- **app:** added candidate highlight ([d0abca0](https://github.com/vitalyiegorov/suuudokuuu/commit/d0abca0f4804ee6a4c1d258bf555111a7672aaf7))
- **app:** added candidate highlight ([db19a8e](https://github.com/vitalyiegorov/suuudokuuu/commit/db19a8e4cb64c7ee80ae42885e77d4fc9cafcf10))
- **app:** added candidate highlight ([39e66fd](https://github.com/vitalyiegorov/suuudokuuu/commit/39e66fd919ee6fb088bf258022c840ce830de9a5))

### Performance Improvements

- **app:** optimize cells rendering ([ed80aed](https://github.com/vitalyiegorov/suuudokuuu/commit/ed80aedb2adc61df71642a7f07eedd9e4fca4144))
- **app:** optimize cells rendering ([9edaee9](https://github.com/vitalyiegorov/suuudokuuu/commit/9edaee9d2b8601a810ba56b76647eb6fc5a7655c))

## [1.40.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.40.1...v1.40.2) (2025-07-31)

### Bug Fixes

- **app:** fix i18n ([b58b7e7](https://github.com/vitalyiegorov/suuudokuuu/commit/b58b7e7e1bda629bf0138dc18b98e58a1772c1e0))

## [1.40.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.40.0...v1.40.1) (2025-07-31)

### Bug Fixes

- **app:** fix i18n ([8823637](https://github.com/vitalyiegorov/suuudokuuu/commit/8823637d7bf63e65f9382e6aef6bd193e0ba9eb9))

# [1.40.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.39.1...v1.40.0) (2025-07-31)

### Bug Fixes

- **app:** fix available items font size setting ([5c5486c](https://github.com/vitalyiegorov/suuudokuuu/commit/5c5486ca2cb2f4acaa0fae269af466bc55bc399e))
- **app:** game screen for iphone ([bc95638](https://github.com/vitalyiegorov/suuudokuuu/commit/bc95638d2868442816aa8719cc1904d65984141a))
- **app:** game screen for iphone ([b5e81ad](https://github.com/vitalyiegorov/suuudokuuu/commit/b5e81ad1a74a40827a4ed281534b9f0d98de53b5))
- **app:** game screen for iphone ([2554723](https://github.com/vitalyiegorov/suuudokuuu/commit/255472339a157bb7adb1bf12e4194f879489e764))
- **app:** game screen for iphone ([c82bdda](https://github.com/vitalyiegorov/suuudokuuu/commit/c82bdda22d073347f5164111d3ff9dd2f93c4ce1))
- **app:** game screen for iphone ([610dd00](https://github.com/vitalyiegorov/suuudokuuu/commit/610dd006ed18655cab744fe0b4a817cfeef2f86a))
- **app:** i18n ([1544ed4](https://github.com/vitalyiegorov/suuudokuuu/commit/1544ed489d115e26cb8dcd31a5e46609bba24932))
- **app:** i18n ([6e6b3e2](https://github.com/vitalyiegorov/suuudokuuu/commit/6e6b3e296b3f78b8b41cb62e75643d7e2a6d2c31))
- **app:** initial language selection ([da6f8ac](https://github.com/vitalyiegorov/suuudokuuu/commit/da6f8acc6f68ed6e1ac983290116cd8684f78300))
- **app:** initial language selection ([e4710b1](https://github.com/vitalyiegorov/suuudokuuu/commit/e4710b130b41144b1bce7c2f654daa4941bcc50d))

### Features

- **app:** added settings ([6ab3e22](https://github.com/vitalyiegorov/suuudokuuu/commit/6ab3e22a2c43384f4a187ce0c8ae5881cfb07c71))
- **app:** added settings ([9e4eb0d](https://github.com/vitalyiegorov/suuudokuuu/commit/9e4eb0d06d5edde97ed2007432e7d427585b97d2))
- **app:** added settings ([61b0ad6](https://github.com/vitalyiegorov/suuudokuuu/commit/61b0ad679c98b55d08487485e7777a4a15f922f5))
- **app:** added settings ([ebd330e](https://github.com/vitalyiegorov/suuudokuuu/commit/ebd330e8f2b20593001876e8306003bf2d1734e0))
- **app:** added settings ([7275c3e](https://github.com/vitalyiegorov/suuudokuuu/commit/7275c3e377a5e23aac34e20727f599f49fe30971))

## [1.39.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.39.0...v1.39.1) (2025-07-29)

### Bug Fixes

- **app:** difficulty/mistakes ([a361e91](https://github.com/vitalyiegorov/suuudokuuu/commit/a361e91645e10bcaf2a396bb36ee6cbffffe8cbc))

# [1.39.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.38.0...v1.39.0) (2025-07-29)

### Features

- **app:** improved statistics ([5e89274](https://github.com/vitalyiegorov/suuudokuuu/commit/5e892747d6c13c596bf1a8b05e3a7805a38343c2))
- **app:** improved statistics ([122e642](https://github.com/vitalyiegorov/suuudokuuu/commit/122e642759392f3e697114fede074c4c7067fc18))

# [1.38.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.37.1...v1.38.0) (2025-07-29)

### Features

- **app:** added statistics page, extended data ([6812868](https://github.com/vitalyiegorov/suuudokuuu/commit/681286814c8ae15af66f271a389e08fe933346e7))
- **app:** added statistics page, extended data ([bfe3fe0](https://github.com/vitalyiegorov/suuudokuuu/commit/bfe3fe0e8254cd996cbddeb841938c7b74c6958e))
- **app:** added statistics page, extended data ([6093b3d](https://github.com/vitalyiegorov/suuudokuuu/commit/6093b3d8e9e23118699b9b021c9a88ebec953fbb))
- **app:** added statistics page, extended data ([8decc36](https://github.com/vitalyiegorov/suuudokuuu/commit/8decc36702beb4e9e7943d765a3755fe92730438))

## [1.37.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.37.0...v1.37.1) (2025-07-29)

### Bug Fixes

- **app:** remove font scaling ([9992374](https://github.com/vitalyiegorov/suuudokuuu/commit/99923745a82d9f974865ceee4d18fe96bd2db1fa))

# [1.37.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.36.0...v1.37.0) (2025-07-29)

### Features

- **app:** increase cell font size ([20a1206](https://github.com/vitalyiegorov/suuudokuuu/commit/20a1206cce9f188986d500f9b112ada399e0bc6a))

# [1.36.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.35.1...v1.36.0) (2025-07-29)

### Features

- disable font scaling ([52b7b60](https://github.com/vitalyiegorov/suuudokuuu/commit/52b7b60814dd398085613878b777f884d924832a))

## [1.35.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.35.0...v1.35.1) (2025-07-29)

**Note:** Version bump only for package @suuudokuuu/root

# [1.35.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.34.0...v1.35.0) (2025-07-29)

### Features

- **app:** disable app font scaling ([528c756](https://github.com/vitalyiegorov/suuudokuuu/commit/528c756b875cf6ef209e86d6a65c4dac79e7cda3))

# [1.34.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.33.0...v1.34.0) (2025-07-28)

### Features

- **app:** added max mistakes selector, hardcore mode ([4e0afd1](https://github.com/vitalyiegorov/suuudokuuu/commit/4e0afd1603a6788c0568b5782adc7831f7a9d6e5))
- **app:** added max mistakes selector, hardcore mode ([83ee598](https://github.com/vitalyiegorov/suuudokuuu/commit/83ee598586e8d6fa2d6ae54b1ef7275408cb5886))
- **app:** added max mistakes selector, hardcore mode ([e14afc4](https://github.com/vitalyiegorov/suuudokuuu/commit/e14afc4e207b0241d2123f7bc5df79030857ce65))
- **app:** added max mistakes selector, hardcore mode ([b4a1e09](https://github.com/vitalyiegorov/suuudokuuu/commit/b4a1e09c853dfc09cb346a84127f622e585099c7))
- **app:** added max mistakes selector, hardcore mode ([41cf87c](https://github.com/vitalyiegorov/suuudokuuu/commit/41cf87cc6704140605e672ceaf4c2b4abb72f3bd))

# [1.33.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.32.1...v1.33.0) (2025-07-28)

### Features

- **app,generator:** avoid passing solved puzzle as string ([c456d7a](https://github.com/vitalyiegorov/suuudokuuu/commit/c456d7a760be20ceb35601263dbc60f59a2b6027))
- **app:** encode sharing state ([260210a](https://github.com/vitalyiegorov/suuudokuuu/commit/260210a3f3900ea6b60e3281665b4689a13cf68d))
- **generator:** fix tests ([dd5257a](https://github.com/vitalyiegorov/suuudokuuu/commit/dd5257a4504b9ea289711b700c9eef3313901854))

## [1.32.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.32.0...v1.32.1) (2025-07-27)

### Bug Fixes

- **app:** fix i18n ([fb0b7ca](https://github.com/vitalyiegorov/suuudokuuu/commit/fb0b7ca6d798d71928d5e17c6fc789f49498e32b))

### Performance Improvements

- **app:** improve animation ([54d741f](https://github.com/vitalyiegorov/suuudokuuu/commit/54d741fae494c69d666bb1bcbc7575ab8a7d440a))
- **app:** improve animation ([9de31b1](https://github.com/vitalyiegorov/suuudokuuu/commit/9de31b1e2c8d173a54cda08dd150dc312823d34e))
- **app:** improve animation, fix win animation ([31f6f8b](https://github.com/vitalyiegorov/suuudokuuu/commit/31f6f8bf33213a008bad37bd1eb295aaa795ab31))
- **app:** improve animation, fix win animation ([80b85a6](https://github.com/vitalyiegorov/suuudokuuu/commit/80b85a6e1546f75b56180a630d305dae757dd926))

# [1.32.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.31.0...v1.32.0) (2025-07-27)

### Features

- **app:** improve active value cells background ([2ceb5a9](https://github.com/vitalyiegorov/suuudokuuu/commit/2ceb5a9af63ee4e1395288bc67f08bfb4e5e1325))

# [1.31.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.30.0...v1.31.0) (2025-07-27)

### Features

- **app:** added theme button to game screen ([769019c](https://github.com/vitalyiegorov/suuudokuuu/commit/769019ca831cd3e33bbbdd4e4ee9c2f35f7b1469))
- **app:** moved auto-candidates button ([4a6e8e0](https://github.com/vitalyiegorov/suuudokuuu/commit/4a6e8e0f30f11ce7ae317cd4e0d7482fb6c952af))

# [1.30.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.29.0...v1.30.0) (2025-07-27)

### Bug Fixes

- **app:** fix game timer, using Intl ([ddd51d5](https://github.com/vitalyiegorov/suuudokuuu/commit/ddd51d5ebeeb4847482e2f8e4bbd80d960064916))

### Features

- **app:** improve game header ([ce1b2b4](https://github.com/vitalyiegorov/suuudokuuu/commit/ce1b2b410cc1da13f2e0205fe61e345223b96d0c))
- **app:** improve game header ([88a30f0](https://github.com/vitalyiegorov/suuudokuuu/commit/88a30f0064ecc0a8b90674d749997927983085c1))
- **app:** improve game header ([373d591](https://github.com/vitalyiegorov/suuudokuuu/commit/373d591a38f41adcca99dd5f219d4382621ee758))
- **app:** improve game header ([fa2d15f](https://github.com/vitalyiegorov/suuudokuuu/commit/fa2d15fcb930d953cd02bfd1e4f42dfa3399ed00))

# [1.29.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.28.2...v1.29.0) (2025-07-27)

### Bug Fixes

- **app:** fix fingerprint to work on internal dev build ([dfeba04](https://github.com/vitalyiegorov/suuudokuuu/commit/dfeba04f9aa23e4980d607cbc34fe46c2ce8b8b6))
- **app:** fix fingerprint to work on internal dev build ([b93487b](https://github.com/vitalyiegorov/suuudokuuu/commit/b93487b395fb54a7b69eb352469fe415f99ba339))
- **app:** fix parsing boolean from the url state ([bc1240b](https://github.com/vitalyiegorov/suuudokuuu/commit/bc1240b099cfeb5a441a8919391a4098318cb7f7))

### Features

- **app:** added theme background color ([f60a443](https://github.com/vitalyiegorov/suuudokuuu/commit/f60a443776fc013b7dc0cf9f3c9c8c82aa778296))

## [1.28.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.28.1...v1.28.2) (2025-07-27)

### Bug Fixes

- **app:** single fingerprint for all ios/android ([f594b0a](https://github.com/vitalyiegorov/suuudokuuu/commit/f594b0a457fc2599c9aecbfa76b9e51f7cbfc57e))

## [1.28.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.28.0...v1.28.1) (2025-07-27)

### Bug Fixes

- **app:** fix ios fingerprint ([62a7d4d](https://github.com/vitalyiegorov/suuudokuuu/commit/62a7d4da0d45e511fd79140a2c19b52c6456b820))
- **app:** fix ios fingerprint ([5796656](https://github.com/vitalyiegorov/suuudokuuu/commit/5796656ffa8b74eac6d4f81f31a29be3b390853d))
- **app:** fix ios fingerprint ([f9dd029](https://github.com/vitalyiegorov/suuudokuuu/commit/f9dd0297932287ab0365e779fff07f4d60f6ec47))
- **app:** single fingerprint for all ios/android ([3b59d4d](https://github.com/vitalyiegorov/suuudokuuu/commit/3b59d4d36ed1dee96b7a25bb9f9167578cc926eb))
- **app:** single fingerprint for all ios/android ([4fe9cb6](https://github.com/vitalyiegorov/suuudokuuu/commit/4fe9cb6c5cdaba80178eb5c6cad7bc7f06909193))
- **app:** single fingerprint for all ios/android ([5d3880e](https://github.com/vitalyiegorov/suuudokuuu/commit/5d3880ebc5bc1f76ece55164a46f006543b3267c))

# [1.28.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.27.2...v1.28.0) (2025-07-27)

### Bug Fixes

- **app:** fix phone field size ([ae04247](https://github.com/vitalyiegorov/suuudokuuu/commit/ae042474a5de0742d024abb2e6eb419d7aedb436))

### Features

- **app:** change runtimeVersion to fingerprint ([42b54e7](https://github.com/vitalyiegorov/suuudokuuu/commit/42b54e799e1b509ed22808fe670ea6122061d8b8))
- **app:** change runtimeVersion to fingerprint ([a734292](https://github.com/vitalyiegorov/suuudokuuu/commit/a7342927902b0c9a9bb9982fae6dfc45893cf1c9))
- **app:** change runtimeVersion to fingerprint ([dd5b7db](https://github.com/vitalyiegorov/suuudokuuu/commit/dd5b7db2214ce1c3827c22a891e2b31b98cd7ee5))
- **app:** change runtimeVersion to fingerprint ([aff6199](https://github.com/vitalyiegorov/suuudokuuu/commit/aff6199104c325c0c3afb9c0d51e1c06d45d1285))
- **app:** change runtimeVersion to fingerprint ([b47a60a](https://github.com/vitalyiegorov/suuudokuuu/commit/b47a60aae16da5596c18cf9039ff56d63ee7af74))

## [1.27.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.27.1...v1.27.2) (2025-07-26)

### Bug Fixes

- **app:** improve field responsive styling ([4165857](https://github.com/vitalyiegorov/suuudokuuu/commit/416585765ced315cea94c3bf3768181cabe95175))

## [1.27.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.27.0...v1.27.1) (2025-07-26)

### Bug Fixes

- auto theme ([0d4789f](https://github.com/vitalyiegorov/suuudokuuu/commit/0d4789fdb36544e2570ecd2cb108b8ba976e6b87))
- auto theme ([c90660f](https://github.com/vitalyiegorov/suuudokuuu/commit/c90660fb8079fe0a9ae61b87fef248829c6f3863))

# [1.27.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.26.0...v1.27.0) (2025-07-26)

### Bug Fixes

- **app:** ios site association ids ([bd2a2ff](https://github.com/vitalyiegorov/suuudokuuu/commit/bd2a2ff903e37b0879471fa2c52b2411ad9da9ab))
- **app:** ios site association ids ([429a166](https://github.com/vitalyiegorov/suuudokuuu/commit/429a166098f4d542b26d46b8886673961f0fec31))
- **app:** themes and status bar ([60035c4](https://github.com/vitalyiegorov/suuudokuuu/commit/60035c42abf286b92f253328defd4d4d21d0d68e))

### Features

- **app:** added android deep links ([8e7ac54](https://github.com/vitalyiegorov/suuudokuuu/commit/8e7ac544a6a492edc14e23db50d08da6ad26b2db))

# [1.26.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.25.1...v1.26.0) (2025-07-26)

### Features

- **app:** added universal links ([540ddf3](https://github.com/vitalyiegorov/suuudokuuu/commit/540ddf31ad5117f9f20f6e3d011f1f2f61d62e17))

## [1.25.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.25.0...v1.25.1) (2025-07-26)

### Bug Fixes

- **app:** game state parsing and sharing ([fcc2f89](https://github.com/vitalyiegorov/suuudokuuu/commit/fcc2f898d5d7c90457192eafe8d742e4abc6a5d4))
- **app:** language fallback ([c9d8527](https://github.com/vitalyiegorov/suuudokuuu/commit/c9d85271bdbaff61a677d85ee1afd05b0297cf40))

# [1.25.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.24.2...v1.25.0) (2025-07-25)

### Bug Fixes

- **app:** remove losing focus if last value filled ([0183c64](https://github.com/vitalyiegorov/suuudokuuu/commit/0183c640ed083a51bfd69df56b5e544e271ac556))

### Features

- **app:** added puzzle sharing ([db315b7](https://github.com/vitalyiegorov/suuudokuuu/commit/db315b761feceeb2f83631818a532bbd96e8a226))
- **app:** fix styles ([76818b9](https://github.com/vitalyiegorov/suuudokuuu/commit/76818b98daaa0721e922e3ed4d6684cf8eb91710))

## [1.24.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.24.1...v1.24.2) (2025-07-25)

**Note:** Version bump only for package @suuudokuuu/root

## [1.24.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.24.0...v1.24.1) (2025-07-25)

**Note:** Version bump only for package @suuudokuuu/root

# [1.24.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.23.1...v1.24.0) (2025-07-24)

### Features

- **app:** i18n support ([5be57bf](https://github.com/vitalyiegorov/suuudokuuu/commit/5be57bf106a4b2c32c24a8bf7f431b1186d46ee5))
- **app:** i18n support ([0a69a2b](https://github.com/vitalyiegorov/suuudokuuu/commit/0a69a2b705f8e475044cb397099ede7ba1a04053))
- **app:** i18n support ([83a8b99](https://github.com/vitalyiegorov/suuudokuuu/commit/83a8b99cd2644e24983e475303c96d86c6a03f84))
- **app:** i18n support ([1b50f11](https://github.com/vitalyiegorov/suuudokuuu/commit/1b50f119023b51cae25afbeb9ea90be3a15b6c5c))
- **app:** i18n support ([335af03](https://github.com/vitalyiegorov/suuudokuuu/commit/335af032bdad5837692e0c66dfc2e90384504e08))
- **app:** i18n support ([869679f](https://github.com/vitalyiegorov/suuudokuuu/commit/869679f4b233aac824c41d8ff1c300f0ff1979fc))
- **app:** i18n support ([c5f9048](https://github.com/vitalyiegorov/suuudokuuu/commit/c5f90486d46f60c711f794b36d75dba547124ac0))
- **app:** i18n support ([ba61a89](https://github.com/vitalyiegorov/suuudokuuu/commit/ba61a89b70ec84d2adeed5aca73656b52a5c8262))

## [1.23.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.23.0...v1.23.1) (2025-07-24)

### Bug Fixes

- **app:** align controls with new buttons ([ae03bec](https://github.com/vitalyiegorov/suuudokuuu/commit/ae03bec71a787ac5c27f5fc69b94978fe51a8805))
- **app:** align controls with new buttons ([0e65c0b](https://github.com/vitalyiegorov/suuudokuuu/commit/0e65c0bf05bb8251d22883e9f9d92f742e8fa036))
- **app:** improve candidate and cell styling ([291b5e5](https://github.com/vitalyiegorov/suuudokuuu/commit/291b5e53342e0ce597c5ed7b851d4aaf2430fbf5))
- **app:** improve candidate styling ([1088124](https://github.com/vitalyiegorov/suuudokuuu/commit/108812486009235649d828f10e9b3a32e234b081))
- **app:** native expo support ([2fb4eb0](https://github.com/vitalyiegorov/suuudokuuu/commit/2fb4eb0c226b009033ce80f3babb551e24af9107))
- **app:** svg colors on white theme ([56918fc](https://github.com/vitalyiegorov/suuudokuuu/commit/56918fc5328656e88b3e4cf43ace10b87ad2ab12))

# [1.23.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.8...v1.23.0) (2025-07-22)

### Features

- **app,generator:** added candidate mode ([e064aa4](https://github.com/vitalyiegorov/suuudokuuu/commit/e064aa4f978975a9f6375a157e25477a030af85f))
- **app,generator:** added contrast to filled cells ([c79c69c](https://github.com/vitalyiegorov/suuudokuuu/commit/c79c69c2ce1ae9bb3b673c1e1087bfa5c6a8fe94))
- **app,generator:** added contrast to filled cells ([1216356](https://github.com/vitalyiegorov/suuudokuuu/commit/1216356efb2b0079adc5871e9b73e6ebeeee2f0b))
- **app,generator:** added contrast to filled cells ([cbcd11e](https://github.com/vitalyiegorov/suuudokuuu/commit/cbcd11ebde60ce10e4a0092936048c63ebc861a2))
- **app,generator:** added contrast to filled cells ([7958c98](https://github.com/vitalyiegorov/suuudokuuu/commit/7958c985e527f3d95fd48360befbd4f8e70e640f))
- **app,generator:** added contrast to filled cells ([b946756](https://github.com/vitalyiegorov/suuudokuuu/commit/b94675677b48433a70a2a0dd4536417f2ebb10b4))

## [1.22.8](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.7...v1.22.8) (2025-07-22)

### Bug Fixes

- **field-cell:** resolve ReanimatedError by inlining animation logic and keeping optimization changes ([51685aa](https://github.com/vitalyiegorov/suuudokuuu/commit/51685aaaaac205272f8b4cc94d7ff42d32b3f5bf))

### Performance Improvements

- **app:** optimize iOS animation performance and reduce UI blocking ([f76847b](https://github.com/vitalyiegorov/suuudokuuu/commit/f76847b3f465b9b8caaade2429cf2b78d2b21517))

## [1.22.7](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.6...v1.22.7) (2025-07-22)

### Bug Fixes

- correct failing test in sudoku-navigation.spec.ts ([0929507](https://github.com/vitalyiegorov/suuudokuuu/commit/09295074816cdd04ac96a90f437379b58889dcc7))
- resolve TypeScript compilation errors in sudoku-navigation.spec.ts ([4016a03](https://github.com/vitalyiegorov/suuudokuuu/commit/4016a0303cbe1597e163775d70b45779459abba4))

## [1.22.6](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.5...v1.22.6) (2025-07-22)

**Note:** Version bump only for package @suuudokuuu/root

## [1.22.5](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.4...v1.22.5) (2025-07-22)

**Note:** Version bump only for package @suuudokuuu/root

## [1.22.4](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.3...v1.22.4) (2025-07-21)

**Note:** Version bump only for package @suuudokuuu/root

## [1.22.3](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.2...v1.22.3) (2025-07-21)

### Bug Fixes

- **app:** fix native keyboard handler error ([6ffab9a](https://github.com/vitalyiegorov/suuudokuuu/commit/6ffab9abe7f8a7eadc51b54bb9388177875cb193))
- **app:** fix text animation ([df9c360](https://github.com/vitalyiegorov/suuudokuuu/commit/df9c36069ef4de482118f44af54a3d1b1d8de9f4))
- **app:** fix text animation ([e182ad6](https://github.com/vitalyiegorov/suuudokuuu/commit/e182ad62f9ec4924d9400fbb44d2852f9561b11f))
- **generator:** replace protected config access with defaultSudokuConfig in tests ([c789b26](https://github.com/vitalyiegorov/suuudokuuu/commit/c789b26bc58646b6f11d6d8b0369a7e2f21ad9d1))
- isCellWrong test to ensure wrong value is actually different from correct value ([3060eae](https://github.com/vitalyiegorov/suuudokuuu/commit/3060eae1ab2d1da3c6e9f61d738c487955c43df4))
- **tests:** resolve ESLint failures in sudoku.spec.ts ([1e2307a](https://github.com/vitalyiegorov/suuudokuuu/commit/1e2307a7a68d7a1db477342fb9dad27b670dbb5c))

## [1.22.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.1...v1.22.2) (2025-07-21)

**Note:** Version bump only for package @suuudokuuu/root

## [1.22.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.22.0...v1.22.1) (2025-07-21)

### Bug Fixes

- **generator:** fix possible/available values calculation ([e0b9841](https://github.com/vitalyiegorov/suuudokuuu/commit/e0b9841b8d6182ddf32b2e353717338121674910))
- **generator:** fix possible/available values calculation ([0d177a4](https://github.com/vitalyiegorov/suuudokuuu/commit/0d177a49f76c8b0ecf8fdcb7a7d5796075660fb5))

# [1.22.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.21.0...v1.22.0) (2025-07-20)

### Features

- **app,generator:** added loading indicator ([f51923c](https://github.com/vitalyiegorov/suuudokuuu/commit/f51923ce7f96760622740c1a8989d3f01a0edd6e))
- **app,generator:** implement keyboard controls ([787c478](https://github.com/vitalyiegorov/suuudokuuu/commit/787c4782ce1cf7793fc95ceac268bb1800bdc430))
- **app,generator:** implement keyboard controls ([f1ca0d1](https://github.com/vitalyiegorov/suuudokuuu/commit/f1ca0d12b0929ccd6429bbbe587f89ec6188673e))
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
- **generator:** added DLX algorithm ([07c9c06](https://github.com/vitalyiegorov/suuudokuuu/commit/07c9c06da7bda4ac10fa3800d732162215266df2))
- **generator:** added DLX algorithm ([34af3a1](https://github.com/vitalyiegorov/suuudokuuu/commit/34af3a1e0171475479d1e6ee52c1581631e05ff8))
- **generator:** added DLX algorithm ([a45f48d](https://github.com/vitalyiegorov/suuudokuuu/commit/a45f48d086503a6555ae89fc8308be45f3123115))
- **generator:** added DLX algorithm ([a57c56d](https://github.com/vitalyiegorov/suuudokuuu/commit/a57c56d5950c91e52799593be2d6c0ab1fbf791a))

## [1.20.3](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.20.2...v1.20.3) (2025-07-20)

### Bug Fixes

- **app:** field is not clickable on the edges on web ([6009e54](https://github.com/vitalyiegorov/suuudokuuu/commit/6009e54888decea83232b3500dc3fd1f8793cac1))

## [1.20.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.20.1...v1.20.2) (2025-07-20)

**Note:** Version bump only for package @suuudokuuu/root

## [1.20.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.20.0...v1.20.1) (2025-07-20)

### Features

- **app:** fix runtimeVersion ([5c2718a](https://github.com/vitalyiegorov/suuudokuuu/commit/5c2718a70c662a8ef32469a0d48f03ff0f2b7a09))

# [1.20.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.19.0...v1.20.0) (2025-07-20)

### Features

- **app:** fix runtimeVersion ([122d22f](https://github.com/vitalyiegorov/suuudokuuu/commit/122d22f1d45b5559e2195ff09049ae827ef07c70))

# [1.19.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.18.5...v1.19.0) (2025-07-20)

### Features

- **app:** migrate to app.config.js, add package.json as version ([14525e6](https://github.com/vitalyiegorov/suuudokuuu/commit/14525e6eb905b64f24e5b8800661365ac49cf772))

## [1.18.5](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.18.4...v1.18.5) (2025-07-20)

**Note:** Version bump only for package @suuudokuuu/root

## [1.18.4](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.18.3...v1.18.4) (2025-07-20)

**Note:** Version bump only for package @suuudokuuu/root

## [1.18.3](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.18.2...v1.18.3) (2025-07-20)

**Note:** Version bump only for package @suuudokuuu/root

## [1.18.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.18.1...v1.18.2) (2025-07-20)

### Features

- increase difficulty, refactor game screen ([24a6140](https://github.com/vitalyiegorov/suuudokuuu/commit/24a61405c6e818a10a336b7628525e354e5ebfa7))
- remove .idea ([7e60e88](https://github.com/vitalyiegorov/suuudokuuu/commit/7e60e88819f1a3c795054e67a87754ecb4143627))

# Changelog

## <small>1.18.1 (2025-07-19)</small>

- docs: added todo, updated description ([5b81747](https://github.com/vitalyiegorov/suuudokuuu/commit/5b81747))
- chore: released version v1.18.0 [no ci] ([edbeb4d](https://github.com/vitalyiegorov/suuudokuuu/commit/edbeb4d))

## 1.18.0 (2025-07-19)

- fix: mobile web style ([218c1e5](https://github.com/vitalyiegorov/suuudokuuu/commit/218c1e5))
- fix: mobile web style ([80354d8](https://github.com/vitalyiegorov/suuudokuuu/commit/80354d8))
- feat: web theme color status bars ([40b7903](https://github.com/vitalyiegorov/suuudokuuu/commit/40b7903))
- chore: released version v1.17.0 [no ci] ([48e7156](https://github.com/vitalyiegorov/suuudokuuu/commit/48e7156))

## 1.17.0 (2025-07-19)

- chore: added play market assets ([77672a1](https://github.com/vitalyiegorov/suuudokuuu/commit/77672a1))
- chore: released version v1.16.2 [no ci] ([6dc4fdc](https://github.com/vitalyiegorov/suuudokuuu/commit/6dc4fdc))
- chore: removed wdio ([fc1af50](https://github.com/vitalyiegorov/suuudokuuu/commit/fc1af50))
- chore: removed wdio ([35b7ca6](https://github.com/vitalyiegorov/suuudokuuu/commit/35b7ca6))
- refactor: screens + styles ([c6b3fee](https://github.com/vitalyiegorov/suuudokuuu/commit/c6b3fee))
- docs: updated todos ([6be797a](https://github.com/vitalyiegorov/suuudokuuu/commit/6be797a))
- docs: updated todos ([5d0d79c](https://github.com/vitalyiegorov/suuudokuuu/commit/5d0d79c))
- docs: updated todos ([a11e311](https://github.com/vitalyiegorov/suuudokuuu/commit/a11e311))
- docs: updated todos ([a739e9f](https://github.com/vitalyiegorov/suuudokuuu/commit/a739e9f))
- docs: updated todos ([6d5edf5](https://github.com/vitalyiegorov/suuudokuuu/commit/6d5edf5))
- docs: updated todos ([f6680d0](https://github.com/vitalyiegorov/suuudokuuu/commit/f6680d0))
- ci: added pr name job ([2d6a7ae](https://github.com/vitalyiegorov/suuudokuuu/commit/2d6a7ae))
- feat: bump expo and deps ([36aad0d](https://github.com/vitalyiegorov/suuudokuuu/commit/36aad0d))
- feat: bump expo and deps ([00072e0](https://github.com/vitalyiegorov/suuudokuuu/commit/00072e0))

## <small>1.16.2 (2025-01-07)</small>

- fix: web bundle error, bump redux ([6e24b1e](https://github.com/vitalyiegorov/suuudokuuu/commit/6e24b1e))
- chore: released version v1.16.1 [no ci] ([53b7db9](https://github.com/vitalyiegorov/suuudokuuu/commit/53b7db9))

## <small>1.16.1 (2025-01-07)</small>

- fix: patched react-native-version to support new app.json without expo ([d0686db](https://github.com/vitalyiegorov/suuudokuuu/commit/d0686db))
- chore: released version v1.16.0 [no ci] ([5f505db](https://github.com/vitalyiegorov/suuudokuuu/commit/5f505db))

## 1.16.0 (2025-01-07)

- fix: patched react-native-version to support new app.json without expo ([6f677e0](https://github.com/vitalyiegorov/suuudokuuu/commit/6f677e0))
- feat: migrated to knip ([a532b51](https://github.com/vitalyiegorov/suuudokuuu/commit/a532b51))
- feat: migrated to knip ([9f2f46b](https://github.com/vitalyiegorov/suuudokuuu/commit/9f2f46b))
- refactor: expo routes structure + 404 ([6015478](https://github.com/vitalyiegorov/suuudokuuu/commit/6015478))
- refactor: removed memo ([c1ad4d0](https://github.com/vitalyiegorov/suuudokuuu/commit/c1ad4d0))
- docs: updated todo ([79a5995](https://github.com/vitalyiegorov/suuudokuuu/commit/79a5995))
- ci: fixed release changelog generation ([2d08558](https://github.com/vitalyiegorov/suuudokuuu/commit/2d08558))
- chore: released version v1.15.0 [no ci] ([1cf6d8b](https://github.com/vitalyiegorov/suuudokuuu/commit/1cf6d8b))

## 1.15.0 (2025-01-06)

- ci: android bundle id ([1c40702](https://github.com/vitalyiegorov/suuudokuuu/commit/1c40702))
- ci: android bundle id ([6aaabb5](https://github.com/vitalyiegorov/suuudokuuu/commit/6aaabb5))
- ci: fixed release it deps ([85273b4](https://github.com/vitalyiegorov/suuudokuuu/commit/85273b4))
- ci: fixed release it deps ([c5808d2](https://github.com/vitalyiegorov/suuudokuuu/commit/c5808d2))
- ci: main branch release ([6772a30](https://github.com/vitalyiegorov/suuudokuuu/commit/6772a30))
- ci: main branch release ([b8a4245](https://github.com/vitalyiegorov/suuudokuuu/commit/b8a4245))
- ci: main branch release ([6e3edb7](https://github.com/vitalyiegorov/suuudokuuu/commit/6e3edb7))
- ci: release it not workin ([7022a74](https://github.com/vitalyiegorov/suuudokuuu/commit/7022a74))
- ci: release it not workin ([6b178db](https://github.com/vitalyiegorov/suuudokuuu/commit/6b178db))
- ci: release it not workin ([dc5e95e](https://github.com/vitalyiegorov/suuudokuuu/commit/dc5e95e))
- ci: removed all manual config in favor of expo ([a8f3e98](https://github.com/vitalyiegorov/suuudokuuu/commit/a8f3e98))
- ci: revert ([c768004](https://github.com/vitalyiegorov/suuudokuuu/commit/c768004))
- ci: revert ([02b1141](https://github.com/vitalyiegorov/suuudokuuu/commit/02b1141))
- chore: android ([0d8b78a](https://github.com/vitalyiegorov/suuudokuuu/commit/0d8b78a))
- chore: android ([c357257](https://github.com/vitalyiegorov/suuudokuuu/commit/c357257))
- chore: bump eslint - fixed errors ([d601e2e](https://github.com/vitalyiegorov/suuudokuuu/commit/d601e2e))
- chore: bump eslint - fixed errors ([7698d19](https://github.com/vitalyiegorov/suuudokuuu/commit/7698d19))
- chore: bump eslint - fixed errors ([53dcae3](https://github.com/vitalyiegorov/suuudokuuu/commit/53dcae3))
- chore: bump eslint - fixed errors ([acafa62](https://github.com/vitalyiegorov/suuudokuuu/commit/acafa62))
- chore: expo-updates ([1c1b712](https://github.com/vitalyiegorov/suuudokuuu/commit/1c1b712))
- chore: ios build ([899f0db](https://github.com/vitalyiegorov/suuudokuuu/commit/899f0db))
- chore: lock file fix ([260973d](https://github.com/vitalyiegorov/suuudokuuu/commit/260973d))
- chore: released version v1.14.1 [no ci] ([7667169](https://github.com/vitalyiegorov/suuudokuuu/commit/7667169))
- chore: remove buildNumber/Version ([6c1eff4](https://github.com/vitalyiegorov/suuudokuuu/commit/6c1eff4))
- chore: updated release it ([9ab24e9](https://github.com/vitalyiegorov/suuudokuuu/commit/9ab24e9))
- feat: added dev build ([7a3aba0](https://github.com/vitalyiegorov/suuudokuuu/commit/7a3aba0))
- feat: bump deps ([7e68637](https://github.com/vitalyiegorov/suuudokuuu/commit/7e68637))
- feat: bump turbo ([b0883f3](https://github.com/vitalyiegorov/suuudokuuu/commit/b0883f3))
- feat: bump turbo ([97906cc](https://github.com/vitalyiegorov/suuudokuuu/commit/97906cc))
- feat: bump yarn ([5199349](https://github.com/vitalyiegorov/suuudokuuu/commit/5199349))
- feat: bump yarn ([b0e7c24](https://github.com/vitalyiegorov/suuudokuuu/commit/b0e7c24))
- feat: expo 52 update ([284f199](https://github.com/vitalyiegorov/suuudokuuu/commit/284f199))
- revert: turbo ([804f9f6](https://github.com/vitalyiegorov/suuudokuuu/commit/804f9f6))

## [1.14.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.14.0...v1.14.1) (2023-06-04)

### Bug Fixes

- refactor calculation logic, re-renders, timer speed up ([a504a59](https://github.com/vitalyiegorov/suuudokuuu/commit/a504a59fc970df1ad6cfa4bd51fb7d0cc3e9195b))

## [1.14.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.13.0...v1.14.0) (2023-06-03)

### Features

- added haptic to ui buttons, fixed mistakes increase on losing game ([8d3bb68](https://github.com/vitalyiegorov/suuudokuuu/commit/8d3bb6806a270c25d01d950021395ff6024f47fb))

## [1.13.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.12.5...v1.13.0) (2023-06-03)

### Features

- added dot symbol for active empty cell ([5a1a148](https://github.com/vitalyiegorov/suuudokuuu/commit/5a1a1483afdc8b5f53fa915647294de1125d3365))
- moved eas udpate workflow to pull-request workflow job ([7e0d589](https://github.com/vitalyiegorov/suuudokuuu/commit/7e0d58988d5df7413220834b973e614d516cbd9d))

### Bug Fixes

- fixed pause, winner screen change logic to unmount game screen and stop the timer ([ae06b5d](https://github.com/vitalyiegorov/suuudokuuu/commit/ae06b5d7c6badbcb814cd9f5ee5c2339c7e69b21))
- fixed pause, winner screen change logic to unmount game screen and stop the timer ([79e3a7c](https://github.com/vitalyiegorov/suuudokuuu/commit/79e3a7c5cf3ae7287e8b6e6edd1540d84bfcd903))

## [1.12.5](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.12.4...v1.12.5) (2023-06-03)

### Bug Fixes

- added ios config to bypass compliance ([bf292b9](https://github.com/vitalyiegorov/suuudokuuu/commit/bf292b93124cd1a7e5948130c4a38d3e0d5aff16))

## [1.12.4](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.12.3...v1.12.4) (2023-06-03)

### Bug Fixes

- fixed cell scored animation ([04d3d71](https://github.com/vitalyiegorov/suuudokuuu/commit/04d3d712adae949db653f3bc5efa98fe0c2fd37d))
- fixed cell scored animation ([256b6e1](https://github.com/vitalyiegorov/suuudokuuu/commit/256b6e1487c68609cb88a2afecfafc46ad0e6416))
- improved scored cells comparison, should fix incorrect animations ([ddade16](https://github.com/vitalyiegorov/suuudokuuu/commit/ddade168b06116b7eab47d91a3976e18325263a8))

## [1.12.3](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.12.2...v1.12.3) (2023-06-03)

## [1.12.2](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.12.1...v1.12.2) (2023-06-02)

### Bug Fixes

- fixed automatic GH release creation ([1861828](https://github.com/vitalyiegorov/suuudokuuu/commit/1861828186b73173372d75a8116397c9003c01e7))
- fixed pushing tags after the release ([79f5b58](https://github.com/vitalyiegorov/suuudokuuu/commit/79f5b58f1193a92909c0848d155a62dbdb8669d3))

## [1.12.1](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.12.0...v1.12.1) (2023-06-02)

### Bug Fixes

- fixed eas config ([87336f2](https://github.com/vitalyiegorov/suuudokuuu/commit/87336f2e3e343bd00cac0ffb9dfc4797834779c1))

## [1.12.0](https://github.com/vitalyiegorov/suuudokuuu/compare/v1.11.0...v1.12.0) (2023-06-02)

### Features

- added automatic react-native versioning on release ([d832066](https://github.com/vitalyiegorov/suuudokuuu/commit/d832066c99b8ef702eea023105183f254cc20507))
- added release to main branch merge ([ad7dadc](https://github.com/vitalyiegorov/suuudokuuu/commit/ad7dadc74af01ef9bd9ccf5409eac6054744aac4))
- added release to main branch merge ([75fe2d9](https://github.com/vitalyiegorov/suuudokuuu/commit/75fe2d9025942b8efb6096c6d96c882e219979d1))
- added release to main branch merge ([7ca5a6a](https://github.com/vitalyiegorov/suuudokuuu/commit/7ca5a6a181a4a75339d3e9f484d14217ee95b926))
- added release to main branch merge ([8290b18](https://github.com/vitalyiegorov/suuudokuuu/commit/8290b18fc943cb6f119b561461d1991f50f75123))
- added release to main branch merge ([274280e](https://github.com/vitalyiegorov/suuudokuuu/commit/274280e63d671eaeba723bcc5b6b10cc47e8ae88))

### Bug Fixes

- added separate release job ([ac31443](https://github.com/vitalyiegorov/suuudokuuu/commit/ac31443c1894acb089e33dec4591f4501ae742db))
- added separate release job ([fd9bc2e](https://github.com/vitalyiegorov/suuudokuuu/commit/fd9bc2ee15264b54f7f549b784301e21a3ba975a))
- added separate release job ([5ca70cd](https://github.com/vitalyiegorov/suuudokuuu/commit/5ca70cd3250c126c9a1bef9a9b6bddb61fd33bc9))
- added separate release job ([43ef1bd](https://github.com/vitalyiegorov/suuudokuuu/commit/43ef1bd38d02a6fbaa40b921c2241660d62901ef))
- release it ([ad01eb0](https://github.com/vitalyiegorov/suuudokuuu/commit/ad01eb0636c827cdd5dea56f109eaa2352b875fd))
- release it ([5d6cdf1](https://github.com/vitalyiegorov/suuudokuuu/commit/5d6cdf1b1deb7250fb1630a1ab80ae1c2620baf8))

## 1.11.0 (2023-06-02)

### Features

- added android build config ([ed3ea55](https://github.com/vitalyiegorov/suuudokuuu/commit/ed3ea552acd6c21b4ce18eefbc15d7f156fac11d))
- added completed value based animation, small refactoring ([c9a3ec1](https://github.com/vitalyiegorov/suuudokuuu/commit/c9a3ec18d564e7ff11a6e810a89c8e99d704b56c))
- added const for progressWidth ([c5a6fba](https://github.com/vitalyiegorov/suuudokuuu/commit/c5a6fba22925b33214512eacff89756d79a5204c))
- added dark theme ([f5bec17](https://github.com/vitalyiegorov/suuudokuuu/commit/f5bec17a728e5d112f730fa90497505b0de62375))
- added dark theme ([d667e6a](https://github.com/vitalyiegorov/suuudokuuu/commit/d667e6a67b227fc92d800f131697aaa9653eb5a6))
- added donation to win/lose pages ([e97117d](https://github.com/vitalyiegorov/suuudokuuu/commit/e97117df769620d4a37d59905e96c7e595a3d010))
- added exit, added generic black button style, fixed cell x/y coordinates ([94aea1d](https://github.com/vitalyiegorov/suuudokuuu/commit/94aea1da398b0de1759ef4c4bb1c980327e99202))
- added expo-router ([25f28ce](https://github.com/vitalyiegorov/suuudokuuu/commit/25f28cee754f47f30de70cacb10ab60597977e18))
- added expo-router ([ec34bc2](https://github.com/vitalyiegorov/suuudokuuu/commit/ec34bc29ef97351f5747ba728e8256fde3a625d8))
- added filling logic ([10efaab](https://github.com/vitalyiegorov/suuudokuuu/commit/10efaab34ccb9f097dcd533b23d5a6108550c40e))
- added game field with blank spaces ([5cd3626](https://github.com/vitalyiegorov/suuudokuuu/commit/5cd3626bbf3865b0cef143574385d575861f8f85))
- added game pause, closes [#2](https://github.com/vitalyiegorov/suuudokuuu/issues/2), closes [#1](https://github.com/vitalyiegorov/suuudokuuu/issues/1) ([8ebe293](https://github.com/vitalyiegorov/suuudokuuu/commit/8ebe29353c8475c0ba52490bc5d90a73a174252e))
- added games history ([7c062d4](https://github.com/vitalyiegorov/suuudokuuu/commit/7c062d437e4325ce7176e2af57ac8f2a3fef4b1f))
- added games history ([576951b](https://github.com/vitalyiegorov/suuudokuuu/commit/576951b88fb24b8c863e5c1f41cebf48312c6407))
- added grid markup ([9535751](https://github.com/vitalyiegorov/suuudokuuu/commit/9535751d62ceade1efa921abbbb9b97677e9ab3b))
- added grid markup ([7694442](https://github.com/vitalyiegorov/suuudokuuu/commit/7694442460e9fe1d0cad5c479db420dce7c46adb))
- added haptic ([3e318cc](https://github.com/vitalyiegorov/suuudokuuu/commit/3e318cc890050b6895385ea6082f443223a77a9f))
- added icons ([96c9f41](https://github.com/vitalyiegorov/suuudokuuu/commit/96c9f41dba70f5b29344a0e776624a7837140587))
- added icons ([43debb9](https://github.com/vitalyiegorov/suuudokuuu/commit/43debb9a071030801698f05dd833c0b9f74ce2a4))
- added ios folder for xcode cloud ([25f1ce2](https://github.com/vitalyiegorov/suuudokuuu/commit/25f1ce2ba63c0b1b653b48182898d4a861ca9c94))
- added loser screen, mistakes logic and some styling ([89c986f](https://github.com/vitalyiegorov/suuudokuuu/commit/89c986f1bb7904b01f079e0bdf573e54eab0c40a))
- added navigation ([d025575](https://github.com/vitalyiegorov/suuudokuuu/commit/d0255752db5512c71f3cc4b89c51fa7e550bda94))
- added navigation ([0451648](https://github.com/vitalyiegorov/suuudokuuu/commit/045164854182c62ec09d81ebde3aa897f6e118e1))
- added random filling logic ([badfeb6](https://github.com/vitalyiegorov/suuudokuuu/commit/badfeb636c6076782d75ad6cdd497ddc740419ef))
- added reanimated animation ([3f78d94](https://github.com/vitalyiegorov/suuudokuuu/commit/3f78d94d8cbdca9c2699772f4388f6e0dc910a54))
- added reanimated animation ([92eff5b](https://github.com/vitalyiegorov/suuudokuuu/commit/92eff5b08cb160c63b73119bd057632fba38cb8c))
- added reanimated animation, fixed filling logic bug ([d24c9c9](https://github.com/vitalyiegorov/suuudokuuu/commit/d24c9c9e0d301392b64951f26658e4f5343bbfd1))
- added redux and pressable cells ([9ccf23e](https://github.com/vitalyiegorov/suuudokuuu/commit/9ccf23e0fbc0b0238ea5d97d2f2d3df56480e2d2))
- added redux-persist to save current game progress ([4db11f7](https://github.com/vitalyiegorov/suuudokuuu/commit/4db11f787ad635e09b177f0980d42541dbbd0817))
- added release ([56cde95](https://github.com/vitalyiegorov/suuudokuuu/commit/56cde959724c645faa60e3ce77f9dfab29cd26df))
- added row/col/group completion animation ([788b51c](https://github.com/vitalyiegorov/suuudokuuu/commit/788b51c708ca8e66c944025b7d04a103ec36f709))
- added score calculation and timer ([883ead5](https://github.com/vitalyiegorov/suuudokuuu/commit/883ead5dc0a6f3ce69e9a5f2ea1f55ed5bef8d5f))
- added score calculation and timer ([b4464dd](https://github.com/vitalyiegorov/suuudokuuu/commit/b4464ddb51afa1d31b4524bb80ef6dceeef5726e))
- added support ukraine banner on index page ([06f1ba7](https://github.com/vitalyiegorov/suuudokuuu/commit/06f1ba7d34bd27dff920591c09e401a307c2b086))
- added support ukraine banner on index page ([e1af8fe](https://github.com/vitalyiegorov/suuudokuuu/commit/e1af8fe28f5757bb7ec341e5b539a0bf6ec2781c))
- added todo ([826f5a7](https://github.com/vitalyiegorov/suuudokuuu/commit/826f5a7fb7085329eb3456757e4490d7eb6db693))
- added turbo ([25e4241](https://github.com/vitalyiegorov/suuudokuuu/commit/25e4241297c34da7d13786efc126263fadb7eb8e))
- added turbo ([9fca8c7](https://github.com/vitalyiegorov/suuudokuuu/commit/9fca8c7a36ebc9a859bd68da3f6b1dfbd9b32188))
- added value selection check for empty selected cell ([0d7885c](https://github.com/vitalyiegorov/suuudokuuu/commit/0d7885ccee0267239e5028182c223fe3d1173d49))
- added value selection check for empty selected cell ([cac5dae](https://github.com/vitalyiegorov/suuudokuuu/commit/cac5dae36b9bb2015f8787423dcb2c51b962e190))
- added values progress bar ([e90515d](https://github.com/vitalyiegorov/suuudokuuu/commit/e90515de299ffa5e3f7fc7a1e0d4109f2c7f7141))
- changed elapsed time text to be timer text ([3b60453](https://github.com/vitalyiegorov/suuudokuuu/commit/3b604538673e42fea65819e2bef3042d5effce90))
- fixed animation for row/col/group ([8d0be05](https://github.com/vitalyiegorov/suuudokuuu/commit/8d0be0589c87fdfaccbfc320f9f6c9757c345328))
- fixed testflight encryption compliance ([7a740d3](https://github.com/vitalyiegorov/suuudokuuu/commit/7a740d3bc92c6ea72ccaabf2f4826c6f7c29b097))
- fixed x/y ([207e238](https://github.com/vitalyiegorov/suuudokuuu/commit/207e2383f35a4a3ba6c477b7f5635ebe0101dad5))
- fixed x/y ([00f5021](https://github.com/vitalyiegorov/suuudokuuu/commit/00f5021dca474bca13deffad7f550fe3c7729325))
- improved group border style ([7bc9f0e](https://github.com/vitalyiegorov/suuudokuuu/commit/7bc9f0e5d56d60be30619dc2d8b79434f7a43b97))
- improved mechanics on selecting correct value ([4596e5b](https://github.com/vitalyiegorov/suuudokuuu/commit/4596e5bd0d75f5e3eecc528ef23999f24d799602))
- improved web styling ([b804853](https://github.com/vitalyiegorov/suuudokuuu/commit/b8048531d6bf6ef90e26cd5b1c869b40ecafd9ec))
- moved rendering logic to the cell, fixed x/y ([8e409ec](https://github.com/vitalyiegorov/suuudokuuu/commit/8e409eca8951d4aa8ffd5e824146d0dc3a5b2e1c))
- moved rendering logic to the cell, fixed x/y ([d9dfb94](https://github.com/vitalyiegorov/suuudokuuu/commit/d9dfb94e00d0a864c5be6224018f983d9242487d))
- optimized cell rendering ([d2e8f1f](https://github.com/vitalyiegorov/suuudokuuu/commit/d2e8f1ffd9a095e8323f11bb0929c0f4badbe75a))
- optimized cell rendering ([c9b1785](https://github.com/vitalyiegorov/suuudokuuu/commit/c9b1785097847977d862f56a416793ece39a5343))
- optimized field re-renders, changed history action and logic ([9cfe68f](https://github.com/vitalyiegorov/suuudokuuu/commit/9cfe68fc0fdce47093fe6f3065e020027fb41b08))
- optimized scoring, react and sudoku class integration ([a2c824e](https://github.com/vitalyiegorov/suuudokuuu/commit/a2c824e4b139129bf34d3f0b9d760c9394c750d3))
- refactored available values progress coloring through theme ([b86c3ee](https://github.com/vitalyiegorov/suuudokuuu/commit/b86c3ee2f5be64fca9bae5f2a042e5de31bc90ac))
- removed idea ([04c4309](https://github.com/vitalyiegorov/suuudokuuu/commit/04c4309460be0115fd2368c6246ab5fd4affd568))
- removed idea ([8498733](https://github.com/vitalyiegorov/suuudokuuu/commit/84987331e83fb0c00fea60138753514dff32d586))
- started creation of game logic class with string representation ([51e43e3](https://github.com/vitalyiegorov/suuudokuuu/commit/51e43e32bbbb52099d93f022d96d4ca2caf76d21))
- started creation of game logic class with string representation ([f2c303d](https://github.com/vitalyiegorov/suuudokuuu/commit/f2c303d85fd41f9019c0f5368b1da5f70d355044))
- updated privacy policy ([ac499d1](https://github.com/vitalyiegorov/suuudokuuu/commit/ac499d12882fa643281037a23fe2b9cfdbe8396e))
- working basic flow ([3d413dd](https://github.com/vitalyiegorov/suuudokuuu/commit/3d413dd5ae607b65f849be235bfaec77d1690ad4))

### Bug Fixes

- adaptive cell size and font based on the platform ([1bf2485](https://github.com/vitalyiegorov/suuudokuuu/commit/1bf2485f632209e3b3090381b5a647b0ea5fc49b))
- added eslintignore ([9cf8a8f](https://github.com/vitalyiegorov/suuudokuuu/commit/9cf8a8f1eaea36a15e91bd5c70ba6109b6514b62))
- added hours support to timer text ([3219e25](https://github.com/vitalyiegorov/suuudokuuu/commit/3219e25d3bd98d12495b17a00cc0cccab763c2a9))
- added privacy policy ([25541de](https://github.com/vitalyiegorov/suuudokuuu/commit/25541de026ddcd040335b28a08679cc64bde94af))
- added web version page titles, fixed haptic error on web ([91d29b5](https://github.com/vitalyiegorov/suuudokuuu/commit/91d29b5df5b9064bb4540f742bd9c18b9535fce0))
- app version generation ([46c293a](https://github.com/vitalyiegorov/suuudokuuu/commit/46c293aca7b8ec0d7b93f15d19ee231fb202464c))
- app version generation ([6904892](https://github.com/vitalyiegorov/suuudokuuu/commit/69048922799b460c02b1b3f27c416a67006ffe4b))
- disabled navigation gestures ([dfe44a1](https://github.com/vitalyiegorov/suuudokuuu/commit/dfe44a1fda7a38bf76f453547804913f4640904d))
- excluded ios/android from git ([797803b](https://github.com/vitalyiegorov/suuudokuuu/commit/797803bac28fc580c5d62cd792b35a8ed9b9a84c))
- fixed alert/confirm for the web ([788ce13](https://github.com/vitalyiegorov/suuudokuuu/commit/788ce13239455ed493b89e1765c80890da673aff))
- fixed available value missing bug ([56f3be5](https://github.com/vitalyiegorov/suuudokuuu/commit/56f3be56355035f77f147bceaed13730b80f48c2))
- fixed available values ([3a541cc](https://github.com/vitalyiegorov/suuudokuuu/commit/3a541cc73084e5a631560dc9f8de1124b3423843))
- fixed cell light theme colors ([313b1e9](https://github.com/vitalyiegorov/suuudokuuu/commit/313b1e942f677158bad553ab131d8f90364a750b))
- fixed cell light theme colors ([0651f74](https://github.com/vitalyiegorov/suuudokuuu/commit/0651f746a01ec8be27b9beaef8237203e52bafda))
- fixed cell light theme colors ([265d5ef](https://github.com/vitalyiegorov/suuudokuuu/commit/265d5ef9c6cd2cb7cb4fb1bbb9e9d3ee50ad8c19))
- fixed cell rendering logic, redux issues ([12cf89a](https://github.com/vitalyiegorov/suuudokuuu/commit/12cf89a0dbaeb10e0778c7f0273fc901601ace11))
- fixed closing app on running game and continue - stopped timier ([66211f6](https://github.com/vitalyiegorov/suuudokuuu/commit/66211f6c47801dfae53fdffee4a57f0276906121))
- fixed difficulty, and empty column dots ([641b946](https://github.com/vitalyiegorov/suuudokuuu/commit/641b946560c81eb36139612386bc32d7638cf932))
- fixed expo deps ([2e810c2](https://github.com/vitalyiegorov/suuudokuuu/commit/2e810c25f85553a8e6812d939d0f677fa5e7f99b))
- fixed game duration ([5ba9c2a](https://github.com/vitalyiegorov/suuudokuuu/commit/5ba9c2a6ba913bea3e7bd2bf70172ce1f1a94da8))
- fixed game finish state ([9feb146](https://github.com/vitalyiegorov/suuudokuuu/commit/9feb146b0d67dbeb74d80db79c5631eabc402113))
- fixed history ([5aea8ad](https://github.com/vitalyiegorov/suuudokuuu/commit/5aea8add7b4ba85564a1651bb6f67567ba1aa518))
- fixed imprting expo app.json to get version ([c22a956](https://github.com/vitalyiegorov/suuudokuuu/commit/c22a956e51be96cfda898287e79b154939603d8a))
- fixed privacy policy return button ([6851cbe](https://github.com/vitalyiegorov/suuudokuuu/commit/6851cbed1d903cc6f971962f4d0eaaa7a5ab0aa0))
- fixed row/col/group score calculation ([a9e5a83](https://github.com/vitalyiegorov/suuudokuuu/commit/a9e5a8348f957343032382db404c1c4f24cb826b))
- fixed score reset on win/lose, added history state ([87b55fe](https://github.com/vitalyiegorov/suuudokuuu/commit/87b55fe85279409d6f5f56764a943bc03b540cdd))
- fixed state migration ([2283040](https://github.com/vitalyiegorov/suuudokuuu/commit/2283040f7bd018dee451cb47dfbbb3fd7ba49b78))
- fixed state score calculation ([dd07432](https://github.com/vitalyiegorov/suuudokuuu/commit/dd07432af151ca4c816508d1f04351b5cf4bf8d8))
- fixed styling across platforms, negative score ([b58fe91](https://github.com/vitalyiegorov/suuudokuuu/commit/b58fe917ce3e40e654c106d51f98c7863ef0297b))
- fixed timer start/stop on pause/return ([77ba27c](https://github.com/vitalyiegorov/suuudokuuu/commit/77ba27c6e44ebc337bd202c24ca44b2b1f6abbad))
- fixed win/loose play again button ([de926eb](https://github.com/vitalyiegorov/suuudokuuu/commit/de926eb1d7dc979a237f4b92561d12784c8c699f))
- main screen history stats when no data ([768b23d](https://github.com/vitalyiegorov/suuudokuuu/commit/768b23dc0480c750ea80269c34935dd1bb6007c8))
- mistakes count to loose, incapsulated field/cell logic into sudoku ([393dcd5](https://github.com/vitalyiegorov/suuudokuuu/commit/393dcd514ba760adae803c7b0463d00105877054))
- optimized cell rendering ([8d714ec](https://github.com/vitalyiegorov/suuudokuuu/commit/8d714ecc5aaaf06e3ad14f1d894465ded69649e0))
- possible values re-rendering ([42313ce](https://github.com/vitalyiegorov/suuudokuuu/commit/42313ce5cec1dffbf0d24c4d08109c929b8f5ca8))
- remove coverage from git ([8e63099](https://github.com/vitalyiegorov/suuudokuuu/commit/8e6309924e6422bc16d0afc52734b321c3065119))
- removed ios folder ([140b192](https://github.com/vitalyiegorov/suuudokuuu/commit/140b19252bf03ef324b837daf973384fe2bc990c))
- theme automatic ([95b34ba](https://github.com/vitalyiegorov/suuudokuuu/commit/95b34ba69c58aaed44807bf20c4afd1c6cee6a72))
- web mobile field position ([3035e21](https://github.com/vitalyiegorov/suuudokuuu/commit/3035e212f2f6cf369e42ed7bd6daa52a0c10c4d3))
- web mobile field size ([9eff124](https://github.com/vitalyiegorov/suuudokuuu/commit/9eff124615eb3f22dec50f6561f8f2a10821895f))
- web version routing, small generic improvement in constants ([e94f7bf](https://github.com/vitalyiegorov/suuudokuuu/commit/e94f7bf477050b68e074e86a1b14248d043e5a0c))
- whole support banner is pressable ([632df99](https://github.com/vitalyiegorov/suuudokuuu/commit/632df990e7ce2748127b606cf6309cf43f1fd405))
- winner screen elapsed text ([7783bb7](https://github.com/vitalyiegorov/suuudokuuu/commit/7783bb782f12973239eddf4c9d38d2adb8f5ac90))
