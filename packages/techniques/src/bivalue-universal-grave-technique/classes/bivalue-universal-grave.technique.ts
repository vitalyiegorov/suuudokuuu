import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createPlacementResult } from '../../@generic/utils/create-placement-result.util';
import { getUniqueCells } from '../../@generic/utils/get-unique-cells.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { CandidateUnitInterface } from '../../@generic/interfaces/candidate-unit.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const graveCandidateCount = 2;
const extraCellCandidateCount = 3;

export class BivalueUniversalGraveTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.BivalueUniversalGrave;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const extraCell = this.getExtraCell(context);

        if (!isDefined(extraCell)) {
            return [];
        }

        const value = context.getCandidates(extraCell).find(candidate => this.escapesGrave(context, extraCell, candidate));

        if (!isDefined(value)) {
            return [];
        }

        return [createPlacementResult(this.technique, extraCell, value, this.getReasonCells(context, extraCell, value))];
    }

    private getExtraCell(context: CandidateContext): CellInterface | null {
        const unfilledCells = context.getCells().filter(cell => context.isBlankCell(cell));
        const extraCells = unfilledCells.filter(cell => context.getCandidates(cell).length !== graveCandidateCount);
        const [extraCell] = extraCells;

        if (extraCells.length !== 1 || !isDefined(extraCell) || context.getCandidates(extraCell).length !== extraCellCandidateCount) {
            return null;
        }

        return extraCell;
    }

    private escapesGrave(context: CandidateContext, extraCell: CellInterface, value: number): boolean {
        return context.getUnits().every(unit => this.hasGraveCandidateCounts(context, unit, extraCell, value));
    }

    private hasGraveCandidateCounts(
        context: CandidateContext,
        unit: CandidateUnitInterface,
        extraCell: CellInterface,
        value: number
    ): boolean {
        const holdsExtraCell = unit.cells.some(cell => isSameCell(cell, extraCell));

        return context.getValues().every(candidate => {
            const candidateCount = unit.cells.filter(cell => context.getCandidates(cell).includes(candidate)).length;
            const graveCount = holdsExtraCell && candidate === value ? extraCellCandidateCount : graveCandidateCount;

            return candidateCount === 0 || candidateCount === graveCount;
        });
    }

    private getReasonCells(context: CandidateContext, extraCell: CellInterface, value: number): CellInterface[] {
        const unitCells = [
            ...context.getRowCells(extraCell.y),
            ...context.getColumnCells(extraCell.x),
            ...context.getGroupCells(extraCell)
        ];

        return getUniqueCells(unitCells.filter(cell => context.getCandidates(cell).includes(value)));
    }
}
