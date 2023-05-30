import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type DifficultyEnum } from '../../@generic';
import { SudokuGame } from '../../@logic';
import { type CellInterface, type ScoredCellsInterface } from '../../@logic';
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
        setValue: (state, action: PayloadAction<CellInterface>) => {
            state.field[action.payload.y][action.payload.x] = action.payload;
            state.endedAt = new Date();
        },
        reset: state => {
            Object.assign(state, emptyGame);
        },
        selectCell: (state, action: PayloadAction<CellInterface | undefined>) => {
            state.selectedCell = action.payload;
        },
        increaseScore: (state, action: PayloadAction<number>) => {
            state.score += action.payload;
        },
        madeAMistake: state => {
            state.mistakes++;
        },
        setScoredCells: (state, action: PayloadAction<ScoredCellsInterface>) => {
            state.scoredCells = action.payload;
        }
    }
});
