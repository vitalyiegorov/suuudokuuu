import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import type { CandidateContext } from './candidate-context/candidate-context';
import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export abstract class AbstractTechnique {
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
    }

    protected getCommonPeerEliminations(
        context: CandidateContext,
        cells: CellInterface[],
        value: number,
        reasonCells: CellInterface[]
    ): CandidateEliminationInterface[] {
        return context
            .getCommonPeers(cells)
            .filter(cell => !reasonCells.some(reasonCell => this.isSameCell(reasonCell, cell)))
            .filter(cell => context.getCandidates(cell).includes(value))
            .map(cell => ({ cell, value }));
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

    protected isSameCell(cell: CellInterface, otherCell: CellInterface): boolean {
        return cell.x === otherCell.x && cell.y === otherCell.y;
    }
}
