import { isDefined } from '@rnw-community/shared';

import type { CellInterface } from '@suuudokuuu/generator';

export interface SolutionStepInterface {
    x: number;
    y: number;
    value: number;
    ts: number;
}

const solutionStepStringLength = 7;

const solutionStepToString = (solutionStep: SolutionStepInterface): string =>
    `${solutionStep.x}${solutionStep.y}${solutionStep.value}${solutionStep.ts}`;

const solutionStepFromString = (solutionStep: string): SolutionStepInterface => ({
    x: parseInt(solutionStep[0], 10),
    y: parseInt(solutionStep[1], 10),
    value: parseInt(solutionStep[2], 10),
    ts: parseInt(solutionStep[3], 10)
});

export const solutionStepsStringify = (solutionSteps: SolutionStepInterface[]): string => solutionSteps.map(solutionStepToString).join('');

export const solutionStepsParse = (solutionSteps?: string): SolutionStepInterface[] => {
    if (!isDefined(solutionSteps) || solutionSteps.length % solutionStepStringLength !== 0) {
        return [];
    }

    const result: SolutionStepInterface[] = [];
    for (let i = 0; i < solutionSteps.length; i += solutionStepStringLength) {
        result.push(solutionStepFromString(solutionSteps.substring(i, i + solutionStepStringLength)));
    }

    return result;
};

export const solutionStepFromCell = (cell: CellInterface, elapsedTime: number): SolutionStepInterface => ({
    x: cell.x,
    y: cell.y,
    value: cell.value,
    ts: elapsedTime
});
