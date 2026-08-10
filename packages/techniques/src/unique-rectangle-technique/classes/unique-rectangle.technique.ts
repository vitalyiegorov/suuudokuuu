import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCombinations } from '../../@generic/utils/get-combinations.util';
import { hasSameCandidates } from '../../@generic/utils/has-same-candidates.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const uniqueRectangleSideCount = 2;
const uniqueRectangleGroupCount = 2;
const uniqueRectangleFloorCandidateCount = 2;

export class UniqueRectangleTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.UniqueRectangle;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const units = context.getUnits();
        const rows = units.filter(unit => unit.type === 'row').map(unit => unit.cells);
        const columnIndexes = units.filter(unit => unit.type === 'column').map(unit => unit.index);

        for (const [firstRow, secondRow] of getCombinations(rows, uniqueRectangleSideCount)) {
            for (const [firstColumnIndex, secondColumnIndex] of getCombinations(columnIndexes, uniqueRectangleSideCount)) {
                const corners = [
                    firstRow[firstColumnIndex],
                    firstRow[secondColumnIndex],
                    secondRow[firstColumnIndex],
                    secondRow[secondColumnIndex]
                ];

                results.push(...this.findRectangleResults(context, corners));
            }
        }

        return results;
    }

    private findRectangleResults(context: CandidateContext, corners: CellInterface[]): TechniqueResultInterface[] {
        if (!this.isDeadlyPatternShape(context, corners)) {
            return [];
        }

        const results: TechniqueResultInterface[] = [];

        for (const roofCell of corners) {
            const floorCells = corners.filter(corner => !isSameCell(corner, roofCell));
            const floorValues = this.getFloorValues(context, floorCells);

            if (isDefined(floorValues) && this.hasExtraCandidates(context, roofCell, floorValues)) {
                const eliminations = floorValues.map(value => ({ cell: roofCell, value }));

                results.push(...createEliminationResults(this.technique, eliminations, floorCells));
            }
        }

        return results;
    }

    private isDeadlyPatternShape(context: CandidateContext, corners: CellInterface[]): boolean {
        const groupIndexes = new Set(corners.map(corner => corner.group));

        return groupIndexes.size === uniqueRectangleGroupCount && corners.every(corner => context.isBlankCell(corner));
    }

    private getFloorValues(context: CandidateContext, floorCells: CellInterface[]): number[] | null {
        const [firstFloorCell] = floorCells;

        if (!isDefined(firstFloorCell)) {
            return null;
        }

        const floorValues = context.getCandidates(firstFloorCell);
        const hasIdenticalPair =
            floorValues.length === uniqueRectangleFloorCandidateCount &&
            floorCells.every(floorCell => hasSameCandidates(context.getCandidates(floorCell), floorValues));

        return hasIdenticalPair ? [...floorValues] : null;
    }

    private hasExtraCandidates(context: CandidateContext, roofCell: CellInterface, floorValues: number[]): boolean {
        const roofCandidates = context.getCandidates(roofCell);

        return roofCandidates.length > floorValues.length && floorValues.every(value => roofCandidates.includes(value));
    }
}
