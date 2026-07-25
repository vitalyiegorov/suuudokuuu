import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { TechniqueManager } from '@suuudokuuu/solver';

import { isEmptyArray, isNotEmptyString, isPositiveNumber } from '@rnw-community/shared';

import { getTechniqueTier } from './get-technique-tier.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';
import type { SolutionStepInterface } from '@suuudokuuu/encoder';

export const getChallengeTechniqueEvents = (
    sudokuString: string,
    steps: SolutionStepInterface[],
    totalTime: number
): ChallengeTechniqueEventInterface[] => {
    if (!isNotEmptyString(sudokuString) || isEmptyArray(steps) || !isPositiveNumber(totalTime)) {
        return [];
    }

    const sudoku = Sudoku.fromString(sudokuString, defaultSudokuConfig);
    const events: ChallengeTechniqueEventInterface[] = [];
    let cumulativeTime = 0;

    for (const step of steps) {
        const x = step.cellIndex % defaultSudokuConfig.fieldSize;
        const y = Math.floor(step.cellIndex / defaultSudokuConfig.fieldSize);
        const cell = { ...sudoku.Field[y][x], value: step.value };
        const classification = new TechniqueManager(sudoku).identifyMove(cell);

        sudoku.Field[y][x] = cell;
        cumulativeTime += step.ts;

        events.push({
            cumulativeTime,
            positionPercent: (cumulativeTime / totalTime) * 100,
            technique: classification.technique,
            tier: getTechniqueTier(classification.technique)
        });
    }

    return events;
};
