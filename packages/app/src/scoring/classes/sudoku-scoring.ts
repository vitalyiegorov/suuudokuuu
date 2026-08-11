import { emptyScoredCells } from '@suuudokuuu/generator';

import type { ScoringConfigInterface } from '../interfaces/scoring-config.interface';
import type { DifficultyEnum, ScoredCellsInterface } from '@suuudokuuu/generator';

interface CalculateScoreParams {
    difficulty: DifficultyEnum;
    scoredCells: ScoredCellsInterface;
    mistakes: number;
    elapsedTime: number;
    maxMistakes: number;
}

interface CalculateHintPenaltyParams {
    difficulty: DifficultyEnum;
    maxMistakes: number;
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

    calculateHintPenalty(params: CalculateHintPenaltyParams): number {
        const { difficulty, maxMistakes } = params;

        const placementValue = this.applyMaxMistakesBonus(this.getDifficultyBonus(this.config.correctValue, difficulty), maxMistakes);

        return Math.floor(Math.max(placementValue * this.config.hintCoefficient, this.config.correctMinValue));
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
