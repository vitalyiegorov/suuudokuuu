import { findStepScript } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import type { StepScriptInterface } from '@suuudokuuu/field-core';
import type { Sudoku } from '@suuudokuuu/generator';

export const gameFindHintStepScript = (sudoku: Sudoku): StepScriptInterface | null => {
    const stepScript = findStepScript(sudoku);

    if (!isDefined(stepScript) || stepScript.technique === SolutionTechniqueEnum.Guess) {
        return null;
    }

    return stepScript;
};
