import { DifficultyEnum } from '@suuudokuuu/generator';

export const DIFFICULTY_NAMES: Record<DifficultyEnum, string> = {
    [DifficultyEnum.Newbie]: 'Newbie',
    [DifficultyEnum.Easy]: 'Easy',
    [DifficultyEnum.Medium]: 'Medium',
    [DifficultyEnum.Hard]: 'Hard',
    [DifficultyEnum.Nightmare]: 'Nightmare',
    [DifficultyEnum.Hell]: 'Hell'
};

export const DIFFICULTY_LADDER: DifficultyEnum[] = [
    DifficultyEnum.Newbie,
    DifficultyEnum.Easy,
    DifficultyEnum.Medium,
    DifficultyEnum.Hard,
    DifficultyEnum.Nightmare,
    DifficultyEnum.Hell
];
