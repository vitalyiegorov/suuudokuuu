import type { TimelineEventType } from '@suuudokuuu/progress';

export interface ReplayTimelineInterface {
    readonly events: readonly TimelineEventType[];
    readonly givens: string;
}
