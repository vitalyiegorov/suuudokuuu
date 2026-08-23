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
│   ├── constants/       # DIFFICULTY_BANDS, the attempt budget, and the daily challenge scheme
│   ├── interfaces/      # band, band match, and forged-puzzle contracts
│   └── types/           # the corpus discriminator
├── daily/
│   └── utils/           # UTC date keys, the daily seed, the tier rotation, and the daily entry point
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

## The Daily Challenge Seed

The daily challenge is reproducible from nothing but a UTC calendar date. No table is stored anywhere, so a client, a build step and a future `/daily/YYYY-MM-DD` archive page all derive the same board independently, and the app never talks to a server for one.

1. **The key is the UTC date string.** `getDailyDateString(timestamp)` is `new Date(timestamp).toISOString().slice(0, 10)`, so the day boundary is UTC midnight everywhere on earth. `getDailyDayNumber(dateString)` is `Math.floor(Date.parse(`${dateString}T00:00:00.000Z`) / 86_400_000)` — whole UTC days since the epoch, and the exact inverse of the date string. Never use a local calendar date here: two players in different time zones must get the same puzzle at the same moment.
2. **The seed is FNV-1a over a namespaced key.** `getDailyPuzzleSeed(dateString)` hashes `` `suuudokuuu-daily-${dateString}` `` with 32-bit FNV-1a: offset basis `0x811c9dc5`, prime `0x01000193`, `Math.imul` per UTF-16 code unit, `>>> 0` after every step. `2026-08-23` therefore always yields `2317164260`, and `get-daily-puzzle-seed.util.spec.ts` pins that value. Changing the namespace string, the hash, or the date format reshuffles every past and future daily, so treat all three as frozen.
3. **The tier rotates by day number.** `DAILY_DIFFICULTY_LADDER` is the four generated tiers below `Nightmare` — `Newbie`, `Easy`, `Medium`, `Hard` — and `getDailyDifficulty(dateString)` indexes it with `dayNumber % 4`. A daily is never a corpus tier, so it is always a genuinely generated, band-checked board rather than a corpus pick.
4. **Every draw in the pipeline comes from that one seed.** `forgeDailyPuzzle(dateString)` calls `forgePuzzle(tier, budget, seed)`. `forgePuzzle` builds one master `createSeededRandom(seed)` stream and draws each rejection-sampling attempt's own PRNG seed from it, so attempt N is a pure function of the daily seed and the attempt index. It is not `seed + attempt`: adjacent seeds would then share attempt streams and two neighbouring days could forge the same board.
5. **Determinism is a property of mulberry32, not of the test runner.** `createSeededRandom` in `@suuudokuuu/solver-core` is integer and bitwise only, so it produces byte-identical streams on Hermes, JSC and every browser engine. Tests can only prove same-process reproducibility; the cross-engine half follows from the PRNG never touching a host random source or a float intermediate.
6. **An unseeded `forgePuzzle` stays unpredictable.** The `seed` parameter defaults to `Math.floor(Math.random() * PUZZLE_FORGE_SEED_RANGE)`, so ordinary puzzle creation is unchanged and two runs in the same millisecond cannot collide.

## Cost Rules

1. Band checks run cheap ladders first. `matchPuzzleBand` rejects with the simpler ladder before it pays for the band ladder, so puzzles that are too easy for a tier are discarded before any fish, wing or chain scan runs.
2. Raising a blank-cell target past 58 makes clue removal, not classification, the bottleneck. Measure before moving one.
3. Keep the attempt budget bounded. Puzzle creation happens on a phone while the player waits.

## Testing

1. Every tier needs a test that forges a real board and proves it sits in its band through the same ladder checks the forge uses.
2. Tier tests are randomized by nature. Give them a generous attempt budget rather than loosening the band assertion.
3. Cover the back-compat contract: the frozen generator inference table and the append-only tier list.
4. Cover the rating split: a corpus tier's rating must come from the record (Infinity's published rating sits above `SE_RATING_CEILING`, which the rater can never return), and a generated tier's rating must come from the rater.
