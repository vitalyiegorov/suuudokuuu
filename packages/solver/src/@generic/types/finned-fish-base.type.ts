import type { LineType } from './line.type';
import type { CandidateUnitInterface } from '../interfaces/candidate-unit.interface';

export type FinnedFishBaseType = {
    readonly units: CandidateUnitInterface[];
    readonly baseType: LineType;
    readonly coverType: LineType;
};
