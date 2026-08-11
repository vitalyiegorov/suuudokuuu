import { FieldEngine } from '@suuudokuuu/field-core';
import { useState } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { GameEmptySudokuStringConstant } from '../constant/empty-sudoku-string.constant';
import {
    gameCandidatesSelector,
    gameDifficultySelector,
    gameInputModeSelector,
    gameMistakesSelector,
    gameShowAutoCandidatesSelector,
    gameSudokuStringSelector
} from '../store/game.selectors';

import type { OnEventFn } from '@rnw-community/shared';
import type { Dispatch, SetStateAction } from 'react';

export const useGameEngineState = (onInvalidState: OnEventFn<unknown>): [FieldEngine, Dispatch<SetStateAction<FieldEngine>>] => {
    const sudokuString = useAppSelector(gameSudokuStringSelector);
    const difficulty = useAppSelector(gameDifficultySelector);
    const candidates = useAppSelector(gameCandidatesSelector);
    const inputMode = useAppSelector(gameInputModeSelector);
    const showAutoCandidates = useAppSelector(gameShowAutoCandidatesSelector);
    const mistakes = useAppSelector(gameMistakesSelector);

    return useState(() => {
        if (isNotEmptyString(sudokuString)) {
            try {
                return new FieldEngine({ sudokuString, difficulty, candidates, inputMode, showAutoCandidates, mistakes });
            } catch (error: unknown) {
                onInvalidState(error);
            }
        }

        return new FieldEngine({ sudokuString: GameEmptySudokuStringConstant, difficulty });
    });
};
