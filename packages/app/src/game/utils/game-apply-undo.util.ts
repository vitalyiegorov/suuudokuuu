import { isDefined, isEmptyArray } from '@rnw-community/shared';

import { createGameSnapshot } from './create-game-snapshot.util';

import type { defaultScoringConfig } from '../../scoring/interfaces/scoring-config.interface';
import type { GameUndoRedoStateInterface } from '../interface/game-undo-redo-state.interface';

type ScoringConfig = typeof defaultScoringConfig;

export const gameApplyUndo = (state: GameUndoRedoStateInterface, scoringConfig: ScoringConfig): void => {
    if (state.isChallengeRun || state.maxMistakes === 0 || isEmptyArray(state.undoStack)) {
        return;
    }

    const snapshot = state.undoStack.pop();
    state.redoStack.push(createGameSnapshot(state));

    if (isDefined(snapshot)) {
        const penalty = Math.floor(state.score * scoringConfig.undoCoefficient);

        state.lastUndoScorePenalty = penalty;
        state.score -= penalty;
        state.sudokuString = snapshot.sudokuString;
        state.candidates = snapshot.candidates;
    }
};
