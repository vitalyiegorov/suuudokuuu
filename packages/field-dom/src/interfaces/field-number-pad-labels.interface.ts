export interface FieldNumberPadLabelsInterface {
    numberPad: string;
    digit: (value: number, remaining: number) => string;
    candidateMode: string;
    undo: string;
    redo: string;
}
