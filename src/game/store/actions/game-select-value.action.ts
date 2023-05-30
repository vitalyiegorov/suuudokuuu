import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { isDefined } from '@rnw-community/shared';

import type { AppDispatch, RootState } from '../../../@app-root';
import { hapticImpact, hapticNotification } from '../../../@generic';
import { BlankCellValueConstant, MaxMistakesConstant, SudokuGame } from '../../../@logic';
import { gameFinishMoveAction, gameMadeAMistakeAction } from '../game.actions';

export const gameSelectValueAction = createAsyncThunk<boolean, number, { dispatch: AppDispatch; state: RootState }>(
    'game/selectValue',
    async (value: number, thunkAPI) => {
        const state = thunkAPI.getState().game;

        if (isDefined(state.selectedCell) && state.selectedCell.value === BlankCellValueConstant) {
            const cell = { ...state.selectedCell, value };

            if (SudokuGame.isCorrectValue(cell)) {
                thunkAPI.dispatch(gameFinishMoveAction(cell));

                await hapticNotification(Haptics.NotificationFeedbackType.Success);

                return true;
            }

            if (state.mistakes >= MaxMistakesConstant) {
                await hapticImpact(ImpactFeedbackStyle.Heavy);
            } else {
                thunkAPI.dispatch(gameMadeAMistakeAction());
                await hapticNotification(Haptics.NotificationFeedbackType.Error);
            }
        }

        return false;
    }
);
