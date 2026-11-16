import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { ratePuzzle } from '@suuudokuuu/rating';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { GRID_BLANK_VALUE, UNIQUENESS_COUNT_LIMIT, formatGridString, parseGridString } from '@suuudokuuu/solver-core';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { DIFFICULTY_BANDS } from '../../@generic/constants/difficulty-band.constant';
import { ImportedPuzzleAssessmentKindEnum } from '../../@generic/enums/imported-puzzle-assessment-kind.enum';
import { createPuzzleBandMatcher } from '../../forge/utils/match-puzzle-band.util';

import { getConflictingCellIndexes } from './get-conflicting-cell-indexes.util';

import type { ImportedPuzzleAssessmentType } from '../../@generic/types/imported-puzzle-assessment.type';

const getDifficulty = (puzzleString: string, isRatingCeiling: boolean): DifficultyEnum => {
    if (isRatingCeiling) {
        return DifficultyEnum.Infinity;
    }

    const sudoku = Sudoku.fromString(puzzleString, defaultSudokuConfig);

    return (
        Object.values(DifficultyEnum).find(difficulty => createPuzzleBandMatcher(DIFFICULTY_BANDS[difficulty])(sudoku).isWithinBand) ??
        DifficultyEnum.Infinity
    );
};

export const assessImportedPuzzle = (puzzleString: string): ImportedPuzzleAssessmentType => {
    const grid = parseGridString(puzzleString.replaceAll('.', String(GRID_BLANK_VALUE)));
    const cellIndexes = getConflictingCellIndexes(grid);

    if (isNotEmptyArray(cellIndexes)) {
        return { kind: ImportedPuzzleAssessmentKindEnum.CONFLICT, cellIndexes };
    }

    if (!grid.includes(GRID_BLANK_VALUE)) {
        return { kind: ImportedPuzzleAssessmentKindEnum.COMPLETE };
    }

    const solver = new BitmaskSolver();

    if (solver.countSolutions(grid, UNIQUENESS_COUNT_LIMIT) > 1) {
        return { kind: ImportedPuzzleAssessmentKindEnum.MULTIPLE_SOLUTIONS };
    }

    const solution = solver.solve(grid);

    if (!isDefined(solution)) {
        return { kind: ImportedPuzzleAssessmentKindEnum.NO_SOLUTION };
    }

    const { rating, isCeiling, hardestTechnique } = ratePuzzle(puzzleString);

    return {
        kind: ImportedPuzzleAssessmentKindEnum.UNIQUE,
        solutionString: formatGridString(solution),
        rating,
        isRatingCeiling: isCeiling,
        hardestTechnique,
        difficulty: getDifficulty(puzzleString, isCeiling)
    };
};
