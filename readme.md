[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://stand-with-ukraine.pp.ua)

# Suuudokuuu

Sudoku game to help Ukraine win the war against Russia.

## Play now! Do not hesitate

[![Download on the App Store](./assets/appstore-badge.png)](https://apps.apple.com/ua/app/suuudokuuu/id6449440933)

### [Play directly in your browser!](https://www.suuudokuuu.com/)

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

-   [ ] improve logic code coverage
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

-   [ ] setup maestro e2e tests on CI pull request
-   [x] android build for main branch should be published to play console
-   [x] ios/android builds should be published as artifacts so team members can test them
-   [x] setup conventional commits, automatic version management and changelog generation(ios, android also)
-   [x] setup pull-request pipeline for linting, tests, etc
-   [x] ios build for main branch should be published to testflight

### E2E

-   [ ] Create separate flows for described items
-   [ ] Pass selectors from `typescript selector files`
-   [ ] Cannot select value if not empty cell selected
-   [ ] Deselect cell if value is completed
-   [ ] Leave cell selection if value is not completed
-   [ ] Animations:
    -   [ ] Select cell animation
    -   [ ] Complete row animation
    -   [ ] Complete col animation
    -   [ ] Complete group animation
    -   [ ] Complete value animation
    -   [ ] Win animation
-   [ ] Win scenario:
    -   [ ] Win score and time
-   [ ] Loose scenario:
    -   [ ] Win score and time
-   [ ] Pause scenario:
    -   [ ] Return to game after pause
    -   [ ] No pause on other screens(win, loose, home)
    -   [ ] Reset app after pause
-   [ ] Score calculation
-   [ ] Best game on home page

### Overall

-   [ ] add sentry for error reporting
-   [ ] migrate to monorepo
-   [x] add e2e tests(maestro or wdio?)
-   [x] add turbo
-   [x] fix metro require cycles (store related as usual) =)
-   [x] add unit tests for game logic, add code coverage([codecov](https://about.codecov.io)?)
-   [x] add ts-prune
-   [x] add jscpd
-   [x] add commit-lint
-   [x] add husky
-   [x] fix ts error on app.json import
-   [x] refactor folder structure to modules(game, app-root, history)
-   [x] setup eas
-   [x] setup iphone deployment
-   [x] add github actions
