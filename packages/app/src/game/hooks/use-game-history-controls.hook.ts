import { CurrentRunMoveService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';

import { isDefined } from '@rnw-community/shared';

import { appRuntime } from '../../@generic/runtime/app.runtime';
import { gameGetFieldStatePayload } from '../utils/game-get-field-state-payload.util';

import type { FieldEngine } from '@suuudokuuu/field-core';

export const useGameHistoryControls = (engine: FieldEngine) => {
    const isPlayingStepScript = () => isDefined(engine.getSnapshot().stepScript);

    const handleUndo = () => {
        if (!isPlayingStepScript() && engine.undo()) {
            void appRuntime.runPromise(
                Effect.flatMap(CurrentRunMoveService, currentRunMoveService => currentRunMoveService.undo(gameGetFieldStatePayload(engine)))
            );
        }
    };

    const handleRedo = () => {
        if (!isPlayingStepScript() && engine.redo()) {
            void appRuntime.runPromise(
                Effect.flatMap(CurrentRunMoveService, currentRunMoveService => currentRunMoveService.redo(gameGetFieldStatePayload(engine)))
            );
        }
    };

    return { handleUndo, handleRedo };
};
