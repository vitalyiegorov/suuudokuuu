import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { isDefined } from '@rnw-community/shared';

import type { GameTimelineEventInterface } from '../interface/game-timeline-event.interface';

export const isLastTimelineEventAway = (events: GameTimelineEventInterface[]): boolean => {
    const lastEvent = events[events.length - 1];

    return isDefined(lastEvent) && lastEvent.kind === TimelineEventKindEnum.Away;
};
