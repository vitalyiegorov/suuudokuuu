import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

import { isSolutionTechnique } from './is-solution-technique.util';

describe('isSolutionTechnique', () => {
    it('should accept every registered technique ordinal', () => {
        expect.assertions(1);

        const unrecognised = Object.values(SolutionTechniqueEnum)
            .filter(value => typeof value === 'number')
            .filter(value => !isSolutionTechnique(value));

        expect(unrecognised).toStrictEqual([]);
    });

    it('should reject ordinals outside the enum and missing values', () => {
        expect.assertions(4);

        expect(isSolutionTechnique(-1)).toBe(false);
        expect(isSolutionTechnique(SolutionTechniqueEnum.RegionForcingChain + 1)).toBe(false);
        expect(isSolutionTechnique(null)).toBe(false);
        expect(isSolutionTechnique(undefined)).toBe(false);
    });
});
