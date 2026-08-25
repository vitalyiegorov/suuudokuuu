import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { isDefined } from '@rnw-community/shared';

import type { GameCellTimelineEventInterface, GameTimelineEventInterface } from '../interface/game-timeline-event.interface';

export const gameTakeLastTimelineCellEvent = (events: GameTimelineEventInterface[]): GameCellTimelineEventInterface | null => {
    for (let index = events.length - 1; index >= 0; index -= 1) {
        const event = events[index];

        if (event.kind === TimelineEventKindEnum.Cell) {
            const nextEvent = events[index + 1];

            if (isDefined(nextEvent)) {
                nextEvent.ts += event.ts;
            }

            events.splice(index, 1);

            return event;
        }
    }

    return null;
};
