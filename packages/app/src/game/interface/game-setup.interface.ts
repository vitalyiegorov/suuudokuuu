import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface GameSetupInterface {
    readonly difficulty: DifficultyEnum;
    readonly isChallengeRun: boolean;
    readonly maxMistakes: number;
}
