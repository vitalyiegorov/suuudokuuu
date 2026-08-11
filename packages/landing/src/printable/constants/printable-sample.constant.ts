import { DifficultyEnum } from '@suuudokuuu/generator';

import { RATING_SAMPLE_PUZZLES } from '../../rating/constants/rating-sample.constant';

import type { LandingDifficultyType } from '../../difficulty/types/landing-difficulty.type';

export const PRINTABLE_BOOKLET_SIZE = 16;

export const PRINTABLE_LARGE_PRINT_SIZE = 12;

export const PRINTABLE_BOOKLET_PUZZLES: Record<LandingDifficultyType, string[]> = {
    [DifficultyEnum.Newbie]: RATING_SAMPLE_PUZZLES[DifficultyEnum.Newbie].slice(0, PRINTABLE_BOOKLET_SIZE),
    [DifficultyEnum.Easy]: RATING_SAMPLE_PUZZLES[DifficultyEnum.Easy].slice(0, PRINTABLE_BOOKLET_SIZE),
    [DifficultyEnum.Medium]: RATING_SAMPLE_PUZZLES[DifficultyEnum.Medium].slice(0, PRINTABLE_BOOKLET_SIZE),
    [DifficultyEnum.Hard]: RATING_SAMPLE_PUZZLES[DifficultyEnum.Hard].slice(0, PRINTABLE_BOOKLET_SIZE),
    [DifficultyEnum.Nightmare]: RATING_SAMPLE_PUZZLES[DifficultyEnum.Nightmare].slice(0, PRINTABLE_BOOKLET_SIZE),
    [DifficultyEnum.Hell]: RATING_SAMPLE_PUZZLES[DifficultyEnum.Hell].slice(0, PRINTABLE_BOOKLET_SIZE)
};

export const PRINTABLE_LARGE_PRINT_PUZZLES: string[] = RATING_SAMPLE_PUZZLES[DifficultyEnum.Easy].slice(
    PRINTABLE_BOOKLET_SIZE,
    PRINTABLE_BOOKLET_SIZE + PRINTABLE_LARGE_PRINT_SIZE
);
