import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

export const PLACEMENT_CHAIN_MAX_STEPS = 30;
export const PLACEMENT_CHAIN_WORK_BUDGET = 500;
export const PLACEMENT_CHAIN_DEFAULT_SCAN_COST = 1;
export const PLACEMENT_CHAIN_SCAN_COSTS: Partial<Record<SolutionTechniqueEnum, number>> = {
    [SolutionTechniqueEnum.AIC]: 100,
    [SolutionTechniqueEnum.NishioForcingChain]: 4,
    [SolutionTechniqueEnum.CellForcingChain]: 4,
    [SolutionTechniqueEnum.RegionForcingChain]: 4
};
