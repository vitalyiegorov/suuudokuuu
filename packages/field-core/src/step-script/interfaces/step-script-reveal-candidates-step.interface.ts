import type { StepScriptCandidateInterface } from './step-script-candidate.interface';
import type { StepScriptNarrationInterface } from './step-script-narration.interface';
import type { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';
import type { CellInterface } from '@suuudokuuu/generator';

export interface StepScriptRevealCandidatesStepInterface {
    kind: StepScriptStepKindEnum.RevealCandidates;
    patternCells: CellInterface[];
    candidates: StepScriptCandidateInterface[];
    narration: StepScriptNarrationInterface;
}
