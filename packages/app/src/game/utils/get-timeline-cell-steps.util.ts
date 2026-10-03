import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import type { SolutionStepInterface } from '@suuudokuuu/encoder';
import type { TimelineEventType } from '@suuudokuuu/progress';

export const getTimelineCellSteps = (events: readonly TimelineEventType[]): SolutionStepInterface[] => {
    const steps: SolutionStepInterface[] = [];

    for (const event of events) {
        if (event.kind === TimelineEventKindEnum.Cell) {
            steps.push({ cellIndex: event.cellIndex, value: event.value, ts: event.ts });
        }
    }

    return steps;
};
