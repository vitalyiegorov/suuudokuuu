import type { CandidateUnitTypeType } from '../types/candidate-unit-type.type';
import type { CellInterface } from '@suuudokuuu/generator';

export interface CandidateUnitInterface {
    readonly type: CandidateUnitTypeType;
    readonly index: number;
    readonly cells: CellInterface[];
}
