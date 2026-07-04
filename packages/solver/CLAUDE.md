# Solver Package

Sudoku solving-technique detection engine. Given a board state, identifies which named technique (Full House, Naked Single, X-Wing, XY-Chain, ...) justifies a placement, or classifies it as a guess. Used by the app to label moves during replay.

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
├── classes/techniques/
│   ├── technique-manager.ts            # Public API: findNextStep, identifyMove, identify
│   ├── candidate-context/
│   │   └── candidate-context.ts        # Immutable candidate map + unit/peer navigation
│   └── scanners/
│       ├── abstract-technique.scanner.ts   # Shared result builders, combinations helper
│       ├── placement-technique.scanner.ts  # FullHouse, NakedSingle, HiddenSingle
│       ├── intersection-technique.scanner.ts # PointingPair/Triple, BoxLineReduction
│       ├── subset-technique.scanner.ts     # Naked/Hidden Pair, Triple, Quad
│       ├── fish-technique.scanner.ts       # X-Wing, Swordfish, Jellyfish + finned/sashimi
│       ├── wing-technique.scanner.ts       # XY-Wing, XYZ-Wing, W-Wing
│       ├── chain-technique.scanner.ts      # XY-Chain (3-6 cells), X-Chain (4-6 cells)
│       └── guess-technique.scanner.ts      # Fallback when no logical technique matches
├── constants/
│   └── chain-scan.constant.ts          # Chain search depth bounds
├── enums/
│   └── solution-technique.enum.ts      # 27 techniques ordered by difficulty (Guess = 0)
├── interfaces/                         # TechniqueResult, CandidateElimination, ...
└── types/                              # CandidateMapType, LineType, FinnedFish*, ...
```

## Key Concepts

### TechniqueManager

```typescript
constructor(sudoku: Sudoku)
findNextStep(): TechniqueResultInterface | null     // Simplest available logical step, else guess
identifyMove(cell: CellInterface): TechniqueResultInterface  // Technique justifying this exact cell/value
identify(cell: CellInterface): SolutionTechniqueEnum
```

Scanners run in difficulty order (placement -> intersection -> subset -> fish -> wing -> chain) with per-scanner early exit; within a scanner, matches are sorted by enum value so the simplest technique always wins. Scanner order must stay aligned with `SolutionTechniqueEnum` difficulty bands.

### SolutionTechniqueEnum

Enum values double as difficulty ranking (lower = simpler); `Guess = 0` is the fallback, never emitted by logical scanners. `SimpleColoring` and `AIC` are reserved names not yet produced by any scanner — do not assert them in tests until implemented.

### CandidateContext

Immutable snapshot of candidates per blank cell (`fromSudoku`), with unit/peer navigation and `applyEliminations` returning a new context. All scanner logic works on this context, never on the Sudoku instance directly.

## Rules

- Technique detection must answer "which technique justifies value V in cell C", not "any technique anywhere"
- New scanners must keep enum-band monotonicity with existing scanner order
- Tests use realistic boards via `Sudoku.fromStrings(defaultSudokuConfig, ...)` + `CandidateContext.fromSudoku`; synthetic candidate maps only for patterns impractical to reach from a real board
- Every technique needs a positive assertion and each scanner family a negative test

## Testing

- Tests colocated with source files (`.spec.ts` suffix)
- Coverage thresholds: statements 80%, branches 70%, lines 80%, functions 80%

## Exports

```typescript
export { SolutionTechniqueEnum, TechniqueManager };
export type { TechniqueResultInterface, CandidateEliminationInterface, CandidatePlacementInterface, CandidateUnitInterface, CandidateMapType, TechniqueResultKindType };
```

## Build

Dual output: ESM (`dist/esm/`) + CommonJS (`dist/cjs/`). Dependencies: `@rnw-community/shared`, `@suuudokuuu/generator` (one-way, generator never imports solver).
