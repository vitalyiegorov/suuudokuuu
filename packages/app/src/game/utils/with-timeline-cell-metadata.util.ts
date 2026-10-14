import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { isSolutionTechnique } from '@suuudokuuu/techniques';

import type { DecodedGameStateInterface } from '@suuudokuuu/encoder';
import type { TimelineEventType } from '@suuudokuuu/progress';

export const withTimelineCellMetadata = ({
    timelineEvents,
    techniques,
    hints
}: Pick<DecodedGameStateInterface, 'hints' | 'techniques' | 'timelineEvents'>): TimelineEventType[] => {
    let cellEventIndex = 0;

    return timelineEvents.map(event => {
        if (event.kind !== TimelineEventKindEnum.Cell) {
            return event;
        }

        const technique = techniques?.[cellEventIndex];
        const isHinted = hints?.[cellEventIndex] === true;
        cellEventIndex += 1;

        return { ...event, ...(isSolutionTechnique(technique) && { technique }), ...(isHinted && { hinted: true }) };
    });
};
