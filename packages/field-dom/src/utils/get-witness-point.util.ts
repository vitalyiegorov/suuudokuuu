import type { StepScriptCandidateInterface } from '@suuudokuuu/field-core';

export const getWitnessPoint = (cell: Pick<StepScriptCandidateInterface['cell'], 'x' | 'y'>, value: number) => ({
    x: cell.x * 3 + ((value - 1) % 3) + 0.5,
    y: cell.y * 3 + Math.floor((value - 1) / 3) + 0.5
});
