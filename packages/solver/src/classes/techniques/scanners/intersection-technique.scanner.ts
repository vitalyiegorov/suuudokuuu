import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';

import { AbstractTechniqueScanner } from './abstract-technique.scanner';

import type { CandidateEliminationInterface } from '../../../interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueScannerInterface } from '../../../interfaces/technique-scanner.interface';
import type { LineType } from '../../../types/line.type';
import type { CandidateContext } from '../candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

export class IntersectionTechniqueScanner extends AbstractTechniqueScanner implements TechniqueScannerInterface {
    find(context: CandidateContext): TechniqueResultInterface[] {
        return [...this.findPointing(context), ...this.findBoxLineReductions(context)];
    }

    private findPointing(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const groupUnits = context.getUnits().filter(unit => unit.type === 'group');

        for (const groupUnit of groupUnits) {
            for (const value of context.getValues()) {
                const cells = groupUnit.cells.filter(cell => context.getCandidates(cell).includes(value));

                if (cells.length === 2 || cells.length === 3) {
                    const rowEliminations = this.getLineEliminations(context, cells, value, 'row');
                    const columnEliminations = this.getLineEliminations(context, cells, value, 'column');
                    const technique = cells.length === 2 ? SolutionTechniqueEnum.PointingPair : SolutionTechniqueEnum.PointingTriple;

                    results.push(...this.createEliminationResults(context, technique, rowEliminations, cells));
                    results.push(...this.createEliminationResults(context, technique, columnEliminations, cells));
                }
            }
        }

        return results;
    }

    private findBoxLineReductions(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const lineUnits = context.getUnits().filter(unit => unit.type !== 'group');

        for (const lineUnit of lineUnits) {
            for (const value of context.getValues()) {
                const cells = lineUnit.cells.filter(cell => context.getCandidates(cell).includes(value));
                const groupIndexes = this.getUniqueValues(cells.map(cell => cell.group));
                const [groupIndex] = groupIndexes;

                if (cells.length > 1 && groupIndexes.length === 1 && isDefined(groupIndex)) {
                    const eliminations = context
                        .getGroupCells({ group: groupIndex })
                        .filter(cell => !this.hasCell(cells, cell) && context.getCandidates(cell).includes(value))
                        .map(cell => ({ cell, value }));

                    results.push(...this.createEliminationResults(context, SolutionTechniqueEnum.BoxLineReduction, eliminations, cells));
                }
            }
        }

        return results;
    }

    private getLineEliminations(
        context: CandidateContext,
        cells: CellInterface[],
        value: number,
        lineType: LineType
    ): CandidateEliminationInterface[] {
        const indexes = this.getUniqueValues(cells.map(cell => (lineType === 'row' ? cell.y : cell.x)));
        const [index] = indexes;

        if (indexes.length !== 1 || !isDefined(index)) {
            return [];
        }

        const [firstCell] = cells;

        if (!isDefined(firstCell)) {
            return [];
        }

        const { group } = firstCell;
        const lineCells = lineType === 'row' ? context.getRowCells(index) : context.getColumnCells(index);

        return lineCells.filter(cell => cell.group !== group && context.getCandidates(cell).includes(value)).map(cell => ({ cell, value }));
    }

    private hasCell(cells: CellInterface[], cell: CellInterface): boolean {
        return cells.some(currentCell => currentCell.x === cell.x && currentCell.y === cell.y);
    }
}
