import { createAsyncThunk } from '@reduxjs/toolkit';
import { isDefined } from '@rnw-community/shared';
import * as Haptics from 'expo-haptics';

import { BlankCellValueConstant } from '../../../constants/blank-cell-value.constant';
import { type AppDispatch, type RootState } from '../../create-store';
import { appRootMadeAMistake, appRootSetValueAction } from '../app-root.actions';

export const appRootSelectValueAction = createAsyncThunk<boolean, number, { dispatch: AppDispatch; state: RootState }>(
    'appRoot/selectValue',
    async (value: number, thunkAPI) => {
        const state = thunkAPI.getState().appRoot;

        if (isDefined(state.selectedCell) && state.selectedCell.value === BlankCellValueConstant) {
            const newCell = { ...state.selectedCell, value };
            if (state.filledField[newCell.y][newCell.x].value === value) {
                thunkAPI.dispatch(appRootSetValueAction(newCell));

                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

                return true;
            } else {
                thunkAPI.dispatch(appRootMadeAMistake());
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        }

        return true;
    }
);
