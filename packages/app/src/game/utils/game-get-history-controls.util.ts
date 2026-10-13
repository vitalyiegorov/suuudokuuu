import { emptyFn, isDefined } from '@rnw-community/shared';

import { gameGetFieldStatePayload } from './game-get-field-state-payload.util';
import { runCurrentRunCommand } from './run-current-run-command.util';

import type { FieldEngine } from '@suuudokuuu/field-core';

export const gameGetHistoryControls = (engine: FieldEngine) => {
    const isPlayingStepScript = () => isDefined(engine.getSnapshot().stepScript);

    const handleUndo = () => {
        if (!isPlayingStepScript() && engine.undo()) {
            void runCurrentRunCommand(currentRunService => currentRunService.undo(gameGetFieldStatePayload(engine))).catch(emptyFn);
        }
    };

    const handleRedo = () => {
        if (!isPlayingStepScript() && engine.redo()) {
            void runCurrentRunCommand(currentRunService => currentRunService.redo(gameGetFieldStatePayload(engine))).catch(emptyFn);
        }
    };

    return { handleUndo, handleRedo };
};
