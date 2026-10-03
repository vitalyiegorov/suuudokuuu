import { getCellKey } from '@suuudokuuu/field-core';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { getTimelineCellTechniques } from '@suuudokuuu/progress';
import { TechniqueManager, interactiveTechniqueOrder } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { getTimelineCellSteps } from '../../game/utils/get-timeline-cell-steps.util';

import { getReplayTimeline } from './get-replay-timeline.util';

import type { SolutionStepInterface } from '@suuudokuuu/encoder';
import type { CurrentRunType } from '@suuudokuuu/progress';
import type { MoveClassificationInterface } from '@suuudokuuu/techniques';

export const getSudokuAtStep = (gameState: CurrentRunType, currentStep: number) => {
    const { events, givens } = getReplayTimeline(gameState);
    const sudoku = Sudoku.fromString(givens, defaultSudokuConfig);

    const steps = getTimelineCellSteps(events);
    const storedTechniques = getTimelineCellTechniques(events);
    const effectiveStep = Math.min(currentStep, steps.length);
    let elapsedTime = 0;
    let highlightedCellKey = '';
    let solutionStep: SolutionStepInterface | null = null;
    let moveClassification: MoveClassificationInterface | null = null;

    for (let i = 0; i < effectiveStep; i += 1) {
        const x = steps[i].cellIndex % defaultSudokuConfig.fieldSize;
        const y = Math.floor(steps[i].cellIndex / defaultSudokuConfig.fieldSize);
        const cell = { ...sudoku.Field[y][x], value: steps[i].value };

        if (i === effectiveStep - 1) {
            const storedTechnique = storedTechniques[i];

            moveClassification = isDefined(storedTechnique)
                ? { technique: storedTechnique, value: cell.value }
                : new TechniqueManager(sudoku).identifyMove(cell, interactiveTechniqueOrder);
        }

        sudoku.Field[y][x] = cell;
        elapsedTime += steps[i].ts;
        highlightedCellKey = getCellKey({ x, y });
        solutionStep = steps[i];
    }

    return { sudoku, highlightedCellKey, elapsedTime, solutionStep, moveClassification };
};
