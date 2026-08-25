import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { pickHellPuzzleRecord, pickInfinityPuzzle } from '@suuudokuuu/hell-corpus';
import { ratePuzzle } from '@suuudokuuu/rating';
import { createSeededRandom } from '@suuudokuuu/solver-core';

import { isDefined } from '@rnw-community/shared';

import { DIFFICULTY_BANDS, PUZZLE_FORGE_MAX_ATTEMPTS, PUZZLE_FORGE_SEED_RANGE } from '../../@generic/constants/difficulty-band.constant';

import { matchPuzzleBand } from './match-puzzle-band.util';

import type { DifficultyBandInterface } from '../../@generic/interfaces/difficulty-band.interface';
import type { ForgedPuzzleInterface } from '../../@generic/interfaces/forged-puzzle.interface';
import type { PuzzleBandMatchInterface } from '../../@generic/interfaces/puzzle-band-match.interface';
import type { PuzzleCorpusType } from '../../@generic/types/puzzle-corpus.type';
import type { DifficultyEnum, SudokuConfigInterface } from '@suuudokuuu/generator';
import type { RatedCorpusPuzzleInterface } from '@suuudokuuu/hell-corpus';
import type { SeededRandomType } from '@suuudokuuu/solver-core';

interface CandidateInterface {
    sudoku: Sudoku;
    match: PuzzleBandMatchInterface;
}

const corpusPickers: Record<PuzzleCorpusType, (random: SeededRandomType) => RatedCorpusPuzzleInterface> = {
    hell: pickHellPuzzleRecord,
    infinity: pickInfinityPuzzle
};

const createBandConfig = (difficulty: DifficultyEnum, band: DifficultyBandInterface): SudokuConfigInterface => ({
    ...defaultSudokuConfig,
    difficultyBlankCells: { ...defaultSudokuConfig.difficultyBlankCells, [difficulty]: band.blankCells }
});

const createCandidate = (
    config: SudokuConfigInterface,
    difficulty: DifficultyEnum,
    band: DifficultyBandInterface,
    random: SeededRandomType
): CandidateInterface => {
    const sudoku = new Sudoku({ ...config, random });

    sudoku.create(difficulty);

    return { sudoku, match: matchPuzzleBand(sudoku.toString(), band) };
};

const createAttemptRandom = (attemptSeedRandom: SeededRandomType): SeededRandomType =>
    createSeededRandom(Math.floor(attemptSeedRandom() * PUZZLE_FORGE_SEED_RANGE));

const isBetterMatch = (match: PuzzleBandMatchInterface, bestMatch: PuzzleBandMatchInterface): boolean =>
    match.isWithinBand === bestMatch.isWithinBand ? match.isAboveSimplerLadder && !bestMatch.isAboveSimplerLadder : match.isWithinBand;

const forgeCorpusPuzzle = (corpus: PuzzleCorpusType, seed: number): ForgedPuzzleInterface => {
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
    const attemptSeedRandom = createSeededRandom(seed);
    let bestCandidate = createCandidate(config, difficulty, band, createAttemptRandom(attemptSeedRandom));

    for (let attempt = 1; attempt < maxAttempts && !bestCandidate.match.isWithinBand; attempt += 1) {
        const candidate = createCandidate(config, difficulty, band, createAttemptRandom(attemptSeedRandom));

        if (isBetterMatch(candidate.match, bestCandidate.match)) {
            bestCandidate = candidate;
        }
    }

    const { rating, isCeiling } = ratePuzzle(bestCandidate.sudoku.toString());

    return { sudoku: bestCandidate.sudoku, isInBand: bestCandidate.match.isWithinBand, rating, isRatingCeiling: isCeiling };
};
