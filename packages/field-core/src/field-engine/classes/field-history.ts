import type { FieldHistoryEntryInterface } from '../interfaces/field-history-entry.interface';
import type { FieldHistoryStateInterface } from '../interfaces/field-history-state.interface';

export class FieldHistory {
    private readonly states: FieldHistoryStateInterface[] = [];
    private index = 0;

    get CanUndo(): boolean {
        return this.index > 0;
    }

    get CanRedo(): boolean {
        return this.index < this.states.length - 1;
    }

    push(entry: FieldHistoryEntryInterface): void {
        if (this.states.length === 0) {
            this.states.push(entry.previous);
        }

        this.states.splice(this.index + 1);
        this.states.push(entry.next);
        this.index = this.states.length - 1;
    }

    undo(): FieldHistoryStateInterface | null {
        if (!this.CanUndo) {
            return null;
        }

        this.index -= 1;

        return this.states[this.index];
    }

    redo(): FieldHistoryStateInterface | null {
        if (!this.CanRedo) {
            return null;
        }

        this.index += 1;

        return this.states[this.index];
    }
}
