import { findStepScript } from '@suuudokuuu/field-core';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { UNIQUENESS_COUNT_LIMIT, formatGridString, parseGridString } from '@suuudokuuu/solver-core';
import { DLXSolver } from '@suuudokuuu/solver-dlx';
import { SolutionTechniqueEnum, createTechniqueStrategies } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { TECHNIQUE_NAMES } from '../../techniques/constants/technique-name.constant';
import { TECHNIQUE_PAGE_PATHS } from '../../techniques/constants/technique-page-path.constant';
import { renderTechniqueNarration } from '../../techniques/utils/render-technique-narration.util';
import { ENTRY_BLANK_CHARACTER, ENTRY_GRID_BLANK_CHARACTER } from '../constants/puzzle-entry.constant';

import type { SolverSolutionInterface } from '../interfaces/solver-solution.interface';
import type { SolverStepInterface } from '../interfaces/solver-step.interface';
import type { SolverOutcomeType } from '../types/solver-outcome.type';
import type { StepScriptInterface } from '@suuudokuuu/field-core';

const MAX_SOLVER_STEPS = 400;
const NO_SOLUTION_COUNT = 0;
const UNIQUE_SOLUTION_COUNT = 1;

const buildSolverStep = (index: number, boardBefore: string, script: StepScriptInterface): SolverStepInterface => {
    const [lastStep] = script.steps.slice(-1);
    const techniqueName = TECHNIQUE_NAMES[script.technique];

    return {
        index,
        techniqueName,
        techniquePath: TECHNIQUE_PAGE_PATHS[script.technique],
        narration: isDefined(lastStep) ? renderTechniqueNarration(lastStep) : techniqueName,
        boardBefore,
        script
    };
};

const collectSolverSteps = (sudoku: Sudoku): SolverStepInterface[] => {
    const steps: SolverStepInterface[] = [];
    const exhaustedTechniques = new Set<SolutionTechniqueEnum>();

    while (steps.length < MAX_SOLVER_STEPS && sudoku.PossibleValues.length > 0) {
        const strategies = createTechniqueStrategies().filter(strategy => !exhaustedTechniques.has(strategy.technique));
        const script = findStepScript(sudoku, strategies);

        if (!isDefined(script) || script.technique === SolutionTechniqueEnum.Guess) {
            break;
        }

        steps.push(buildSolverStep(steps.length, sudoku.toString(), script));

        const { placement } = script;

        if (isDefined(placement)) {
            sudoku.setCellValue({ ...placement.cell, value: placement.value });
            exhaustedTechniques.clear();
        } else {
            exhaustedTechniques.add(script.technique);
        }
    }

    return steps;
};

const buildSolution = (puzzle: string, solutionBoard: string): SolverSolutionInterface => {
    const sudoku = Sudoku.fromString(puzzle, { ...defaultSudokuConfig });
    const difficulty = sudoku.Difficulty;
    const steps = collectSolverSteps(sudoku);
    const unprovenCellCount = Array.from(sudoku.toString()).filter(character => character === ENTRY_BLANK_CHARACTER).length;

    return { kind: 'solved', solutionBoard, difficulty, steps, unprovenCellCount };
};

export const solvePuzzle = (puzzle: string): SolverOutcomeType => {
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
