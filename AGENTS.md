# AGENTS.md

Suuudokuuu is an open-source Sudoku game built with React Native and Expo. This monorepo has fifteen core packages and one shared test harness: `app` for the game UI and the platform/runtime edge, `ui` for shared React Native components, hooks, and the theme contract, `progress` for the persisted SQL schema, migrations, repositories, reactivity keys, and the player-progress domain services (current run, finishing a run into history and stats, legacy import), `landing` for the static Next.js content and SEO site, `generator` for Sudoku generation and solving, `solver-core` for the shared solver contract, grid utilities, and conformance helpers, `solver-dlx` for the Dancing Links exact-cover solver, `solver-bitmask` for the typed-array bitmask solver, `techniques` for solving-technique detection and the logical-solve driver, `rating` for Sudoku Explainer difficulty rating, `puzzle-forge` for technique-aware puzzle sourcing per difficulty tier, `field-core` for the headless interactive field engine and technique step-script player, `field-dom` for the React DOM board renderer, `encoder` for compact shareable game-state encoding, and `hell-corpus` for the bundled, verified Hell-difficulty and Infinity puzzle corpora. `tests/test-kit` holds the shared Vitest and in-memory SQLite test harness.

Persistence is Effect v4 services over SQLite (op-sqlite on native, wa-sqlite on web) with `@effect/atom-react` atoms for reads. The pre-SQLite redux-persist payload survives only as the one-time legacy import in `packages/progress`.

## Canonical Agent Surfaces

- `AGENTS.md` is the canonical instruction file for Codex and other agents.
- `CLAUDE.md` is a symlink to `AGENTS.md` at the root and in every package scope.
- Package-level `AGENTS.md` files override and refine this root file for their own directories.
- Project skills live in `.agents/skills`. Claude-visible skills in `.claude/skills` must be symlinks to the matching `.agents/skills/<skill>` directory.
- Keep instruction text provider-neutral. Put tool-specific behavior in skills or local/global agent config, not in package docs.

## Commands

```bash
pnpm install

pnpm build
pnpm build:force

pnpm format
pnpm format:check
pnpm ts
pnpm effect:check
pnpm lint
pnpm lint:fix
pnpm deadcode
pnpm cpd
pnpm test

pnpm deps:check
pnpm deps:dedupe
```

Before finishing code changes, run this validation sequence from the root:

```bash
pnpm format && pnpm ts && pnpm effect:check && pnpm lint && pnpm deadcode && pnpm cpd
```

Run `pnpm test` when behavior, algorithms, serialization, persistence, scoring, or app flows change. Run package-specific tests when the blast radius is narrow.

Tooling: `pnpm lint` runs type-aware oxlint once over the whole repo from `.oxlintrc.json`; React and React Compiler rules run natively (write Reanimated shared values with `.set()` so the compiler rules understand them), and rules oxlint has no native port for run as oxlint JS plugins (ESLint plugins, plus local rules in `eslint-rules/`). `pnpm format` runs oxfmt from `.oxfmtrc.json`, which also sorts imports and `package.json` files. `tsc` is native TypeScript 7 (`@typescript/native`); the `typescript` package name resolves to `@typescript/typescript6` so tools that load the compiler JS API keep working.

## Structure

