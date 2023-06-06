import { gameSlice } from './game.slice';

export const {
    save: gameSaveAction,
    reset: gameResetAction,
    pause: gamePauseAction,
    resume: gameResumeAction,
    tick: gameTickAction
} = gameSlice.actions;
