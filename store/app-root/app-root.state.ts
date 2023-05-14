import { type CellInterface } from '../../interfaces/cell.interface';

export interface AppRootState {
    filledField: CellInterface[][];
    gameField: CellInterface[][];
    selectedCell?: CellInterface;
}

export const appRootInitialState: AppRootState = {
    filledField: [],
    gameField: []
};
