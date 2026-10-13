import { emptyScoredCells } from '@suuudokuuu/generator';

import type { ScoringConfigInterface } from '../interface/scoring-config.interface';
import type { DifficultyEnum, ScoredCellsInterface } from '@suuudokuuu/generator';

interface CalculateScoreParams {
    readonly difficulty: DifficultyEnum;
    readonly scoredCells: ScoredCellsInterface;
    readonly mistakes: number;
    readonly elapsedTime: number;
    readonly maxMistakes: number;
}

interface CalculatePenaltyParams {
    readonly difficulty: DifficultyEnum;
    readonly maxMistakes: number;
}

export class SudokuScoring {
    constructor(private readonly config: ScoringConfigInterface) {}

    calculate(params: CalculateScoreParams): number {
        const { difficulty, scoredCells, mistakes, elapsedTime, maxMistakes } = params;

        let score = this.getDifficultyBonus(this.config.correctValue, difficulty);
        score = this.applyMaxMistakesBonus(score, maxMistakes);
        score = this.applyCompletionBonuses(score, scoredCells);
        score = this.applyElapsedPenalty(score, elapsedTime);
        score = this.applyMistakesPenalty(score, mistakes);

        return Math.floor(Math.max(score, this.config.correctMinValue));
    }

    calculateHintPenalty(params: CalculatePenaltyParams): number {
        return this.calculatePlacementFraction(params, this.config.hintCoefficient);
    }

    calculateUndoPenalty(params: CalculatePenaltyParams): number {
        return this.calculatePlacementFraction(params, this.config.undoCoefficient);
    }

    private calculatePlacementFraction(params: CalculatePenaltyParams, coefficient: number): number {
        const { difficulty, maxMistakes } = params;

        const placementValue = this.applyMaxMistakesBonus(this.getDifficultyBonus(this.config.correctValue, difficulty), maxMistakes);

        return Math.floor(Math.max(placementValue * coefficient, this.config.correctMinValue));
    }

    private applyCompletionBonuses(score: number, scoredCells: ScoredCellsInterface): number {
        let bonusScore = score;

        if (scoredCells.x !== emptyScoredCells.x) {
            bonusScore += Math.floor(bonusScore * this.config.lastInRowCoefficientConstant);
        }

        if (scoredCells.y !== emptyScoredCells.y) {
            bonusScore += Math.floor(bonusScore * this.config.lastInColCoefficientConstant);
        }

        if (scoredCells.group !== emptyScoredCells.group) {
            bonusScore += Math.floor(bonusScore * this.config.lastInGroupCoefficientConstant);
        }

        if (scoredCells.values.length === 1) {
            bonusScore += Math.floor(bonusScore * this.config.lastValueCoefficient);
        }

        return bonusScore;
    }

    private applyMaxMistakesBonus(score: number, maxMistakes: number): number {
        const coefficient = this.config.maxMistakesCoefficients[maxMistakes] ?? 1;

        return Math.floor(score * coefficient);
    }

    private applyElapsedPenalty(score: number, elapsedSeconds: number): number {
        const penalty = Math.floor(score * elapsedSeconds * this.config.elapsedCoefficient);

        return Math.floor(Math.max(score - penalty, this.config.correctMinValue));
    }

    private applyMistakesPenalty(score: number, mistakes: number): number {
        const penalty = Math.floor(score * mistakes * this.config.mistakesCoefficient);

        return Math.floor(Math.max(score - penalty, this.config.correctMinValue));
    }

    private getDifficultyBonus(score: number, difficulty: DifficultyEnum): number {
        return Math.floor(score * this.config.difficultyCoefficients[difficulty]);
    }
}
