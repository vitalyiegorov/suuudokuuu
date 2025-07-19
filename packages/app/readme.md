# Suuudokuuu App

React Native / Expo application package

## TODO

- [ ] add lingui
- [ ] add styling library
- [ ] extract logic for processing sudoku game into separate package
- [ ] setup maestro e2e tests on CI pull request
- [ ] add sentry for error reporting
- [ ] migrate game logic to RxJS
- [ ] add `master` branch dev build, master app build, CI/CD and certificates for iOS and Android
- [ ] add `production` branch and CI/CD for production release

### Puzzle generation

- [ ] optimize puzzle generation performance
- [ ] optimize puzzle processing performance
- [ ] add 90%+ code coverage and extensive test cases
- [ ] add unique check for generated field, sometimes puzzle can have multiple solutions
- [ ] use DHX for puzzle generation/solving

### UI/UX

- [ ] add hints in the cells for possible values, switching this mode on/off
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
