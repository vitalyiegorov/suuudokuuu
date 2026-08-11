import type { FieldCandidatesType } from '../types/field-candidates.type';

export interface FieldCandidateStateInterface {
    candidates: FieldCandidatesType;
    eliminatedCandidates: FieldCandidatesType;
}
