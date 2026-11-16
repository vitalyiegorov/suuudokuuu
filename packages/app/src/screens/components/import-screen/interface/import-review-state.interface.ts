export interface ImportReviewStateInterface {
    readonly isPasteMissed: boolean;
    readonly selectedCellIndex: number | null;
    readonly entryString: string;
    readonly uncertainCellIndexes: readonly number[];
    readonly scannedCellIndexes: readonly number[];
    readonly isRecognizing: boolean;
    readonly isGridMissed: boolean;
    readonly isTyping: boolean;
}
