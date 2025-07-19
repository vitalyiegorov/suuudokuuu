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

export const isEmptyScoredCells = (scoredCells: ScoredCellsInterface): boolean =>
    scoredCells.isWon === emptyScoredCells.isWon &&
    scoredCells.x === emptyScoredCells.x &&
    scoredCells.y === emptyScoredCells.y &&
    scoredCells.group === emptyScoredCells.group &&
    scoredCells.values.length === 0;
