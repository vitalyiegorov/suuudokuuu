import type { FieldHistoryEntryInterface } from '../interfaces/field-history-entry.interface';
import type { FieldHistoryStateInterface } from '../interfaces/field-history-state.interface';

export class FieldHistory {
    private entries: FieldHistoryEntryInterface[] = [];
    private index = -1;

    get CanUndo(): boolean {
        return this.index >= 0;
    }

    get CanRedo(): boolean {
        return this.index < this.entries.length - 1;
    }

    push(entry: FieldHistoryEntryInterface): void {
        this.entries = [...this.entries.slice(0, this.index + 1), entry];
        this.index = this.entries.length - 1;
    }

    undo(): FieldHistoryStateInterface | null {
        if (!this.CanUndo) {
            return null;
        }

        const { previous } = this.entries[this.index];

        this.index -= 1;

        return previous;
    }

    redo(): FieldHistoryStateInterface | null {
        if (!this.CanRedo) {
            return null;
        }

        this.index += 1;

        return this.entries[this.index].next;
    }
}
