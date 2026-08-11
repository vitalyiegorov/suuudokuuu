import type { FieldMistakeInterface } from './field-mistake.interface';
import type { FieldMoveResultInterface } from './field-move-result.interface';
import type { StepScriptInterface } from '../../step-script/interfaces/step-script.interface';
import type { ScoredCellsInterface } from '@suuudokuuu/generator';

export interface FieldEventMapInterface {
    moveApplied: FieldMoveResultInterface;
    mistake: FieldMistakeInterface;
    completed: ScoredCellsInterface;
    stepScriptStarted: StepScriptInterface;
    stepScriptFinished: StepScriptInterface;
}
