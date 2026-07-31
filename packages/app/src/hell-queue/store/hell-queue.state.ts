import type { HellQueueEntryInterface } from '../interfaces/hell-queue-entry.interface';

export interface HellQueueState {
    readonly entries: readonly HellQueueEntryInterface[];
}

export const initialHellQueueState: HellQueueState = { entries: [] };
