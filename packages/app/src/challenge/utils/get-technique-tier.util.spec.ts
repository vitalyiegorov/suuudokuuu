import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/solver';

import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import { getTechniqueTier } from './get-technique-tier.util';

describe('getTechniqueTier', () => {
    it('classifies a guess as the guess tier', () => {
        expect(getTechniqueTier(SolutionTechniqueEnum.Guess)).toBe(ChallengeTechniqueTierEnum.Guess);
    });

    it('classifies singles and full house as basic', () => {
        expect(getTechniqueTier(SolutionTechniqueEnum.FullHouse)).toBe(ChallengeTechniqueTierEnum.Basic);
        expect(getTechniqueTier(SolutionTechniqueEnum.NakedSingle)).toBe(ChallengeTechniqueTierEnum.Basic);
        expect(getTechniqueTier(SolutionTechniqueEnum.HiddenSingle)).toBe(ChallengeTechniqueTierEnum.Basic);
    });

    it('classifies pairs, triples, and pointing moves as clever', () => {
        expect(getTechniqueTier(SolutionTechniqueEnum.PointingPair)).toBe(ChallengeTechniqueTierEnum.Clever);
        expect(getTechniqueTier(SolutionTechniqueEnum.HiddenPair)).toBe(ChallengeTechniqueTierEnum.Clever);
        expect(getTechniqueTier(SolutionTechniqueEnum.NakedQuad)).toBe(ChallengeTechniqueTierEnum.Clever);
    });

    it('classifies fish, wings, and chains as advanced', () => {
        expect(getTechniqueTier(SolutionTechniqueEnum.XWing)).toBe(ChallengeTechniqueTierEnum.Advanced);
        expect(getTechniqueTier(SolutionTechniqueEnum.XYWing)).toBe(ChallengeTechniqueTierEnum.Advanced);
        expect(getTechniqueTier(SolutionTechniqueEnum.AIC)).toBe(ChallengeTechniqueTierEnum.Advanced);
    });
});
