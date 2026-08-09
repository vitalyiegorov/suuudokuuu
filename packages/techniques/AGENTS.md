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
solveLogically(techniqueOrder?: SolutionTechniqueEnum[]): LogicalSolveResultInterface  // Full logical solve driver
```

Logical strategies run in `SolutionTechniqueEnum` difficulty order from `createTechniqueStrategies`. The manager exits at the first strategy that finds a result, and fallback `GuessTechnique` runs only when no supported logical technique matches. Techniques that only differ by size/name use descriptor-backed family strategies instead of empty subclasses.

`identifyMove` classifies in two ordered passes, each walking the registry in difficulty order:

1. Direct — the strategy places the played value in the played cell, or its eliminations leave that value as the only candidate there.
2. Enabling — the strategy's eliminations, applied to a transient context via `CandidateContext.withEliminations`, turn the played value into a naked or hidden single at the played cell (`isForcedPlacement`). The pass is skipped when the placement is already forced without those eliminations, so a technique is never credited for a deduction it did not cause.

A direct justification is one deduction step and always outranks an enabling one, which is two. Only moves that would otherwise fall through to `Guess` can reach the enabling pass.

### solveLogically

`findNextStep` rebuilds the candidate snapshot from the Sudoku on every call, so it cannot advance past an elimination-only step. `solveLogically` is the multi-step driver: it threads a single `CandidateContext` across iterations, applies each accepted step to that context (`withEliminations`, then `withPlacement` for placements), and never mutates the `Sudoku`.

A step is accepted only when it still changes the threaded context: a placement needs candidates left in its cell, and an elimination needs at least one of its values to still be a candidate. That keeps every iteration monotonic, so the driver cannot repeat a step and always terminates.

`LogicalSolveResultInterface` carries the ordered `steps` and one `outcome`:

- `solved` — no unfilled cells remain.
- `stuck` — no registered technique produces a progressing step; this is the single "beyond the ladder" signal that a guess would be needed. Capped chain searches simply land here.
- `contradiction` — an unfilled cell has no candidates left.

Guess steps are never emitted; `steps` holds logical deductions only.

`techniqueOrder` overrides the registry order with plain enum values, which keeps strategy classes unexported. The array defines both order and membership: only the listed techniques run, in the listed order, and entries without a registered strategy are ignored. Omitting the parameter uses the registry order. Consumers that rank by an external difficulty scale pass their own cheapest-first order instead of relying on enum ordinals.

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

Snapshots are immutable: `withEliminations(eliminations)` and `withPlacement(cell, value)` both return a new context, the latter with the value written into its own field copy and the value pruned from the peer candidates. `getBlankCells` is candidate-driven, so a cell reduced to zero candidates silently leaves it; `hasContradiction()` reports that state explicitly and `isSolved()` reports a board with no unfilled cells.

## Rules

- Technique detection must answer "which technique justifies value V in cell C", not "any technique anywhere"
- New logical strategies must keep registry order aligned with `SolutionTechniqueEnum`
- New algorithms belong in their own `*-technique/classes/` folder; parameter-only variants belong in descriptor-backed family strategies
- Tests use realistic boards via `Sudoku.fromStrings(defaultSudokuConfig, ...)` + `CandidateContext.fromSudoku`; synthetic candidate maps only for patterns impractical to reach from a real board
- Every technique needs a positive assertion; add negative coverage where false positives are plausible

## Testing

- Tests colocated with source files (`.spec.ts` suffix)
- Coverage thresholds: statements 80%, branches 70%, lines 80%, functions 80%
- `solve-logically.spec.ts` guards the driver: elimination-only progress, solved/stuck/contradiction outcomes, determinism from a fixed board string, and a wall-clock budget of 5000 ms for a full logical solve of a 17-clue hell-corpus board (about 80 ms locally, so the budget only fails on real regressions)
- Driver fixtures are fixed 81-character board strings fed through `Sudoku.fromString`; never `Sudoku.create`, which uses unseeded randomness

## Exports

```typescript
export { SolutionTechniqueEnum, TechniqueManager };
export type { TechniqueResultInterface, MoveClassificationInterface, LogicalSolveResultInterface, LogicalSolveOutcomeType };
```

## Build

Dual output: ESM (`dist/esm/`) + CommonJS (`dist/cjs/`). Dependencies: `@rnw-community/shared`, `@suuudokuuu/generator` (one-way, generator never imports techniques).
