import type { FieldMistakeInterface } from './field-mistake.interface';
import type { FieldMoveResultInterface } from './field-move-result.interface';
import type { ScoredCellsInterface } from '@suuudokuuu/generator';

export interface FieldEventMapInterface {
    moveApplied: FieldMoveResultInterface;
    mistake: FieldMistakeInterface;
    completed: ScoredCellsInterface;
}