```text
packages/
├── app/                # Expo 58, React Native 0.88, React 19.3 game UI, SQL platform layers, app runtime, boot gate
├── ui/                 # Shared React Native components, hooks, and the theme contract
├── progress/           # Effect v4 persisted schemas, SQL migrations, repositories, reactivity keys, domain services, legacy import
├── generator/          # Pure TypeScript Sudoku generator and DLX solver
├── solver-core/        # Shared solver contract, grid constants, and conformance-test helpers
├── solver-dlx/         # Dancing Links (DLX) exact-cover Sudoku solver
├── solver-bitmask/     # Typed-array bitmask MRV Sudoku solver
├── techniques/         # Pure TypeScript solving-technique detection and logical-solve driver
├── rating/             # Sudoku Explainer style difficulty rating engine
├── puzzle-forge/       # Technique-aware puzzle sourcing: difficulty bands and rejection sampling
├── field-core/         # Headless sudoku field engine and technique step-script player
├── field-dom/          # React DOM board, number pad, and step-player components with plain CSS
├── encoder/            # Binary/LZ encoding for puzzle sharing and replay
├── hell-corpus/        # Bundled, verified Hell (forcing-chain) and Infinity puzzle corpora
└── landing/            # Static Next.js App Router content and SEO site for www.suuudokuuu.com
tests/
├── app-tests/          # Maestro E2E flows
├── test-kit/           # Shared Vitest config and makeTestSqlLayer() in-memory SQLite harness
└── web-tests/          # Playwright web E2E specs
```

## Package Instructions

- Read `packages/app/AGENTS.md` before changing Expo Router routes, React Native UI, the app runtime, atoms, persistence wiring, themes, Lingui text, deep links, sharing, or app assets.
- Read the `## Effect` section below and load the `effect` skill before changing `packages/progress`, `tests/test-kit`, or any service, repository, layer, atom, or SQL migration.
- Read `packages/generator/AGENTS.md` before changing Sudoku generation, validation, navigation, DLX solving, difficulty config, or puzzle interfaces.
- Read `packages/techniques/AGENTS.md` before changing solving techniques, candidate context, strategy ordering, or move classification.
- Read `packages/rating/AGENTS.md` before changing the SE value table, the cheapest-first technique order, ceiling reporting, or the `ratePuzzle` API.
- Read `packages/field-core/AGENTS.md` before changing the headless field engine: snapshots, subscriptions, engine events, candidates and input modes, undo/redo, engine serialization, or the StepScript model, mapper, and player.
- Read `packages/field-dom/AGENTS.md` before changing the React DOM board: component APIs, label contracts, the narration renderer, cell state data attributes, keyboard handling, or `src/styles/field-dom.css` and its `--field-*` custom properties.
- Read `packages/encoder/AGENTS.md` before changing binary formats, solution-step encoding, URL serialization, compression, or decode error behavior.
- Read `packages/puzzle-forge/AGENTS.md` before changing what a difficulty tier means: the per-tier technique bands, blank-cell targets, the attempt budget, or how the app asks for a new board.
- Read `packages/hell-corpus/scripts/build-corpus.mjs` before changing the bundled Hell-difficulty puzzle corpus, its build/verification CLI, or the packed record format.
- Read `packages/landing/AGENTS.md` before changing the landing site: App Router routes, page metadata sidecars, the metadata registry, JSON-LD schema components, `sitemap.ts`, `robots.ts`, `manifest.ts`, or landing copy.
- Read the `@rnw-community/react-native-screen-chrome` and `@rnw-community/react-native-collapsible-header` readmes before changing screen chrome: the app consumes those published primitives and owns only the thin page wrappers in `packages/app/src/@generic/components`.
- Read `.agents/skills/store-media/SKILL.md` before changing store listing metadata, store screenshots, release-notes generation, or `packages/app/fastlane`. It also records the App Store rules that publishing depends on, including the requirement that `packages/app/package.json` stay ahead of the version already released on the App Store; a lower version produces a listing that can never be submitted and cannot be deleted.
- Read `tests/app-tests/AGENTS.md` before changing Maestro flows, test IDs used by flows, deep-link fixtures, or E2E app assumptions.
- Read `tests/app-tests/docs/store-screenshot-capture.md` before changing store-screenshot capture, the seed fixture, the compose pipeline, or before capturing any store screenshots. It is the canonical capture reference: seeded-state fast path, per-platform commands, verification checklist, and the hazards that already burned one release cycle.
- Read `tests/web-tests/AGENTS.md` before changing Playwright web flows, web selectors, or web E2E CI assumptions.

