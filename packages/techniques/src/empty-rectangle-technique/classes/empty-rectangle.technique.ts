import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { getContextUnitValueIndex } from '../../@generic/utils/context-scan-state.util';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getUniqueValues } from '../../@generic/utils/get-unique-values.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { UnitValueIndex } from '../../@generic/classes/unit-value-index/unit-value-index';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { LineType } from '../../@generic/types/line.type';
import type { CellInterface } from '@suuudokuuu/generator';

interface EmptyRectangleInterface {
    readonly value: number;
    readonly row: number;
    readonly column: number;
    readonly boxCells: readonly CellInterface[];
}

const isOnHingeLines = (cell: CellInterface, row: number, column: number): boolean => cell.y === row || cell.x === column;

export class EmptyRectangleTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.EmptyRectangle;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const index = getContextUnitValueIndex(context);
        const results: TechniqueResultInterface[] = [];

        const boxPositions = index.units.flatMap((unit, unitPosition) => (unit.type === 'group' ? [unitPosition] : []));

        for (const boxPosition of boxPositions) {
            for (const value of context.getValues()) {
                for (const rectangle of this.findBoxRectangles(index.getUnitValueEntry(boxPosition, value).cells, value)) {
                    results.push(
                        ...this.findLinkResults(context, index, rectangle, 'column'),
                        ...this.findLinkResults(context, index, rectangle, 'row')
                    );
                }
            }
        }

        return results;
    }

    private findBoxRectangles(boxCells: readonly CellInterface[], value: number): EmptyRectangleInterface[] {
        const rectangles: EmptyRectangleInterface[] = [];

        for (const row of getUniqueValues(boxCells.map(cell => cell.y))) {
            for (const column of getUniqueValues(boxCells.map(cell => cell.x))) {
                const hasRowArm = boxCells.some(cell => cell.y === row && cell.x !== column);
                const hasColumnArm = boxCells.some(cell => cell.x === column && cell.y !== row);

                if (hasRowArm && hasColumnArm && boxCells.every(cell => isOnHingeLines(cell, row, column))) {
                    rectangles.push({ value, row, column, boxCells });
                }
            }
        }

        return rectangles;
    }

    private findLinkResults(
        context: CandidateContext,
        index: UnitValueIndex,
        rectangle: EmptyRectangleInterface,
        lineType: LineType
    ): TechniqueResultInterface[] {
        const [boxCell] = rectangle.boxCells;
        const isColumnLink = lineType === 'column';
        const crossedLine = isColumnLink ? rectangle.row : rectangle.column;
        const results: TechniqueResultInterface[] = [];

        for (const linePosition of index.getLineUnitPositions(lineType)) {
            const linkCells = index.getUnitValueEntry(linePosition, rectangle.value).cells;
            const nearCell = linkCells.find(cell => (isColumnLink ? cell.y : cell.x) === crossedLine);
            const farCell = linkCells.find(cell => cell !== nearCell);

            if (linkCells.length === 2 && isDefined(nearCell) && isDefined(farCell) && nearCell.group !== boxCell.group) {
                const target = isColumnLink
                    ? context.getRowCells(farCell.y)[rectangle.column]
                    : context.getRowCells(rectangle.row)[farCell.x];
                const eliminations =
                    target.group !== boxCell.group && context.getCandidates(target).includes(rectangle.value)
                        ? [{ cell: target, value: rectangle.value }]
                        : [];

                results.push(...createEliminationResults(this.technique, eliminations, [...rectangle.boxCells, nearCell, farCell]));
            }
        }

        return results;
    }
}
