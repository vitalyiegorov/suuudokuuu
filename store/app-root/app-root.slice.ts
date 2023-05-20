import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type DifficultyEnum, difficultyValues } from '../../enums/difficulty.enum';
import { type CellInterface } from '../../interfaces/cell.interface';
import { createField } from '../../utils/field/create-field.util';
import { createGameField } from '../../utils/field/create-game-field.util';

import { appRootInitialState } from './app-root.state';

export const appRootSlice = createSlice({
    name: 'counter',
    initialState: appRootInitialState,
    reducers: {
        load: (state, action: PayloadAction<DifficultyEnum>) => {
            const blankCellsCount = difficultyValues[action.payload];

            state.filledField = createField(9);
            state.gameField = createGameField(state.filledField, blankCellsCount);
        },
        selectCell: (state, action: PayloadAction<CellInterface | undefined>) => {
            state.selectedCell = action.payload;
        },
        setValue: (state, action: PayloadAction<CellInterface>) => {
            const cell = action.payload;
            state.selectedCell = state.gameField[cell.y][cell.x];
            state.gameField[cell.y][cell.x].value = cell.value;
        }
    }
});
