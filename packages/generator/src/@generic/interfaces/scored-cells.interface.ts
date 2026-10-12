export interface ScoredCellsInterface {
    readonly x: number;
    readonly y: number;
    readonly group: number;
    readonly values: readonly number[];
    readonly isWon: boolean;
}

export const emptyScoredCells: ScoredCellsInterface = {
    x: -1,
    y: -1,
    group: -1,
    values: [],
    isWon: false
};

export const isEmptyScoredCells = (scoredCells: ScoredCellsInterface): boolean =>
    scoredCells.isWon === emptyScoredCells.isWon &&
    scoredCells.x === emptyScoredCells.x &&
    scoredCells.y === emptyScoredCells.y &&
    scoredCells.group === emptyScoredCells.group &&
    scoredCells.values.length === 0;
