import { DifficultyEnum } from '@suuudokuuu/generator';

import type { LandingDifficultyType } from '../types/landing-difficulty.type';

export const DIFFICULTY_NAMES: Record<LandingDifficultyType, string> = {
    [DifficultyEnum.Newbie]: 'Newbie',
    [DifficultyEnum.Easy]: 'Easy',
    [DifficultyEnum.Medium]: 'Medium',
    [DifficultyEnum.Hard]: 'Hard',
    [DifficultyEnum.Nightmare]: 'Nightmare',
    [DifficultyEnum.Hell]: 'Hell'
};

export const DIFFICULTY_LADDER: LandingDifficultyType[] = [
    DifficultyEnum.Newbie,
    DifficultyEnum.Easy,
    DifficultyEnum.Medium,
    DifficultyEnum.Hard,
    DifficultyEnum.Nightmare,
    DifficultyEnum.Hell
];
