import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface TechniqueGlyphInterface {
    readonly primary: readonly number[];
    readonly accent: readonly number[];
}

export const techniqueGlyphConstant: Record<SolutionTechniqueEnum, TechniqueGlyphInterface> = {
    [SolutionTechniqueEnum.Guess]: { primary: [], accent: [0, 2, 4, 6, 8] },
    [SolutionTechniqueEnum.FullHouse]: { primary: [0, 1, 2, 3, 4, 5, 6, 7, 8], accent: [] },
    [SolutionTechniqueEnum.NakedSingle]: { primary: [4], accent: [] },
    [SolutionTechniqueEnum.HiddenSingle]: { primary: [4], accent: [1, 7] },
    [SolutionTechniqueEnum.PointingPair]: { primary: [0, 3], accent: [6] },
    [SolutionTechniqueEnum.PointingTriple]: { primary: [0, 3, 6], accent: [] },
    [SolutionTechniqueEnum.BoxLineReduction]: { primary: [0, 1, 2], accent: [3, 6] },
    [SolutionTechniqueEnum.NakedPair]: { primary: [3, 4], accent: [] },
    [SolutionTechniqueEnum.NakedTriple]: { primary: [3, 4, 5], accent: [] },
    [SolutionTechniqueEnum.NakedQuad]: { primary: [3, 4, 6, 7], accent: [] },
    [SolutionTechniqueEnum.HiddenPair]: { primary: [1, 7], accent: [4] },
    [SolutionTechniqueEnum.HiddenTriple]: { primary: [1, 4, 7], accent: [] },
    [SolutionTechniqueEnum.HiddenQuad]: { primary: [1, 4, 7], accent: [3, 5] },
    [SolutionTechniqueEnum.XWing]: { primary: [0, 2, 6, 8], accent: [] },
    [SolutionTechniqueEnum.Swordfish]: { primary: [0, 2, 4, 6, 8], accent: [] },
    [SolutionTechniqueEnum.Jellyfish]: { primary: [0, 1, 2, 6, 7, 8], accent: [] },
    [SolutionTechniqueEnum.FinnedXWing]: { primary: [0, 2, 6, 8], accent: [5] },
    [SolutionTechniqueEnum.FinnedSwordfish]: { primary: [0, 2, 4, 6, 8], accent: [5] },
    [SolutionTechniqueEnum.SashimiXWing]: { primary: [0, 2, 6], accent: [7] },
    [SolutionTechniqueEnum.SashimiSwordfish]: { primary: [0, 2, 4, 6], accent: [7] },
    [SolutionTechniqueEnum.XYWing]: { primary: [4], accent: [0, 2] },
    [SolutionTechniqueEnum.XYZWing]: { primary: [4], accent: [0, 2, 6] },
    [SolutionTechniqueEnum.WWing]: { primary: [0, 8], accent: [4] },
    [SolutionTechniqueEnum.XChain]: { primary: [0, 4, 8], accent: [] },
    [SolutionTechniqueEnum.XYChain]: { primary: [0, 4, 8], accent: [2] },
    [SolutionTechniqueEnum.SimpleColoring]: { primary: [0, 2, 6, 8], accent: [4] },
    [SolutionTechniqueEnum.AIC]: { primary: [2, 4, 6], accent: [0, 8] },
    [SolutionTechniqueEnum.UniqueRectangle]: { primary: [0, 1, 3], accent: [4] },
    [SolutionTechniqueEnum.BivalueUniversalGrave]: { primary: [0, 1, 2, 3, 5, 6, 7, 8], accent: [4] }
};
