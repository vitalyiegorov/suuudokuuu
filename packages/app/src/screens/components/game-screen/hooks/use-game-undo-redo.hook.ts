import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { useAppDispatch } from '../../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../../@generic/hooks/use-app-selector.hook';
import { GameContext } from '../../../../game/context/game.context';
import { gameRedoAction, gameUndoAction } from '../../../../game/store/game.actions';
import {
    gameCanRedoSelector,
    gameCanUndoSelector,
    gameRedoSnapshotSelector,
    gameUndoSnapshotSelector
} from '../../../../game/store/game.selectors';

export const useGameUndoRedo = () => {
    const dispatch = useAppDispatch();
    const { restore } = use(GameContext);

    const canUndo = useAppSelector(gameCanUndoSelector);
    const canRedo = useAppSelector(gameCanRedoSelector);
    const undoSnapshot = useAppSelector(gameUndoSnapshotSelector);
    const redoSnapshot = useAppSelector(gameRedoSnapshotSelector);

    const handleUndo = () => {
        if (isDefined(undoSnapshot)) {
            dispatch(gameUndoAction());
            restore(undoSnapshot.sudokuString);
        }
    };

    const handleRedo = () => {
        if (isDefined(redoSnapshot)) {
            dispatch(gameRedoAction());
            restore(redoSnapshot.sudokuString);
        }
    };

    return { canUndo, canRedo, handleRedo, handleUndo };
};
