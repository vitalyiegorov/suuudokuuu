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
│   ├── se-technique-rating.constant.ts  # SE value table + reported ceiling
│   └── se-technique-order.constant.ts   # Cheapest-SE-first solve order
├── interfaces/
│   └── puzzle-rating.interface.ts
└── utils/
    └── rate-puzzle.util.ts              # Public API
```

## Key Concepts

### ratePuzzle

```typescript
ratePuzzle(puzzleString: string): PuzzleRatingInterface
```

The input is always a puzzle string, never a live `Sudoku` instance, so a rating depends on nothing but the 81 characters passed in. `Sudoku.fromString` rebuilds a deterministic board, `TechniqueManager.solveLogically(seTechniqueOrder)` produces the solve path, and the rating is the maximum technique value over that path.

```typescript
interface PuzzleRatingInterface {
    rating: number;
    hardestTechnique: SolutionTechniqueEnum;
    isCeiling: boolean;
}
```

An input that is already complete produces no steps and rates at the cheapest value (Full House, 1.0).

### Ordering policy

SE rates a puzzle as the hardest technique on the _rating-optimal_ path, so the solve must always reach for the cheapest technique that still makes progress. `seTechniqueOrder` is the SE-cheapest-first permutation of the registry and is passed to `solveLogically` as its plain enum-array parameter. It lists every technique except `Guess` exactly once, sorted by SE value and tie-broken by enum ordinal.

The order deliberately differs from `SolutionTechniqueEnum` ordinals: SE prices a Hidden Single (1.5) below a Naked Single (2.3), an X-Wing (3.2) below a Hidden Pair (3.4) and a Naked Triple (3.6), and a Naked Quad (5.0) above every wing. The registry-order rule in `packages/techniques/AGENTS.md` stays true; SE ordering lives only here.

### Ceiling reporting

`solveLogically` returns `stuck` when no registered technique makes progress, and `contradiction` when a blank cell loses every candidate. Neither outcome yields a real SE number, so both report the ceiling: `rating` is the hardest value the ladder can express, `hardestTechnique` is `Guess`, and `isCeiling` is `true`. Consumers render that as "N+" (today "5.6+").

This is a first-class path, not an edge case. Hell-corpus puzzles rate 8.0–11.0 on the published SE scale, far beyond the implemented ladder, so most of them come back as a ceiling result. A ceiling rating equal to a non-ceiling one is not a contradiction: `isCeiling` is what separates "solved by the hardest technique we have" from "harder than every technique we have".

### SE value table

`seTechniqueRatings` maps every `SolutionTechniqueEnum` member to a number. The record is exhaustive by type, so a new technique cannot be added to the enum without pricing it here.

The implemented ladder covers SE 1.0–5.4 completely (17/17 techniques), plus the two uniqueness techniques that carry the ladder to 5.6:

| Technique          | SE  |
| ------------------ | --- |
| Full House         | 1.0 |
| Hidden Single      | 1.5 |
| Naked Single       | 2.3 |
| Pointing Pair      | 2.6 |
| Pointing Triple    | 2.6 |
| Box/Line Reduction | 2.8 |
| Naked Pair         | 3.0 |
| X-Wing             | 3.2 |
| Hidden Pair        | 3.4 |
| Naked Triple       | 3.6 |
| Swordfish          | 3.8 |
| Hidden Triple      | 4.0 |
| XY-Wing            | 4.2 |
| XYZ-Wing           | 4.4 |
| Unique Rectangle   | 4.5 |
| Naked Quad         | 5.0 |
| Jellyfish          | 5.2 |
| Hidden Quad        | 5.4 |
| BUG                | 5.6 |

Only the type 1 form of each uniqueness technique is implemented, which is exactly what SE prices at 4.5 for a Unique Rectangle and 5.6 for a Bivalue Universal Grave. The remaining UR and BUG types start at 4.6 and 5.7 and are out of scope until corpus measurements show they matter. Both values are sound only because every served puzzle has a single solution.

A BUG rating is reachable but rare: BUG sits last in the cheapest-first order, and most BUG positions also yield to an XY-Chain (5.1) or an AIC (5.4), which the rating-optimal path must prefer. A Unique Rectangle at 4.5 is the uniqueness technique that actually unblocks solves.

SE's Box/Line Reduction is its "Claiming" rule, and both Pointing sizes share SE's single Pointing value. SE's box/line hidden-single split and its "Direct" variants only refine the 1.2–2.5 band and are deliberately skipped: a uniform 1.5 is close enough for easy puzzles and irrelevant to hard ones.

### Non-SE approximations

Nine registered detectors have no classic SE name. Their values below are **approximations**, not published SE numbers:

| Technique         | Approximate SE | Rationale                                                  |
| ----------------- | -------------- | ---------------------------------------------------------- |
| Finned X-Wing     | 3.4            | An X-Wing (3.2) plus one fin                               |
| Sashimi X-Wing    | 3.5            | Harder to spot than its finned form                        |
| Finned Swordfish  | 4.0            | A Swordfish (3.8) plus one fin                             |
| Sashimi Swordfish | 4.1            | Harder to spot than its finned form                        |
| W-Wing            | 4.4            | Two bi-value cells joined by a strong link, XYZ-Wing class |
| Simple Coloring   | 4.6            | Single-digit colouring, above every wing                   |
| X-Chain           | 4.8            | Single-digit chain                                         |
| XY-Chain          | 5.1            | Bi-value chain, above a Naked Quad                         |
| AIC               | 5.4            | Hardest chain detector in the ladder                       |

Real SE prices chains from 6.6 upwards by _shortest_ chain length, which these detectors do not guarantee, so the approximations stay conservative and bounded by the classic 5.4 band until a shortest-chain rater exists. Follow-up work raises the ceiling further: shortest-chain ratings to about 7.6, and a forcing-chain engine to 8.0 and above.

`Guess` carries the ceiling value and is the sentinel `hardestTechnique` for ceiling results; `SE_RATING_CEILING` reads it back, so the ceiling can never drift from the table.

## Rules

- Rating input is a puzzle string. Never rate a live `Sudoku` instance, which would make the result depend on play state.
- Every enum member needs a value in `seTechniqueRatings` and a slot in `seTechniqueOrder` (except `Guess`, which is the ceiling sentinel).
- Approximate values must stay listed as approximations in this file with a stated rationale.
- Ratings must be invariant under the runtime symmetry transforms, which permute and relabel but preserve logical structure.

## Testing

- Tests colocated with source files (`.spec.ts` suffix)
- Fixtures are fixed 81-character board strings fed through `Sudoku.fromString`; never `Sudoku.create`, which uses unseeded randomness
- `rate-puzzle.util.spec.ts` guards known-technique boards against their SE values, max-over-path aggregation, ceiling reporting for a stuck 17-clue hell-corpus board, an exact rating for a board that only the uniqueness techniques unblock, and determinism across repeated calls
- `se-technique-order.constant.spec.ts` guards the ordering policy: full coverage of the enum, cheapest-first ordering, enum-ordinal tie-breaking, and the ceiling matching the hardest table value

## Exports

```typescript
export { ratePuzzle, seTechniqueOrder, seTechniqueRatings, SE_RATING_CEILING };
export type { PuzzleRatingInterface };
```

## Build

Dual output: ESM (`dist/esm/`) + CommonJS (`dist/cjs/`). Dependencies: `@suuudokuuu/generator`, `@suuudokuuu/techniques` (one-way; neither imports rating).
