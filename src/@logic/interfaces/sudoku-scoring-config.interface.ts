export interface SudokuScoringConfigInterface {
    // Base score value for correct value
    correctValue: number;
    // Minimal score earned for correct value
    correctMinValue: number;
    // Decreasing coefficient for elapsed time
    elapsedCoefficient: number;
    // Decreasing coefficient for mistakes count
    mistakesCoefficient: number;
    // Increasing coefficient for completing row
    lastInRowCoefficientConstant: number;
    // Increasing coefficient for completing column
    lastInColCoefficientConstant: number;
    // Increasing coefficient for completing group
    lastInGroupCoefficientConstant: number;
    // Increasing coefficient for completing all values
    lastValueCoefficient: number;
}

export const defaultSudokuScoringConfig: SudokuScoringConfigInterface = {
    correctMinValue: 50,
    correctValue: 500,
    elapsedCoefficient: 0.001,
    lastInColCoefficientConstant: 2,
    lastInGroupCoefficientConstant: 3,
    lastInRowCoefficientConstant: 3,
    lastValueCoefficient: 2,
    mistakesCoefficient: 0.05
};
