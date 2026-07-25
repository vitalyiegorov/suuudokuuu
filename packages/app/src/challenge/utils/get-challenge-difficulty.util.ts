import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { isNotEmptyString } from '@rnw-community/shared';

import { stringToGameState } from '../../game/utils/string-to-game-state.util';

export const getChallengeDifficulty = (challengeState: string): DifficultyEnum => {
    const { sudokuString } = stringToGameState(challengeState);

    if (!isNotEmptyString(sudokuString)) {
        return DifficultyEnum.Newbie;
    }

    return Sudoku.fromString(sudokuString, defaultSudokuConfig).Difficulty;
};
