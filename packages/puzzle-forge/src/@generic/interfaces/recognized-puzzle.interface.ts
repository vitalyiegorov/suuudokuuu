export interface RecognizedPuzzleInterface {
    readonly puzzleString: string;
    readonly confidences: readonly number[];
    readonly handwritten: readonly boolean[];
    readonly probabilities: readonly (readonly number[] | null)[];
}
