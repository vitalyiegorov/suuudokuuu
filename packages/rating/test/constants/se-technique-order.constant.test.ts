import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { describe, expect, it } from 'vitest';

import { seTechniqueOrder } from '../../src/constants/se-technique-order.constant';
import { seTechniqueRatings } from '../../src/constants/se-technique-rating.constant';

const enumMemberCount = Object.keys(SolutionTechniqueEnum).length / 2;

describe('seTechniqueOrder', () => {
    it('should cover every technique except the guess fallback exactly once', () => {
        expect.assertions(3);

        expect(new Set(seTechniqueOrder).size).toBe(seTechniqueOrder.length);
        expect(seTechniqueOrder).not.toContain(SolutionTechniqueEnum.Guess);
        expect(seTechniqueOrder).toHaveLength(enumMemberCount - 1);
    });

    it('should preserve the established solve order', () => {
        expect.assertions(1);

        expect(seTechniqueOrder).toEqual([
            SolutionTechniqueEnum.FullHouse,
            SolutionTechniqueEnum.HiddenSingle,
            SolutionTechniqueEnum.NakedSingle,
            SolutionTechniqueEnum.PointingPair,
            SolutionTechniqueEnum.PointingTriple,
            SolutionTechniqueEnum.BoxLineReduction,
            SolutionTechniqueEnum.NakedPair,
            SolutionTechniqueEnum.XWing,
            SolutionTechniqueEnum.HiddenPair,
            SolutionTechniqueEnum.FinnedXWing,
            SolutionTechniqueEnum.SashimiXWing,
            SolutionTechniqueEnum.NakedTriple,
            SolutionTechniqueEnum.Swordfish,
            SolutionTechniqueEnum.HiddenTriple,
            SolutionTechniqueEnum.FinnedSwordfish,
            SolutionTechniqueEnum.SashimiSwordfish,
            SolutionTechniqueEnum.XYWing,
            SolutionTechniqueEnum.XYZWing,
            SolutionTechniqueEnum.WWing,
            SolutionTechniqueEnum.UniqueRectangle,
            SolutionTechniqueEnum.EmptyRectangle,
            SolutionTechniqueEnum.SimpleColoring,
            SolutionTechniqueEnum.NakedQuad,
            SolutionTechniqueEnum.Jellyfish,
            SolutionTechniqueEnum.HiddenQuad,
            SolutionTechniqueEnum.BivalueUniversalGrave,
            SolutionTechniqueEnum.SueDeCoq,
            SolutionTechniqueEnum.ALSXZ,
            SolutionTechniqueEnum.XChain,
            SolutionTechniqueEnum.XYChain,
            SolutionTechniqueEnum.AIC,
            SolutionTechniqueEnum.NishioForcingChain,
            SolutionTechniqueEnum.CellForcingChain,
            SolutionTechniqueEnum.RegionForcingChain
        ]);
    });

    it('should list techniques from cheapest to most expensive', () => {
        expect.assertions(1);

        const orderedRatings = seTechniqueOrder.map(technique => seTechniqueRatings[technique]);

        expect(orderedRatings).toEqual([...orderedRatings].sort((left, right) => left - right));
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

    it('should price the uniqueness techniques at their published values', () => {
        expect.assertions(2);

        expect(seTechniqueRatings[SolutionTechniqueEnum.UniqueRectangle].toFixed(1)).toBe('4.5');
        expect(seTechniqueRatings[SolutionTechniqueEnum.BivalueUniversalGrave].toFixed(1)).toBe('5.6');
    });

    it('should price Empty Rectangle, Sue de Coq and ALS-XZ at their approximate values', () => {
        expect.assertions(3);

        expect(seTechniqueRatings[SolutionTechniqueEnum.EmptyRectangle].toFixed(1)).toBe('4.5');
        expect(seTechniqueRatings[SolutionTechniqueEnum.SueDeCoq].toFixed(1)).toBe('5.8');
        expect(seTechniqueRatings[SolutionTechniqueEnum.ALSXZ].toFixed(1)).toBe('6.2');
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