## Engineering Rules

1. Do not use `any`. Model unknown data as `unknown`, validate it, then narrow it.
2. Do not add type assertions such as `as Type`, `@ts-ignore`, or `@ts-expect-error`. `as const` is allowed as a const assertion. Legacy persisted-state migrations are not a precedent for new code.
3. Do not add explanatory code comments. Prefer clearer names and smaller functions. Existing legacy comments are not a pattern to extend.
4. Never add `oxlint-disable` comments without explicit approval unless the exact rule is listed in this file's approved disable section.
5. Use one `const` declaration per variable. Do not create a derived `const` that is used once when inlining it is equally readable, such as `const queryDependencies = [...]` passed straight into one call. Keep a named local when it is needed for hook ordering, type narrowing, repeated use, JSX prop extraction, or genuinely clearer non-trivial logic.
6. Use `emptyFn` from `@rnw-community/shared` for no-op callbacks.
7. Do not use IIFEs. Use `.catch(handleError)` or `.then(onSuccess, onError)` for async fire-and-forget work.
8. Use `getErrorMessage(error)` from `@rnw-community/shared` instead of manual `Error` checks.
9. Use full, descriptive names. Avoid abbreviations such as `cfg`, `idx`, `acc`, `tx`, or `val`.
10. Extract ternaries, boolean chains, and other complex JSX prop logic to named variables before JSX.
11. Use `Pick<EntityInterface, 'field'>` when only specific properties are needed.
12. Do not add wrapper functions that only delegate to another function. A wrapper is acceptable only when it adds meaning, handles an edge case, or is required by a lint rule.
13. Use spread syntax for optional object params: `...(isPositiveNumber(value) && { value })`.
14. Group `useWatch` calls together near the other hooks in React components.
15. Public class methods come before private methods.
16. Always brace control-flow bodies.
17. Keep class boundaries cohesive. One-method classes are functions in disguise. Use a class only when it holds state, several cohesive methods share private helpers, or two or more consumers share the logic.
18. Do not add re-export-only files. Re-export public package API directly from the package `index.ts`.
19. The single-consumer rule covers every artifact type: `*.util.ts`, `*.constant.ts`, reducers, type aliases, mapping records, and discriminated-union action types. Before creating one, grep for the name; if exactly one file imports it, inline it in that consumer (a module-level `const`, or a private member for a class consumer). Never create a single-use util, interface, or wrapper to appease a lint rule or a review comment; fix the underlying design instead. Domain interfaces and enums may live in their own files for navigation even with one consumer.
20. Enum members are `UPPER_CASE` with `UPPER_CASE` string values (`TRANSFER = 'TRANSFER'`). When a pre-existing serialized value (storage key, persisted column, URL parameter) uses another casing, keep the value string and uppercase only the key. Magic strings that name a thing and are referenced at two or more sites (hook states, reducer action types, storage keys, subsystem names) become an enum. This applies to new code; existing enums are migrated opportunistically when touched.
21. Interface fields are `readonly` by default. An interface that is a mutable accumulator becomes a class with explicit mutation methods.
22. Do not reshape existing positional arguments into an object, array, tuple, or new interface to satisfy a lint rule such as `max-params`; split the implementation into smaller functions instead. Do not create single-field interfaces or type aliases: pass the field's value directly.
23. Component files contain imports, the inline `Props`, and the component. Free functions with branching, hooks, and inline anonymous object types above a component belong in their proper module folders or in the child component that consumes them. `lazy(() => import(...))` wrappers count as components and live in their own file so the dynamic-import boundary is a real split point.
24. Do not add hooks that only delegate to another hook plus constants, and do not add hooks whose whole body is one `useEffect` calling one side effect. A hook earns its place only when it composes state, refs, effects, or two or more sources with branching; otherwise inline it into the consumer or hoist the call to the provider that owns the service.
25. A `useEffect` cleanup that must run only on unmount reads its target through a stable ref (updated in a separate effect) with an empty dependency list, never through a function reconstructed each render. After an `await` inside an effect, read downstream values from the awaited result or a fresh ref read, never from the render-time closure.
26. Repeated JSX rows, list items, and card bodies become named components in their own folders; `renderItem` and `.map()` callbacks only select the component and pass props. A component takes at most 8 props. Prop-relay components and boolean mode props are replaced by `children` composition and explicit variant components.
27. Never change app behavior only to satisfy E2E tests. E2E exercises real product behavior; app code may gain a stable selector or accessibility metadata only when that preserves or improves real UI semantics. Otherwise fix the flow, fixture, or harness.
28. Never `git add -f` a path that matches `.gitignore`. Keep it untracked unless the ignore rule itself is intentionally changed in review.
29. Rule 3 applies to every language in the repo, shell, SQL, YAML, and config included. At most one single-line header comment per file; explanations belong in a package doc or the PR description.
30. Over-engineering red flags to refactor before shipping: a config map that a naming convention would replace, parallel scripts that could share one implementation, a test larger than the code it covers, a single-consumer abstraction, and a wrapper that only renames.

