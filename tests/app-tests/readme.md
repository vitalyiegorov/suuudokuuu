# Suuudokuuu App Tests

Maestro scenarios cover home, game start/quit, win/loss, statistics and replay, settings, persisted resume, and background/foreground pause behavior.

On a fresh simulator, run `launch-dev-client.flow.yaml` before the scenario suite. It loads the project and primes the iOS confirmations for the dev-client and `suuudokuuu://` URL schemes. Scenario launches preserve the installed app container because reinstalling would invalidate that system trust. Each scenario returns active gameplay to a stable home state through shared teardown, while `relaunch-home.flow.yaml` covers explicit persistence behavior.

## TODO

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
