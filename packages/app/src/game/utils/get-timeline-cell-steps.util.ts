import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import type { GameTimelineEventInterface } from '../interface/game-timeline-event.interface';
import type { SolutionStepInterface } from '@suuudokuuu/encoder';

export const getTimelineCellSteps = (events: GameTimelineEventInterface[]): SolutionStepInterface[] => {
    const steps: SolutionStepInterface[] = [];

    for (const event of events) {
        if (event.kind === TimelineEventKindEnum.Cell) {
            steps.push({ cellIndex: event.cellIndex, value: event.value, ts: event.ts });
        }
    }

    return steps;
};
