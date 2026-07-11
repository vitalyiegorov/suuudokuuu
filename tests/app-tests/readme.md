# Suuudokuuu App Tests

Maestro scenarios cover home, game start/quit, win/loss, statistics and replay, settings, persisted resume, and background/foreground pause behavior.

CI installs an embedded Release E2E app and runs `scripts/run-maestro-suite.sh` with `APP_ID` and `SIMULATOR_UDID`; it does not depend on Metro or a development-client URL. For local dev-client testing, run `launch-dev-client.flow.yaml` once after loading the project. The suite runner primes the iOS custom scheme, starts each selected numbered flow in a fresh Maestro/XCTest session, preserves app data between flows, and merges JUnit output. Each scenario returns to the active Home tab before stopping; `relaunch-home.flow.yaml` covers explicit persistence behavior.

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
