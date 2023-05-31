import { gameSlice } from './game.slice';

export const { start: gameStartAction, save: gameSaveAction, reset: gameResetAction } = gameSlice.actions;
