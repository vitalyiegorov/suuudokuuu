import { FieldEngine } from '@suuudokuuu/field-core';
import { useState } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { GameEmptySudokuStringConstant } from '../constant/empty-sudoku-string.constant';
import { useCurrentRun } from '../query/use-current-run.query';
import { gameCreateEngine } from '../utils/game-create-engine.util';

import type { OnEventFn } from '@rnw-community/shared';
import type { Dispatch, SetStateAction } from 'react';

export const useGameEngineState = (onInvalidState: OnEventFn<unknown>): [FieldEngine, Dispatch<SetStateAction<FieldEngine>>] => {
    const currentRun = useCurrentRun();
    const { difficulty, sudokuString } = currentRun;

    return useState(() => {
        if (isNotEmptyString(sudokuString)) {
            try {
                return gameCreateEngine(currentRun);
            } catch (error: unknown) {
                onInvalidState(error);
            }
        }

        return new FieldEngine({ sudokuString: GameEmptySudokuStringConstant, difficulty });
    });
};
