import { isDefined } from '@rnw-community/shared';

import { gameApplyTechniqueUsageDelta } from './game-apply-technique-usage-delta.util';
import { getTimelineTimestampDelta } from './get-timeline-timestamp-delta.util';

import type { GameState } from '../store/game.state';

export const gameRedoPlacement = (state: GameState): void => {
    const redoneMove = state.undoneMoves.pop();

    if (!isDefined(redoneMove)) {
        return;
    }

    state.score += redoneMove.score ?? 0;
    state.timelineEvents.push({ ...redoneMove, ts: getTimelineTimestampDelta(state.timelineEvents, state.elapsedTime) });

    if (isDefined(redoneMove.technique)) {
        gameApplyTechniqueUsageDelta(state.techniqueUsageCounts, redoneMove.technique, 1);
    }
};
