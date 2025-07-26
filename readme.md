[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://stand-with-ukraine.pp.ua)

# Suuudokuuu

> Sudoku game to help **_Ukraine_** win the war against `russia`.

Unique. modern, open source [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/) Sudoku game with a lot of features.

Feel free to create an `issue`, `feature request` or `pull request` if you have any **_suggestions_** or **_ideas_**.

## Play now! Do not hesitate

| [![Play directly in your browser!](packages/app/assets/chrome.png)](https://www.suuudokuuu.com/) | [![Download on the App Store](packages/app/assets/appstore-badge.png)](https://apps.apple.com/ua/app/suuudokuuu/id6449440933) | [![Download on the Play Market](packages/app/assets/google-play-badge.png)](https://apps.apple.com/ua/app/suuudokuuu/id6449440933) |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |

![Play directly in your browser!](packages/app/assets/gameplay.gif)]

## Features

### Monorepo architecture

Project is using a monorepo approach with [TurboRepo](https://turborepo.com/) to manage multiple packages in a single repository.

### Internalization(i18n)

The app supports multiple languages, which is detected by [expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/) including:

- Ukrainian
- English
- French
- German
- Spanish

> i18n is implemented using [Lingui](https://lingui.dev/) library

### Enterprise-grade CI/CD

[EAS](https://expo.dev/eas) over the air updates are used to deliver the PRs and production updates to the users, 2 channels are used:

- `development` - for the pull requests
- `production` - for the master branch

All changes are represented as `pull requests`, each pipeline runs:

- [Linting](https://eslint.org/) to ensure code quality
- [Type checking](https://www.typescriptlang.org/) to ensure type safety
- [Unit tests](https://jestjs.io/) to ensure code correctness
- [Copy-paste detection](https://github.com/kucherenko/jscpd) to ensure code uniqueness
- [Dead code detection](https://knip.dev/) to ensure code cleanliness
- [CodeQL](https://codeql.github.com/) to ensure code security
- TODO: [Maestro tests](https://maestro.mobile.dev/) to ensure app functionality

> These strict rules ensure that the code is of high quality, secure, and maintainable.
> Also this is very helpful for Copilot and other AI tools

#### Pull requests

Each pull request creates an EAS preview for the `iOS`, `Android` and `Web` platforms, all info is published as comments to the PR, and web deployment is created.

#### Master branch

Each commit to the `master` branch creates an EAS OTA update for the `iOS`, `Android` and `Web` production platforms.

> Production Web is hosted on [Vercel](https://vercel.com/), maybe we will migrate to EAS hosting when it becomes stable.

#### [AppStore](https://www.apple.com/app-store/) and [Google Play](https://play.google.com/console)

Special manual [GitHub Workflow](./.github/workflows/native-publish.yml) is used to build and publish the app to the stores.

> For the iOS app is published ti the TestFlight, for the Play Market it is published to the internal testing track.

Then after manual review the app can be published to the production track.

#### Internal distribution and testing

For testing on `real devices` special manual [GitHub Workflow](./.github/workflows/native-dev-build.yml) is used to build the app for internal distribution.

> You need to register your device in the Expo dashboard to be able to install the development build.

[Register your IOS device](https://expo.dev/register-device/c1da1a6e-616b-40a3-93ba-45bef53696e5)

### Auto-candidates

The app supports auto-candidates mode, which allows you to fill the candidates automatically based on the current state of the board.

### Web keyboard support

Use your arrow keys to navigate through the Sudoku board, press any number `1-9` to fill the cell.

> `Tab` activates auto-candidate mode

### Sharing puzzles

You can share the current puzzle with your friends via a link, which will open the app with the same puzzle, score, mistakes and timer.

### Theming support

You can switch between light and dark themes, OS/Browser theme is detected automatically initially.

> [React navigation theming](https://reactnavigation.org/docs/themes/)
>
> [React native - Appearance](https://reactnative.dev/docs/appearance)
>
> [React native - useColorTheme](https://reactnative.dev/docs/usecolorscheme)

### Universal links

Sharing a link to `https://suuudokuuu.com/` will open the app on your device if it is installed, otherwise it will open the web version of the app.

> [Expo iOS Universal Links](https://docs.expo.dev/linking/ios-universal-links/)

## Packages

- [app](packages/app/readme.md) - React Native / Expo application package
- [generator](packages/generator/readme.md) - Sudoku puzzle generator
- [app-tests](tests/app-tests/readme.md) - Maestro tests for the app package
