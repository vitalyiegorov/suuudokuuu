import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { pickHellPuzzleRecord, pickInfinityPuzzle } from '@suuudokuuu/hell-corpus';
import { ratePuzzle } from '@suuudokuuu/rating';
import { createSeededRandom } from '@suuudokuuu/solver-core';

import { isDefined } from '@rnw-community/shared';

import { DIFFICULTY_BANDS, PUZZLE_FORGE_MAX_ATTEMPTS, PUZZLE_FORGE_SEED_RANGE } from '../../@generic/constants/difficulty-band.constant';
import { PuzzleCorpusEnum } from '../../@generic/enums/puzzle-corpus.enum';

import { createPuzzleBandMatcher } from './match-puzzle-band.util';

import type { DifficultyBandInterface } from '../../@generic/interfaces/difficulty-band.interface';
import type { ForgedPuzzleInterface } from '../../@generic/interfaces/forged-puzzle.interface';
import type { PuzzleBandMatchInterface } from '../../@generic/interfaces/puzzle-band-match.interface';
import type { DifficultyEnum, SudokuConfigInterface } from '@suuudokuuu/generator';
import type { RatedCorpusPuzzleInterface } from '@suuudokuuu/hell-corpus';
import type { SeededRandomType } from '@suuudokuuu/solver-core';

interface AttemptInterface {
    readonly sudoku: Sudoku;
    readonly match: PuzzleBandMatchInterface;
}

const corpusPickers: Record<PuzzleCorpusEnum, (random: SeededRandomType) => RatedCorpusPuzzleInterface> = {
    [PuzzleCorpusEnum.HELL]: pickHellPuzzleRecord,
    [PuzzleCorpusEnum.INFINITY]: pickInfinityPuzzle
};

const createBandConfig = (difficulty: DifficultyEnum, band: DifficultyBandInterface): SudokuConfigInterface => ({
    ...defaultSudokuConfig,
    difficultyBlankCells: { ...defaultSudokuConfig.difficultyBlankCells, [difficulty]: band.blankCells }
});

const createAttempt = (
    config: SudokuConfigInterface,
    difficulty: DifficultyEnum,
    matchBand: (sudoku: Sudoku) => PuzzleBandMatchInterface,
    random: SeededRandomType
): AttemptInterface => {
    const sudoku = new Sudoku({ ...config, random });

    sudoku.create(difficulty);

    return { sudoku, match: matchBand(sudoku) };
};

const createAttemptRandom = (attemptSeedRandom: SeededRandomType): SeededRandomType =>
    createSeededRandom(Math.floor(attemptSeedRandom() * PUZZLE_FORGE_SEED_RANGE));

const forgeCorpusPuzzle = (corpus: PuzzleCorpusEnum, seed: number): ForgedPuzzleInterface => {
    const { puzzle, rating, isCeiling } = corpusPickers[corpus](createSeededRandom(seed));

    return { sudoku: Sudoku.fromString(puzzle, defaultSudokuConfig), isInBand: true, rating, isRatingCeiling: isCeiling };
};

export const forgePuzzle = (
    difficulty: DifficultyEnum,
    maxAttempts: number = PUZZLE_FORGE_MAX_ATTEMPTS,
    seed: number = Math.floor(Math.random() * PUZZLE_FORGE_SEED_RANGE)
): ForgedPuzzleInterface => {
    const band = DIFFICULTY_BANDS[difficulty];

    if (isDefined(band.corpus)) {
        return forgeCorpusPuzzle(band.corpus, seed);
    }

    const config = createBandConfig(difficulty, band);
    const matchBand = createPuzzleBandMatcher(band);
    const attemptSeedRandom = createSeededRandom(seed);
    let bestAttempt = createAttempt(config, difficulty, matchBand, createAttemptRandom(attemptSeedRandom));

    for (let attempt = 1; attempt < maxAttempts && !bestAttempt.match.isWithinBand; attempt += 1) {
        const attemptResult = createAttempt(config, difficulty, matchBand, createAttemptRandom(attemptSeedRandom));

        if (attemptResult.match.isWithinBand || (attemptResult.match.isAboveSimplerLadder && !bestAttempt.match.isAboveSimplerLadder)) {
            bestAttempt = attemptResult;
        }
    }

    const { rating, isCeiling } = ratePuzzle(bestAttempt.sudoku.toString());

    return { sudoku: bestAttempt.sudoku, isInBand: bestAttempt.match.isWithinBand, rating, isRatingCeiling: isCeiling };
};
