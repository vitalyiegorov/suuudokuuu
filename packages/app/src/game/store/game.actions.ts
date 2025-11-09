import { gameSlice } from './game.slice';

export const gameStartAction = gameSlice.actions.start;
export const gameSaveAction = gameSlice.actions.save;
export const gameLoadAction = gameSlice.actions.load;
export const gameResetAction = gameSlice.actions.reset;
export const gamePauseAction = gameSlice.actions.pause;
export const gameResumeAction = gameSlice.actions.resume;
export const gameTickAction = gameSlice.actions.tick;
export const gameMistakeAction = gameSlice.actions.mistake;
export const gameToggleAutoCandidatesAction = gameSlice.actions.toggleShowAutoCandidates;
export const gameToggleInputModeAction = gameSlice.actions.toggleInputMode;
export const gameToggleCellCandidateAction = gameSlice.actions.toggleCellCandidate;
export const gameClearCellCandidatesAction = gameSlice.actions.clearCellCandidates;
export const gameFinishAction = gameSlice.actions.finish;
