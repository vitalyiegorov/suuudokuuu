import type { StepScriptBranchStepInterface } from './step-script-branch-step.interface';
import type { StepScriptChainStepInterface } from './step-script-chain-step.interface';

export interface StepScriptStateInterface {
    readonly explanation?: StepScriptChainStepInterface | StepScriptBranchStepInterface;
    patternCellKeys: ReadonlySet<string>;
    targetCellKey: string | null;
    revealedCandidates: ReadonlyMap<string, number[]>;
    eliminatedCandidates: ReadonlyMap<string, number[]>;
    placedValues: ReadonlyMap<string, number>;
}
