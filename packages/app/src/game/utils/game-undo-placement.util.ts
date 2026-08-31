import { isDefined } from '@rnw-community/shared';

import { SudokuScoring } from '../../scoring/classes/sudoku-scoring';
import { defaultScoringConfig } from '../../scoring/interfaces/scoring-config.interface';

import { gameApplyTechniqueUsageDelta } from './game-apply-technique-usage-delta.util';
import { gameTakeLastTimelineCellEvent } from './game-take-last-timeline-cell-event.util';

import type { GameState } from '../store/game.state';

export const gameUndoPlacement = (state: GameState): void => {
    const undoneMove = gameTakeLastTimelineCellEvent(state.timelineEvents);

    if (!isDefined(undoneMove)) {
        return;
    }

    const scoring = new SudokuScoring(defaultScoringConfig);
    const penalty = scoring.calculateUndoPenalty({ difficulty: state.difficulty, maxMistakes: state.maxMistakes });

    state.undoneMoves.push(undoneMove);
    state.score = Math.max(state.score - (undoneMove.score ?? 0) - penalty, 0);

    if (isDefined(undoneMove.technique)) {
        gameApplyTechniqueUsageDelta(state.techniqueUsageCounts, undoneMove.technique, -1);
    }
};
