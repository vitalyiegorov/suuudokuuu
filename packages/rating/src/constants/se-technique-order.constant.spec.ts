import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { SE_FORCING_CHAIN_RATING_MAXIMUM } from './se-chain-rating.constant';
import { seTechniqueOrder } from './se-technique-order.constant';
import { SE_RATING_CEILING, seTechniqueRatings } from './se-technique-rating.constant';

const enumMemberCount = Object.keys(SolutionTechniqueEnum).length / 2;

const expectedOrderedRatings =
    '1.0 1.5 2.3 2.6 2.6 2.8 3.0 3.2 3.4 3.4 3.5 3.6 3.8 4.0 4.0 4.1 4.2 4.4 4.4 4.5 4.6 5.0 5.2 5.4 5.6 6.6 7.0 7.2 7.5 8.0 8.0';

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

    it('should use the top of the forcing chain band as the reported ceiling', () => {
        expect.assertions(4);

        const orderedRatings = seTechniqueOrder.map(technique => seTechniqueRatings[technique]);

        expect(SE_RATING_CEILING).toBe(SE_FORCING_CHAIN_RATING_MAXIMUM);
        expect(SE_RATING_CEILING).toBe(seTechniqueRatings[SolutionTechniqueEnum.Guess]);
        expect(SE_RATING_CEILING).toBeGreaterThanOrEqual(Math.max(...orderedRatings));
        expect(SE_RATING_CEILING.toFixed(1)).toBe('8.5');
    });

    it('should price the uniqueness techniques at their published values', () => {
        expect.assertions(2);

        expect(seTechniqueRatings[SolutionTechniqueEnum.UniqueRectangle].toFixed(1)).toBe('4.5');
        expect(seTechniqueRatings[SolutionTechniqueEnum.BivalueUniversalGrave].toFixed(1)).toBe('5.6');
    });

    it('should price the chain techniques at the base of the shortest-chain band', () => {
        expect.assertions(3);

        expect(seTechniqueRatings[SolutionTechniqueEnum.XChain].toFixed(1)).toBe('6.6');
        expect(seTechniqueRatings[SolutionTechniqueEnum.XYChain].toFixed(1)).toBe('7.0');
        expect(seTechniqueRatings[SolutionTechniqueEnum.AIC].toFixed(1)).toBe('7.2');
    });

    it('should price the forcing chains at the Nishio and multiple-chain bases', () => {
        expect.assertions(4);

        expect(seTechniqueRatings[SolutionTechniqueEnum.NishioForcingChain].toFixed(1)).toBe('7.5');
        expect(seTechniqueRatings[SolutionTechniqueEnum.CellForcingChain].toFixed(1)).toBe('8.0');
        expect(seTechniqueRatings[SolutionTechniqueEnum.RegionForcingChain].toFixed(1)).toBe('8.0');
        expect(seTechniqueRatings[SolutionTechniqueEnum.CellForcingChain]).toBe(
            seTechniqueRatings[SolutionTechniqueEnum.RegionForcingChain]
        );
    });
});
