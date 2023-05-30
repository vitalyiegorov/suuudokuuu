export interface ScoredCellsInterface {
    x: number;
    y: number;
    group: number;
    values: number[];
}

export const emptyScoredCells: ScoredCellsInterface = {
    x: -1,
    y: -1,
    group: -1,
    values: []
};
