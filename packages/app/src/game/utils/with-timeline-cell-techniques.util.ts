import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { isSolutionTechnique } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import type { TimelineEventInterface } from '@suuudokuuu/encoder';
import type { TimelineEventType } from '@suuudokuuu/progress';

export const withTimelineCellTechniques = (events: TimelineEventInterface[], techniques: (number | null)[] | null): TimelineEventType[] => {
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
