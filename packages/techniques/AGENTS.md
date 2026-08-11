# Techniques Package

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
│   │   ├── technique-manager/          # Public API: findNextStep, identifyMove
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
```

Logical strategies run in `SolutionTechniqueEnum` difficulty order from `createTechniqueStrategies`. The manager exits at the first strategy that finds a result, and fallback `GuessTechnique` runs only when no supported logical technique matches. Techniques that only differ by size/name use descriptor-backed family strategies instead of empty subclasses.

`identifyMove` classifies in two ordered passes, each walking the registry in difficulty order:

1. Direct — the strategy places the played value in the played cell, or its eliminations leave that value as the only candidate there.
2. Enabling — the strategy's eliminations, applied to a transient context via `CandidateContext.withEliminations`, turn the played value into a naked or hidden single at the played cell (`isForcedPlacement`). The pass is skipped when the placement is already forced without those eliminations, so a technique is never credited for a deduction it did not cause.

A direct justification is one deduction step and always outranks an enabling one, which is two. Only moves that would otherwise fall through to `Guess` can reach the enabling pass.

### LogicalSolver

```typescript
constructor(strategies?: TechniqueStrategyInterface[])
solve(puzzleString: string): LogicalSolveResultInterface   // { isSolved, requiredTechniques, hardestTechnique }
```

The driver that answers "can this ladder finish this board, and what did it need". It exists because `findNextStep` rebuilds candidate state on every call and nothing consumes `TechniqueResultInterface.eliminations`, so a naive solve loop repeats the first elimination-only step forever.

Per step the solver walks the registry once over one `CandidateContext`. The first strategy that returns placements supplies them all at once — every placement a strategy reports from one position is logically forced, so batching them is sound and saves a context rebuild per cell. A strategy that only eliminates has its eliminations folded into the working context with `withEliminations`, which means later strategies in the same pass see them, and the pass then re-asks the simpler placement strategies whether the new context forces a cell. Because eliminations accumulate across the pass, this driver is strictly stronger than one that re-queries from a fresh context per step.

Placements only ever come from `PLACEMENT_TECHNIQUES` (Full House, Naked Single, Hidden Single); every other technique eliminates candidates. The constant keeps the elimination cash-in from re-running fish, wing and chain scans. A new placement-producing technique must be added to it.

Narrowing the strategy list narrows the ladder, so `new LogicalSolver(createTechniqueStrategies().filter(strategy => strategy.technique <= NakedSingle))` answers "is this board solvable with naked singles alone". That is how `@suuudokuuu/puzzle-forge` grades difficulty tiers.

`solve` parses its own `Sudoku` from the puzzle string, so it never mutates a caller's board. Every placement goes through `Sudoku.setCellValue`, which throws on a value that contradicts the solution — a solved result is therefore proof the ladder reached the real solution.

### TechniqueSearchTargetInterface

`find(context, target)` narrows a scan to one move. `target.intent` says which pass is asking:

- `'direct'` — the caller wants the played cell's other candidates eliminated, so strategies may restrict to those values and to eliminations landing on that cell.
- `'enabling'` — the caller wants the played value eliminated elsewhere, so strategies may restrict to `target.value` but must not restrict eliminations to the played cell.

`getSearchScope` resolves both narrowings at once: `eliminationValues` for either intent, and `directTarget` only when the intent is `'direct'`. A strategy that cannot narrow an enabling scan safely leaves `directTarget` unused and scans broadly, which stays correct and only costs time.

Ignoring `target` entirely also stays correct for both intents.

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
export { SolutionTechniqueEnum, TechniqueManager, LogicalSolver, createTechniqueStrategies };
export type { TechniqueResultInterface, MoveClassificationInterface, TechniqueStrategyInterface, LogicalSolveResultInterface };
```

`createTechniqueStrategies` is exported so a consumer can build a `TechniqueManager` over a narrowed registry, for example a single technique. `findNextStep` always returns the first strategy in the given order that fires, so a full registry can only ever surface the simplest available technique. Several techniques — `HiddenQuad` most obviously, because its in-unit complement is always a smaller naked subset — can therefore never be observed through the default registry, and a filtered registry is the only way to detect them on demand.

## Build

Dual output: ESM (`dist/esm/`) + CommonJS (`dist/cjs/`). Dependencies: `@rnw-community/shared`, `@suuudokuuu/generator` (one-way, generator never imports techniques).
