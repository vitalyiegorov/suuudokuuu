import { isDefined } from '@rnw-community/shared';

import { createGameSnapshot } from './create-game-snapshot.util';

import type { GameUndoRedoStateInterface } from '../interface/game-undo-redo-state.interface';

export const gameApplyRedo = (state: GameUndoRedoStateInterface): void => {
    const snapshot = state.redoStack.at(-1);

    if (state.isChallengeRun || state.maxMistakes === 0 || !isDefined(snapshot)) {
        return;
    }

    state.redoStack.pop();
    state.undoStack.push(createGameSnapshot(state));

    state.score += state.lastUndoScorePenalty;
    state.lastUndoScorePenalty = 0;
    state.sudokuString = snapshot.sudokuString;
    state.candidates = snapshot.candidates;
};
