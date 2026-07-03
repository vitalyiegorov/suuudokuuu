import type { CellInterface } from './cell.interface';
import type { CandidateUnitTypeType } from '../types/candidate-unit-type.type';

export interface CandidateUnitInterface {
    type: CandidateUnitTypeType;
    index: number;
    cells: CellInterface[];
}
