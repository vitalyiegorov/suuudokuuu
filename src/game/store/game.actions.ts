import { gameSlice } from './game.slice';

export const {
    start: gameLoadAction,
    selectCell: gameSelectCellAction,
    finishMove: gameFinishMoveAction,
    madeAMistake: gameMadeAMistakeAction,
    reset: gameResetAction
} = gameSlice.actions;
