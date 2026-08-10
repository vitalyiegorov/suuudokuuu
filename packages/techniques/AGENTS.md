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

New members are appended, never inserted: the app persists these ordinals on replay timeline events, so renumbering would relabel finished games. `UniqueRectangle` and `BivalueUniversalGrave` therefore sit after `AIC` even though their solving cost is lower, which also keeps the registry reaching for them only after every non-uniqueness technique has failed.

### Uniqueness techniques

`UniqueRectangle` and `BivalueUniversalGrave` are valid only because every puzzle the app serves has exactly one solution: generation verifies uniqueness on every clue removal, and both bundled corpora are uniqueness-verified. Both detectors reason "this candidate would create a second solution, so it cannot be true", which is unsound on a multi-solution grid.

- `UniqueRectangle` covers type 1 only: four unfilled corners over two rows, two columns, and exactly two boxes, three of them holding the same candidate pair, so the pair leaves the fourth corner.
- `BivalueUniversalGrave` covers BUG+1: every unfilled cell holds two candidates except one that holds three, so the candidate appearing three times in that cell's units is placed.

### Chain search

`XChainTechnique` and `XYChainTechnique` search shortest-first. Each root runs a breadth-first scan over link states, so the first chain that reaches a state is the shortest chain to it:

- An X-Chain state is a cell plus the link type the chain must take next, which alternates strong, weak, strong. Endpoint eliminations are collected whenever a state is reached over a strong link with at least `X_CHAIN_MIN_CELLS` cells on the path.
- An XY-Chain state is a bi-value cell plus its outgoing link value. Endpoint eliminations are collected when that outgoing value is the elimination value and the path holds at least `XY_CHAIN_MIN_CELLS` cells.

A state is expanded once, and a neighbour already on the reconstructed path is rejected, so every emitted chain is a simple path: a chain that used a cell in both link states would be a contradiction argument, not a chain deduction. The `*_MAX_VISITS_PER_ROOT` caps still bound the scan, but a breadth-first scan visits at most two states per cell per root and never approaches them.

Results carry `chainLength`, the number of cells in the chain, which is always `reasonCells.length`. `@suuudokuuu/rating` prices chains from it. Nothing else in the ladder sets the field, and `getCanonicalTechniqueResults` already keeps the fewest-reason-cells result per deduction, so the surviving result for a deduction is the shortest chain found for it across every root.

### CandidateContext

Cached snapshot of candidates per blank cell (`fromSudoku`), with unit/peer navigation. Logical strategies work on this context, never on the Sudoku instance directly.

Snapshots are immutable: `withEliminations(eliminations)` and `withPlacement(cell, value)` both return a new context, the latter with the value written into its own field copy and the value pruned from the peer candidates. `getBlankCells` is candidate-driven, so a cell reduced to zero candidates silently leaves it; `hasContradiction()` reports that state explicitly and `isSolved()` reports a board with no unfilled cells.

## Rules

- Technique detection must answer "which technique justifies value V in cell C", not "any technique anywhere"
- New logical strategies must keep registry order aligned with `SolutionTechniqueEnum`
- New algorithms belong in their own `*-technique/classes/` folder; parameter-only variants belong in descriptor-backed family strategies
- Uniqueness-based strategies may only assume a single solution; state that assumption in this file when adding one
- Tests use realistic boards via `Sudoku.fromStrings(defaultSudokuConfig, ...)` + `CandidateContext.fromSudoku`; synthetic candidate maps only for patterns impractical to reach from a real board
- Every technique needs a positive assertion; add negative coverage where false positives are plausible

## Testing

- Tests colocated with source files (`.spec.ts` suffix)
- Coverage thresholds: statements 80%, branches 70%, lines 80%, functions 80%
- `solve-logically.spec.ts` guards the driver: elimination-only progress, solved/stuck/contradiction outcomes, determinism from a fixed board string, and a wall-clock budget of 5000 ms for a full logical solve of a 17-clue hell-corpus board (about 80 ms locally, so the budget only fails on real regressions)
- The chain specs guard shortest-first search: a fixture where a short and a long chain prove the same deduction asserts the short one is reported, the same fixture with the short chain broken asserts the long one is, and each detector holds a 2000 ms budget for a broad scan of a stuck 17-clue board (about 5 ms locally)
- Driver fixtures are fixed 81-character board strings fed through `Sudoku.fromString`; never `Sudoku.create`, which uses unseeded randomness
- `technique-catalog-known-solution.spec.ts` pairs every fixture board with its own solution and asserts that no registered strategy eliminates a solution value or places a wrong one, which is what keeps the uniqueness techniques honest

## Exports

```typescript
export { SolutionTechniqueEnum, TechniqueManager };
export type { TechniqueResultInterface, MoveClassificationInterface, LogicalSolveResultInterface, LogicalSolveOutcomeType };
```

## Build

Dual output: ESM (`dist/esm/`) + CommonJS (`dist/cjs/`). Dependencies: `@rnw-community/shared`, `@suuudokuuu/generator` (one-way, generator never imports techniques).
