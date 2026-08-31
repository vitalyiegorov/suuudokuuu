import type { StepScriptCandidateInterface } from './step-script-candidate.interface';
import type { StepScriptStepType } from '../types/step-script-step.type';
import type { CellInterface } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface StepScriptInterface {
    technique: SolutionTechniqueEnum;
    patternCells: CellInterface[];
    eliminations: StepScriptCandidateInterface[];
    placement?: StepScriptCandidateInterface;
    steps: StepScriptStepType[];
}
