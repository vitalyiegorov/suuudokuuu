import { DifficultyEnum } from '@suuudokuuu/generator';

export interface ScoringConfigInterface {
    correctValue: number;
    correctMinValue: number;
    elapsedCoefficient: number;
    mistakesCoefficient: number;
    lastInRowCoefficientConstant: number;
    lastInColCoefficientConstant: number;
    lastInGroupCoefficientConstant: number;
    lastValueCoefficient: number;
    difficultyCoefficients: Record<DifficultyEnum, number>;
}

export const defaultScoringConfig: ScoringConfigInterface = {
    correctMinValue: 0.05,
    correctValue: 0.5,
    elapsedCoefficient: 0.000001,
    lastInColCoefficientConstant: 2,
    lastInGroupCoefficientConstant: 3,
    lastInRowCoefficientConstant: 3,
    lastValueCoefficient: 2,
    mistakesCoefficient: 0.00005,
    difficultyCoefficients: {
        [DifficultyEnum.Newbie]: 1,
        [DifficultyEnum.Easy]: 2,
        [DifficultyEnum.Medium]: 3,
        [DifficultyEnum.Hard]: 4,
        [DifficultyEnum.Nightmare]: 5
    }
};
