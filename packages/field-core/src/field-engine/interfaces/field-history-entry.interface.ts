import type { FieldHistoryStateInterface } from './field-history-state.interface';
import type { FieldHistoryKindEnum } from '../enums/field-history-kind.enum';
import type { CellInterface } from '@suuudokuuu/generator';

export interface FieldHistoryEntryInterface {
    kind: FieldHistoryKindEnum;
    cell: CellInterface;
    value: number;
    previous: FieldHistoryStateInterface;
    next: FieldHistoryStateInterface;
}
