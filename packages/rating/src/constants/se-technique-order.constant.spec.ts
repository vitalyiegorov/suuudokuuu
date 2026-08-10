import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { seTechniqueOrder } from './se-technique-order.constant';
import { SE_RATING_CEILING, seTechniqueRatings } from './se-technique-rating.constant';

const enumMemberCount = Object.keys(SolutionTechniqueEnum).length / 2;

const expectedOrderedRatings =
    '1.0 1.5 2.3 2.6 2.6 2.8 3.0 3.2 3.4 3.4 3.5 3.6 3.8 4.0 4.0 4.1 4.2 4.4 4.4 4.5 4.6 4.8 5.0 5.1 5.2 5.4 5.4 5.6';

const formatOrderedRatings = (): string => seTechniqueOrder.map(technique => seTechniqueRatings[technique].toFixed(1)).join(' ');

describe('seTechniqueOrder', () => {
    it('should cover every technique except the guess fallback exactly once', () => {
        expect.assertions(3);

        expect(new Set(seTechniqueOrder).size).toBe(seTechniqueOrder.length);
        expect(seTechniqueOrder).not.toContain(SolutionTechniqueEnum.Guess);
        expect(seTechniqueOrder).toHaveLength(enumMemberCount - 1);
    });

    it('should list every technique with its rating from cheapest to most expensive', () => {
        expect.assertions(1);

        expect(formatOrderedRatings()).toBe(expectedOrderedRatings);
    });

    it('should break equal ratings by the registry enum ordinal', () => {
        expect.assertions(1);

        const tiedOutOfOrder = seTechniqueOrder.filter((technique, index) => {
            const previous = seTechniqueOrder[index - 1];

            if (index === 0) {
                return false;
            }

            return seTechniqueRatings[previous] === seTechniqueRatings[technique] && previous > technique;
        });

        expect(tiedOutOfOrder).toEqual([]);
    });
});

describe('seTechniqueRatings', () => {
    it('should rate every technique in the enum', () => {
        expect.assertions(1);

        expect(Object.keys(seTechniqueRatings)).toHaveLength(enumMemberCount);
    });

    it('should use the hardest known technique value as the reported ceiling', () => {
        expect.assertions(3);

        const orderedRatings = seTechniqueOrder.map(technique => seTechniqueRatings[technique]);

        expect(SE_RATING_CEILING).toBe(Math.max(...orderedRatings));
        expect(SE_RATING_CEILING).toBe(seTechniqueRatings[SolutionTechniqueEnum.BivalueUniversalGrave]);
        expect(SE_RATING_CEILING.toFixed(1)).toBe('5.6');
    });

    it('should price the uniqueness techniques at their published values', () => {
        expect.assertions(2);

        expect(seTechniqueRatings[SolutionTechniqueEnum.UniqueRectangle].toFixed(1)).toBe('4.5');
        expect(seTechniqueRatings[SolutionTechniqueEnum.BivalueUniversalGrave].toFixed(1)).toBe('5.6');
    });
});