## File Organization

- Components live one per folder, with the component file named after the folder.
- Each component file exports one component (lazy wrappers count). Extract sibling JSX helpers, render functions that return JSX, and local subcomponents into their own component folders.
- React component props are named exactly `Props` and declared inline as `interface Props` in the component file. Do not use `type Props` for component props. Use a shared `*PropsInterface` only when the exact same props shape is consumed by multiple components.
- Use composition and explicit variant components instead of growing boolean prop combinations or opaque object prop bags.
- Prefer `children` for primary composed content instead of `render*` props or named content props.
- Reusable utilities live in the owning module's utility folder and use the `.util.ts` suffix, one utility per file. Do not create one-off utilities for a single consumer (see Engineering Rule 19).
- Constants live in the owning module's constant/constants folder, following the package's existing folder convention.
- Interfaces and shared types live in the owning module's interface/interfaces or types folder, following the package's existing folder convention.
- Pure helper functions used by component files live in the owning module's utility folder. Component files may keep module-level data constants, but not named behavior helpers.
- Domain type guards live in a `type-guard` folder with the `.type-guard.ts` suffix when a package introduces that convention.

## Type Guards And Validation

Prefer `@rnw-community/shared` guards before writing manual primitive checks:

- `isDefined(value)` for nullish checks.
- `isNumber(value)` for numbers.
- `isString(value)` for strings.
- `isNotEmptyArray(value)` and `isEmptyArray(value)` for array length checks.
- `isNotEmptyString(value)` for non-empty strings.
- `isPositiveNumber(value)` for positive numbers.

Use `.filter(isDefined)` only when the mapped array can actually contain nullish values. Use Zod or an existing schema for complex external data, persisted JSON, deep-link payloads, and API-style boundaries.

## React And i18n

- React 19 Compiler is enabled for the app. Do not add `React.memo`, `useMemo`, or `useCallback` by default. Use manual memoization only when a framework API explicitly requires a stable callback identity.
- Do not add `forwardRef` for new components. Accept `ref` as a regular prop when React 19 native refs are enough.
- Prefer React's guidance for removing unnecessary Effects before adding state synchronization: https://react.dev/learn/you-might-not-need-an-effect
- Use React 19 ref callback cleanup and compiler-aware ref patterns where refs are the right tool: https://tkdodo.eu/blog/ref-callbacks-react-19-and-the-compiler
- Use the `t` macro for string props and non-JSX strings.
- Use `<Trans>` for direct JSX text children.
- Prefer `<Trans>` in JSX: `<Trans>Score</Trans>` instead of `{t\`Score\`}`.
- Use `plural(...)` from Lingui macros for count-sensitive user-facing text instead of concatenating counts with fixed singular/plural labels.
- Do not call `i18n.t()`. Use `t`, `<Trans>`, `msg`, or `plural` macros so extraction stays static.
- After changing user-facing app text, run `pnpm i18n:sync` from the root or `pnpm --filter @suuudokuuu/app i18n:sync` from the package.
- Before PRs, run `pnpm i18n:check` to prove `messages.po` and generated `messages.ts` files under `packages/app/src/i18n/locales` are current.

