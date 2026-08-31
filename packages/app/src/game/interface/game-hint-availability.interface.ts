import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface GameHintAvailabilityInterface {
    readonly difficulty: DifficultyEnum;
    readonly isChallengeRun: boolean;
    readonly allowHintsOnHardDifficulties: boolean;
}
