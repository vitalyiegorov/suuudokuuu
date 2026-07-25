import { SolutionTechniqueEnum } from '@suuudokuuu/solver';

/** How "sharp" a technique is, on a 1-5 scale, driving the timeline mark height. */
export const techniqueComplexityConstant: Record<SolutionTechniqueEnum, number> = {
    [SolutionTechniqueEnum.Guess]: 5,
    [SolutionTechniqueEnum.FullHouse]: 1,
    [SolutionTechniqueEnum.NakedSingle]: 1,
    [SolutionTechniqueEnum.HiddenSingle]: 1,
    [SolutionTechniqueEnum.PointingPair]: 2,
    [SolutionTechniqueEnum.PointingTriple]: 3,
    [SolutionTechniqueEnum.BoxLineReduction]: 2,
    [SolutionTechniqueEnum.NakedPair]: 2,
    [SolutionTechniqueEnum.NakedTriple]: 3,
    [SolutionTechniqueEnum.NakedQuad]: 3,
    [SolutionTechniqueEnum.HiddenPair]: 2,
    [SolutionTechniqueEnum.HiddenTriple]: 3,
    [SolutionTechniqueEnum.HiddenQuad]: 3,
    [SolutionTechniqueEnum.XWing]: 3,
    [SolutionTechniqueEnum.Swordfish]: 4,
    [SolutionTechniqueEnum.Jellyfish]: 4,
    [SolutionTechniqueEnum.FinnedXWing]: 4,
    [SolutionTechniqueEnum.FinnedSwordfish]: 4,
    [SolutionTechniqueEnum.SashimiXWing]: 4,
    [SolutionTechniqueEnum.SashimiSwordfish]: 4,
    [SolutionTechniqueEnum.XYWing]: 4,
    [SolutionTechniqueEnum.XYZWing]: 4,
    [SolutionTechniqueEnum.WWing]: 4,
    [SolutionTechniqueEnum.XChain]: 5,
    [SolutionTechniqueEnum.XYChain]: 5,
    [SolutionTechniqueEnum.SimpleColoring]: 5,
    [SolutionTechniqueEnum.AIC]: 5
};
