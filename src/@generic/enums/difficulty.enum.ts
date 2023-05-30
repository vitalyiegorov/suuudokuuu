export enum DifficultyEnum {
    Newbie = 'Newbie',
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
    Nightmare = 'Nightmare'
}

const difficultyValues: Record<DifficultyEnum, number> = {
    [DifficultyEnum.Newbie]: 0.03,
    [DifficultyEnum.Easy]: 0.2,
    [DifficultyEnum.Medium]: 0.4,
    [DifficultyEnum.Hard]: 0.5,
    [DifficultyEnum.Nightmare]: 0.8
};

export const getDifficulty = (difficulty: DifficultyEnum, fieldSize: number): number => Math.ceil(difficultyValues[difficulty] * fieldSize);
