import { appRootSlice } from './app-root.slice';

export const {
    load: appRootLoadAction,
    selectCell: appRootSelectCellAction,
    setValue: appRootSetValueAction,
    madeAMistake: appRootMadeAMistake,
    finish: appRootFinishAction,
    increaseScore: appRootIncreaseScoreAction
} = appRootSlice.actions;
