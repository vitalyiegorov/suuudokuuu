import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface ScoringConfigInterface {
    correctValue: number;
    correctMinValue: number;
    elapsedCoefficient: number;
    mistakesCoefficient: number;
    hintCoefficient: number;
    undoCoefficient: number;
    lastInRowCoefficientConstant: number;
    lastInColCoefficientConstant: number;
    lastInGroupCoefficientConstant: number;
    lastValueCoefficient: number;
    difficultyCoefficients: Record<DifficultyEnum, number>;
    maxMistakesCoefficients: Record<number, number>;
}
