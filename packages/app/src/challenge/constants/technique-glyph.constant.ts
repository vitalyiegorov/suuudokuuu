import { SolutionTechniqueEnum } from '@suuudokuuu/solver';

/**
 * Each technique renders as a mini 3x3 sudoku-pattern pictogram. The values are
 * the lit cell indexes (0-8, row-major) that draw a shape evoking the technique.
 * Every pattern is unique so no two techniques share a glyph.
 */
export const techniqueGlyphConstant: Record<SolutionTechniqueEnum, readonly number[]> = {
    [SolutionTechniqueEnum.Guess]: [1, 3, 4, 5, 7],
    [SolutionTechniqueEnum.FullHouse]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [SolutionTechniqueEnum.NakedSingle]: [4],
    [SolutionTechniqueEnum.HiddenSingle]: [1],
    [SolutionTechniqueEnum.PointingPair]: [0, 3],
    [SolutionTechniqueEnum.PointingTriple]: [0, 3, 6],
    [SolutionTechniqueEnum.BoxLineReduction]: [0, 1, 2],
    [SolutionTechniqueEnum.NakedPair]: [3, 4],
    [SolutionTechniqueEnum.NakedTriple]: [3, 4, 5],
    [SolutionTechniqueEnum.NakedQuad]: [0, 1, 3, 4],
    [SolutionTechniqueEnum.HiddenPair]: [1, 7],
    [SolutionTechniqueEnum.HiddenTriple]: [1, 4, 7],
    [SolutionTechniqueEnum.HiddenQuad]: [1, 3, 5, 7],
    [SolutionTechniqueEnum.XWing]: [0, 2, 6, 8],
    [SolutionTechniqueEnum.Swordfish]: [0, 2, 4, 6, 8],
    [SolutionTechniqueEnum.Jellyfish]: [0, 1, 2, 6, 7, 8],
    [SolutionTechniqueEnum.FinnedXWing]: [0, 2, 5, 6, 8],
    [SolutionTechniqueEnum.FinnedSwordfish]: [0, 2, 4, 5, 6, 8],
    [SolutionTechniqueEnum.SashimiXWing]: [0, 2, 6, 7, 8],
    [SolutionTechniqueEnum.SashimiSwordfish]: [0, 2, 4, 6, 7, 8],
    [SolutionTechniqueEnum.XYWing]: [0, 1, 4],
    [SolutionTechniqueEnum.XYZWing]: [0, 1, 4, 5],
    [SolutionTechniqueEnum.WWing]: [2, 4, 6],
    [SolutionTechniqueEnum.XChain]: [0, 4, 8],
    [SolutionTechniqueEnum.XYChain]: [0, 4, 5, 8],
    [SolutionTechniqueEnum.SimpleColoring]: [0, 2, 3, 5, 6, 8],
    [SolutionTechniqueEnum.AIC]: [0, 3, 4, 5, 8]
};
