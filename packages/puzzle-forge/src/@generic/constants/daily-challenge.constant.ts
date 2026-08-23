import { DifficultyEnum } from '@suuudokuuu/generator';

export const DAILY_MILLISECONDS_PER_DAY = 86_400_000;

export const DAILY_SEED_NAMESPACE = 'suuudokuuu-daily-';

export const DAILY_DIFFICULTY_LADDER: readonly DifficultyEnum[] = [
    DifficultyEnum.Newbie,
    DifficultyEnum.Easy,
    DifficultyEnum.Medium,
    DifficultyEnum.Hard
];
