import { findPlacementChain } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { techniqueResultToStepScript } from './technique-result-to-step-script.util';

import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { Sudoku } from '@suuudokuuu/generator';

export const findHintStepScript = (sudoku: Sudoku): StepScriptInterface | null => {
    const scripts = findPlacementChain(sudoku).map(techniqueResultToStepScript);
    const [firstScript] = scripts;
    const placement = scripts.at(-1)?.placement;

    if (!isDefined(firstScript) || !isDefined(placement)) {
        return null;
    }

    return {
        technique: firstScript.technique,
        patternCells: scripts.flatMap(script => script.patternCells),
        eliminations: scripts.flatMap(script => script.eliminations),
        placement,
        steps: scripts.flatMap(script => script.steps)
    };
};
