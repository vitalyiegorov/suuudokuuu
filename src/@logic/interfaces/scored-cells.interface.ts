export interface ScoredCellsInterface {
    x: number;
    y: number;
    group: number;
    values: number[];
    isWon: boolean;
}

export const emptyScoredCells: ScoredCellsInterface = {
    x: -1,
    y: -1,
    group: -1,
    values: [],
    isWon: false
};
