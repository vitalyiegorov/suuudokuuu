import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type CellInterface } from '../../interfaces/cell.interface';
import { createField } from '../../utils/field/create-field.util';
import { createGameField } from '../../utils/field/create-game-field.util';

import { appRootInitialState } from './app-root.state';

export const appRootSlice = createSlice({
    name: 'counter',
    initialState: appRootInitialState,
    reducers: {
        load: state => {
            state.filledField = createField(9);
            state.gameField = createGameField(state.filledField, 60);
        },
        selectCell: (state, action: PayloadAction<CellInterface | undefined>) => {
            state.selectedCell = action.payload;
        },
        setValue: (state, action: PayloadAction<CellInterface>) => {
            const cell = action.payload;
            state.selectedCell = state.gameField[cell.x][cell.y];
            state.gameField[cell.x][cell.y].value = cell.value;
        }
    }
});
