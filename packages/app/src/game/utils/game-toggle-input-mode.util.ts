import { gameGetInputStatePayload } from './game-get-input-state-payload.util';
import { runCurrentRunCommand } from './run-current-run-command.util';

import type { FieldEngine } from '@suuudokuuu/field-core';

export const gameToggleInputMode = (engine: FieldEngine): void => {
    engine.toggleInputMode();
    void runCurrentRunCommand(currentRunService => currentRunService.toggleInputMode(gameGetInputStatePayload(engine)));
};
