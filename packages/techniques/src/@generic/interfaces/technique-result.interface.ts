import type { CandidateEliminationInterface } from './candidate-elimination.interface';
import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import type { TechniqueResultKindType } from '../types/technique-result-kind.type';
import type { CellInterface } from '@suuudokuuu/generator';

export interface TechniqueResultInterface {
    technique: SolutionTechniqueEnum;
    cell: CellInterface;
    value: number;
    kind: TechniqueResultKindType;
    eliminations: CandidateEliminationInterface[];
    reasonCells: CellInterface[];
    chainLength?: number;
}
