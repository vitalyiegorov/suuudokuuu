import type { FieldHistoryStateInterface } from './field-history-state.interface';

export interface FieldHistoryEntryInterface {
    readonly previous: FieldHistoryStateInterface;
    readonly next: FieldHistoryStateInterface;
}
