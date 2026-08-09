import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

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
    [SolutionTechniqueEnum.SimpleColoring]: 4.6,
    [SolutionTechniqueEnum.XChain]: 4.8,
    [SolutionTechniqueEnum.NakedQuad]: 5.0,
    [SolutionTechniqueEnum.XYChain]: 5.1,
    [SolutionTechniqueEnum.Jellyfish]: 5.2,
    [SolutionTechniqueEnum.HiddenQuad]: 5.4,
    [SolutionTechniqueEnum.AIC]: 5.4,
    [SolutionTechniqueEnum.Guess]: 5.4
};

export const SE_RATING_CEILING = seTechniqueRatings[SolutionTechniqueEnum.Guess];
