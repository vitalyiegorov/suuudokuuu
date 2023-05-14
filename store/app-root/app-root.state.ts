import { type CellInterface } from '../../interfaces/cell.interface';

export interface AppRootState {
    field: CellInterface[][];
    selectedCell?: CellInterface;
}

export const appRootInitialState: AppRootState = {
    field: []
};
