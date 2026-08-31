import { TechniqueManager } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { techniqueResultToStepScript } from './technique-result-to-step-script.util';

import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { Sudoku } from '@suuudokuuu/generator';
import type { TechniqueStrategyInterface } from '@suuudokuuu/techniques';

export const findStepScript = (sudoku: Sudoku, strategies?: TechniqueStrategyInterface[]): StepScriptInterface | null => {
    const result = new TechniqueManager(sudoku, strategies).findNextStep();

    return isDefined(result) ? techniqueResultToStepScript(result) : null;
};
