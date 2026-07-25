import { SolutionTechniqueEnum } from '@suuudokuuu/solver';

import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

const basicTechniques: SolutionTechniqueEnum[] = [
    SolutionTechniqueEnum.FullHouse,
    SolutionTechniqueEnum.NakedSingle,
    SolutionTechniqueEnum.HiddenSingle
];

const cleverTechniques: SolutionTechniqueEnum[] = [
    SolutionTechniqueEnum.PointingPair,
    SolutionTechniqueEnum.PointingTriple,
    SolutionTechniqueEnum.BoxLineReduction,
    SolutionTechniqueEnum.NakedPair,
    SolutionTechniqueEnum.NakedTriple,
    SolutionTechniqueEnum.NakedQuad,
    SolutionTechniqueEnum.HiddenPair,
    SolutionTechniqueEnum.HiddenTriple,
    SolutionTechniqueEnum.HiddenQuad
];

export const getTechniqueTier = (technique: SolutionTechniqueEnum): ChallengeTechniqueTierEnum => {
    if (technique === SolutionTechniqueEnum.Guess) {
        return ChallengeTechniqueTierEnum.Guess;
    }

    if (basicTechniques.includes(technique)) {
        return ChallengeTechniqueTierEnum.Basic;
    }

    if (cleverTechniques.includes(technique)) {
        return ChallengeTechniqueTierEnum.Clever;
    }

    return ChallengeTechniqueTierEnum.Advanced;
};
