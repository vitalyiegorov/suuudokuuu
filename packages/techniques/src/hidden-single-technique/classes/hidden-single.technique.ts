import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createPlacementResult } from '../../@generic/utils/create-placement-result.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const seesCell = (cell: CellInterface, otherCell: CellInterface): boolean =>
    cell.x === otherCell.x || cell.y === otherCell.y || cell.group === otherCell.group;

const countSeenCells = (cell: CellInterface, cells: readonly CellInterface[]): number =>
    cells.filter(otherCell => seesCell(cell, otherCell)).length;

const findBlockingCells = (filledCells: readonly CellInterface[], blockedCells: readonly CellInterface[]): CellInterface[] => {
    const [blockingCell] = [...filledCells].sort(
        (firstCell, secondCell) => countSeenCells(secondCell, blockedCells) - countSeenCells(firstCell, blockedCells)
    );

    if (!isDefined(blockingCell) || countSeenCells(blockingCell, blockedCells) === 0) {
        return [];
    }

    return [
        blockingCell,
        ...findBlockingCells(
            filledCells,
            blockedCells.filter(cell => !seesCell(blockingCell, cell))
        )
    ];
};

export class HiddenSingleTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.HiddenSingle;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const unit of context.getUnits()) {
            for (const value of context.getValues()) {
                const cellsWithCandidate = unit.cells.filter(cell => context.getCandidates(cell).includes(value));
                const [targetCell] = cellsWithCandidate;

                if (cellsWithCandidate.length === 1 && isDefined(targetCell) && context.getCandidates(targetCell).length > 1) {
                    const filledCells = context.getCells().filter(cell => cell.value === value);
                    const blockedCells = unit.cells.filter(cell => context.isBlankCell(cell) && !isSameCell(cell, targetCell));

                    results.push({
                        ...createPlacementResult(this.technique, targetCell, value, unit.cells),
                        blockingCells: findBlockingCells(filledCells, blockedCells)
                    });
                }
            }
        }

        return results;
    }
}
