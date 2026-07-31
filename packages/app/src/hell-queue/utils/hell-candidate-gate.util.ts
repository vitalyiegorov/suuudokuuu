import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { TechniqueManager } from '@suuudokuuu/techniques';

import type { HellCandidateInterface } from '@suuudokuuu/generator';

const GRID_CELL_COUNT = defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize;
const GATE_SAFETY_MARGIN = 9;
const MAXIMUM_PLACEMENT_ITERATIONS = GRID_CELL_COUNT + GATE_SAFETY_MARGIN;

export const createHellCandidateGate =
    (): ((candidate: HellCandidateInterface) => boolean) =>
    (candidate: HellCandidateInterface): boolean => {
        const sudoku = Sudoku.fromString(candidate.puzzle);
        const techniqueManager = new TechniqueManager(sudoku);

        for (let iteration = 0; iteration < MAXIMUM_PLACEMENT_ITERATIONS; iteration += 1) {
            const result = techniqueManager.findNextStep();

            if (result === null) {
                return false;
            }

            if (result.kind !== 'placement') {
                return true;
            }

            const { x, y } = result.cell;
            sudoku.Field[y][x] = { ...sudoku.Field[y][x], value: result.value };
        }

        return true;
    };
