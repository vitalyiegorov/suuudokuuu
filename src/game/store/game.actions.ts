import { gameSlice } from './game.slice';

export const {
    start: gameLoadAction,
    selectCell: gameSelectCellAction,
    setValue: gameSetValueAction,
    madeAMistake: gameMadeAMistakeAction,
    reset: gameResetAction,
    increaseScore: gameIncreaseScoreAction
} = gameSlice.actions;
