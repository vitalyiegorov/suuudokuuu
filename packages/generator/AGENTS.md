# Generator Package

Pure TypeScript Sudoku generation and solving engine. It exports the `Sudoku` class, difficulty config, field/cell interfaces, and scored-cell helpers; machine solving lives in the `@suuudokuuu/solver-*` packages.

## Commands

```bash
yarn build
yarn build:esm
yarn build:cjs
yarn ts
yarn lint
yarn test
yarn test:coverage
```

## Structure

```text
src/
├── @generic/                  # Shared enums, interfaces, types, and utilities
├── serializable-sudoku/       # Base serialization and field state feature
│   └── classes/
└── sudoku/                    # Generation, gameplay, navigation, and scoring feature
    └── classes/
```

## Domain Rules

1. Preserve the public `Sudoku` API unless the app and tests are updated in the same change.
2. `field` is the solved grid; `gameField` is the playable grid; `emptyField` is the blank template.
3. A cell uses `x`, `y`, `value`, and `group`. Keep coordinate semantics consistent across app, generator, and encoder.
4. Blank cells use the configured blank value, currently `0`.
5. Puzzle generation must keep a unique solution. Use `SolverInterface.countSolutions(grid, UNIQUENESS_COUNT_LIMIT)` or equivalent uniqueness checks before accepting clue removal.
6. `DifficultyEnum` values are serialized into app history and UI. Changing names or values requires app migrations, i18n updates, and tests.
7. `defaultSudokuConfig.difficultyBlankCells` is frozen for every tier that already shipped. It is the legacy blank-count table that `convertFieldFromString` uses to label pre-trailer shared links, and changing a number relabels links players already hold. Blank-cell targets for newly created puzzles live in `@suuudokuuu/puzzle-forge`, which passes its own cloned config into `create`.
8. The generator knows nothing about solving techniques. `techniques` depends on `generator`, so a technique import here would be a dependency cycle. Technique-aware puzzle acceptance belongs in `@suuudokuuu/puzzle-forge`.
9. `Hell` and `Infinity` are corpus-only difficulties: the app never calls `Sudoku.create()` for them, so their `difficultyBlankCells` entries do not drive clue removal. `Hell`'s entry (64) happens to equal every corpus puzzle's real blank count, so blank-count inference (`SerializableSudoku.convertFieldFromString`) still resolves it correctly. `Infinity` puzzles are curated by Sudoku Explainer rating, not clue count, so their real blank count (~58-60) varies and collides with `Nightmare`/`Hell`; `Infinity`'s entry (81, a full-board sentinel) only keeps the threshold table monotonic and satisfies the `Record<DifficultyEnum, number>` type. It does not make `Infinity` reachable by inference for realistic puzzles — callers that need to know a puzzle is `Infinity` must carry the difficulty explicitly (see the encoder's rating trailer) rather than relying on blank-count inference.

## Algorithm Rules

1. Treat the generator's clue-removal loop and its solver-backed uniqueness checks as invariant-heavy code. Small readability refactors are fine; broad rewrites need focused tests first.
2. Keep solver methods deterministic for a given field. Randomness belongs in generation and shuffle steps.
3. All generation randomness flows through `config.random`, a `SeededRandomType` from `@suuudokuuu/solver-core`. `defaultSudokuConfig.random` is `Math.random`, so every existing caller is unchanged, and passing `createSeededRandom(seed)` in a cloned config makes `create()` fully reproducible. `shuffle` takes the generator as a required argument precisely so a new randomness site cannot silently reach for `Math.random`: never call `Math.random` inside this package. `sudoku-seeded-generation.spec.ts` proves same-seed reproducibility, and the daily challenge's seed derivation is documented in `packages/puzzle-forge/AGENTS.md`.
4. Do not replace structured field/cell operations with ad hoc string parsing inside the generator.
5. Use constants or config values for grid dimensions when touching generic Sudoku logic.
6. Algorithm-heavy `max-statements` disables must stay local to the narrow method and carry a short justification.

## File Organization

1. Classes live one folder per class.
2. Interfaces stay in `src/interfaces` and use the `*Interface` suffix.
3. Utility functions stay in `src/util` and use the `.util.ts` suffix.
4. Keep one utility per file.
5. Re-export public API directly from `src/index.ts`.
6. Tests stay colocated with source files using `.spec.ts`.

## Testing

1. Add or update tests for puzzle creation, serialization, navigation, scoring return shapes, candidate calculation, and solver-backed uniqueness behavior.
2. Use deterministic fixtures when asserting exact fields. Avoid brittle tests that depend on random generation order.
3. After generator changes, run:

```bash
yarn test && yarn ts && yarn lint && yarn build
```

Run the root validation sequence before finishing.

## Exports

The public API is exported from `src/index.ts` and includes `Sudoku`, difficulty/config, field/cell, available-value, and scored-cell APIs. `createEmptyField` remains an internal utility.
