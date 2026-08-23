# Puzzle Forge Package

Technique-aware puzzle sourcing. `@suuudokuuu/puzzle-forge` is the only place that decides what a difficulty tier means, and it is the package the app asks for a new board.

Read the root `AGENTS.md` first. Every engineering rule there applies here.

## Why the package exists

`@suuudokuuu/techniques` depends on `@suuudokuuu/generator`, so the generator can never import technique detection — that would be a dependency cycle. Technique-aware generation therefore cannot live inside the generator. This package sits above both and owns the composition:

```text
puzzle-forge → techniques → generator → solver-bitmask → solver-core
puzzle-forge → rating → techniques
puzzle-forge → hell-corpus
```

The generator stays a pure, dependency-clean puzzle engine: it still only knows how to fill a grid and remove clues down to a blank-cell target.

## Commands

```bash
yarn build
yarn ts
yarn lint
yarn test
yarn test:coverage
```

## Structure

```text
src/
├── @generic/
│   ├── constants/       # DIFFICULTY_BANDS and the attempt budget
│   ├── interfaces/      # band, band match, and forged-puzzle contracts
│   └── types/           # the corpus discriminator
└── forge/
    └── utils/           # ladder solvability, band matching, and the forge entry point
```

## Domain Rules

1. `DIFFICULTY_BANDS` in `src/@generic/constants/difficulty-band.constant.ts` is the single source of truth for what a tier means. A tier is a blank-cell target plus a required-technique band, never a blank-cell target alone. It is exported from the package index so consumers can state a tier's clue count and band contract without re-deriving either.
2. A band is expressed as two ladder ceilings. `simplerLadderMaxTechnique` is the previous tier's ceiling and the puzzle must **not** be solvable with it; `bandLadderMaxTechnique` is this tier's ceiling and the puzzle **must** be solvable with it. `null` means the bound is open on that side.
3. `DifficultyEnum` values are append-only and are serialized into saved games, history, shared links and replays. Adding a tier means adding a band entry; never renumber or drop one.
4. `defaultSudokuConfig.difficultyBlankCells` in the generator is frozen for every tier that already shipped. It is the legacy blank-count inference table used to label pre-trailer shared links, not a generation target. Blank-cell targets for new puzzles live in `DIFFICULTY_BANDS` and are applied by cloning the config per request. Corpus tiers never reach that cloning path, so their `blankCells` entry only records the tier's place in the table.
5. Hell and Infinity are corpus-sourced. `band.corpus` names which corpus supplies the board, and `null` means the tier is generated. Seventeen-clue Hell puzzles cannot be produced by clue removal in any practical time, and Infinity puzzles are curated by published Sudoku Explainer rating rather than clue count, so `@suuudokuuu/hell-corpus` supplies both.
6. `forgePuzzle` returns the rating with the board. A corpus tier carries the record's stored `rating` and `isCeiling` straight through, because those are verified or published values the local rater cannot reproduce — the rater's ladder tops out at `SE_RATING_CEILING`, well below the Infinity band. A generated tier is rated by `ratePuzzle` from `@suuudokuuu/rating`. The app never rates a new board itself.
7. `forgePuzzle` is rejection sampling with a budget. It always returns a board: when the budget runs out it returns the closest candidate it saw and reports `isInBand: false`. Callers must never block on an in-band result.

## Cost Rules

1. Band checks run cheap ladders first. `matchPuzzleBand` rejects with the simpler ladder before it pays for the band ladder, so puzzles that are too easy for a tier are discarded before any fish, wing or chain scan runs.
2. Raising a blank-cell target past 58 makes clue removal, not classification, the bottleneck. Measure before moving one.
3. Keep the attempt budget bounded. Puzzle creation happens on a phone while the player waits.

## Testing

1. Every tier needs a test that forges a real board and proves it sits in its band through the same ladder checks the forge uses.
2. Tier tests are randomized by nature. Give them a generous attempt budget rather than loosening the band assertion.
3. Cover the back-compat contract: the frozen generator inference table and the append-only tier list.
4. Cover the rating split: a corpus tier's rating must come from the record (Infinity's published rating sits above `SE_RATING_CEILING`, which the rater can never return), and a generated tier's rating must come from the rater.
