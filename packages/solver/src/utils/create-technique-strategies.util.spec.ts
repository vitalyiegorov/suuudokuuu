import { describe, expect, it } from '@jest/globals';

import { isNumber } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

import { createTechniqueStrategies } from './create-technique-strategies.util';

const reservedTechniques = [SolutionTechniqueEnum.Guess, SolutionTechniqueEnum.SimpleColoring, SolutionTechniqueEnum.AIC];

const getSortedTechniques = (techniques: SolutionTechniqueEnum[]): SolutionTechniqueEnum[] =>
    [...techniques].sort((firstTechnique, secondTechnique) => firstTechnique - secondTechnique);

const getLogicalTechniques = (): SolutionTechniqueEnum[] =>
    Object.values(SolutionTechniqueEnum)
        .filter(isNumber)
        .filter(technique => !reservedTechniques.includes(technique));

describe('createTechniqueStrategies', () => {
    it('creates one ordered strategy for every supported logical technique', () => {
        expect.assertions(2);

        const strategies = createTechniqueStrategies();
        const techniques = strategies.map(strategy => strategy.technique);

        expect(techniques).toEqual(getSortedTechniques(techniques));
        expect(techniques).toEqual(getLogicalTechniques());
    });
});
