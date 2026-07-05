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
├── @generic/
│   ├── constants/
│   │   ├── bit-encoding.constant.ts      # CELL_INDEX_BITS=7, VALUE_BITS=4, TIMESTAMP_BITS=8
│   │   ├── binary-codec.constant.ts      # v2 format: version, prefix, base-9 packing bits
│   │   ├── base64url.constant.ts
│   │   └── grid.constant.ts
│   ├── interfaces/
│   │   ├── cell-position.interface.ts
│   │   └── solution-step.interface.ts
│   └── utils/
│       ├── base64url-to-bytes.util.ts
│       ├── bytes-to-base64url.util.ts
│       ├── is-valid-cell-index.util.ts
│       ├── is-valid-cell-value.util.ts
│       └── string-to-uint8array.util.ts
├── sudoku-string-encoder/classes/        # Legacy encode/decode of 81-char puzzle strings
├── solution/classes/                     # Track and encode solution steps
├── game-state-binary-codec/classes/      # v2 bit-packed game state <-> base64url string
└── game-state-serializer/classes/        # Public API: v2 encode, v2 + legacy decode
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
// Output: v2 bit-packed, base64url encoded string with '_' prefix

decode(gameStateString: string): [field, steps, maxMistakes, isChallenge, elapsedTime]
// Accepts both v2 ('_' prefix) and legacy (lz-string) formats
```

## Encoding Details

### v2 format (current, emitted by encode)

`'_' + base64url(bits)` — alphabet is `A-Za-z0-9-_` only (RFC 3986 unreserved). Bit layout:

- Header: 4-bit version (=2) + 1-bit isChallenge + 3 reserved bits + 8-bit maxMistakes (clamped 0-255)
- Field: 81-bit givens mask + given values base-9 packed (3 values per 10 bits, pair in 7 bits, single in 4 bits)
- Steps (challenge only): 7-bit step count; per-step index into the shrinking remaining-empty-cells list
  (adaptive bit width); step values base-9 packed; 8-bit timestamp deltas
- Non-challenge shares omit steps entirely (the app ignores them for puzzle links)
- Typical sizes: ~35 chars for a 30-given puzzle share, ~173 chars for a completed 51-step challenge

### Legacy format (decode only)

- **Field encoding:** 7-bit cell index + 4-bit value (11 bits per clue)
- **Solution encoding:** 7-bit index + 4-bit value + 8-bit timestamp delta
- **Game state:** Length-prefixed segments, then LZ compression via `compressToEncodedURIComponent`
- Detected by the absence of the `_` prefix (lz-string output never contains `_`)

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
