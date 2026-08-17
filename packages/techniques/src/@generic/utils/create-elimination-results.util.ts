import { isPositiveNumber } from '@rnw-community/shared';

import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export const createEliminationResults = (
    technique: SolutionTechniqueEnum,
    eliminations: CandidateEliminationInterface[],
    reasonCells: CellInterface[],
    chainLength?: number
): TechniqueResultInterface[] => {
    if (eliminations.length === 0) {
        return [];
    }

    const [firstElimination] = eliminations;

    return [
        {
            technique,
            cell: firstElimination.cell,
            value: firstElimination.value,
            kind: 'elimination',
            eliminations,
            reasonCells,
            ...(isPositiveNumber(chainLength) && { chainLength })
        }
    ];
};
