import { DIFFICULTY_CODE_MAX } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';

export const difficultyToDifficultyCode = (difficulty: DifficultyEnum): number | null => {
    const code = Object.values(DifficultyEnum).indexOf(difficulty);

    return code >= 0 && code <= DIFFICULTY_CODE_MAX ? code : null;
};
