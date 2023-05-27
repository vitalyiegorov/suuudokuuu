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

                // TODO: We should form winning state and store it
                const newState = thunkAPI.getState().game;
                const score = calculateScore(newState.filledField, state.selectedCell, state.mistakes, state.startedAt);

                await hapticNotification(Haptics.NotificationFeedbackType.Success);

                thunkAPI.dispatch(gameIncreaseScoreAction(score));
                thunkAPI.dispatch(gameFinishAction());

                const newState2 = thunkAPI.getState().game;
                if (!hasBlankCells(newState.gameField)[0]) {
                    thunkAPI.dispatch(historyRecordAction(newState2));
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
