import { isDefined } from '@rnw-community/shared';

import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gameRedoAction, gameUndoAction } from '../store/game.actions';
import { gameGetFieldStatePayload } from '../utils/game-get-field-state-payload.util';

import type { FieldEngine } from '@suuudokuuu/field-core';

export const useGameHistoryControls = (engine: FieldEngine) => {
    const dispatch = useAppDispatch();

    const isPlayingStepScript = () => isDefined(engine.getSnapshot().stepScript);

    const handleUndo = () => {
        if (!isPlayingStepScript() && engine.undo()) {
            dispatch(gameUndoAction(gameGetFieldStatePayload(engine)));
        }
    };

    const handleRedo = () => {
        if (!isPlayingStepScript() && engine.redo()) {
            dispatch(gameRedoAction(gameGetFieldStatePayload(engine)));
        }
    };

    return { handleUndo, handleRedo };
};
