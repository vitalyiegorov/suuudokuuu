import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

export const PLACEMENT_CHAIN_MAX_STEPS = 30;
export const PLACEMENT_CHAIN_WORK_BUDGET = 500;
export const PLACEMENT_CHAIN_DEFAULT_SCAN_COST = 1;
export const PLACEMENT_CHAIN_SCAN_COSTS: Readonly<Partial<Record<SolutionTechniqueEnum, number>>> = {
    [SolutionTechniqueEnum.AIC]: 100,
    [SolutionTechniqueEnum.NishioForcingChain]: 4,
    [SolutionTechniqueEnum.CellForcingChain]: 4,
    [SolutionTechniqueEnum.RegionForcingChain]: 4
};
export const PLACEMENT_CHAIN_DIFFICULTY_TOLERANCE = 1;
export const PLACEMENT_CHAIN_DIFFICULTIES: Record<SolutionTechniqueEnum, number> = {
    [SolutionTechniqueEnum.Guess]: 8.5,
    [SolutionTechniqueEnum.FullHouse]: 1,
    [SolutionTechniqueEnum.NakedSingle]: 2.3,
    [SolutionTechniqueEnum.HiddenSingle]: 1.5,
    [SolutionTechniqueEnum.PointingPair]: 2.6,
    [SolutionTechniqueEnum.PointingTriple]: 2.6,
    [SolutionTechniqueEnum.BoxLineReduction]: 2.8,
    [SolutionTechniqueEnum.NakedPair]: 3,
    [SolutionTechniqueEnum.NakedTriple]: 3.6,
    [SolutionTechniqueEnum.NakedQuad]: 5,
    [SolutionTechniqueEnum.HiddenPair]: 3.4,
    [SolutionTechniqueEnum.HiddenTriple]: 4,
    [SolutionTechniqueEnum.HiddenQuad]: 5.4,
    [SolutionTechniqueEnum.XWing]: 3.2,
    [SolutionTechniqueEnum.Swordfish]: 3.8,
    [SolutionTechniqueEnum.Jellyfish]: 5.2,
    [SolutionTechniqueEnum.FinnedXWing]: 3.4,
    [SolutionTechniqueEnum.FinnedSwordfish]: 4,
    [SolutionTechniqueEnum.SashimiXWing]: 3.5,
    [SolutionTechniqueEnum.SashimiSwordfish]: 4.1,
    [SolutionTechniqueEnum.XYWing]: 4.2,
    [SolutionTechniqueEnum.XYZWing]: 4.4,
    [SolutionTechniqueEnum.WWing]: 4.4,
    [SolutionTechniqueEnum.XChain]: 6.6,
    [SolutionTechniqueEnum.XYChain]: 7,
    [SolutionTechniqueEnum.SimpleColoring]: 4.6,
    [SolutionTechniqueEnum.AIC]: 7.2,
    [SolutionTechniqueEnum.UniqueRectangle]: 4.5,
    [SolutionTechniqueEnum.BivalueUniversalGrave]: 5.6,
    [SolutionTechniqueEnum.NishioForcingChain]: 7.5,
    [SolutionTechniqueEnum.CellForcingChain]: 8,
    [SolutionTechniqueEnum.RegionForcingChain]: 8,
    [SolutionTechniqueEnum.EmptyRectangle]: 4.5,
    [SolutionTechniqueEnum.ALSXZ]: 6.2,
    [SolutionTechniqueEnum.SueDeCoq]: 5.8
};
