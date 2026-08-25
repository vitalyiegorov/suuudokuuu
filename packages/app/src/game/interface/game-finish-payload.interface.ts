import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface GameFinishPayloadInterface {
    readonly difficulty: DifficultyEnum;
    readonly isWon: boolean;
    readonly isChallenge?: boolean;
}
