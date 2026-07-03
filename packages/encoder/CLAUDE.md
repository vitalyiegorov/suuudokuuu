# Encoder Package

Compact binary encoding/decoding of Sudoku puzzles and solution steps for URL sharing and game state persistence.

## Commands

```bash
yarn build              # Build ESM only
yarn build:esm         # TypeScript -> ESM /dist/esm
yarn lint              # ESLint fix
yarn test              # Jest tests
yarn test:coverage     # With coverage report
yarn ts                # TypeScript check
```

## Structure

```
src/
├── classes/
│   ├── sudoku-string-encoder/
│   │   ├── sudoku-string-encoder.ts      # Encode/decode 81-char puzzle strings
│   │   └── sudoku-string-encoder.spec.ts
│   ├── solution/
│   │   ├── solution.ts                   # Track and encode solution steps (moves)
│   │   └── solution.spec.ts
│   └── game-state-serializer/
│       ├── game-state-serializer.ts      # Full game state -> LZ-compressed string
│       └── game-state-serializer.spec.ts
├── constants/
│   ├── bit-encoding.constant.ts          # CELL_INDEX_BITS=7, VALUE_BITS=4, TIMESTAMP_BITS=13
│   └── grid.constant.ts                  # GRID_SIZE=9, GRID_CELL_COUNT=81
├── interfaces/
│   ├── cell-position.interface.ts        # { x, y, value }
│   └── solution-step.interface.ts        # { cellIndex, value, ts }
└── util/
    ├── is-valid-cell-index.util.ts
    ├── is-valid-cell-value.util.ts
    └── string-to-uint8array.util.ts
```

## Key Classes

### SudokuStringEncoder

Encodes/decodes 81-character puzzle strings to compact binary:

```typescript
encode(sudokuString: string, steps: SolutionStepInterface[] = []): string
// Input: 81-char string (0=blank, 1-9) + optional steps to remove
// Output: compact binary string

decode(input: string): string
// Input: encoded binary string -> 81-char sudoku string
```

### Solution

Tracks gameplay moves with timestamps:

```typescript
addStep(cell: CellPositionInterface, elapsedTime: number): SolutionStepInterface
stringify(): string                    // Binary encode all steps with time deltas
getSteps(): SolutionStepInterface[]
getElapsedTime(): number
static fromString(solutionSteps: string): Solution
static fromSteps(steps: SolutionStepInterface[]): Solution
```

### GameStateSerializer

Combines field + steps + metadata into shareable URL-safe string:

```typescript
encode(field: string, steps: SolutionStepInterface[], maxMistakes: number, isChallenge: boolean): string
// Output: LZ-compressed, URL-safe encoded string

decode(gameStateString: string): [field, steps, maxMistakes, isChallenge, elapsedTime]
```

## Encoding Details

- **Field encoding:** 7-bit cell index + 4-bit value (11 bits per clue)
- **Solution encoding:** 7-bit index + 4-bit value + 13-bit timestamp delta
- **Game state:** Length-prefixed segments, then LZ compression via `compressToEncodedURIComponent`

## Testing

- Tests colocated with source files (`.spec.ts` suffix)
- Coverage thresholds: statements 80%, branches 70%, lines 80%, functions 75%

## Exports

```typescript
export { SudokuStringEncoder, Solution, GameStateSerializer };
export type { SolutionStepInterface };
```

## Build

ESM only (`dist/esm/`). Dependencies: `@rnw-community/shared`, `@thi.ng/bitstream`, `lz-string`.