## Effect

All effectful logic runs on Effect v4 (`effect`, pinned exactly). API names are authoritative in `node_modules/effect/AGENTS.md`, `node_modules/effect/ai-docs/src/**`, and `node_modules/effect/dist/**/*.d.ts`. Load the `effect` skill before writing or reviewing logic; use `effect-v3-to-v4` when touching leftover v3 code. Never write v3 APIs (`Effect.Service`, `Context.Tag`, `catchAll`); v4 is `Context.Service` and `Effect.catch`.

**Binding.** New logic with IO, state, concurrency, time, or failure is Effect. No `async`/`await`, `try`/`throw`, `new Promise`, `setTimeout` loops, or `useEffect` fetches with cancelled flags except at the runtime edges. Pure code (grid math, parsers, mappers, encoders) stays plain TypeScript with no tag. Existing Promise-based generator, solver, and encoder code is not rewritten.

- **Packages.** `@suuudokuuu/progress` owns persisted schemas, SQL migrations, repositories, reactivity keys, tagged errors, and the domain services built on them. `packages/app` owns the platform SQL layers (native op-sqlite, web wa-sqlite), the app runtime, and the boot gate. Everything above the platform layer depends only on `SqlClient` and `Reactivity`.
- **Services.** Every service and repository is `class X extends Context.Service<X>()('@suuudokuuu/<pkg>/X', { make: Effect.gen(function* () { const dependency = yield* Dependency; return { method }; }) }) { static readonly layer = Layer.effect(X, X.make).pipe(Layer.provide(Dependency.layer)); }`. No constructors and no `this`: dependencies resolve once at the top of `make`, helpers and state are `make` locals, and the returned object is the contract. Callers use only the tag (`yield* X`, `Effect.flatMap(X, service => ...)`, never `X.use`). Layers are static values, so each service is built once per runtime. Do not add a service interface file.
- **Tracing.** Multi-step methods are `Effect.fn('X.method')(function* (...) {...})`. A method whose body is a single call is a plain arrow. Hot-loop helpers use `Effect.fnUntraced`. Never `console.*`.
- **Errors.** Expected failures are `Schema.TaggedError` classes in the module `error/<name>.error.ts`, created only when a caller branches on them; everything else is a defect (`Effect.orDie`). Wrap foreign Promise, SDK, or native calls with `Effect.tryPromise`/`Effect.try` at that boundary only. Recover only at edges (React, boot) with `Effect.catchTag`/`catchTags`/`catch`. Log failures once, at the edge, not inside services.
- **Schema.** Validate unknown external input (deep links, persisted JSON, share payloads) with Effect `Schema` at the boundary (`Schema.decodeUnknownEffect`, `Schema.fromJsonString` for JSON columns), then pass typed values inward. Persisted row models are `Model.Class` or `Schema.Struct` in progress. Service signatures encode invariants: narrow the parameter type instead of accepting a wide input and silently dropping fields.
- **SQL.** Repositories are services over `SqlClient` and return Effects. Schema changes are a new migration added to the migration record in `packages/progress`, never an edit of a shipped migration. Atomic work uses `sql.withTransaction`, never a transaction argument threaded through signatures.
- **Reactivity.** Reads are atoms built from the app atom runtime with `withReactivity([keys])`, read in components with `useAtomValue` (a refreshing atom keeps its previous value, so no extra hook is needed). Every repository write is wrapped in `reactivity.mutation([keys], effect)` using the key constants exported from progress. High-frequency data such as the run clock has its own key so a tick re-renders only its readers.
- **Runtime.** One app `ManagedRuntime` and one atom runtime share a memo map (`packages/app/src/@generic/runtime/app.runtime.ts`). Components run commands with `appRuntime.runPromise`; an effect started from `useEffect` uses `runFork` and interrupts the fiber in cleanup. No `Effect.runPromise`/`runSync` inside services.
- **Concurrency and time.** `Schedule`, `Effect.retry`/`repeat`, `Effect.timeout`, `Effect.sleep`, `Semaphore`, `FiberMap`, `Effect.acquireRelease`. Never `Promise.race`, generation counters, promise-chain mutexes, or boolean cancel flags.
- **Imports by subpath.** `import * as Effect from 'effect/Effect'`, never the `effect` barrel. Metro does not tree-shake, and the barrel adds megabytes to the bundle.
- **Diagnostics.** `pnpm effect:check` runs the `@effect/language-service` diagnostics (severities set in the root `tsconfig.json` plugin block) over `progress`, `app`, and `test-kit`; it must report no errors.
- **Tests.** Vitest with `@effect/vitest`: every test is `it.effect('...', () => Effect.gen(function* () {...}))`, with `it.layer` for shared layers and `makeTestSqlLayer()` from `tests/test-kit` for an in-memory database. No `async` test bodies, no `runPromise` or `try`/`catch` in tests; assert failures with `Effect.flip`/`Effect.exit`. Time-dependent tests use `TestClock`.

