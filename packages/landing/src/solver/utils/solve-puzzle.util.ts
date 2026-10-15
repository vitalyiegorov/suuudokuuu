import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { ratePuzzle } from '@suuudokuuu/rating';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { UNIQUENESS_COUNT_LIMIT, formatGridString, parseGridString } from '@suuudokuuu/solver-core';
import { DLXSolver } from '@suuudokuuu/solver-dlx';

import { isDefined } from '@rnw-community/shared';

import { TECHNIQUE_NAMES } from '../../techniques/constants/technique-name.constant';
import { TECHNIQUE_PAGE_PATHS } from '../../techniques/constants/technique-page-path.constant';
import { SolvePathBuilder } from '../classes/solve-path-builder';
import { ENTRY_BLANK_CHARACTER, ENTRY_GRID_BLANK_CHARACTER, ENTRY_GRID_SIZE } from '../constants/puzzle-entry.constant';

import type { SolverConflictInterface } from '../interfaces/solver-conflict.interface';
import type { SolverSolutionInterface } from '../interfaces/solver-solution.interface';
import type { SolverOutcomeType } from '../types/solver-outcome.type';

const NO_SOLUTION_COUNT = 0;
const UNIQUE_SOLUTION_COUNT = 1;
const BOX_SIZE = 3;

const getUnitNames = (index: number): string[] => {
    const row = Math.floor(index / ENTRY_GRID_SIZE);
    const column = index % ENTRY_GRID_SIZE;
    const box = Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(column / BOX_SIZE);

    return [`row ${row + 1}`, `column ${column + 1}`, `box ${box + 1}`];
};

const formatEntryCell = (index: number): string => `r${Math.floor(index / ENTRY_GRID_SIZE) + 1}c${(index % ENTRY_GRID_SIZE) + 1}`;

const findGivenConflict = (puzzle: string): SolverConflictInterface | null => {
    const seenGivens = new Map<string, number>();
    const givens = Array.from(puzzle)
        .map((character, index) => ({ character, index }))
        .filter(({ character }) => character !== ENTRY_BLANK_CHARACTER);

    for (const { character, index } of givens) {
        for (const unitName of getUnitNames(index)) {
            const unitKey = `${unitName}:${character}`;
            const firstIndex = seenGivens.get(unitKey);

            if (isDefined(firstIndex)) {
                return { value: Number(character), unitName, firstCell: formatEntryCell(firstIndex), secondCell: formatEntryCell(index) };
            }

            seenGivens.set(unitKey, index);
        }
    }

    return null;
};

const buildSolution = (puzzle: string, solutionBoard: string): SolverSolutionInterface => {
    const { rating, hardestTechnique, isCeiling } = ratePuzzle(puzzle);

    return {
        kind: 'solved',
        solutionBoard,
        difficulty: Sudoku.fromString(puzzle, { ...defaultSudokuConfig }).Difficulty,
        rating,
        isRatingCeiling: isCeiling,
        hardestTechniqueName: TECHNIQUE_NAMES[hardestTechnique],
        hardestTechniquePath: TECHNIQUE_PAGE_PATHS[hardestTechnique],
        ...new SolvePathBuilder(puzzle).build()
    };
};

export const solvePuzzle = (puzzle: string): SolverOutcomeType => {
    const conflict = findGivenConflict(puzzle);

    if (isDefined(conflict)) {
        return { kind: 'invalid-grid', conflict };
    }

    const grid = parseGridString(puzzle.replaceAll(ENTRY_BLANK_CHARACTER, ENTRY_GRID_BLANK_CHARACTER));
    const counts = {
        bitmaskCount: new BitmaskSolver().countSolutions(grid, UNIQUENESS_COUNT_LIMIT),
        dlxCount: new DLXSolver().countSolutions(grid, UNIQUENESS_COUNT_LIMIT)
    };

    if (counts.bitmaskCount !== counts.dlxCount) {
        return { kind: 'solver-disagreement', ...counts };
    }

    if (counts.bitmaskCount === NO_SOLUTION_COUNT) {
        return { kind: 'no-solution', ...counts };
    }

    if (counts.bitmaskCount > UNIQUE_SOLUTION_COUNT) {
        return { kind: 'multiple-solutions', ...counts };
    }

    const solvedGrid = new BitmaskSolver().solve(grid);

    if (!isDefined(solvedGrid)) {
        throw new Error('The solvers counted one solution for this grid but the bitmask solver could not produce it');
    }

    return buildSolution(puzzle, formatGridString(solvedGrid));
};
