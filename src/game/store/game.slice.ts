import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type DifficultyEnum, difficultyValues } from '../../@generic';
import { FieldSizeConstant } from '../constants/field.constant';
import { type CellInterface } from '../interfaces/cell.interface';
import { emptyGame } from '../interfaces/game.interface';
import { createField } from '../utils/field/create-field.util';
import { createGameField } from '../utils/field/create-game-field.util';

import { gameInitialState } from './game.state';

export const gameSlice = createSlice({
    name: 'game',
    initialState: gameInitialState,
    reducers: {
        load: (state, action: PayloadAction<DifficultyEnum>) => {
            const blankCellsCount = difficultyValues[action.payload];

            Object.assign(state, emptyGame);

            state.filledField = createField(FieldSizeConstant);
            state.gameField = createGameField(state.filledField, blankCellsCount);
            state.startedAt = new Date();
            state.difficulty = action.payload;
        },
        finish: state => {
            state.endedAt = new Date();
        },
        reset: state => {
            Object.assign(state, emptyGame);
        },
        selectCell: (state, action: PayloadAction<CellInterface | undefined>) => {
            state.selectedCell = action.payload;
        },
        setValue: (state, action: PayloadAction<CellInterface>) => {
            const cell = action.payload;
            state.selectedCell = state.gameField[cell.y][cell.x];
            state.gameField[cell.y][cell.x].value = cell.value;
        },
        increaseScore: (state, action: PayloadAction<number>) => {
            state.score += action.payload;
        },
        madeAMistake: state => {
            state.mistakes++;
        },
        setScoredCells: (state, action: PayloadAction<CellInterface>) => {
            state.scoredCells = action.payload;
        }
    }
});
