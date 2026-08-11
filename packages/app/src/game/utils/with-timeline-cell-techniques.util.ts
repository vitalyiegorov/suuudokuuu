import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { isSolutionTechnique } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import type { GameTimelineEventInterface } from '../interface/game-timeline-event.interface';
import type { TimelineEventInterface } from '@suuudokuuu/encoder';

export const withTimelineCellTechniques = (
    events: TimelineEventInterface[],
    techniques: (number | null)[] | null
): GameTimelineEventInterface[] => {
    if (!isDefined(techniques)) {
        return events;
    }

    let cellEventIndex = 0;

    return events.map(event => {
        if (event.kind !== TimelineEventKindEnum.Cell) {
            return event;
        }

        const technique = techniques[cellEventIndex];
        cellEventIndex += 1;

        return { ...event, ...(isSolutionTechnique(technique) && { technique }) };
    });
};
