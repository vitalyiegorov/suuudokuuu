import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import { createTechniqueStrategies } from '../utils/create-technique-strategies.util';

import { interactiveTechniqueOrder } from './interactive-technique-order.constant';

const registryTechniqueOrder = createTechniqueStrategies().map(strategy => strategy.technique);

const expensiveTechniques = [
    SolutionTechniqueEnum.AIC,
    SolutionTechniqueEnum.UniqueRectangle,
    SolutionTechniqueEnum.BivalueUniversalGrave,
    SolutionTechniqueEnum.NishioForcingChain,
    SolutionTechniqueEnum.CellForcingChain,
    SolutionTechniqueEnum.RegionForcingChain
];

describe('interactiveTechniqueOrder', () => {
    it('should be the registry order truncated before the expensive tail', () => {
        expect.assertions(2);

        expect([...interactiveTechniqueOrder]).toStrictEqual(registryTechniqueOrder.slice(0, interactiveTechniqueOrder.length));
        expect(interactiveTechniqueOrder.at(-1)).toBe(SolutionTechniqueEnum.SimpleColoring);
    });

    it('should exclude every expensive technique and keep every cheaper one', () => {
        expect.assertions(2);

        const excluded = registryTechniqueOrder.filter(technique => !interactiveTechniqueOrder.includes(technique));

        expect(excluded).toStrictEqual(expensiveTechniques);
        expect(interactiveTechniqueOrder).toHaveLength(registryTechniqueOrder.length - expensiveTechniques.length);
    });

    it('should never contain the guess fallback', () => {
        expect.assertions(1);

        expect(interactiveTechniqueOrder).not.toContain(SolutionTechniqueEnum.Guess);
    });
});
