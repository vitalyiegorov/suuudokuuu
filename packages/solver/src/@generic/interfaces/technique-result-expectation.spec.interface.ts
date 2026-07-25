import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import type { CandidateCoordinateSpecType } from '../types/candidate-coordinate.spec.type';

export interface TechniqueResultExpectationInterface {
    technique: SolutionTechniqueEnum;
    kind: 'placement' | 'elimination' | 'guess';
    result: CandidateCoordinateSpecType;
    eliminations: CandidateCoordinateSpecType[];
    reasonCells: [number, number][];
}
