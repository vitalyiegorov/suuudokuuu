import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { isDefined } from '@rnw-community/shared';

import { type CellInterface } from '../../interfaces/cell.interface';
import { createField } from '../../utils/create-field.util';
import { createGameField } from '../../utils/create-game-field.util';
import { isCorrectCell } from '../../utils/is-correct-cell.util';

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
        selectValue: (state, action: PayloadAction<number>) => {
            if (isDefined(state.selectedCell)) {
                if (isCorrectCell({ ...state.selectedCell, value: action.payload }, state.gameField)) {
                    state.gameField[state.selectedCell.x][state.selectedCell.y].value = action.payload;
                    state.selectedCell = state.gameField[state.selectedCell.x][state.selectedCell.y];
                }
            }
        }
    }
});
