import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { FieldSizeConstant } from '../../constants/field.constant';
import { type DifficultyEnum, difficultyValues } from '../../enums/difficulty.enum';
import { type CellInterface } from '../../interfaces/cell.interface';
import { createField } from '../../utils/field/create-field.util';
import { createGameField } from '../../utils/field/create-game-field.util';
import { resetGameState } from '../../utils/game/reset-game-state.util';

import { appRootInitialState } from './app-root.state';

export const appRootSlice = createSlice({
    name: 'appRoot',
    initialState: appRootInitialState,
    reducers: {
        load: (state, action: PayloadAction<DifficultyEnum>) => {
            const blankCellsCount = difficultyValues[action.payload];

            state.filledField = createField(FieldSizeConstant);
            state.gameField = createGameField(state.filledField, blankCellsCount);
            state.startedAt = new Date();
            state.difficulty = action.payload;
        },
        finish: state => {
            state.endedAt = new Date();
        },
        reset: state => {
            Object.assign(state, resetGameState(state));
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
        }
    }
});
