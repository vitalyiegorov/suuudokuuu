import { FieldEngine } from '@suuudokuuu/field-core';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { createContext } from 'react';

import { emptyFn } from '@rnw-community/shared';

import { GameEmptySudokuStringConstant } from '../constant/empty-sudoku-string.constant';

import type { GameContextValueInterface } from '../interface/game-context-value.interface';

const emptyEngine = new FieldEngine({ sudokuString: GameEmptySudokuStringConstant, difficulty: DifficultyEnum.Newbie });

export const GameContext = createContext<GameContextValueInterface>({
    create: emptyFn,
    createDaily: emptyFn,
    createFromState: emptyFn,
    engine: emptyEngine,
    isCreatingGame: false,
    snapshot: emptyEngine.getSnapshot()
});
