# Generator Package

Core Sudoku puzzle generation and solving engine. Exports `Sudoku` class for puzzle creation, validation, cell navigation, and state management.

## Commands

```bash
yarn build              # Build ESM + CommonJS
yarn build:esm         # TypeScript -> ESM /dist/esm
yarn build:cjs         # TypeScript -> CommonJS /dist/cjs
yarn lint              # ESLint fix
yarn test              # Jest tests
yarn test:coverage     # With coverage report
yarn ts                # TypeScript check
```

## Structure

```
src/
├── classes/
│   ├── sudoku/
│   │   ├── sudoku.ts                   # Main Sudoku class (extends SerializableSudoku)
│   │   ├── sudoku.spec.ts
│   │   └── sudoku-navigation.spec.ts
│   ├── serializable-sudoku/
│   │   ├── serializable-sudoku.ts      # Base class (serialization, field management)
│   │   └── serializable-sudoku.spec.ts
│   └── dlx/
│       ├── dlx-solver.ts              # Dancing Links algorithm
│       ├── dlx-column-node.ts         # DLX node structure
│       ├── dlx-node.ts
│       └── dlx-solver.spec.ts
├── enums/
│   └── difficulty.enum.ts             # Newbie, Easy, Medium, Hard, Nightmare
├── interfaces/
│   ├── cell.interface.ts              # { x, y, value, group }
│   ├── field.interface.ts             # FieldInterface = CellInterface[][]
│   ├── scored-cells.interface.ts      # { x, y, group, values[], isWon }
│   ├── row-mapping.interface.ts
│   └── sudoku-config.interface.ts     # Config with blank cell counts per difficulty
├── types/
│   └── available-values.type.ts       # Record<number, {count, progress}>
└── util/
    ├── clone-field.util.ts            # Deep clone 2D array
    ├── create-empty-field.util.ts
    └── shuffle.util.ts                # Fisher-Yates shuffle
```

## Key Classes

### Sudoku (extends SerializableSudoku)

Main class for puzzle generation and gameplay:

```typescript
constructor(config: SudokuConfigInterface = defaultSudokuConfig)
create(difficulty: DifficultyEnum): void      // Generate new puzzle
getCorrectValue(cell?: CellInterface): number // Get solution value
setCellValue(cell: CellInterface): ScoredCellsInterface  // Place value, check completions
getCellCandidates(cell: CellInterface): number[]  // Valid candidates

// Navigation
getCellRight/Left/Up/Down(selectedCell?): CellInterface | undefined

// Validation
isCellHighlighted(cell, selectedCell?): boolean
isCellWrong(cell, selectedCell?): boolean
isSameCell(cell, selectedCell?): boolean
isBlankCell(cell?): boolean

// Serialization
static fromString(fieldsString: string, config?): Sudoku
```

### DLX Solver

Dancing Links (DLX) algorithm for validating puzzle uniqueness (exactly 1 solution).

## Algorithm

- **Generation:** Backtracking with random value placement + shuffled clue removal (50 attempts max)
- **Uniqueness:** DLX solver validates exactly 1 solution exists
- **Fields:** `field` (solution), `gameField` (playable with blanks), `emptyField` (initial template)

## Key Interfaces

```typescript
// CellInterface
{ x: number; y: number; value: number; group: number; }

// DifficultyEnum
Newbie = 10 blanks, Easy = 30, Medium = 40, Hard = 50, Nightmare = 59

// ScoredCellsInterface - returned when placing a value
{ x: number; y: number; group: number; values: number[]; isWon: boolean; }
// x/y/group = index of completed row/col/box (-1 if none)
// values = completed number values, isWon = puzzle solved
```

## Testing

- Tests colocated with source files (`.spec.ts` suffix)
- Coverage thresholds: statements 69%, branches 39%, lines 66%, functions 56%
- Tests cover: creation, navigation, DLX correctness, serialization

## Exports

```typescript
export { Sudoku, DifficultyEnum, defaultSudokuConfig, emptyScoredCells, isEmptyScoredCells };
export type { CellInterface, ScoredCellsInterface, FieldInterface, SudokuConfigInterface, AvailableValuesType };
```

## Build

Dual output: ESM (`dist/esm/`) + CommonJS (`dist/cjs/`). Only dependency: `@rnw-community/shared`.
