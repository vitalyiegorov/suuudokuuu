import type { FieldHistoryStateInterface } from './field-history-state.interface';

export interface FieldHistoryEntryInterface {
    previous: FieldHistoryStateInterface;
    next: FieldHistoryStateInterface;
}
