# Suuudokuuu

Sudoku game to help Ukraine win the war against Russia.

[Play now!](https://www.suuudokuuu.com/)

## TODO

### Features

-   [ ] share puzzle/challenge with friends:
    -   [ ] challenge mode - see target score and countdown timer based on shared data
-   [ ] add mistakes purchasing through in-app purchases
    -   [ ] donate to ZSU, add BE logic for this
    -   [ ] add donation branding and description on main screen
-   [ ] add gamification and percentage of completeness
-   [ ] add game pausing? timer should not run when app is in background
-   [ ] disable screenshots?
-   [ ] add unique check for generated field, sometimes puzzle can have multiple solutions
-   [ ] best stats is confusing and not clear, especially time:
    -   [ ] add best time/score for each difficulty, when user selects difficulty show separate screen
-   [x] score row completing row/col/group

### Frontend

-   [ ] add donation CTA on main screen and ukraine support
-   [ ] add animations
    -   [ ] add number flying to its stop?
    -   [ ] add more fun to winner page(ZSU, Ukraine, donation CTA)
    -   [ ] add more fun to looser page(ZSU, Ukraine, donation CTA)
    -   [x] animation when finishing full row/col/group(score multiplies)
-   [ ] add successful run count and longest run count history on main screen?
-   [x] add game logic:
    -   [x] timer
    -   [x] score and its calculation based on errors, timer, row/col/group finish
-   [x] optimize rendering(why does it lag? =)

#### Web

-   [x] fix mobile version padding and field size
-   [x] add pages titles
-   [x] fix font issue

### Backend

-   [ ] setup backend, app should still support full offline mode support
-   [ ] add user creation and logic
-   [ ] store user solved puzzle, add time, score, rank for same puzzle
-   [ ] create leaderboards

### CI/CD

-   [ ] setup github actions hosted runners for ios build
    -   [ ] setup fastlane for testflight publication
-   [ ] setup github actions hosted runners for android build
-   [ ] setup conventional commits, automatic version management and changelog generation(ios, android also)
-   [ ] setup pull-request pipeline for linting, tests, etc
    -   [ ] ios/android builds should be published as artifacts so team members can test them

### Overall

-   [ ] add unit tests for game logic, add code coverage([codecov](https://about.codecov.io)?)
-   [ ] fix metro require cycles (store related as usual) =)
-   [ ] add sentry for error reporting
-   [ ] migrate to monorepo
-   [ ] add e2e tests(maestro or wdio?)
-   [x] add ts-prune
-   [x] add jscpd
-   [x] add commit-lint
-   [x] add husky
-   [x] fix ts error on app.json import
-   [x] refactor folder structure to modules(game, app-root, history)
-   [x] setup eas
-   [x] setup iphone deployment
-   [x] add github actions
