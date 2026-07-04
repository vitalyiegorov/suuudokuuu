import { isDefined } from '@rnw-community/shared';

import type { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import type { CandidateEliminationInterface } from '../../../interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { CandidateContext } from '../candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

export abstract class AbstractTechniqueScanner {
    protected createPlacement(
        technique: SolutionTechniqueEnum,
        cell: CellInterface,
        value: number,
        reasonCells: CellInterface[] = []
    ): TechniqueResultInterface {
        return {
            technique,
            cell,
            value,
            kind: 'placement',
            eliminations: [],
            reasonCells
        };
    }

    protected createEliminationResults(
        context: CandidateContext,
        technique: SolutionTechniqueEnum,
        eliminations: CandidateEliminationInterface[],
        reasonCells: CellInterface[] = []
    ): TechniqueResultInterface[] {
        const placementResults = context.getPlacementsFromEliminations(eliminations).map(placement => ({
            technique,
            cell: placement.cell,
            value: placement.value,
            kind: 'elimination' as const,
            eliminations,
            reasonCells
        }));

        if (placementResults.length > 0) {
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
    }

    protected getUniqueValues(values: number[]): number[] {
        return [...new Set(values)].sort((firstValue, secondValue) => firstValue - secondValue);
    }

    protected getCombinations<T>(items: T[], size: number): T[][] {
        if (size === 0) {
            return [[]];
        }

        if (items.length < size) {
            return [];
        }

        const combinations: T[][] = [];

        for (let index = 0; index <= items.length - size; index += 1) {
            const item = items[index];
            const remainingItems = items.slice(index + 1);

            for (const combination of this.getCombinations(remainingItems, size - 1)) {
                combinations.push([item, ...combination]);
            }
        }

        return combinations;
    }
}
