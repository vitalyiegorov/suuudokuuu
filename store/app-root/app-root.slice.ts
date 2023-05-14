import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type CellInterface } from '../../interfaces/cell.interface';
import { createField } from '../../utils/create-field.util';
import { createGameField } from '../../utils/create-game-field.util';

import { appRootInitialState } from './app-root.state';

export const appRootSlice = createSlice({
    name: 'counter',
    initialState: appRootInitialState,
    reducers: {
        load: state => {
            state.filledField = createField(9);
            state.gameField = createGameField(state.filledField, 40);
        },
        selectCell: (state, action: PayloadAction<CellInterface | undefined>) => {
            state.selectedCell = action.payload;
        }
    }
});
