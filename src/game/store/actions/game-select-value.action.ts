import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { isDefined } from '@rnw-community/shared';

import type { AppDispatch, RootState } from '../../../@app-root';
import { hapticImpact, hapticNotification } from '../../../@generic';
import { SudokuGame } from '../../../@logic';
import { BlankCellValueConstant } from '../../../@logic/constants/blank-cell-value.constant';
import { MaxMistakesConstant } from '../../../@logic/constants/max-mistakes.constant';
import { calculateScore } from '../../../@logic/utils/calculate-score.util';
import { gameIncreaseScoreAction, gameMadeAMistakeAction, gameSetScoredCellsAction, gameSetValueAction } from '../game.actions';

export const gameSelectValueAction = createAsyncThunk<boolean, number, { dispatch: AppDispatch; state: RootState }>(
    'game/selectValue',
    async (value: number, thunkAPI) => {
        const state = thunkAPI.getState().game;

        if (isDefined(state.selectedCell) && state.selectedCell.value === BlankCellValueConstant) {
            const cell = { ...state.selectedCell, value };

            try {
                const scoredCells = SudokuGame.setCellValue(cell.y, cell.x, cell.value);
                await hapticNotification(Haptics.NotificationFeedbackType.Success);
                // TODO: Move score calculation to logic
                const score = calculateScore(SudokuGame.Field, state.selectedCell, state.mistakes, state.startedAt);

                thunkAPI.dispatch(gameSetValueAction(cell));
                thunkAPI.dispatch(gameIncreaseScoreAction(score));
                thunkAPI.dispatch(gameSetScoredCellsAction(scoredCells));

                return true;
            } catch (e) {
                await hapticNotification(Haptics.NotificationFeedbackType.Error);

                if (state.mistakes >= MaxMistakesConstant) {
                    await hapticImpact(ImpactFeedbackStyle.Heavy);
                } else {
                    thunkAPI.dispatch(gameMadeAMistakeAction());
                }
            }
        }

        return false;
    }
);
