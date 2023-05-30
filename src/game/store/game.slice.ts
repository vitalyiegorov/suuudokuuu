import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { DifficultyEnum } from '../../@generic';
import type { CellInterface } from '../../@logic';
import { SudokuGame, calculateScore } from '../../@logic';
import { emptyGame } from '../interfaces/game.interface';

import { initialGameState } from './game.state';

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        start: (state, action: PayloadAction<DifficultyEnum>) => {
            Object.assign(state, initialGameState);
            SudokuGame.create(action.payload);

            state.field = SudokuGame.Field;
            state.fullField = SudokuGame.FullField;
            state.possibleValues = SudokuGame.PossibleValues;
            state.availableValues = SudokuGame.AvailableValues;
            state.startedAt = new Date();
            state.difficulty = action.payload;
        },
        finishMove: (state, action: PayloadAction<CellInterface>) => {
            state.scoredCells = SudokuGame.setCellValue(action.payload);
            state.field = SudokuGame.Field;
            state.possibleValues = SudokuGame.PossibleValues;
            state.availableValues = SudokuGame.AvailableValues;
            // TODO: Move score calculation to logic, improve logic
            state.score += calculateScore(SudokuGame.Field, action.payload, state.mistakes, state.startedAt);
            state.endedAt = new Date();

            // HINT: We reselect cell if there are values left, otherwise loose focus
            if (state.possibleValues.includes(action.payload.value)) {
                state.selectedCell = state.field[action.payload.y][action.payload.x];
            } else {
                // eslint-disable-next-line no-undefined
                state.selectedCell = undefined;
            }
        },
        reset: state => {
            Object.assign(state, emptyGame);
        },
        selectCell: (state, action: PayloadAction<CellInterface | undefined>) => {
            state.selectedCell = action.payload;
        },
        madeAMistake: state => {
            state.mistakes += 1;
            state.endedAt = new Date();
        }
    }
});
