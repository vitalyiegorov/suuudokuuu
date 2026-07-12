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
├── @generic/
│   ├── classes/
│   │   ├── technique-manager/          # Public API: findNextStep, identifyMove, identify
│   │   ├── candidate-context/          # Cached candidate map + unit/peer navigation
│   │   ├── abstract-sized-technique.ts # Descriptor-backed family metadata only
│   │   └── abstract-fish-technique.ts  # Shared fish scanning only
│   ├── constants/
│   │   └── chain-scan.constant.ts
│   ├── enums/
│   │   └── solution-technique.enum.ts  # Techniques ordered by difficulty (Guess = 0)
│   ├── interfaces/                     # TechniqueResult, CandidateElimination, ...
│   ├── types/                          # CandidateMapType, LineType, FinnedFish*, ...
│   └── utils/                          # Pure result, cell, peer, and registry helpers
├── *-technique/                       # One feature folder per solving technique
│   ├── classes/                        # Strategy and focused colocated tests
│   ├── constants/                      # Feature-owned constants when needed
│   ├── interfaces/                     # Feature-owned object contracts when needed
│   ├── types/                          # Feature-owned type aliases when needed
│   └── utils/                          # Reusable feature-owned pure helpers when needed
```

## Key Concepts

### TechniqueManager

```typescript
constructor(sudoku: Sudoku)
findNextStep(): TechniqueResultInterface | null     // Simplest available logical step, else guess
identifyMove(cell: CellInterface): MoveClassificationInterface  // Technique and value for this exact move
identify(cell: CellInterface): SolutionTechniqueEnum
```

Logical strategies run in `SolutionTechniqueEnum` difficulty order from `createTechniqueStrategies`. The manager exits at the first strategy that finds a result, and fallback `GuessTechnique` runs only when no supported logical technique matches. Techniques that only differ by size/name use descriptor-backed family strategies instead of empty subclasses.

### SolutionTechniqueEnum

Enum values double as difficulty ranking (lower = simpler); `Guess = 0` is the fallback, never emitted by logical strategies. `SimpleColoring` and `AIC` are represented by their own feature folders and are part of the technique registry; keep their enum names and labels aligned with those modules.

### CandidateContext

Cached snapshot of candidates per blank cell (`fromSudoku`), with unit/peer navigation. Logical strategies work on this context, never on the Sudoku instance directly.

## Rules

- Technique detection must answer "which technique justifies value V in cell C", not "any technique anywhere"
- New logical strategies must keep registry order aligned with `SolutionTechniqueEnum`
- New algorithms belong in their own `*-technique/classes/` folder; parameter-only variants belong in descriptor-backed family strategies
- Tests use realistic boards via `Sudoku.fromStrings(defaultSudokuConfig, ...)` + `CandidateContext.fromSudoku`; synthetic candidate maps only for patterns impractical to reach from a real board
- Every technique needs a positive assertion; add negative coverage where false positives are plausible

## Testing

- Tests colocated with source files (`.spec.ts` suffix)
- Coverage thresholds: statements 80%, branches 70%, lines 80%, functions 80%

## Exports

```typescript
export { SolutionTechniqueEnum, TechniqueManager };
export type { TechniqueResultInterface, MoveClassificationInterface, CandidateEliminationInterface, CandidateUnitInterface, CandidateMapType, TechniqueResultKindType };
```

## Build

Dual output: ESM (`dist/esm/`) + CommonJS (`dist/cjs/`). Dependencies: `@rnw-community/shared`, `@suuudokuuu/generator` (one-way, generator never imports solver).
