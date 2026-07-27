import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import type { TimelineEventInterface } from '@suuudokuuu/encoder';

export const getTimelineMistakesCount = (events: TimelineEventInterface[]): number =>
    events.filter(event => event.kind === TimelineEventKindEnum.Mistake).length;
