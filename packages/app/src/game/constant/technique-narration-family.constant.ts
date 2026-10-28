import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { NarrationFamilyEnum } from '../enums/narration-family.enum';

export const techniqueNarrationFamilyConstant: Partial<Record<SolutionTechniqueEnum, NarrationFamilyEnum>> = {
    [SolutionTechniqueEnum.PointingPair]: NarrationFamilyEnum.POINTING,
    [SolutionTechniqueEnum.PointingTriple]: NarrationFamilyEnum.POINTING,
    [SolutionTechniqueEnum.BoxLineReduction]: NarrationFamilyEnum.BOX_LINE,
    [SolutionTechniqueEnum.NakedPair]: NarrationFamilyEnum.NAKED_SUBSET,
    [SolutionTechniqueEnum.NakedTriple]: NarrationFamilyEnum.NAKED_SUBSET,
    [SolutionTechniqueEnum.NakedQuad]: NarrationFamilyEnum.NAKED_SUBSET,
    [SolutionTechniqueEnum.HiddenPair]: NarrationFamilyEnum.HIDDEN_SUBSET,
    [SolutionTechniqueEnum.HiddenTriple]: NarrationFamilyEnum.HIDDEN_SUBSET,
    [SolutionTechniqueEnum.HiddenQuad]: NarrationFamilyEnum.HIDDEN_SUBSET,
    [SolutionTechniqueEnum.XWing]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.Swordfish]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.Jellyfish]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.FinnedXWing]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.FinnedSwordfish]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.SashimiXWing]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.SashimiSwordfish]: NarrationFamilyEnum.FISH,
    [SolutionTechniqueEnum.XYWing]: NarrationFamilyEnum.WING,
    [SolutionTechniqueEnum.XYZWing]: NarrationFamilyEnum.WING,
    [SolutionTechniqueEnum.WWing]: NarrationFamilyEnum.CHAIN,
    [SolutionTechniqueEnum.XChain]: NarrationFamilyEnum.CHAIN,
    [SolutionTechniqueEnum.XYChain]: NarrationFamilyEnum.CHAIN,
    [SolutionTechniqueEnum.SimpleColoring]: NarrationFamilyEnum.COLORING,
    [SolutionTechniqueEnum.AIC]: NarrationFamilyEnum.CHAIN,
    [SolutionTechniqueEnum.UniqueRectangle]: NarrationFamilyEnum.UNIQUE_RECTANGLE,
    [SolutionTechniqueEnum.BivalueUniversalGrave]: NarrationFamilyEnum.BUG,
    [SolutionTechniqueEnum.NishioForcingChain]: NarrationFamilyEnum.FORCING_CHAIN,
    [SolutionTechniqueEnum.CellForcingChain]: NarrationFamilyEnum.FORCING_CHAIN,
    [SolutionTechniqueEnum.RegionForcingChain]: NarrationFamilyEnum.FORCING_CHAIN,
    [SolutionTechniqueEnum.EmptyRectangle]: NarrationFamilyEnum.EMPTY_RECTANGLE,
    [SolutionTechniqueEnum.ALSXZ]: NarrationFamilyEnum.ALMOST_LOCKED_SET,
    [SolutionTechniqueEnum.SueDeCoq]: NarrationFamilyEnum.SUE_DE_COQ
};
