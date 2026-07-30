import type { CandidateUnitTypeType } from '../types/candidate-unit-type.type';
import type { CellInterface } from '@suuudokuuu/generator';

export interface CandidateUnitInterface {
    type: CandidateUnitTypeType;
    index: number;
    cells: CellInterface[];
}
