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
│   ├── abstract-technique.ts           # Shared result builders and small common helpers
│   ├── abstract-*-technique.ts         # Family bases only when techniques share real mechanics
│   ├── candidate-context/
│   │   └── candidate-context.ts        # Immutable candidate map + unit/peer navigation
│   └── *-technique/
│       ├── *.technique.ts              # One strategy per named technique
│       └── *.technique.spec.ts         # Focused positive/negative coverage
├── constants/
│   └── chain-scan.constant.ts          # Chain search depth bounds
├── enums/
│   └── solution-technique.enum.ts      # 27 techniques ordered by difficulty (Guess = 0)
├── interfaces/                         # TechniqueResult, CandidateElimination, ...
├── utils/
│   └── create-technique-strategies.util.ts # Difficulty-ordered logical strategy registry
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

Logical strategies run in `SolutionTechniqueEnum` difficulty order from `createTechniqueStrategies`. The manager exits at the first strategy that finds a result, and fallback `GuessTechnique` runs only when no supported logical technique matches.

### SolutionTechniqueEnum

Enum values double as difficulty ranking (lower = simpler); `Guess = 0` is the fallback, never emitted by logical strategies. `SimpleColoring` and `AIC` are reserved names not yet produced by any strategy — do not assert them in tests until implemented.

### CandidateContext

Immutable snapshot of candidates per blank cell (`fromSudoku`), with unit/peer navigation and `applyEliminations` returning a new context. Logical strategies work on this context, never on the Sudoku instance directly.

## Rules

- Technique detection must answer "which technique justifies value V in cell C", not "any technique anywhere"
- New logical strategies must keep registry order aligned with `SolutionTechniqueEnum`
- New techniques belong in their own `*-technique/` folder with a focused spec file
- Tests use realistic boards via `Sudoku.fromStrings(defaultSudokuConfig, ...)` + `CandidateContext.fromSudoku`; synthetic candidate maps only for patterns impractical to reach from a real board
- Every technique needs a positive assertion; add negative coverage where false positives are plausible

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
