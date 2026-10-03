import { gameGetInputStatePayload } from './game-get-input-state-payload.util';
import { runCurrentRunCommand } from './run-current-run-command.util';

import type { FieldEngine } from '@suuudokuuu/field-core';

export const gameToggleAutoCandidates = (engine: FieldEngine): void => {
    engine.toggleShowAutoCandidates();
    void runCurrentRunCommand(currentRunService => currentRunService.toggleAutoCandidates(gameGetInputStatePayload(engine)));
};
