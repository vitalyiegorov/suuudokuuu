import { describe, expect, it, jest } from '@jest/globals';

import { runHellRefill } from './hell-refill-scheduler.util';

describe('runHellRefill', () => {
    it('advances until shouldContinue turns false and forwards each candidate to the caller', async () => {
        expect.assertions(4);

        const advanceResults = [{ candidate: 'first' }, {}, { candidate: 'second' }];
        let callIndex = 0;
        const advance = jest.fn(() => {
            const result = advanceResults[callIndex];
            callIndex += 1;

            return result;
        });
        const shouldContinue = jest.fn(() => callIndex < advanceResults.length);
        const onCandidate = jest.fn();

        await runHellRefill({ advance, onCandidate, shouldContinue });

        expect(advance).toHaveBeenCalledTimes(advanceResults.length);
        expect(onCandidate).toHaveBeenCalledTimes(2);
        expect(onCandidate).toHaveBeenNthCalledWith(1, 'first');
        expect(onCandidate).toHaveBeenNthCalledWith(2, 'second');
    });

    it('stops without calling advance again once shouldContinue flips to false between slices', async () => {
        expect.assertions(1);

        let hasAdvancedOnce = false;
        const advance = jest.fn(() => {
            hasAdvancedOnce = true;

            return {};
        });
        const shouldContinue = jest.fn(() => !hasAdvancedOnce);

        await runHellRefill({ advance, onCandidate: jest.fn(), shouldContinue });

        expect(advance).toHaveBeenCalledTimes(1);
    });

    it('never advances at all when shouldContinue is already false', async () => {
        expect.assertions(1);

        const advance = jest.fn(() => ({}));

        await runHellRefill({ advance, onCandidate: jest.fn(), shouldContinue: () => false });

        expect(advance).not.toHaveBeenCalled();
    });
});
