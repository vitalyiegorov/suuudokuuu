import { isDefined } from '@rnw-community/shared';

import { HellAdvanceBudgetMilliseconds } from '../constants/hell-queue.constant';

import type { HellRefillOptionsInterface } from '../interfaces/hell-refill-options.interface';

const yieldToNextTick = (): Promise<void> =>
    new Promise(resolve => {
        setTimeout(resolve, 0);
    });

export const runHellRefill = async <CandidateType>(options: HellRefillOptionsInterface<CandidateType>): Promise<void> => {
    if (!options.shouldContinue()) {
        return;
    }

    const { candidate } = options.advance(HellAdvanceBudgetMilliseconds);

    if (isDefined(candidate)) {
        options.onCandidate(candidate);
    }

    await yieldToNextTick();
    await runHellRefill(options);
};
