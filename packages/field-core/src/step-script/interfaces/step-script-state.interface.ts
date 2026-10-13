import type { HintRegionInterface } from './hint-region.interface';
import type { StepScriptBranchStepInterface } from './step-script-branch-step.interface';
import type { StepScriptChainStepInterface } from './step-script-chain-step.interface';

export interface StepScriptStateInterface {
    readonly explanation?: StepScriptChainStepInterface | StepScriptBranchStepInterface;
    readonly hintRegion: HintRegionInterface | null;
    readonly regionCellKeys: ReadonlySet<string>;
    readonly revealedImplicationCount: number;
    readonly patternCellKeys: ReadonlySet<string>;
    readonly targetCellKey: string | null;
    readonly revealedCandidates: ReadonlyMap<string, number[]>;
    readonly eliminatedCandidates: ReadonlyMap<string, number[]>;
    readonly placedValues: ReadonlyMap<string, number>;
}
