
import { emptyScoredCells } from '@suuudokuuu/generator';

import type { ScoringConfigInterface } from './scoring-config.interface';
import type { DifficultyEnum, ScoredCellsInterface } from '@suuudokuuu/generator';

/**
 * SudokuScoring class handles all score calculations for Sudoku gameplay.
 * 
 * Scoring Formula:
 * 1. Base Score = correctValue * difficultyCoefficient
 * 2. Bonuses are applied for completing rows, columns, groups, and values
 * 3. Penalties are applied for elapsed time and mistakes
 * 4. Final score is capped at minimum: correctMinValue
 * 
 * Example calculation (Easy difficulty):
 * - Base: 500 * 2 = 1000
 * - Row completed: +3000 (1000 * 3)
 * - Col completed: +2000 (1000 * 2) 
 * - Group completed: +3000 (1000 * 3)
 * - Value completed: +2000 (1000 * 2)
 * - Time penalty (60 sec): -60 (1000 * 60 * 0.001)
 * - Mistake penalty (5 mistakes): -250 (1000 * 5 * 0.05)
 * = 10,690 points
 */
export class SudokuScoring {
    constructor(private readonly config: ScoringConfigInterface) {}

    /**
     * Calculate the score for a correct cell placement
     * @param difficulty The game difficulty level
     * @param scoredCells Information about completed rows/cols/groups/values
     * @param mistakes Total number of mistakes made
     * @param elapsedTime Total elapsed time in seconds
     * @returns The calculated score (minimum: correctMinValue)
     */
    // eslint-disable-next-line max-statements
    calculate(difficulty: DifficultyEnum, scoredCells: ScoredCellsInterface, mistakes: number, elapsedTime: number): number {
        // Start with base score multiplied by difficulty coefficient
        let score = this.getDifficultyBonus(this.config.correctValue, difficulty);

        // Add bonuses for completions
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

        // Apply penalties (only if score is positive)
        if (score > 0) {
            score = this.applyElapsedPenalty(score, elapsedTime);
            score = this.applyMistakesPenalty(score, mistakes);
        }

        // Ensure minimum score
        return Math.max(score, this.config.correctMinValue);
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
