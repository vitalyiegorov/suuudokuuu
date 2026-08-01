import { msg } from '@lingui/core/macro';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import type { MessageDescriptor } from '@lingui/core';

export const techniqueLabelsConstant: Record<SolutionTechniqueEnum, MessageDescriptor> = {
    [SolutionTechniqueEnum.Guess]: msg`Guess`,
    [SolutionTechniqueEnum.FullHouse]: msg`Full House`,
    [SolutionTechniqueEnum.NakedSingle]: msg`Naked Single`,
    [SolutionTechniqueEnum.HiddenSingle]: msg`Hidden Single`,
    [SolutionTechniqueEnum.PointingPair]: msg`Pointing Pair`,
    [SolutionTechniqueEnum.PointingTriple]: msg`Pointing Triple`,
    [SolutionTechniqueEnum.BoxLineReduction]: msg`Box-Line Reduction`,
    [SolutionTechniqueEnum.NakedPair]: msg`Naked Pair`,
    [SolutionTechniqueEnum.NakedTriple]: msg`Naked Triple`,
    [SolutionTechniqueEnum.NakedQuad]: msg`Naked Quad`,
    [SolutionTechniqueEnum.HiddenPair]: msg`Hidden Pair`,
    [SolutionTechniqueEnum.HiddenTriple]: msg`Hidden Triple`,
    [SolutionTechniqueEnum.HiddenQuad]: msg`Hidden Quad`,
    [SolutionTechniqueEnum.XWing]: msg`X-Wing`,
    [SolutionTechniqueEnum.Swordfish]: msg`Swordfish`,
    [SolutionTechniqueEnum.Jellyfish]: msg`Jellyfish`,
    [SolutionTechniqueEnum.FinnedXWing]: msg`Finned X-Wing`,
    [SolutionTechniqueEnum.FinnedSwordfish]: msg`Finned Swordfish`,
    [SolutionTechniqueEnum.SashimiXWing]: msg`Sashimi X-Wing`,
    [SolutionTechniqueEnum.SashimiSwordfish]: msg`Sashimi Swordfish`,
    [SolutionTechniqueEnum.XYWing]: msg`XY-Wing`,
    [SolutionTechniqueEnum.XYZWing]: msg`XYZ-Wing`,
    [SolutionTechniqueEnum.WWing]: msg`W-Wing`,
    [SolutionTechniqueEnum.XChain]: msg`X-Chain`,
    [SolutionTechniqueEnum.XYChain]: msg`XY-Chain`,
    [SolutionTechniqueEnum.SimpleColoring]: msg`Simple Coloring`,
    [SolutionTechniqueEnum.AIC]: msg`AIC`
};
