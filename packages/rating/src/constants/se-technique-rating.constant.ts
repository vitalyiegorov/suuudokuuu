import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { SE_CHAIN_RATING_MAXIMUM, SE_CHAIN_RATING_MINIMUM } from './se-chain-rating.constant';

export const seTechniqueRatings: Record<SolutionTechniqueEnum, number> = {
    [SolutionTechniqueEnum.FullHouse]: 1.0,
    [SolutionTechniqueEnum.HiddenSingle]: 1.5,
    [SolutionTechniqueEnum.NakedSingle]: 2.3,
    [SolutionTechniqueEnum.PointingPair]: 2.6,
    [SolutionTechniqueEnum.PointingTriple]: 2.6,
    [SolutionTechniqueEnum.BoxLineReduction]: 2.8,
    [SolutionTechniqueEnum.NakedPair]: 3.0,
    [SolutionTechniqueEnum.XWing]: 3.2,
    [SolutionTechniqueEnum.HiddenPair]: 3.4,
    [SolutionTechniqueEnum.FinnedXWing]: 3.4,
    [SolutionTechniqueEnum.SashimiXWing]: 3.5,
    [SolutionTechniqueEnum.NakedTriple]: 3.6,
    [SolutionTechniqueEnum.Swordfish]: 3.8,
    [SolutionTechniqueEnum.HiddenTriple]: 4.0,
    [SolutionTechniqueEnum.FinnedSwordfish]: 4.0,
    [SolutionTechniqueEnum.SashimiSwordfish]: 4.1,
    [SolutionTechniqueEnum.XYWing]: 4.2,
    [SolutionTechniqueEnum.XYZWing]: 4.4,
    [SolutionTechniqueEnum.WWing]: 4.4,
    [SolutionTechniqueEnum.UniqueRectangle]: 4.5,
    [SolutionTechniqueEnum.SimpleColoring]: 4.6,
    [SolutionTechniqueEnum.NakedQuad]: 5.0,
    [SolutionTechniqueEnum.Jellyfish]: 5.2,
    [SolutionTechniqueEnum.HiddenQuad]: 5.4,
    [SolutionTechniqueEnum.BivalueUniversalGrave]: 5.6,
    [SolutionTechniqueEnum.XChain]: SE_CHAIN_RATING_MINIMUM,
    [SolutionTechniqueEnum.XYChain]: 7.0,
    [SolutionTechniqueEnum.AIC]: 7.2,
    [SolutionTechniqueEnum.Guess]: SE_CHAIN_RATING_MAXIMUM
};

export const SE_RATING_CEILING = seTechniqueRatings[SolutionTechniqueEnum.Guess];
