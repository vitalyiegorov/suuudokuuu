import type { StepScriptNarrationInterface } from './step-script-narration.interface';
import type { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';
import type { CellInterface } from '@suuudokuuu/generator';

export interface StepScriptHighlightStepInterface {
    kind: StepScriptStepKindEnum.Highlight;
    patternCells: CellInterface[];
    narration: StepScriptNarrationInterface;
}
