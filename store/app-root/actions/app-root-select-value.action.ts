import { createAsyncThunk } from '@reduxjs/toolkit';
import { isDefined } from '@rnw-community/shared';

import { isCorrectCell } from '../../../utils/field/is-correct-cell.util';
import { type AppDispatch, type RootState } from '../../create-store';
import { appRootSetValueAction } from '../app-root.actions';

export const appRootSelectValueAction = createAsyncThunk<boolean, number, { dispatch: AppDispatch; state: RootState }>(
    'appRoot/selectValue',
    async (value: number, thunkAPI) => {
        const state = thunkAPI.getState().appRoot;

        if (isDefined(state.selectedCell)) {
            const newCell = { ...state.selectedCell, value };
            if (isCorrectCell(newCell, state.gameField)) {
                thunkAPI.dispatch(appRootSetValueAction(newCell));
                // TODO: Add logic for row animation
                // TODO: Add logic for column animation
                // TODO: Add logic for group animation
                // TODO: Add score logic

                return true;
            } else {
                // TODO: Add logic for mistake and game over
            }
        }

        return false;
    }
);
