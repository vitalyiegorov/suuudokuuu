import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import type { TimelineEventType } from '../type/timeline-event.type';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const getTimelineCellTechniques = (events: readonly TimelineEventType[]): (SolutionTechniqueEnum | null)[] => {
    const techniques: (SolutionTechniqueEnum | null)[] = [];

    for (const event of events) {
        if (event.kind === TimelineEventKindEnum.Cell) {
            techniques.push(event.technique ?? null);
        }
    }

    return techniques;
};
