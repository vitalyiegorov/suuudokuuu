import type { ScoringConfigInterface } from '../interfaces/scoring-config.interface';
import type { SudokuConfigInterface } from '@suuudokuuu/generator';

const getMaximumValue = (values: readonly number[]): number => Math.max(...values);

const applyBonus = (score: number, coefficient: number): number => score + Math.floor(score * coefficient);

const getMaximumStructureBonusScore = (score: number, scoringConfig: ScoringConfigInterface): number => {
    let bonusScore = score;
    bonusScore = applyBonus(bonusScore, scoringConfig.lastInRowCoefficientConstant);
    bonusScore = applyBonus(bonusScore, scoringConfig.lastInColCoefficientConstant);
    bonusScore = applyBonus(bonusScore, scoringConfig.lastInGroupCoefficientConstant);

    return bonusScore;
};

export const scoringGetMaximumScore = (scoringConfig: ScoringConfigInterface, sudokuConfig: SudokuConfigInterface): number => {
    const maximumDifficultyCoefficient = getMaximumValue(Object.values(scoringConfig.difficultyCoefficients));
    const maximumMistakesCoefficient = getMaximumValue(Object.values(scoringConfig.maxMistakesCoefficients));
    const maximumBlankCells = getMaximumValue(Object.values(sudokuConfig.difficultyBlankCells));
    const maximumStructureBonusMoves = sudokuConfig.fieldSize;
    const maximumValueBonusMoves = Math.max(0, sudokuConfig.fieldSize - 1);
    const maximumAllBonusMoves = Math.min(maximumBlankCells, maximumStructureBonusMoves, maximumValueBonusMoves);
    const remainingAfterAllBonusMoves = maximumBlankCells - maximumAllBonusMoves;
    const remainingStructureBonusMoves = Math.max(0, maximumStructureBonusMoves - maximumAllBonusMoves);
    const maximumStructureOnlyMoves = Math.min(remainingAfterAllBonusMoves, remainingStructureBonusMoves);
    const maximumPlainMoves = Math.max(0, remainingAfterAllBonusMoves - maximumStructureOnlyMoves);
    const maximumBaseScore = Math.floor(Math.floor(scoringConfig.correctValue * maximumDifficultyCoefficient) * maximumMistakesCoefficient);
    const maximumStructureBonusScore = getMaximumStructureBonusScore(maximumBaseScore, scoringConfig);
    const maximumAllBonusScore = applyBonus(maximumStructureBonusScore, scoringConfig.lastValueCoefficient);

    return (
        maximumAllBonusScore * maximumAllBonusMoves +
        maximumStructureBonusScore * maximumStructureOnlyMoves +
        maximumBaseScore * maximumPlainMoves
    );
};
