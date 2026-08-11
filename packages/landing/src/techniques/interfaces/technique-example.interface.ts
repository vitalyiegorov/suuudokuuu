import type { TechniqueExampleCandidateInterface } from './technique-example-candidate.interface';
import type { TechniqueExampleRowInterface } from './technique-example-row.interface';

export interface TechniqueExampleInterface {
    rows: TechniqueExampleRowInterface[];
    patternCellLabels: string[];
    eliminations: TechniqueExampleCandidateInterface[];
    placement?: TechniqueExampleCandidateInterface;
}
