export interface GameSnapshotInterface {
    readonly sudokuString: string;
    readonly candidates: Record<string, number[]>;
}
