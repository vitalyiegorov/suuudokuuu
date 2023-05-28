import { createAsyncThunk } from '@reduxjs/toolkit';
import { isDefined } from '@rnw-community/shared';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

import { type AppDispatch, type RootState } from '../../../@app-root';
import { hapticImpact, hapticNotification } from '../../../@generic';
import { historyRecordAction } from '../../../history';
import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';
import { MaxMistakesConstant } from '../../constants/max-mistakes.constant';
import { calculateScore } from '../../utils/calculate-score.util';
import { createCell } from '../../utils/create-cell.util';
import { hasBlankCells } from '../../utils/field/has-blank-cells.util';
import { hasValueInColumn } from '../../utils/field/has-value-in-column.util';
import { hasValueInGroup } from '../../utils/field/has-value-in-group.util';
import { hasValueInRow } from '../../utils/field/has-value-in-row.util';
import {
    gameFinishAction,
    gameIncreaseScoreAction,
    gameMadeAMistakeAction,
    gameSetScoredCellsAction,
    gameSetValueAction
} from '../game.actions';

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
                // TODO: We should not finish the game on each correct step
                thunkAPI.dispatch(gameFinishAction());

                const newState2 = thunkAPI.getState().game;

                const blankCell = { ...newCell, value: BlankCellValueConstant };
                const scoredCells = createCell(-1, -1, BlankCellValueConstant);
                if (!hasValueInColumn(blankCell, newState2.gameField)) {
                    scoredCells.x = blankCell.x;
                }
                if (!hasValueInRow(blankCell, newState2.gameField)) {
                    scoredCells.y = blankCell.y;
                }
                if (!hasValueInGroup(blankCell, newState2.gameField)) {
                    scoredCells.group = blankCell.group;
                }
                // TODO: Add win animation, probably lose animation?
                thunkAPI.dispatch(gameSetScoredCellsAction(scoredCells));

                if (!hasBlankCells(newState.gameField)[0]) {
                    await hapticImpact(ImpactFeedbackStyle.Heavy);
                    thunkAPI.dispatch(historyRecordAction(newState2));
                }

                return true;
            } else {
                thunkAPI.dispatch(gameMadeAMistakeAction());
                await hapticNotification(Haptics.NotificationFeedbackType.Error);
                if (state.mistakes >= MaxMistakesConstant) {
                    await hapticImpact(ImpactFeedbackStyle.Heavy);
                }
            }
        }

        return true;
    }
);
