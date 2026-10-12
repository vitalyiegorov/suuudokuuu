import { HintLevelEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { runCurrentRunCommand } from './run-current-run-command.util';

import type { FieldEngine, StepScriptInterface } from '@suuudokuuu/field-core';

export const gameStartHintStepScript = (engine: FieldEngine, stepScript: StepScriptInterface): void => {
    if (stepScript.technique === SolutionTechniqueEnum.Guess) {
        engine.startStepScript(stepScript);

        return;
    }

    engine.startStepScript(stepScript, HintLevelEnum.TECHNIQUE);
    void runCurrentRunCommand(currentRunService => currentRunService.revealHintLevel());
};
