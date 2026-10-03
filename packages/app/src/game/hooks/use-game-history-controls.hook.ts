import { isDefined } from '@rnw-community/shared';

import { gameGetFieldStatePayload } from '../utils/game-get-field-state-payload.util';
import { runCurrentRunCommand } from '../utils/run-current-run-command.util';

import type { FieldEngine } from '@suuudokuuu/field-core';

export const useGameHistoryControls = (engine: FieldEngine) => {
    const isPlayingStepScript = () => isDefined(engine.getSnapshot().stepScript);

    const handleUndo = () => {
        if (!isPlayingStepScript() && engine.undo()) {
            void runCurrentRunCommand(currentRunService => currentRunService.undo(gameGetFieldStatePayload(engine)));
        }
    };

    const handleRedo = () => {
        if (!isPlayingStepScript() && engine.redo()) {
            void runCurrentRunCommand(currentRunService => currentRunService.redo(gameGetFieldStatePayload(engine)));
        }
    };

    return { handleUndo, handleRedo };
};
