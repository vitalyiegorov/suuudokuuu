import type { StepScriptNarrationInterface } from './step-script-narration.interface';
import type { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';
import type { CellInterface } from '@suuudokuuu/generator';

export interface StepScriptRevealCandidatesStepInterface {
    kind: StepScriptStepKindEnum.RevealCandidates;
    patternCells: CellInterface[];
    values: number[];
    narration: StepScriptNarrationInterface;
}
