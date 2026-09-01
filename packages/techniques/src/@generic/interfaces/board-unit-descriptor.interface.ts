import type { CandidateUnitTypeType } from '../types/candidate-unit-type.type';

export interface BoardUnitDescriptorInterface {
    type: CandidateUnitTypeType;
    index: number;
    cellIndexes: readonly number[];
}
