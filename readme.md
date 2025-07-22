[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://stand-with-ukraine.pp.ua)

# Suuudokuuu

> Sudoku game to help **_Ukraine_** win the war against `russia`.

Unique modern open source React Native/ Expo Sudoku game with a lot of features.

## Features

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

> These strict rules ensure that the code is of high quality, secure, and maintainable.
> Also this is very helpful for Copilot and other AI tools

#### Pull requests

Each pull request creates an EAS preview for the `iOS`, `Android` and `Web` platforms, all info is published as comments to the PR, and deployment is created.

##### Testing

For testing the PR native builds:

- [Register your IOS device](https://expo.dev/register-device/c1da1a6e-616b-40a3-93ba-45bef53696e5)
- [Install Development build](https://expo.dev/accounts/vitalyiegorov/projects/suuudokuuu/builds/e42efd58-74cf-48be-bdf1-ebc51cde1d6

#### Master branch

Each commit to the `master` branch creates an EAS update for the `iOS`, `Android` and `Web` production platforms.

> Production Web is hosted on [Vercel](https://vercel.com/), maybe we will migrate to EAS hosting when it becomes stable.

## Play now! Do not hesitate

[![Download on the App Store](packages/app/assets/appstore-badge.png)](https://apps.apple.com/ua/app/suuudokuuu/id6449440933)
[![Download on the Play Market](packages/app/assets/google-play-badge.png)](https://apps.apple.com/ua/app/suuudokuuu/id6449440933)

### [Play directly in your browser!](https://www.suuudokuuu.com/)

## Packages

- [app](packages/app/readme.md) - React Native / Expo application package
- [generator](packages/generator/readme.md) - Sudoku puzzle generator
- [app-tests](tests/app-tests/readme.md) - Maestro tests for the app package
