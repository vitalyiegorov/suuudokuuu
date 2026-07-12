import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { createContext } from 'react';

import { emptyFn } from '@rnw-community/shared';

import type { GameContextValueInterface } from '../interface/game-context-value.interface';

export const GameContext = createContext<GameContextValueInterface>({
    create: emptyFn,
    createFromState: emptyFn,
    sudoku: new Sudoku(defaultSudokuConfig)
});
