# Rating Package

Sudoku Explainer (SE) style difficulty rating. Given a puzzle string, runs a full logical solve over the technique ladder in SE-cheapest-first order and reports the hardest technique the rating-optimal path needed.

This package owns the SE scale. It cannot live in `techniques`, whose scope contract is "which technique justifies value V in cell C" and whose registry order deliberately differs from SE cost order, nor in `generator`, where `techniques → generator` would become a dependency cycle.

```
rating → techniques → generator → solver-bitmask → solver-core
```

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
├── constants/
│   ├── se-chain-rating.constant.ts      # Chain length ladder + chain and forcing band maximums
│   ├── se-rating-ceiling.constant.ts    # Reported ceiling, derived from the band maximums
│   ├── se-technique-rating.constant.ts  # SE value table
│   └── se-technique-order.constant.ts   # Cheapest-SE-first solve order
├── interfaces/
│   └── puzzle-rating.interface.ts
├── types/
│   └── ceiling-reason.type.ts
└── utils/
    ├── get-ceiling-reason.util.ts       # Why a result is a ceiling result
    ├── get-step-rating.util.ts          # Per-step value, length-priced for chains
    └── rate-puzzle.util.ts              # Public API
```

## Key Concepts

### ratePuzzle

```typescript
ratePuzzle(puzzleString: string): PuzzleRatingInterface
```

The input is always a puzzle string, never a live `Sudoku` instance, so a rating depends on nothing but the 81 characters passed in. `Sudoku.fromString` rebuilds a deterministic board, `TechniqueManager.solveLogically(seTechniqueOrder)` produces the solve path, and the rating is the maximum step value over that path. A step value is the technique's table value for every technique except the length-priced chains, where `getStepRating` reads `chainLength` off the step.

```typescript
interface PuzzleRatingInterface {
    rating: number;
    hardestTechnique: SolutionTechniqueEnum;
    isCeiling: boolean;
    ceilingReason?: CeilingReasonType;
}
```

An input that is already complete produces no steps and rates at the cheapest value (Full House, 1.0).

### Ordering policy

SE rates a puzzle as the hardest technique on the _rating-optimal_ path, so the solve must always reach for the cheapest technique that still makes progress. `seTechniqueOrder` is the SE-cheapest-first permutation of the registry and is passed to `solveLogically` as its plain enum-array parameter. It lists every technique except `Guess` exactly once, sorted by SE value and tie-broken by enum ordinal.

The order deliberately differs from `SolutionTechniqueEnum` ordinals: SE prices a Hidden Single (1.5) below a Naked Single (2.3), an X-Wing (3.2) below a Hidden Pair (3.4) and a Naked Triple (3.6), and a Naked Quad (5.0) above every wing. The registry-order rule in `packages/techniques/AGENTS.md` stays true; SE ordering lives only here.

A length-priced chain is ordered by the cheapest value it can report, which is its table value, so the shortest-path chain detectors sort in the order X-Chain, XY-Chain, AIC. That is what keeps the rating-optimal path reaching for a length-priced chain before the flat-priced AIC that generalises both. The three forcing chains sort last of all, so a hypothetical argument is only ever reached once every direct technique has failed.

### Ceiling reporting

`solveLogically` returns `stuck` when no registered technique makes progress, and `contradiction` when a blank cell loses every candidate. Neither outcome yields a real SE number, so both report the ceiling: `rating` is the hardest value the ladder can express, `hardestTechnique` is `Guess`, and `isCeiling` is `true`. Consumers render that as "N+" (today "8.5+").

`ceilingReason` says which of three different situations produced that ceiling, and is present only on ceiling results:

| Reason          | Meaning                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------- |
| `contradiction` | The solve drove a blank cell to zero candidates                                             |
| `search-capped` | Some scan on the path exhausted a search cap, so the ladder was truncated rather than spent |
| `beyond-ladder` | Every technique ran to completion and none made progress                                    |

`getCeilingReason` resolves them in that precedence order: a contradiction is reported even when a scan was also truncated, because the contradiction is the harder fact. Only `beyond-ladder` is a genuine "this puzzle is harder than everything we implement" claim; `search-capped` is "we gave up early" and should not be read as a difficulty statement. `isCeiling` keeps its exact previous meaning and is unchanged by this split.

`contradiction` is a defensive path for `ratePuzzle` specifically: `Sudoku.fromString` refuses a board with no solution, so a contradiction can only come from a detector making an unsound deduction. It is covered at the `getCeilingReason` level rather than with a puzzle-string fixture.

This is a first-class path, not an edge case. The curated Infinity corpus rates 10.6–11.9 on the published SE scale, far beyond the implemented ladder, so every one of its records comes back as a ceiling result. A ceiling rating equal to a non-ceiling one is not a contradiction: `isCeiling` is what separates "solved by the hardest technique we have" from "harder than every technique we have".

### SE value table

`seTechniqueRatings` maps every `SolutionTechniqueEnum` member to a number. The record is exhaustive by type, so a new technique cannot be added to the enum without pricing it here.

The implemented ladder covers SE 1.0–5.4 completely (17/17 techniques), plus the two uniqueness techniques that carry the ladder to 5.6, plus the chain band that carries it to 7.6, plus the forcing chain band that carries it to 8.5:

| Technique            | SE  |
| -------------------- | --- |
| Full House           | 1.0 |
| Hidden Single        | 1.5 |
| Naked Single         | 2.3 |
| Pointing Pair        | 2.6 |
| Pointing Triple      | 2.6 |
| Box/Line Reduction   | 2.8 |
| Naked Pair           | 3.0 |
| X-Wing               | 3.2 |
| Hidden Pair          | 3.4 |
| Naked Triple         | 3.6 |
| Swordfish            | 3.8 |
| Hidden Triple        | 4.0 |
| XY-Wing              | 4.2 |
| XYZ-Wing             | 4.4 |
| Unique Rectangle     | 4.5 |
| Naked Quad           | 5.0 |
| Jellyfish            | 5.2 |
| Hidden Quad          | 5.4 |
| BUG                  | 5.6 |
| X-Chain              | 6.6 |
| XY-Chain             | 7.0 |
| Nishio Forcing Chain | 7.5 |
| Cell Forcing Chain   | 8.0 |
| Region Forcing Chain | 8.0 |

Only the type 1 form of each uniqueness technique is implemented, which is exactly what SE prices at 4.5 for a Unique Rectangle and 5.6 for a Bivalue Universal Grave. The remaining UR and BUG types start at 4.6 and 5.7 and are out of scope until corpus measurements show they matter. Both values are sound only because every served puzzle has a single solution.

Both uniqueness techniques now sit ahead of every chain in the cheapest-first order, which matches SE: a BUG at 5.6 is cheaper than the 6.6 chain band, so a BUG position is priced as a BUG instead of as the chain that could also crack it. A Unique Rectangle at 4.5 is the uniqueness technique that most often unblocks solves.

SE's Box/Line Reduction is its "Claiming" rule, and both Pointing sizes share SE's single Pointing value. SE's box/line hidden-single split and its "Direct" variants only refine the 1.2–2.5 band and are deliberately skipped: a uniform 1.5 is close enough for easy puzzles and irrelevant to hard ones.

### Non-SE approximations

Seven registered detectors have no classic SE name. Their values below are **approximations**, not published SE numbers:

| Technique         | Approximate SE | Rationale                                                  |
| ----------------- | -------------- | ---------------------------------------------------------- |
| Finned X-Wing     | 3.4            | An X-Wing (3.2) plus one fin                               |
| Sashimi X-Wing    | 3.5            | Harder to spot than its finned form                        |
| Finned Swordfish  | 4.0            | A Swordfish (3.8) plus one fin                             |
| Sashimi Swordfish | 4.1            | Harder to spot than its finned form                        |
| W-Wing            | 4.4            | Two bi-value cells joined by a strong link, XYZ-Wing class |
| Simple Coloring   | 4.6            | Single-digit colouring, above every wing                   |
| AIC               | 7.2            | Generalised chain, above both length-priced chain bases    |

Simple Coloring stays in the classic band even though SE would treat it as a single-digit cycle: it is a colouring contradiction rather than a chain with a measured length, and repricing it is out of scope until it reports one.

### Chain length pricing

SE prices chains by the length of the _shortest_ chain that proves the deduction, so `XChainTechnique` and `XYChainTechnique` search shortest-first and report `chainLength` (the number of cells in the chain) on every result. `getStepRating` turns that into a value:

```
rating = min(base + 0.1 x (number of thresholds below the chain length), 7.6)
```

The thresholds are SE's own ladder, `[4, 6, 8, 12, 16, 24, 32, 48, 64, 96]`, grown from 4 by alternating factors of 3/2 and 4/3: a chain of at most 4 cells adds nothing, 5–6 cells add 0.1, 7–8 add 0.2, 9–12 add 0.3, and so on. The ladder is exactly long enough to carry the cheapest chain base to the band top, so it is derived from `SE_CHAIN_RATING_MINIMUM`, `SE_CHAIN_RATING_MAXIMUM`, and the increment rather than written out.

Bases are 6.6 for an X-Chain (SE's forcing X-Chain, and the band minimum) and 7.0 for an XY-Chain (SE's forcing Y-Chain). A chain cannot hold more cells than the board has, so in practice an X-Chain tops out at 7.5 and an XY-Chain reaches the 7.6 clamp from about 25 cells.

`SE_CHAIN_RATING_MAXIMUM` is 7.6 and clamps the shortest-path chain band.

AIC keeps a flat 7.2. It is the one chain detector that does not minimise its length, so pricing it by length would be a fiction; sitting above both chain bases and below the band top keeps it last among the shortest-path chains in the cheapest-first order and keeps an exact AIC rating distinguishable from a ceiling result.

### Forcing chain pricing

The three forcing chains are length-priced from the same ladder, off their own bases and against their own clamp, `SE_FORCING_CHAIN_RATING_MAXIMUM` at 8.5. `seLengthPricedBandMaximums` is what makes a technique length-priced at all: a technique absent from that map is priced flat, whatever length its step reports.

A Nishio forcing chain is SE's contradiction form and takes the band minimum of 7.5. A cell forcing chain and a region forcing chain are both SE's "Multiple Forcing Chains" and share its 8.0 base; they are separate enum members because they are separate arguments and get separate labels, not because SE prices them apart. The ladder is exactly ten increments wide, so 7.5 reaches 8.5 at the top of the ladder and 8.0 clamps from a 24-cell argument up.

`chainLength` for a forcing chain is the number of cells the argument placed, which for the multi-branch forms is the union over the branches rather than SE's sum over them. The union is bounded by the board, so it saturates the band more slowly than a sum would while still ordering shorter arguments below longer ones.

8.5 is where SE's dynamic forcing chains begin, and dynamic and nested variants are out of scope, so 8.5 is also the reported ceiling. That keeps "the hardest thing the ladder can express" and "the hardest thing the ladder can price" the same number. Raising the ceiling past 8.5 is the dynamic forcing chain engine's job.

A forcing chain rating is an upper bound in one respect worth stating: the forcing chains run last, so any deduction that reaches them is genuinely beyond the rest of the implemented ladder, but SE's own ladder is wider than this one. A position that SE would crack with a technique this package does not implement is priced here as the forcing chain that cracked it instead, which over-states rather than under-states it.

### The ceiling constant

`SE_RATING_CEILING` has its own definition in `se-rating-ceiling.constant.ts`, derived from the length-priced band maximums:

```typescript
export const SE_RATING_CEILING = Math.max(...seLengthPricedBandMaximums.values());
```

It used to be an alias for `seTechniqueRatings[Guess]`, which conflated two unrelated numbers. `seTechniqueRatings[Guess]` is **the price of guessing** — what a step costs when no technique justifies it — and `SE_RATING_CEILING` is **the top of what the ladder can express**. They are equal today at 8.5 only because the forcing chain band happens to end there. Raising the ceiling by implementing a harder band must not silently reprice guessing for every consumer, and repricing a guess must not move the ceiling.

`se-rating-ceiling.constant.spec.ts` holds the invariant: the ceiling equals the maximum reachable chain or forcing band value, sits at or above every length-priced band maximum, and sits at or above every value in `seTechniqueRatings` — including the price of guessing. Deriving it from the band map rather than writing a literal keeps it correct when a new length-priced band is added.

`Guess` remains the sentinel `hardestTechnique` for ceiling results.

### Transform invariance

The runtime symmetry transforms in `@suuudokuuu/hell-corpus` permute rows, columns, and bands, optionally transpose, and relabel digits. They preserve every logical relationship, so a rating must not move under them. It did.

Measured over hell-corpus boards against four seeded transform images each, ratings diverged on **12 of 30 boards (40%)**, with deltas up to 0.6 SE — typically a board rating 7.2 via AIC whose image fell through to a 7.5–8.0 forcing chain. The cause was `AICTechnique` spending one `AIC_MAX_LINK_VISITS` budget across its whole broad scan in start-node key order: a transform relabels the cells, the winning start node lands past the exhaustion point, and the AIC deduction becomes invisible. Making the budget per start node is the fix and lives in `packages/techniques/AGENTS.md`. It took the same sample to **0 of 30**.

Residual divergence over a wider sample is **2 of 60 boards (3.3%)**, and both are the same remaining cause: **coordinate-dependent tie-breaking among equal-price deductions**.

- One board rates 7.8 on four images and 7.7 on the fifth, from a 7-cell rather than 9-cell Nishio argument, with no scan cap hit anywhere in either solve. The step counts differ across images (86/87/87/90/87), so the paths diverged earlier: `getCanonicalTechniqueResults` breaks ties by reason-path key, which is a coordinate string, so among equally-priced deductions a different one is applied first and the deciding position that follows is not the same position.
- The other rates 7.3 (XY-Chain) against 7.2 (AIC). Its solve does report `wasSearchCapped`, but raising `X_CHAIN_MAX_VISITS_PER_ROOT` and `XY_CHAIN_MAX_VISITS_PER_ROOT` twentyfold and `FORCING_CHAIN_MAX_HYPOTHESES_PER_SCAN` to full-board coverage left the result unchanged, so the cap is incidental rather than causal. It is the same path divergence.

Raising caps is therefore **not** a fix worth paying for: it was measured, it moved nothing, and full-board forcing coverage cost about 8% wall clock. The caps are unchanged.

Closing the remaining 3.3% needs a tie-break that does not read cell coordinates — a canonical form of a deduction under the symmetry group, which is a graph-canonicalisation problem and out of scope here. Until then, treat a rating as accurate to about 0.1 SE for boards decided in the chain and forcing bands, and do not assert exact rating equality across transform images in tests without first checking the board is stable.

## Rules

- Rating input is a puzzle string. Never rate a live `Sudoku` instance, which would make the result depend on play state.
- Every enum member needs a value in `seTechniqueRatings` and a slot in `seTechniqueOrder` (except `Guess`, which is the ceiling sentinel).
- Approximate values must stay listed as approximations in this file with a stated rationale.
- Ratings must be invariant under the runtime symmetry transforms, which permute and relabel but preserve logical structure. Invariance is currently about 97% by board; see the transform invariance section before relying on it.
- `SE_RATING_CEILING` and `seTechniqueRatings[Guess]` are separate numbers with separate meanings. Never redefine either in terms of the other.

## Testing

- Tests colocated with source files (`.spec.ts` suffix)
- Fixtures are fixed 81-character board strings fed through `Sudoku.fromString`; never `Sudoku.create`, which uses unseeded randomness
- `rate-puzzle.util.spec.ts` guards known-technique boards against their SE values, max-over-path aggregation, ceiling reporting for an Infinity-corpus board no technique can finish, an exact rating for a board that only the uniqueness techniques unblock, one that only a forcing chain unblocks, a hell-corpus board priced above the XY-Chain base by its chain length, and determinism across repeated calls
- `get-step-rating.util.spec.ts` guards the length ladder: every band boundary for both chain bases and all three forcing chain bases, the 7.6 and 8.5 clamps, monotonicity in the chain length, the fallback to the table value when a step carries no length, and flat pricing for every other technique
- `se-technique-order.constant.spec.ts` guards the ordering policy: full coverage of the enum, cheapest-first ordering, enum-ordinal tie-breaking, the chain and forcing chain bases, and the ceiling matching the forcing chain band maximum
- `se-rating-ceiling.constant.spec.ts` guards the ceiling invariant: it equals the maximum reachable band value and sits at or above every band maximum and every table value, including the price of guessing
- `get-ceiling-reason.util.spec.ts` guards all four reason combinations, including the precedence of `contradiction` over `search-capped`

## Exports

```typescript
export { ratePuzzle, seTechniqueOrder, seTechniqueRatings, SE_RATING_CEILING };
export type { PuzzleRatingInterface, CeilingReasonType };
```

## Build

Dual output: ESM (`dist/esm/`) + CommonJS (`dist/cjs/`). Dependencies: `@suuudokuuu/generator`, `@suuudokuuu/techniques` (one-way; neither imports rating).
