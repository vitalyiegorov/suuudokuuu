import { PUZZLE_FORGE_MAX_ATTEMPTS } from '../../@generic/constants/difficulty-band.constant';

import { forgePuzzle } from './forge-puzzle.util';

import type { SerializedPuzzleInterface } from '../../@generic/interfaces/serialized-puzzle.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export const forgeSerializablePuzzle = (difficulty: DifficultyEnum, seed?: number): SerializedPuzzleInterface => {
    const { sudoku, rating, isRatingCeiling } = forgePuzzle(difficulty, PUZZLE_FORGE_MAX_ATTEMPTS, seed);

    return {
        sudokuString: sudoku.toString(),
        solutionString: sudoku.FullField.flatMap(row => row.map(cell => cell.value)).join(''),
        rating,
        isRatingCeiling
    };
};
