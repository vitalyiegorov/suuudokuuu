import { DifficultyEnum } from '@suuudokuuu/generator';

import type { RatedDifficultyType } from '../types/rated-difficulty.type';

export const DIFFICULTY_NAMES: Record<DifficultyEnum, string> = {
    [DifficultyEnum.Newbie]: 'Newbie',
    [DifficultyEnum.Easy]: 'Easy',
    [DifficultyEnum.Medium]: 'Medium',
    [DifficultyEnum.Hard]: 'Hard',
    [DifficultyEnum.Nightmare]: 'Nightmare',
    [DifficultyEnum.Hell]: 'Hell',
    [DifficultyEnum.Infinity]: 'Infinity'
};

export const RATED_DIFFICULTY_LADDER: RatedDifficultyType[] = [
    DifficultyEnum.Newbie,
    DifficultyEnum.Easy,
    DifficultyEnum.Medium,
    DifficultyEnum.Hard,
    DifficultyEnum.Nightmare,
    DifficultyEnum.Hell
];

export const DIFFICULTY_LADDER: DifficultyEnum[] = [...RATED_DIFFICULTY_LADDER, DifficultyEnum.Infinity];
