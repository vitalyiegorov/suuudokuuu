import { DifficultyEnum } from '@suuudokuuu/generator';

import { isDefined, isNumber } from '@rnw-community/shared';

export const difficultyCodeToDifficulty = (code: number | null): DifficultyEnum | null => {
    if (!isNumber(code)) {
        return null;
    }

    const difficulty = Object.values(DifficultyEnum)[code];

    return isDefined(difficulty) ? difficulty : null;
};
