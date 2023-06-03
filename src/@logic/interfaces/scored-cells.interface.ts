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

export const isEqualScoreCells = (scoredCells1: ScoredCellsInterface, scoredCells2: ScoredCellsInterface): boolean =>
    scoredCells1.isWon === scoredCells2.isWon &&
    scoredCells1.x === scoredCells2.x &&
    scoredCells1.y === scoredCells2.y &&
    scoredCells1.group === scoredCells2.group &&
    scoredCells1.values.length === scoredCells2.values.length &&
    scoredCells1.values.every((value, index) => value === scoredCells2.values[index]);
