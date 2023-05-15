export enum DifficultyEnum {
    Newbie = 'Newbie',
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
    Nightmare = 'Nightmare'
}

export const difficultyValues = {
    [DifficultyEnum.Newbie]: Math.ceil(9 * 9 * 0.1),
    [DifficultyEnum.Easy]: Math.ceil(9 * 9 * 0.2),
    [DifficultyEnum.Medium]: Math.ceil(9 * 9 * 0.4),
    [DifficultyEnum.Hard]: Math.ceil(9 * 9 * 0.5),
    [DifficultyEnum.Nightmare]: Math.ceil(9 * 9 * 0.7)
};
