# AGENTS.md

Suuudokuuu is an open-source Sudoku game built with React Native and Expo. This monorepo has five core packages: `app` for the game UI, `generator` for Sudoku generation and solving, `techniques` for solving-technique detection, `encoder` for compact shareable game-state encoding, and `screen-chrome` for generic screen chrome primitives.

## Canonical Agent Surfaces

- `AGENTS.md` is the canonical instruction file for Codex and other agents.
- `CLAUDE.md` is a symlink to `AGENTS.md` at the root and in every package scope.
- Package-level `AGENTS.md` files override and refine this root file for their own directories.
- Project skills live in `.agents/skills`. Claude-visible skills in `.claude/skills` must be symlinks to the matching `.agents/skills/<skill>` directory.
- Keep instruction text provider-neutral. Put tool-specific behavior in skills or local/global agent config, not in package docs.

## Commands

```bash
yarn install

yarn build
yarn build:force

yarn format
yarn ts
yarn lint
yarn deadcode
yarn cpd
yarn test

yarn deps:check
yarn deps:dedupe
```

Before finishing code changes, run this validation sequence from the root:

```bash
yarn format && yarn ts && yarn lint && yarn deadcode && yarn cpd
```

Run `yarn test` when behavior, algorithms, serialization, persistence, scoring, or app flows change. Run package-specific tests when the blast radius is narrow.

## Structure

```text
packages/
├── app/                # Expo 57, React Native 0.86, React 19.2 game app
├── generator/          # Pure TypeScript Sudoku generator and DLX solver
├── techniques/         # Pure TypeScript solving-technique detection
├── encoder/            # Binary/LZ encoding for puzzle sharing and replay
└── screen-chrome/      # Raw TypeScript generic screen chrome, edge fades, and collapsible header
tests/
└── app-tests/          # Maestro E2E flows
```

## Package Instructions

- Read `packages/app/AGENTS.md` before changing Expo Router routes, React Native UI, Redux state, persistence, themes, Lingui text, deep links, sharing, or app assets.
- Read `packages/generator/AGENTS.md` before changing Sudoku generation, validation, navigation, DLX solving, difficulty config, or puzzle interfaces.
- Read `packages/techniques/AGENTS.md` before changing solving techniques, candidate context, strategy ordering, or move classification.
- Read `packages/encoder/AGENTS.md` before changing binary formats, solution-step encoding, URL serialization, compression, or decode error behavior.
- Read `packages/screen-chrome/README.md` before changing `@suuudokuuu/screen-chrome`; preserve its generic, app-agnostic API.
- Read `tests/app-tests/AGENTS.md` before changing Maestro flows, test IDs used by flows, deep-link fixtures, or E2E app assumptions.

## Engineering Rules

1. Do not use `any`. Model unknown data as `unknown`, validate it, then narrow it.
2. Do not add type assertions such as `as Type`, `@ts-ignore`, or `@ts-expect-error`. `as const` is allowed as a const assertion. Legacy persisted-state migrations are not a precedent for new code.
3. Do not add explanatory code comments. Prefer clearer names and smaller functions. Existing legacy comments are not a pattern to extend.
4. Never add `eslint-disable` comments without explicit approval unless the exact rule is listed in this file's approved disable section.
5. Use one `const` declaration per variable.
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
17. Keep class boundaries cohesive. Single-consumer helpers belong in the consumer unless extracting them removes real duplication or clarifies an algorithm.
18. Do not add re-export-only files. Re-export public package API directly from the package `index.ts`.

## File Organization

- Components live one per folder, with the component file named after the folder.
- Each component file exports one component. Extract sibling JSX helpers, render functions that return JSX, and local subcomponents into their own component folders.
- React component props are named exactly `Props` and declared inline as `interface Props` in the component file. Do not use `type Props` for component props. Use a shared `*PropsInterface` only when the exact same props shape is consumed by multiple components.
- Use composition and explicit variant components instead of growing boolean prop combinations or opaque object prop bags.
- Prefer `children` for primary composed content instead of `render*` props or named content props.
- Reusable utilities live in the owning module's utility folder and use the `.util.ts` suffix. Do not create one-off utilities for a single consumer.
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
- After changing user-facing app text, run `yarn i18n:sync` from the root or `yarn workspace @suuudokuuu/app i18n:sync` from the package.
- Before PRs, run `yarn i18n:check` to prove `messages.po` and generated `messages.ts` files under `packages/app/src/i18n/locales` are current.

## Testing

- Generator and encoder tests are colocated with source files using `.spec.ts`.
- App unit tests are limited and should stay focused on deterministic logic such as scoring.
- Maestro E2E coverage lives under `tests/app-tests`.
- Add or update tests when changing puzzle generation, solving, serialization, scoring, persistence migrations, or externally visible behavior.

## Delegation And Model Economy

- The primary agent owns architecture, ambiguous decisions, cross-package integration, and final verification.
- Delegate only bounded, well-specified work with clear file ownership and acceptance tests.
- Use the smallest capable worker for mechanical edits, translations, documentation, and routine test migration. A balanced worker with moderate reasoning is the default for ordinary implementation.
- Reserve frontier-level workers and high reasoning effort for novel algorithms, high-risk debugging, architecture, and final review.
- Keep delegated prompts narrow, avoid duplicate investigation, and verify every returned change independently before integration.

## Git Commits And Pull Requests

Use Conventional Commits for commit messages and PR titles:

```text
type(scope): short description
```

Scopes are `app`, `generator`, `techniques`, and `encoder`. Omit the scope for repo-wide docs, tooling, skills, or workspace configuration.

Use these types: `feat`, `fix`, `refactor`, `chore`, `docs`, `ci`, `test`, `i18n`, `perf`, and `build`.

Never mention AI tools, bots, generated output, co-authors, or automation services in commits, PR titles, or PR descriptions.

## PR Review

- Address human reviewer feedback only.
- Validate AI-generated suggestions before applying them.
- Review all changed files before finishing, especially imports, stale docs, and unnecessary abstractions.

## Approved ESLint Disable Comments

Do not add disable comments casually. These are the only pre-approved shapes:

```typescript
// eslint-disable-next-line max-statements -- Form orchestration component with multiple hooks and handlers
```

```typescript
// eslint-disable-next-line max-lines-per-function -- Layout/form component requires many lines
```

Algorithm-heavy techniques/generator exceptions require a short, human-readable justification and should stay local to the narrow method.

## Important Notes

- Use `yarn`, never `npm`.
- Do not modify `.jscpd.json`; fix duplication in source or restructure narrowly.
- Do not edit generated Lingui `messages.ts` by hand.
- Prefer existing package patterns over importing Budgie rules that only made sense for finance, databases, AI services, bank sync, or Next.js landing pages.
