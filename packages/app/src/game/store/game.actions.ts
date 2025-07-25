import { gameSlice } from './game.slice';

export const gameStartAction = gameSlice.actions.start;
export const gameSaveAction = gameSlice.actions.save;
export const gameLoadAction = gameSlice.actions.load;
export const gameResetAction = gameSlice.actions.reset;
export const gamePauseAction = gameSlice.actions.pause;
export const gameResumeAction = gameSlice.actions.resume;
export const gameTickAction = gameSlice.actions.tick;
export const gameToggleCandidatesAction = gameSlice.actions.toggleCandidates;
