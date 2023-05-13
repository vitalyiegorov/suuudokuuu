import { type CellValueType } from './cell-value.type';

export interface CellInterface {
    x: number;
    y: number;
    value: CellValueType;
    group: CellValueType;
}
