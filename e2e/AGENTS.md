# E2E Suite

The iOS E2E suite: one [tester-army e2e](https://github.com/tester-army/e2e) test per numbered Maestro flow in `tests/app-tests/flows`, same name, same sections, same assertions. CI (`mobile-e2e.yml`, mobile-ci's `ios-maestro.yml` with `test-framework: e2e`) runs it from a Linux runner against iPhone 17 Pro simulators leased from the simlock farm, on the repacked E2E app. Android still runs the Maestro flows.

It is a standalone npm project, not a pnpm workspace member: mobile-ci hashes this directory into its result-cache key and installs it with `npm ci`.

## Layout

- `e2e.config.ts`: the `ios` target, its simlock device provider and the app under test (`E2E_APP_PATH`, `E2E_APP_ID`).
- `support/simlock/`: the simlock provider, boot relay, exec API and the E2EDrop helper app. Vendored byte-identical from the other repositories on the farm: never edit it here, which is why oxlint and knip skip it.
- `support/suuudokuuu/core.ts`: locators and assertions with Maestro's matching rules, and `Suuudokuuu.start(fixture?)`, which prepares the leased simulator once (English, Reduce Motion, the deep-link prompt), removes the app database, installs `tests/app-tests/fixtures/databases/<fixture>.db` when given, and launches to Home.
- `support/suuudokuuu/game.ts`: the Maestro subflows.
- `tests/<flow>.e2e.ts`: one per numbered flow.

## Rules

1. Every test starts from `suuudokuuu.start()`: tests share simulators and run in any order, so none may rely on another's state.
2. React Native exposes every testID twice; select by testID with `byId` (`.first()`).
3. Text matches the whole string case-insensitively, as Maestro does: `byText`/`expectText` with a string; pass a `RegExp` for a partial match.
4. Nothing host-side may need macOS tools (`xcrun`, `sqlite3`): the suite runs on Linux. Reach the simulator through `support/simlock/exec.ts`.
5. A port is done when it passes twice in a row with `E2E_RETRIES=0`.

## Running

```bash
cd e2e && npm ci
SIMLOCK_URL=https://simlock.vitaliiyehorov.dev SIMLOCK_TOKEN=<token> E2E_APP_PATH=<path>/Base.app E2E_WORKERS=4 npx e2e run --target ios
```

Download the app from a run of `mobile-e2e.yml`: `gh run download <run> -n ios-e2e-app-e2e`. A failure's `.e2e/results/*/trace.md` holds every step and the accessibility tree at the failure.
