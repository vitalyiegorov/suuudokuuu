import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { SE_CHAIN_RATING_MAXIMUM, SE_FORCING_CHAIN_RATING_MAXIMUM, seLengthPricedBandMaximums } from './se-chain-rating.constant';
import { SE_RATING_CEILING } from './se-rating-ceiling.constant';
import { seTechniqueRatings } from './se-technique-rating.constant';

describe('SE_RATING_CEILING', () => {
    it('should equal the maximum reachable length-priced band value', () => {
        expect.assertions(1);

        expect(SE_RATING_CEILING).toBe(Math.max(SE_CHAIN_RATING_MAXIMUM, SE_FORCING_CHAIN_RATING_MAXIMUM));
    });

    it('should not sit below any length-priced band maximum', () => {
        expect.assertions(1);

        const bandMaximums = [...seLengthPricedBandMaximums.values()];

        expect(bandMaximums.every(bandMaximum => bandMaximum <= SE_RATING_CEILING)).toBe(true);
    });

    it('should not sit below any table value', () => {
        expect.assertions(1);

        const tableValues = Object.values(seTechniqueRatings);

        expect(tableValues.every(tableValue => tableValue <= SE_RATING_CEILING)).toBe(true);
    });

    it('should stay independent of the price of guessing', () => {
        expect.assertions(1);

        const guessPrice = seTechniqueRatings[SolutionTechniqueEnum.Guess];

        expect(guessPrice).toBeLessThanOrEqual(SE_RATING_CEILING);
    });
});
