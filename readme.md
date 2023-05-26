# Suuudokuuu
Sudoku game to help Ukraine win the war against Russia.

[Play now!](https://www.suuudokuuu.com/)

## TODO
### Features
- [ ] add mistakes purchasing through in-app purchases
    - [ ] donate to ZSU, add BE logic for this
    - [ ] add donation branding and description on main screen
- [ ] add gamification and percentage of completeness

### Frontend
- [ ] add animations
    - [ ] add number flying to its stop?
    - [ ] add more fun to winner page(ZSU, Ukraine, donation CTA)
    - [ ] add more fun to looser page(ZSU, Ukraine, donation CTA)
- [ ] add successful run count and longest run count history on main screen?
- [ ] add donation CTA on main screen
- [x] add game logic:
  - [x] timer
  - [x] score and its calculation based on errors, timer, row/col/group finish
- [x] optimize rendering(why does it lag? =)

#### Web
- [ ] fix mobile version padding
- [x] add pages titles
- [x] fix font issue

### Backend
- [ ] setup backend, app should still support full offline mode support
- [ ] add user creation and logic
- [ ] store user solved puzzle, add time, score, rank for same puzzle
- [ ] create leaderboards

### Overall
- [ ] add commitlint
- [ ] migrate to monorepo
- [ ] setup github actions for releases and release management
- [ ] setup github actions for PRs, create web, expo previews
- [ ] add e2e tests(maestro)
- [ ] setup android build and deployment
- [ ] setup [eas submit](https://docs.expo.dev/submit/eas-json/) credentials and github action
- [x] setup eas
- [x] setup iphone deployment
- [x] add github actions
