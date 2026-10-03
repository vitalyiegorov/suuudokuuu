import type { TimelineEventType } from '@suuudokuuu/progress';

export interface ReplayTimelineInterface {
    events: readonly TimelineEventType[];
    givens: string;
}
