import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type CellInterface } from '../../interfaces/cell.interface';
import { createField } from '../../utils/create-field.util';

import { appRootInitialState } from './app-root.state';

export const appRootSlice = createSlice({
    name: 'counter',
    initialState: appRootInitialState,
    reducers: {
        load: state => {
            state.field = createField(9);
        },
        selectCell: (state, action: PayloadAction<CellInterface | undefined>) => {
            state.selectedCell = action.payload;
        }
    }
});
