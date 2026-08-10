import { DifficultyEnum } from '@suuudokuuu/generator';

export const getDifficultyFromOrdinal = (ordinal: number): DifficultyEnum | null => {
    const difficulties = Object.values(DifficultyEnum);
    const index = ordinal - 1;
    const isKnownOrdinal = index >= 0 && index < difficulties.length;

    return isKnownOrdinal ? difficulties[index] : null;
};
