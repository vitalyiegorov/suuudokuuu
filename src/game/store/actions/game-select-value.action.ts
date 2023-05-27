import { createAsyncThunk } from '@reduxjs/toolkit';
import { isDefined } from '@rnw-community/shared';
import * as Haptics from 'expo-haptics';

import { type AppDispatch, type RootState } from '../../../@app-root';
import { hapticNotification } from '../../../@generic';
import { historyRecordAction } from '../../../history/store/history.actions';
import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';
import { calculateScore } from '../../utils/calculate-score.util';
import { hasBlankCells } from '../../utils/field/has-blank-cells.util';
import { gameFinishAction, gameIncreaseScoreAction, gameMadeAMistakeAction, gameSetValueAction } from '../game.actions';

export const gameSelectValueAction = createAsyncThunk<boolean, number, { dispatch: AppDispatch; state: RootState }>(
    'game/selectValue',
    async (value: number, thunkAPI) => {
        const state = thunkAPI.getState().game;

        if (isDefined(state.selectedCell) && state.selectedCell.value === BlankCellValueConstant) {
            const newCell = { ...state.selectedCell, value };
            if (state.filledField[newCell.y][newCell.x].value === value) {
                thunkAPI.dispatch(gameSetValueAction(newCell));

                await hapticNotification(Haptics.NotificationFeedbackType.Success);

                // TODO: Is this is ok to get new state like this
                const newState = thunkAPI.getState().game;
                thunkAPI.dispatch(
                    gameIncreaseScoreAction(calculateScore(newState.filledField, state.selectedCell, newState.mistakes, newState.startedAt))
                );
                thunkAPI.dispatch(gameFinishAction());

                if (!hasBlankCells(newState.gameField)[0]) {
                    thunkAPI.dispatch(historyRecordAction(newState));
                }

                return true;
            } else {
                thunkAPI.dispatch(gameMadeAMistakeAction());
                await hapticNotification(Haptics.NotificationFeedbackType.Error);
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        }

        return true;
    }
);
