---
name: effect
description: Mandatory before writing or reviewing ANY logic in this repo - async, IO, errors, services, SQL persistence, background work, React data fetching, state, logging, time, concurrency or tests. All logic is Effect v4 (effect@4); load this skill first.
---

# Effect in Suuudokuuu

Every effectful line is Effect. No Promise/async logic, `try`/`throw`, `new Promise`, `setTimeout` loops or cancelled-flag fetches outside the edges below. Pure code (grid math, solvers, parsers, encoders, mappers) stays plain TypeScript.

## API truth, in order

1. `node_modules/effect/AGENTS.md` and `node_modules/effect/ai-docs/src/**` (ships with the pinned version), then `node_modules/effect/dist/*.d.ts` and `node_modules/effect/src`.
2. `https://github.com/Effect-TS/effect/blob/main/LLMS.md`.
3. The repo's root `AGENTS.md` "## Effect" section and `packages/app/AGENTS.md` "State And Persistence".
4. Migrating leftover v3 code: the `effect-v3-to-v4` skill. Never write v3 APIs (`Effect.Service`, `Context.Tag`, `catchAll`); v4 is `Context.Service`, `Effect.catch`.

## Repo layout

- `packages/progress` (`@suuudokuuu/progress`): persisted row models (`Model.Class` / `Schema.Struct`), JSON-column schemas, the migration record, reactivity key constants, repositories, tagged errors, and the domain services (current run, finishing a run into history and stats, legacy import).
- `packages/app`: platform SQL layers (native op-sqlite, web wa-sqlite), `src/@generic/runtime/app.runtime.ts` (provides progress's `ProgressLayer`), atom helpers, boot gate. No unit tests here.
- `tests/test-kit` (`@suuudokuuu/test-kit`): `makeTestSqlLayer()` (in-memory SQLite + progress migrations + Reactivity) and the shared Vitest config.

## Repo patterns

- Imports by subpath only: `import * as Effect from 'effect/Effect'`, never the `effect` barrel.
- Functions: service methods are `m: Effect.fn('X.m')(function* (...) {...})` in the object returned by `make`, named after the service; hot-loop helpers are `make` locals with `Effect.fnUntraced`. A method whose body is one call is a plain arrow `m: (a: A) => dep.m(a)`, with no `Effect.fn`. Pass another service's method as a value only through an arrow.
- Services: every service and repository is `class X extends Context.Service<X>()('@suuudokuuu/<pkg>/X', { make: Effect.gen(function* () { const dep = yield* Dep; ...; return { m } }) }) { static readonly layer = Layer.effect(X, X.make).pipe(Layer.provide(Dep.layer)) }` (`make: Effect.succeed({...})` without dependencies). No constructors, no `this`: dependencies resolve once at the top of `make`; helpers, constants and state are `make` locals. Callers use only the tag (`yield* X`, `Effect.flatMap(X, x => ...)`, never `X.use`). Pure code stays plain with no tag. Register each layer in progress's `ProgressLayer`.
- SQL: repositories are services over `SqlClient.SqlClient`, returning Effects; atomic work is `sql.withTransaction(effect)`. Schema changes are a new migration in the progress migration record, never an edit of a shipped one. Everything above the platform layer depends only on `SqlClient` and `Reactivity`.
- Errors: typed channel only. `Schema.TaggedError` classes in `error/<name>.error.ts`, created only when a caller branches on them; everything else is a defect (`Effect.orDie`). Wrap foreign Promise/SDK/native calls with `Effect.tryPromise`/`Effect.try` at that boundary only. Recover only at edges with `Effect.catchTag`/`catchTags`/`catch`. Log failures once at the edge.
- Validation: Effect `Schema` at boundaries (`Schema.decodeUnknownEffect`, `Schema.fromJsonString` for JSON columns). No zod.
- Concurrency and time: `Schedule`, `Effect.retry`/`repeat`, `Effect.timeout`, `Effect.sleep`, `Semaphore`, `FiberMap`/`FiberSet`, `Effect.acquireRelease`. No `Promise.race`, generation counters or boolean cancel flags.
- Reactivity: reads are atoms (`appAtomRuntime.factory.withReactivity([keys])(appAtomRuntime.atom(effect))`, families via `Atom.family`) read with `useAtomValue` or the keep-last-value live hook. Every repository write is wrapped in `reactivity.mutation([keys], effect)` with key constants from progress. The run clock has its own key.
- Runtime edges (`packages/app/src/@generic/runtime/app.runtime.ts`): `appRuntime` (`ManagedRuntime`) runs commands via `runPromise` / `runFork`; the rejection is the original error, so `getErrorMessage(error)` keeps working. When an effect must start from `useEffect`, `runFork` and interrupt the fiber in cleanup. Never `useEffect` + async + cancelled flag.
- Boot: a keep-alive atom runs migrations and the legacy import; the root layout renders nothing until it succeeds.
- Logging: use `Effect.logDebug`/`logError` and `Effect.tapCause(Effect.logError)` at edges. Never `console.*`.
- Tests: Vitest with `@effect/vitest`, `it.effect` (and `it.layer` for shared layers) in `packages/<pkg>/test/**/*.test.ts` and `tests/*`, never `async` test bodies or `runPromise` inside a test. Provide the database with `makeTestSqlLayer()` from `tests/test-kit`. Assert failures with `Effect.flip`/`Effect.exit`; time-dependent tests use `TestClock`. `app` and `landing` host no test files.

## Before finishing

`yarn ts && yarn lint`; check no `async`, `await`, `try`, `throw`, `new Promise`, `Effect.runPromise`/`runSync` in services.
