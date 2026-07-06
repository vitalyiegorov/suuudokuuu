import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export const createEliminationResults = (
    context: CandidateContext,
    technique: SolutionTechniqueEnum,
    eliminations: CandidateEliminationInterface[],
    reasonCells: CellInterface[]
): TechniqueResultInterface[] => {
    const placementResults = context.getPlacementsFromEliminations(eliminations).map(placement => ({
        technique,
        cell: placement.cell,
        value: placement.value,
        kind: 'elimination' as const,
        eliminations,
        reasonCells
    }));

    if (isNotEmptyArray(placementResults)) {
        return placementResults;
    }

    const [firstElimination] = eliminations;

    if (!isDefined(firstElimination)) {
        return [];
    }

    return [
        {
            technique,
            cell: firstElimination.cell,
            value: firstElimination.value,
            kind: 'elimination',
            eliminations,
            reasonCells
        }
    ];
};
