# Generator Package

Pure TypeScript Sudoku generation and solving engine. It exports the `Sudoku` class, difficulty config, field/cell interfaces, scored-cell helpers, and the DLX uniqueness solver used by the app.

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
├── dlx/                       # Dancing Links exact-cover solver feature
│   └── classes/
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
5. Puzzle generation must keep a unique solution. Use `DLXSolver.count(..., 2)` or equivalent uniqueness checks before accepting clue removal.
6. `DifficultyEnum` values are serialized into app history and UI. Changing names or values requires app migrations, i18n updates, and tests.

## Algorithm Rules

1. Treat DLX pointer manipulation as invariant-heavy code. Small readability refactors are fine; broad rewrites need focused tests first.
2. Keep solver methods deterministic for a given field. Randomness belongs in generation and shuffle steps.
3. Do not replace structured field/cell operations with ad hoc string parsing inside the generator.
4. Use constants or config values for grid dimensions when touching generic Sudoku logic.
5. Algorithm-heavy `max-statements` disables must stay local to the narrow method and carry a short justification.

## File Organization

1. Classes live one folder per class.
2. Interfaces stay in `src/interfaces` and use the `*Interface` suffix.
3. Utility functions stay in `src/util` and use the `.util.ts` suffix.
4. Keep one utility per file.
5. Re-export public API directly from `src/index.ts`.
6. Tests stay colocated with source files using `.spec.ts`.

## Testing

1. Add or update tests for puzzle creation, serialization, navigation, scoring return shapes, candidate calculation, and DLX uniqueness behavior.
2. Use deterministic fixtures when asserting exact fields. Avoid brittle tests that depend on random generation order.
3. After generator changes, run:

```bash
yarn test && yarn ts && yarn lint && yarn build
```

Run the root validation sequence before finishing.
