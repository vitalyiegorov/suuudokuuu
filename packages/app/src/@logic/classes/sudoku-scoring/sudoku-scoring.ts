import { type ScoredCellsInterface, emptyScoredCells } from '../../interfaces/scored-cells.interface';

import type { DifficultyEnum } from '../../../@generic/enums/difficulty.enum';
import type { SudokuScoringConfigInterface } from '../../interfaces/sudoku-scoring-config.interface';

export class SudokuScoring {
    private currentScore = 0;

    constructor(private readonly config: SudokuScoringConfigInterface) {}

    // eslint-disable-next-line @typescript-eslint/max-params
    calculate(difficulty: DifficultyEnum, scoredCells: ScoredCellsInterface, mistakes: number, elapsedTime: number): number {
        this.currentScore = this.getDifficultyBonus(this.config.correctValue, difficulty);

        if (scoredCells.x !== emptyScoredCells.x) {
            this.currentScore += this.getCompletedRowBonus();
        }

        if (scoredCells.y !== emptyScoredCells.y) {
            this.currentScore += this.getCompletedColBonus();
        }

        if (scoredCells.group !== emptyScoredCells.group) {
            this.currentScore += this.getCompletedGroupBonus();
        }

        if (scoredCells.values.length === 1) {
            this.currentScore += this.getCompletedValuesBonus();
        }

        this.currentScore = this.getElapsedPenalty(this.currentScore, elapsedTime);
        this.currentScore = this.getMistakesPenalty(this.currentScore, mistakes);

        return Math.max(this.currentScore, this.config.correctMinValue);
    }

    private getElapsedPenalty(score: number, elapsedSeconds: number): number {
        return Math.floor(score - score * elapsedSeconds * this.config.elapsedCoefficient);
    }

    private getMistakesPenalty(score: number, mistakes: number): number {
        return Math.floor(score - score * mistakes * this.config.elapsedCoefficient);
    }

    private getDifficultyBonus(score: number, difficulty: DifficultyEnum): number {
        return Math.floor(score * this.config.difficultyCoefficients[difficulty]);
    }

    private getCompletedRowBonus(): number {
        return this.currentScore * this.config.lastInRowCoefficientConstant;
    }

    private getCompletedColBonus(): number {
        return this.currentScore * this.config.lastInColCoefficientConstant;
    }

    private getCompletedGroupBonus(): number {
        return this.currentScore * this.config.lastInGroupCoefficientConstant;
    }

    private getCompletedValuesBonus(): number {
        return this.currentScore * this.config.lastValueCoefficient;
    }
}
