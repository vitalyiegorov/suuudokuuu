import { type ScoredCellsInterface, emptyScoredCells } from '../interfaces/scored-cells.interface';
import { type SudokuScoringConfigInterface } from '../interfaces/sudoku-scoring-config.interface';

export class SudokuScoring {
    private currentScore = 0;

    constructor(private readonly config: SudokuScoringConfigInterface) {}

    calculate(scoredCells: ScoredCellsInterface, mistakes: number, startedAt: Date): number {
        this.currentScore = this.getElapsedPenalty(this.config.correctValue, startedAt);
        this.currentScore = this.getMistakesPenalty(this.currentScore, mistakes);

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

        return Math.max(this.currentScore, this.config.correctMinValue);
    }

    private getElapsedPenalty(score: number, gameStartedAt: Date): number {
        const elapsedSeconds = (new Date().getTime() - gameStartedAt.getTime()) / 1000;

        return Math.floor(score - score * elapsedSeconds * this.config.elapsedCoefficient);
    }

    private getMistakesPenalty(score: number, mistakes: number): number {
        return Math.floor(score - score * mistakes * this.config.elapsedCoefficient);
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