import { emptyScoredCells } from '@suuudokuuu/generator';

import type { ScoringConfigInterface } from './scoring-config.interface';
import type { DifficultyEnum, ScoredCellsInterface } from '@suuudokuuu/generator';

export class SudokuScoring {
    constructor(private readonly config: ScoringConfigInterface) {}

    calculate(difficulty: DifficultyEnum, scoredCells: ScoredCellsInterface, mistakes: number, elapsedTime: number): number {
        let score = this.getDifficultyBonus(this.config.correctValue, difficulty);

        if (scoredCells.x !== emptyScoredCells.x) {
            score += this.getCompletedRowBonus(score);
        }

        if (scoredCells.y !== emptyScoredCells.y) {
            score += this.getCompletedColBonus(score);
        }

        if (scoredCells.group !== emptyScoredCells.group) {
            score += this.getCompletedGroupBonus(score);
        }

        if (scoredCells.values.length === 1) {
            score += this.getCompletedValuesBonus(score);
        }

        const penalizedScore = this.applyPenalties(score, elapsedTime, mistakes);
        
return Math.max(penalizedScore, this.config.correctMinValue);
    }

    private applyPenalties(score: number, elapsedTime: number, mistakes: number): number {
        const afterTime = this.applyElapsedPenalty(score, elapsedTime);
        
return this.applyMistakesPenalty(afterTime, mistakes);
    }

    private applyElapsedPenalty(score: number, elapsedSeconds: number): number {
        const penalty = Math.floor(score * elapsedSeconds * this.config.elapsedCoefficient);
        
return Math.floor(score - penalty);
    }

    private applyMistakesPenalty(score: number, mistakes: number): number {
        const penalty = Math.floor(score * mistakes * this.config.mistakesCoefficient);
        
return Math.floor(score - penalty);
    }

    private getDifficultyBonus(score: number, difficulty: DifficultyEnum): number {
        return Math.floor(score * this.config.difficultyCoefficients[difficulty]);
    }

    private getCompletedRowBonus(currentScore: number): number {
        return Math.floor(currentScore * this.config.lastInRowCoefficientConstant);
    }

    private getCompletedColBonus(currentScore: number): number {
        return Math.floor(currentScore * this.config.lastInColCoefficientConstant);
    }

    private getCompletedGroupBonus(currentScore: number): number {
        return Math.floor(currentScore * this.config.lastInGroupCoefficientConstant);
    }

    private getCompletedValuesBonus(currentScore: number): number {
        return Math.floor(currentScore * this.config.lastValueCoefficient);
    }
}
