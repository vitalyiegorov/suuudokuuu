import { gameSlice } from './game.slice';

export const { start: gameLoadAction, move: gameMoveAction, reset: gameResetAction } = gameSlice.actions;
