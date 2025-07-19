[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://stand-with-ukraine.pp.ua)

# Suuudokuuu

Sudoku game to help Ukraine win the war against Russia.

## Play now! Do not hesitate

[![Download on the App Store](./assets/appstore-badge.png)](https://apps.apple.com/ua/app/suuudokuuu/id6449440933)

### [Play directly in your browser!](https://www.suuudokuuu.com/)

## TODO

- [ ] add android
- [ ] add lingui
- [ ] add styling library
- [ ] migrate to monorepo
    - [ ] extract logic for processing sudoku game into separate package
- [ ] setup maestro e2e tests on CI pull request
- [ ] add sentry for error reporting
- [ ] migrate game logic to RxJS

### Puzzle generation

- [ ] optimize puzzle generation performance
- [ ] optimize puzzle processing performance
- [ ] add 90%+ code coverage and extensive test cases
- [ ] add unique check for generated field, sometimes puzzle can have multiple solutions

### UI/UX

- [ ] add gamification and percentage of completeness
- [ ] best stats is confusing and not clear, especially time:
    - [ ] add best time/score for each difficulty, when user selects difficulty show separate screen
- [ ] add animations
    - [ ] add number flying to its stop?
    - [ ] add more fun to winner page(ZSU, Ukraine, donation CTA)
    - [ ] add more fun to looser page(ZSU, Ukraine, donation CTA)
- [ ] add winner confetti?

### E2E

- [ ] Create separate flows for described items
- [ ] Pass selectors from `typescript selector files`
- [ ] Cannot select value if not empty cell selected
- [ ] Deselect cell if value is completed
- [ ] Leave cell selection if value is not completed
- [ ] Animations:
    - [ ] Select cell animation
    - [ ] Complete row animation
    - [ ] Complete col animation
    - [ ] Complete group animation
    - [ ] Complete value animation
    - [ ] Win animation
- [ ] Win scenario:
    - [ ] Win score and time
- [ ] Loose scenario:
    - [ ] Win score and time
- [ ] Pause scenario:
    - [ ] Return to game after pause
    - [ ] No pause on other screens(win, loose, home)
    - [ ] Reset app after pause
- [ ] Score calculation
- [ ] Best game on home page
