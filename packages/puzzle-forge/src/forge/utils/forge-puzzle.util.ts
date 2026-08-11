import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { pickHellPuzzle } from '@suuudokuuu/hell-corpus';
import { createSeededRandom } from '@suuudokuuu/solver-core';

import { DIFFICULTY_BANDS, PUZZLE_FORGE_MAX_ATTEMPTS } from '../../@generic/constants/difficulty-band.constant';

import { matchPuzzleBand } from './match-puzzle-band.util';

import type { DifficultyBandInterface } from '../../@generic/interfaces/difficulty-band.interface';
import type { ForgedPuzzleInterface } from '../../@generic/interfaces/forged-puzzle.interface';
import type { PuzzleBandMatchInterface } from '../../@generic/interfaces/puzzle-band-match.interface';
import type { DifficultyEnum, SudokuConfigInterface } from '@suuudokuuu/generator';

interface CandidateInterface {
    sudoku: Sudoku;
    match: PuzzleBandMatchInterface;
}

const withinBandRank = 2;
const aboveSimplerLadderRank = 1;

const createBandConfig = (difficulty: DifficultyEnum, band: DifficultyBandInterface): SudokuConfigInterface => ({
    ...defaultSudokuConfig,
    difficultyBlankCells: { ...defaultSudokuConfig.difficultyBlankCells, [difficulty]: band.blankCells }
});

const createCandidate = (config: SudokuConfigInterface, difficulty: DifficultyEnum, band: DifficultyBandInterface): CandidateInterface => {
    const sudoku = new Sudoku(config);

    sudoku.create(difficulty);

    return { sudoku, match: matchPuzzleBand(sudoku.toString(), band) };
};

const getCandidateRank = (match: PuzzleBandMatchInterface): number =>
    (match.isWithinBand ? withinBandRank : 0) + (match.isAboveSimplerLadder ? aboveSimplerLadderRank : 0);

export const forgePuzzle = (difficulty: DifficultyEnum, maxAttempts: number = PUZZLE_FORGE_MAX_ATTEMPTS): ForgedPuzzleInterface => {
    const band = DIFFICULTY_BANDS[difficulty];

    if (band.isCorpusSourced) {
        return { sudoku: Sudoku.fromString(pickHellPuzzle(createSeededRandom(Date.now())), defaultSudokuConfig), isInBand: true };
    }

    const config = createBandConfig(difficulty, band);
    let bestCandidate = createCandidate(config, difficulty, band);

    for (let attempt = 1; attempt < maxAttempts && !bestCandidate.match.isWithinBand; attempt += 1) {
        const candidate = createCandidate(config, difficulty, band);

        if (getCandidateRank(candidate.match) > getCandidateRank(bestCandidate.match)) {
            bestCandidate = candidate;
        }
    }

    return { sudoku: bestCandidate.sudoku, isInBand: bestCandidate.match.isWithinBand };
};
