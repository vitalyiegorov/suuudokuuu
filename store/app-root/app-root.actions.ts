import { appRootSlice } from './app-root.slice';

export const {
    load: appRootLoadAction,
    selectCell: appRootSelectCellAction,
    setValue: appRootSetValueAction,
    madeAMistake: appRootMadeAMistake
} = appRootSlice.actions;
