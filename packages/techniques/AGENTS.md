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
│   │   ├── hypothesis-propagator/      # Indexed board + memoised hypothesis propagation
│   │   ├── abstract-sized-technique.ts # Descriptor-backed family metadata only
│   │   └── abstract-fish-technique.ts  # Shared fish scanning only
│   ├── constants/
│   │   ├── chain-scan.constant.ts
│   │   └── forcing-chain-scan.constant.ts
│   ├── enums/
│   │   └── solution-technique.enum.ts  # Techniques ordered by difficulty (Guess = 0)
│   ├── interfaces/                     # TechniqueResult, CandidateElimination, ...
│   ├── types/                          # CandidateMapType, LineType, FinnedFish*, ...
│   └── utils/                          # Pure result, cell, peer, and registry helpers
│       └── context-scan-state.util.ts  # Per-context shared propagator + search-cap register
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
identifyMove(cell: CellInterface, techniqueOrder?: readonly SolutionTechniqueEnum[]): MoveClassificationInterface
solveLogically(techniqueOrder?: readonly SolutionTechniqueEnum[]): LogicalSolveResultInterface  // Full logical solve driver
```

Logical strategies run in `SolutionTechniqueEnum` difficulty order from `createTechniqueStrategies`. The manager exits at the first strategy that finds a result, and fallback `GuessTechnique` runs only when no supported logical technique matches. Techniques that only differ by size/name use descriptor-backed family strategies instead of empty subclasses.

`identifyMove` classifies in two ordered passes, each walking the registry in difficulty order:

1. Direct — the strategy places the played value in the played cell, or its eliminations leave that value as the only candidate there.
2. Enabling — the strategy's eliminations, applied to a transient context via `CandidateContext.withEliminations`, turn the played value into a naked or hidden single at the played cell (`isForcedPlacement`). The pass is skipped when the placement is already forced without those eliminations, so a technique is never credited for a deduction it did not cause.

A direct justification is one deduction step and always outranks an enabling one, which is two. Only moves that would otherwise fall through to `Guess` can reach the enabling pass.

`identifyMove` takes the same optional `techniqueOrder` as `solveLogically`, which is the interactive escape hatch: a caller that must answer within a frame passes a cheaper ladder instead of the registry.

### interactiveTechniqueOrder

`interactiveTechniqueOrder` is the registry order truncated before `AIC`, so it runs everything through `SimpleColoring` and drops `AIC`, `UniqueRectangle`, `BivalueUniversalGrave`, and the three forcing chains. It is a strict prefix, never a hole: skipping a cheap technique while keeping a later one would let a move be credited to a technique the full ladder would never have reached. A prefix can only ever weaken a classification, but not always to `Guess`: dropping the technique that justified a move directly lets it fall into the enabling pass, where a cheaper technique can still explain it in two steps, so a direct `AIC` can resurface as an enabling `HiddenPair`.

The cut sits at `AIC` because `identifyMove` narrows every scan by search intent, which makes the forcing chains far cheaper here than they are in a broad `solveLogically` scan, while `AICTechnique` searches depth-first and spends `AIC_MAX_LINK_VISITS` per start node on every fall-through move. Measured over 708 moves of twelve replayed Infinity games, the full ladder cost 11689 ms against 3781 ms for the interactive prefix, the worst single move fell from 780 ms to 42 ms, and 51 moves (7.2 %) downgraded to `Guess` — 31 that only a Nishio forcing chain explained and 20 that only an AIC explained. Cutting earlier, after the wing band, saved little more: the fish and wing strategies cost about 25 ms per move together.

Consumers that rate or solve keep using the full registry, and so does every bulk replay that is not on a tap budget; only classification that must answer inside a frame passes this order.

### solveLogically

`findNextStep` rebuilds the candidate snapshot from the Sudoku on every call, so it cannot advance past an elimination-only step. `solveLogically` is the multi-step driver: it threads a single `CandidateContext` across iterations, applies each accepted step to that context (`withEliminations`, then `withPlacement` for placements), and never mutates the `Sudoku`.

A step is accepted only when it still changes the threaded context: a placement needs candidates left in its cell, and an elimination needs at least one of its values to still be a candidate. That keeps every iteration monotonic, so the driver cannot repeat a step and always terminates.

`LogicalSolveResultInterface` carries the ordered `steps`, one `outcome`, and `wasSearchCapped`:

- `solved` — no unfilled cells remain.
- `stuck` — no registered technique produces a progressing step; this is the single "beyond the ladder" signal that a guess would be needed.
- `contradiction` — an unfilled cell has no candidates left.

`wasSearchCapped` is `true` when any scan run during the solve returned truncated results because it exhausted a search cap. It is deliberately "any scan on the path", not "the last scan": a truncated scan earlier in the solve changes which position the driver ends in, so the whole path is suspect once one scan was cut short. A `stuck` outcome with `wasSearchCapped` is therefore "we ran out of budget", not "we ran out of ladder", and `@suuudokuuu/rating` separates the two in its ceiling reporting.

Detectors report a cap through `markContextSearchCapped(context)`; the driver reads the flag back per iteration with `wasContextSearchCapped(context)`. The register lives in `context-scan-state.util.ts` as a module-level `WeakSet` keyed by the `CandidateContext`, so reporting a cap costs nothing in the strategy contract and cannot leak between boards: contexts are immutable snapshots, and a snapshot that goes out of scope takes its flag with it.

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

New members are appended, never inserted: the app persists these ordinals on replay timeline events, so renumbering would relabel finished games. `UniqueRectangle` and `BivalueUniversalGrave` therefore sit after `AIC` even though their solving cost is lower, which also keeps the registry reaching for them only after every non-uniqueness technique has failed. `NishioForcingChain`, `CellForcingChain`, and `RegionForcingChain` are appended after them and are the most expensive entries in both the registry and the SE order.

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

### AIC scan budget

`AICTechnique` searches depth-first, not breadth-first, so `AIC_MAX_LINK_VISITS` is a cap that really binds. It is spent **per start node**: every start node opens its own scan with a fresh budget, exactly as `XChainTechnique` and `XYChainTechnique` reset `linkVisits` per root.

A single budget shared across the whole broad scan would be spent in start-node key order, which is coordinate order, so the scan would stop somewhere in the middle of the board and every deduction reachable only from a later start node would be invisible. That made the rating depend on cell labelling: a symmetry transform relabels the cells, moves the winning start node past the exhaustion point, and the same puzzle rates differently. Measured over 30 hell-corpus boards against four seeded transform images each, a shared budget diverged on 12 boards; a per-start-node budget diverged on none. Keep the budget per start node.

An exhausted start-node budget still marks the context with `markContextSearchCapped`.

### Forcing chains

`NishioForcingChainTechnique`, `CellForcingChainTechnique`, and `RegionForcingChainTechnique` are the only strategies that reason hypothetically. All three share `HypothesisPropagator`, which is where the cost lives.

`HypothesisPropagator.fromContext(context)` snapshots the context once into an index-addressed board: a `Uint16Array` candidate bitmask per cell, peer index lists, and unit index lists. `propagate(cellIndex, value)` assumes that candidate, then runs naked singles and hidden singles to a fixpoint on a copy of the masks. It reports `hasContradiction`, the cells it placed, and the candidates it eliminated relative to the snapshot. Propagation is memoised per `(cell, value)`, so a scan pays for each hypothesis once even though a cell hypothesis and three region hypotheses ask for the same one.

One propagator is built per `CandidateContext` and shared by all three detectors, so the memo survives across them instead of being thrown away three times per driver step. `getContextHypothesisPropagator(context)` in `context-scan-state.util.ts` holds it in a module-level `WeakMap` keyed by the context. A `WeakMap` is the right home rather than a shared-scan parameter threaded through `find`: the propagator is a pure function of the context, every strategy already receives that context, and keying on it keeps `TechniqueStrategyInterface` unchanged while letting the garbage collector drop the snapshot with the context. Nishio then pays for the propagations and the two multi-branch detectors read them back for free, which measures about 3x faster than rebuilding per detector.

Sharing the memo must not also share the budget, or the second and third detector would start already spent. Each `find` call therefore keeps its own `propagationKeys` set on the scan: `propagateForScan` records the `(cell, value)` key it asked for and `hasForcingChainScanBudget` measures `FORCING_CHAIN_MAX_HYPOTHESES_PER_SCAN` against that set. Counting distinct keys rather than calls is what keeps the truncation point identical to the unshared version, since a region scan can legitimately ask for the same hypothesis from three different units.

Propagation uses only naked and hidden singles, which is SE's non-dynamic chaining: it follows the direct consequences of an assumption and never assumes a second candidate on top of the first. Dynamic and nested variants are deliberately out of scope.

- A **Nishio forcing chain** assumes one candidate. A contradiction proves the candidate false, so the candidate is eliminated.
- A **cell forcing chain** assumes every candidate of one unfilled cell in turn.
- A **region forcing chain** assumes every position of one value inside one unit in turn.

Both multi-branch detectors keep what every branch agrees on: a cell that every branch places with the same value becomes a placement, and a candidate that every branch removes becomes an elimination. A root whose branches include a contradiction is skipped entirely — that branch is a Nishio deduction, which is cheaper and runs first.

`chainLength` is the number of cells the argument placed: the contradiction path for Nishio, and the union of the branch paths for the multi-branch forms. It stays equal to `reasonCells.length`, as it is for the shortest-path chains. `FORCING_CHAIN_MIN_CELLS` rejects arguments below that size, which keeps a degenerate no-propagation case split from being reported as a forcing chain, and `FORCING_CHAIN_MAX_HYPOTHESES_PER_SCAN` caps the propagations one scan may run. A capped-out scan returns what it already found, marks the context with `markContextSearchCapped`, and otherwise leaves the driver `stuck` — but a `stuck` that carries `wasSearchCapped` is a budget limit, not a ladder limit.

Results are canonicalised and then sorted by `chainLength`, so the driver applies the cheapest forcing argument available and `@suuudokuuu/rating` prices the position from the shortest argument that proves it.

### CandidateContext

Cached snapshot of candidates per blank cell (`fromSudoku`), with unit/peer navigation. Logical strategies work on this context, never on the Sudoku instance directly.

Snapshots are immutable: `withEliminations(eliminations)` and `withPlacement(cell, value)` both return a new context, the latter with the value written into its own field copy and the value pruned from the peer candidates. `getBlankCells` is candidate-driven, so a cell reduced to zero candidates silently leaves it; `hasContradiction()` reports that state explicitly and `isSolved()` reports a board with no unfilled cells.

## Rules

- Technique detection must answer "which technique justifies value V in cell C", not "any technique anywhere"
- New logical strategies must keep registry order aligned with `SolutionTechniqueEnum`
- A scan cap must be spent per root, per start node, or per scan — never once across a whole coordinate-ordered sweep, which makes results depend on cell labelling
- A detector that truncates on a cap must say so with `markContextSearchCapped`, so a capped `stuck` stays distinguishable from an exhausted ladder
- New algorithms belong in their own `*-technique/classes/` folder; parameter-only variants belong in descriptor-backed family strategies
- Uniqueness-based strategies may only assume a single solution; state that assumption in this file when adding one
- Tests use realistic boards via `Sudoku.fromStrings(defaultSudokuConfig, ...)` + `CandidateContext.fromSudoku`; synthetic candidate maps only for patterns impractical to reach from a real board
- Every technique needs a positive assertion; add negative coverage where false positives are plausible

## Testing

- Tests colocated with source files (`.spec.ts` suffix)
- Coverage thresholds: statements 80%, branches 70%, lines 80%, functions 80%
- `solve-logically.spec.ts` guards the driver: elimination-only progress, solved/stuck/contradiction outcomes, determinism from a fixed board string, `wasSearchCapped` in all three shapes (a region forcing chain scan truncated on a 17-clue board reports it, a singles-only stuck solve and a solved board do not), and a wall-clock budget of 5000 ms for a full logical solve of a 17-clue hell-corpus board (about 80 ms locally, so the budget only fails on real regressions)
- The chain specs guard shortest-first search: a fixture where a short and a long chain prove the same deduction asserts the short one is reported, the same fixture with the short chain broken asserts the long one is, and each detector holds a 2000 ms budget for a broad scan of a stuck 17-clue board (about 5 ms locally)
- The forcing chain specs guard hypothetical reasoning: each detector proves its own deduction shape on a board where it is the deciding technique, asserts `chainLength === reasonCells.length` and the minimum chain size, checks every deduction against that board's known solution, covers the direct and enabling search intents, and holds a 2000 ms budget for a broad scan of a 17-clue board where the hypothesis cap truncates the search (about 10 ms locally)
- Driver fixtures are fixed 81-character board strings fed through `Sudoku.fromString`; never `Sudoku.create`, which uses unseeded randomness
- `technique-catalog-known-solution.spec.ts` pairs every fixture board with its own solution and asserts that no registered strategy eliminates a solution value or places a wrong one, which is what keeps the uniqueness techniques honest

## Exports

```typescript
export { SolutionTechniqueEnum, TechniqueManager, interactiveTechniqueOrder, isSolutionTechnique, createTechniqueStrategies };
export type {
    TechniqueResultInterface,
    MoveClassificationInterface,
    TechniqueStrategyInterface,
    LogicalSolveResultInterface,
    LogicalSolveOutcomeType
};
```

`createTechniqueStrategies` is exported so a consumer can build a `TechniqueManager` over a narrowed registry, for example a single technique. `findNextStep` always returns the first strategy in the given order that fires, so a full registry can only ever surface the simplest available technique. Several techniques — `HiddenQuad` most obviously, because its in-unit complement is always a smaller naked subset — can therefore never be observed through the default registry, and a filtered registry is the only way to detect them on demand.

## Build

Dual output: ESM (`dist/esm/`) + CommonJS (`dist/cjs/`). Dependencies: `@rnw-community/shared`, `@suuudokuuu/generator` (one-way, generator never imports techniques).
