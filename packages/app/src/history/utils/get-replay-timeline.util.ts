import { removeCellEventsFromField } from '@suuudokuuu/encoder';

import { isNotEmptyArray } from '@rnw-community/shared';

import type { ReplayTimelineInterface } from '../interfaces/replay-timeline.interface';
import type { CurrentRunType } from '@suuudokuuu/progress';

export const getReplayTimeline = (gameState: CurrentRunType): ReplayTimelineInterface => {
    const events = isNotEmptyArray(gameState.timelineEvents) ? gameState.timelineEvents : gameState.challengeTimelineEvents;

    return { events, givens: removeCellEventsFromField(gameState.sudokuString, [...events]) };
};
