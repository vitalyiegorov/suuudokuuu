import { isDefined, isEmptyArray } from '@rnw-community/shared';

import { createGameSnapshot } from './create-game-snapshot.util';

import type { GameUndoRedoStateInterface } from '../interface/game-undo-redo-state.interface';

export const gameApplyRedo = (state: GameUndoRedoStateInterface): void => {
    if (state.isChallengeRun || state.maxMistakes === 0 || isEmptyArray(state.redoStack)) {
        return;
    }

    const snapshot = state.redoStack.pop();
    state.undoStack.push(createGameSnapshot(state));

    if (isDefined(snapshot)) {
        state.score += state.lastUndoScorePenalty;
        state.lastUndoScorePenalty = 0;
        state.sudokuString = snapshot.sudokuString;
        state.candidates = snapshot.candidates;
    }
};
