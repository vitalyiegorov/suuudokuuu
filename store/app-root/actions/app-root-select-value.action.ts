import { createAsyncThunk } from '@reduxjs/toolkit';
import { isDefined } from '@rnw-community/shared';
import * as Haptics from 'expo-haptics';

import { BlankCellValueConstant } from '../../../constants/blank-cell-value.constant';
import { hasBlankCells } from '../../../utils/field/has-blank-cells.util';
import { calculateScore } from '../../../utils/game/calculate-score.util';
import { hapticNotification } from '../../../utils/haptic.utils';
import { type AppDispatch, type RootState } from '../../app.store';
import { historyRecordAction } from '../../history/history.actions';
import { appRootIncreaseScoreAction, appRootMadeAMistake, appRootSetValueAction } from '../app-root.actions';

export const appRootSelectValueAction = createAsyncThunk<boolean, number, { dispatch: AppDispatch; state: RootState }>(
    'appRoot/selectValue',
    async (value: number, thunkAPI) => {
        const state = thunkAPI.getState().appRoot;

        if (isDefined(state.selectedCell) && state.selectedCell.value === BlankCellValueConstant) {
            const newCell = { ...state.selectedCell, value };
            if (state.filledField[newCell.y][newCell.x].value === value) {
                thunkAPI.dispatch(appRootSetValueAction(newCell));

                await hapticNotification(Haptics.NotificationFeedbackType.Success);

                thunkAPI.dispatch(
                    appRootIncreaseScoreAction(calculateScore(state.filledField, state.selectedCell, state.mistakes, state.startedAt))
                );

                // TODO: This needs improvement
                const newState = thunkAPI.getState().appRoot;
                if (!hasBlankCells(newState.gameField)[0]) {
                    thunkAPI.dispatch(historyRecordAction({ ...newState, endedAt: new Date() }));
                }

                return true;
            } else {
                thunkAPI.dispatch(appRootMadeAMistake());
                await hapticNotification(Haptics.NotificationFeedbackType.Error);
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        }

        return true;
    }
);
