import { FieldEngine } from '@suuudokuuu/field-core';
import * as Result from 'effect/Result';
import { useEffect, useRef, useState } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { GameEmptySudokuStringConstant } from '../constant/empty-sudoku-string.constant';
import { useCurrentRun } from '../query/use-current-run.query';
import { gameCreateEngine } from '../utils/game-create-engine.util';

import type { OnEventFn } from '@rnw-community/shared';
import type { Dispatch, SetStateAction } from 'react';

export const useGameEngineState = (onInvalidState: OnEventFn<unknown>): [FieldEngine, Dispatch<SetStateAction<FieldEngine>>] => {
    const currentRun = useCurrentRun();
    const { difficulty, sudokuString } = currentRun;
    const invalidStateHandlerRef = useRef(onInvalidState);
    const [initialEngine] = useState(() =>
        Result.try(() =>
            isNotEmptyString(sudokuString)
                ? gameCreateEngine(currentRun)
                : new FieldEngine({ sudokuString: GameEmptySudokuStringConstant, difficulty })
        )
    );
    const [engine, setEngine] = useState(() =>
        Result.getOrElse(initialEngine, () => new FieldEngine({ sudokuString: GameEmptySudokuStringConstant, difficulty }))
    );

    useEffect(() => {
        invalidStateHandlerRef.current = onInvalidState;
    }, [onInvalidState]);
    useEffect(() => {
        if (Result.isFailure(initialEngine)) {
            invalidStateHandlerRef.current(initialEngine.failure);
        }
    }, [initialEngine]);

    return [engine, setEngine];
};
