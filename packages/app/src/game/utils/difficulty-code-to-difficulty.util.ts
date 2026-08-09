import { DifficultyEnum } from '@suuudokuuu/generator';

import { isDefined, isNumber } from '@rnw-community/shared';

export const difficultyCodeToDifficulty = (code: number | null): DifficultyEnum | null => {
    const difficulties = Object.values(DifficultyEnum);

    if (!isNumber(code) || !Number.isInteger(code) || code < 0 || code >= difficulties.length) {
        return null;
    }

    const difficulty = difficulties[code];

    return isDefined(difficulty) ? difficulty : null;
};
