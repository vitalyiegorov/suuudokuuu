import { gameSlice } from './game.slice';

export const {
    load: gameLoadAction,
    selectCell: gameSelectCellAction,
    setValue: gameSetValueAction,
    madeAMistake: gameMadeAMistakeAction,
    finish: gameFinishAction,
    reset: gameResetAction,
    increaseScore: gameIncreaseScoreAction,
    setScoredCells: gameSetScoredCellsAction
} = gameSlice.actions;
