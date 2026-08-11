import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import type { GameTimelineEventInterface } from '../interface/game-timeline-event.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const getTimelineCellTechniques = (events: GameTimelineEventInterface[]): (SolutionTechniqueEnum | null)[] => {
    const techniques: (SolutionTechniqueEnum | null)[] = [];

    for (const event of events) {
        if (event.kind === TimelineEventKindEnum.Cell) {
            techniques.push(event.technique ?? null);
        }
    }

    return techniques;
};
