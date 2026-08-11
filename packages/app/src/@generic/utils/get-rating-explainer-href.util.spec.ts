import { describe, expect, it } from '@jest/globals';

import { getRatingExplainerHref } from './get-rating-explainer-href.util';

const RatingToRoundUp = 6.75;
const NonCeilingRating = 3.2;

describe('getRatingExplainerHref', () => {
    it('should encode the rating with one decimal place and the ceiling flag as a route param', () => {
        expect.assertions(1);

        expect(getRatingExplainerHref(RatingToRoundUp, true)).toStrictEqual({
            pathname: '/rating-explainer/[rating]',
            params: { rating: '6.8', isCeiling: '1' }
        });
    });

    it('should encode a non-ceiling rating', () => {
        expect.assertions(1);

        expect(getRatingExplainerHref(NonCeilingRating, false)).toStrictEqual({
            pathname: '/rating-explainer/[rating]',
            params: { rating: '3.2', isCeiling: '0' }
        });
    });

    it('should keep the ceiling suffix out of the numeric rating param so it stays parseable', () => {
        expect.assertions(2);

        const { params } = getRatingExplainerHref(RatingToRoundUp, true);

        expect(params.rating).not.toContain('+');
        expect(Number(params.rating)).toBeCloseTo(RatingToRoundUp, 1);
    });
});
