import { appRootSlice } from './app-root.slice';

export const {
    load: appRootLoadAction,
    selectCell: appRootSelectCellAction,
    setValue: appRootSetValueAction,
    madeAMistake: appRootMadeAMistakeAction,
    finish: appRootFinishAction,
    reset: appRootResetAction,
    increaseScore: appRootIncreaseScoreAction
} = appRootSlice.actions;