```ts
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Schema from 'effect/Schema';

export class RunNotFoundError extends Schema.TaggedError<RunNotFoundError>()('RunNotFoundError', {}) {}

export class RunService extends Context.Service<RunService>()('@suuudokuuu/progress/RunService', {
    make: Effect.gen(function* () {
        const runRepository = yield* RunRepository;

        return {
            resume: Effect.fn('RunService.resume')(function* () {
                const run = yield* runRepository.findCurrent();

                return yield* run ?? new RunNotFoundError();
            })
        };
    })
}) {
    static readonly layer = Layer.effect(RunService, RunService.make).pipe(Layer.provide(RunRepository.layer));
}
```

## Testing

- Tests use Vitest and `@effect/vitest`. They live in `packages/<package>/test/**/*.test.ts`, not colocated `.spec.ts` files. Cross-package scenarios live in `tests/*`; shared harness code lives in `tests/test-kit`, not in a scenario suite.
- `packages/app` and `packages/landing` host no unit tests. Pure logic that needs tests belongs in a domain package (`progress`, `generator`, ...); UI behavior is covered by Maestro and Playwright.
- Maestro E2E coverage lives under `tests/app-tests`.
- Web E2E coverage lives under `tests/web-tests` (Playwright against the Expo web export).
- Add or update tests when changing puzzle generation, solving, serialization, scoring, SQL migrations, repositories, or externally visible behavior.
- Migrating packages still on Jest convert to Vitest mechanically, keeping every assertion.

## Agent Orchestration And Model Economy

- The primary agent is the brains: it plans, analyzes, decides, and reviews. It owns architecture, ambiguous decisions, cross-package integration, and final verification, and must not burn its own context on mechanical execution.
- Delegate execution work (file edits, migrations, repetitive refactors, running validation, log digging, CI forensics) to subagents with bounded scope, clear file ownership, and acceptance tests.
- Pick the cheapest capable worker per task: the smallest tier for mechanical edits, searches, translations, and routine test migration; a balanced tier with moderate reasoning for ordinary implementation; the strongest tier only for novel algorithms, high-risk debugging, architecture, and final review.
- Set the lowest reasoning effort that fits the task; raise it only for verification and judging stages where correctness is critical.
- Delegated prompts are self-contained: paths, rules, constraints, and validation steps, so no round-trips are wasted. They must name the skills to load (always `effect` before touching logic) and the files the worker may edit.
- Prefer cheap execution plus targeted verification over an expensive single-shot run. Do not spawn a top-tier worker for work a cheaper one can do and the orchestrator can verify.
- Avoid duplicate investigation across workers, and verify every returned change independently before integration.
- For cross-cutting sweeps that must not miss a reference (renames, copy updates across packages and locales), build or query a project knowledge graph instead of repeating broad greps, then confirm with a targeted grep. Keep generated graph output uncommitted.

