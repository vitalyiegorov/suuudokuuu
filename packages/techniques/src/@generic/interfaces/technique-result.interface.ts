import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import type { TechniqueResultKindType } from '../types/technique-result-kind.type';
import type { CandidateEliminationInterface } from './candidate-elimination.interface';
import type { ChainCandidateInterface } from './chain-candidate.interface';
import type { ForcingBranchInterface } from './forcing-branch.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export interface TechniqueResultInterface {
    readonly technique: SolutionTechniqueEnum;
    readonly cell: CellInterface;
    readonly value: number;
    readonly kind: TechniqueResultKindType;
    readonly eliminations: CandidateEliminationInterface[];
    readonly reasonCells: CellInterface[];
    readonly blockingCells?: readonly CellInterface[];
    readonly unitCells?: readonly CellInterface[];
    readonly chainLength?: number;
    readonly patternCandidates?: readonly CandidateEliminationInterface[];
    readonly chain?: readonly ChainCandidateInterface[];
    readonly branches?: readonly ForcingBranchInterface[];
}
