import { removeCellEventsFromField } from '@suuudokuuu/encoder';

import { isNotEmptyArray } from '@rnw-community/shared';

import type { GameState } from '../../game/store/game.state';
import type { ReplayTimelineInterface } from '../interfaces/replay-timeline.interface';

export const getReplayTimeline = (gameState: GameState): ReplayTimelineInterface => {
    const events = isNotEmptyArray(gameState.timelineEvents) ? gameState.timelineEvents : gameState.challengeTimelineEvents;

    return { events, givens: removeCellEventsFromField(gameState.sudokuString, events) };
};
