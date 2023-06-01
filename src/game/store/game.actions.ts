import { gameSlice } from './game.slice';

export const {
    start: gameStartAction,
    save: gameSaveAction,
    reset: gameResetAction,
    pause: gamePauseAction,
    resume: gameResumeAction,
    tick: gameTickAction
} = gameSlice.actions;