## Git Commits And Pull Requests

Use Conventional Commits for commit messages and PR titles:

```text
type(scope): short description
```

Scopes are `app`, `ui`, `progress`, `test-kit`, `landing`, `generator`, `solver-core`, `solver-dlx`, `solver-bitmask`, `techniques`, `rating`, `puzzle-forge`, `encoder`, `hell-corpus`, `field-core`, and `field-dom`. Omit the scope for repo-wide docs, tooling, skills, or workspace configuration.

Use these types: `feat`, `fix`, `refactor`, `chore`, `docs`, `ci`, `test`, `i18n`, `perf`, and `build`.

Never mention AI tools, bots, generated output, co-authors, or automation services in commits, PR titles, or PR descriptions.

## Workflow

- Commit after every accepted change. Each user-approved fix or feature increment gets its own focused Conventional Commit, validated first, instead of batching unrelated changes or leaving approved work uncommitted.
- Never commit agent-written plan, note, or report Markdown unless explicitly requested. Keep session notes untracked and ignored (`docs/plans`, `.scratch`).

## PR Review

- Read and analyze every review comment, including those from bots. Fetch all of them: inline comments (`gh api repos/<owner>/<repo>/pulls/<n>/comments`) and nitpicks collapsed inside `<details>` blocks, which `gh pr view` truncates.
- Validate each finding against the codebase before judging it: read the cited code, trace the behavior, and check the convention the reviewer invokes against what the repo actually does. Bots routinely generalize a rule from one package to another, cite a guideline that has a documented exception, or flag duplication that `pnpm cpd` already passes. State a verdict per finding (valid, partially valid, or invalid) with the concrete evidence.
- Act on the verdicts on the PR thread. Valid or partially valid: fix the root cause (not necessarily the literal suggested diff) and reply on the thread describing the fix. Invalid: reply with line-level evidence and resolve it. Never apply a suggested diff blindly, and never merge with an unanswered thread. When a valid finding would widen the PR, file a follow-up issue and say so on the thread.
- Never lower a timeout, weaken an assertion, or relax a test on a reviewer's say-so when the test has not been run.
- Note when a bot review is incomplete (rate limits, partial runs, reviews older than the latest commits) instead of implying the PR came back clean.
- Fix review feedback without utility sprawl (Engineering Rule 19).
- Review all changed files before finishing, especially imports, stale docs, and unnecessary abstractions.

## Approved Lint Disable Comments

Do not add disable comments casually. These are the only pre-approved shapes:

```typescript
// oxlint-disable-next-line max-statements -- Form orchestration component with multiple hooks and handlers
```

```typescript
// oxlint-disable-next-line max-lines-per-function -- Layout/form component requires many lines
```

Algorithm-heavy techniques/generator exceptions require a short, human-readable justification and should stay local to the narrow method.

## Important Notes

- Use `pnpm`, never `npm` or `yarn`.
- The TypeScript `lib` is `ES2022` plus `types/hermes-runtime.d.ts`, which declares only the newer built-ins the shipped Hermes engine implements. Node runs the tests, so a newer API compiles and passes tests yet throws on device; never raise `lib` or add a declaration without checking the Hermes version in `packages/app` supports it.
- Do not modify `.jscpd.json`; fix duplication in source or restructure narrowly.
- Do not edit generated Lingui `messages.ts` by hand.
- Prefer existing package patterns over importing Budgie rules that only made sense for finance, AI services, bank sync, or Next.js landing pages.
