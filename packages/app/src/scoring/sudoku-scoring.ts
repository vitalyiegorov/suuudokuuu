import { emptyScoredCells } from '@suuudokuuu/generator';

import type { ScoringConfigInterface } from './scoring-config.interface';
import type { DifficultyEnum, ScoredCellsInterface } from '@suuudokuuu/generator';

interface CalculateScoreParams {
    difficulty: DifficultyEnum;
    scoredCells: ScoredCellsInterface;
    mistakes: number;
    elapsedTime: number;
    maxMistakes: number;
}

export class SudokuScoring {
    constructor(private readonly config: ScoringConfigInterface) {}

    calculate(params: CalculateScoreParams): number {
        const { difficulty, scoredCells, mistakes, elapsedTime, maxMistakes } = params;

        let score = this.getDifficultyBonus(this.config.correctValue, difficulty);
        score = this.applyMaxMistakesBonus(score, maxMistakes);
        score = this.applyCompletionBonuses(score, scoredCells);

        const penalizedScore = this.applyPenalties(score, elapsedTime, mistakes);

        return Math.floor(Math.max(penalizedScore, this.config.correctMinValue));
    }

    private applyCompletionBonuses(score: number, scoredCells: ScoredCellsInterface): number {
        let bonusScore = score;

        if (scoredCells.x !== emptyScoredCells.x) {
            bonusScore += this.getCompletedRowBonus(bonusScore);
        }

        if (scoredCells.y !== emptyScoredCells.y) {
            bonusScore += this.getCompletedColBonus(bonusScore);
        }

        if (scoredCells.group !== emptyScoredCells.group) {
            bonusScore += this.getCompletedGroupBonus(bonusScore);
        }

        if (scoredCells.values.length === 1) {
            bonusScore += this.getCompletedValuesBonus(bonusScore);
        }

        return bonusScore;
    }

    private applyMaxMistakesBonus(score: number, maxMistakes: number): number {
        const coefficient = this.config.maxMistakesCoefficients[maxMistakes] ?? 1;

        return Math.floor(score * coefficient);
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

    private getCompletedRowBonus(score: number): number {
        return Math.floor(score * this.config.lastInRowCoefficientConstant);
    }

    private getCompletedColBonus(score: number): number {
        return Math.floor(score * this.config.lastInColCoefficientConstant);
    }

    private getCompletedGroupBonus(score: number): number {
        return Math.floor(score * this.config.lastInGroupCoefficientConstant);
    }

    private getCompletedValuesBonus(score: number): number {
        return Math.floor(score * this.config.lastValueCoefficient);
    }
}
