import type { SuccessCellTriggerInterface } from '../interface/success-cell-trigger.interface';

export const gameNextSuccessCellTrigger = (
    previousTrigger: Readonly<SuccessCellTriggerInterface>,
    cellKey: string
): SuccessCellTriggerInterface => ({
    key: cellKey,
    generation: previousTrigger.generation + 1
});
