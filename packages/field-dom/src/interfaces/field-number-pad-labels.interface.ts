export interface FieldNumberPadLabelsInterface {
    readonly numberPad: string;
    readonly digit: (value: number, remaining: number) => string;
    readonly candidateMode: string;
    readonly undo: string;
    readonly redo: string;
}
