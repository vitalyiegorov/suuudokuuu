import { isDefined } from '@rnw-community/shared';

import { AbstractTechnique } from './abstract-technique';

import type { CandidateContext } from './candidate-context/candidate-context';
import type { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import type { CandidateEliminationInterface } from '../../interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-result.interface';
import type { LineType } from '../../types/line.type';
import type { CellInterface } from '@suuudokuuu/generator';

export abstract class AbstractPointingTechnique extends AbstractTechnique {
    abstract readonly technique: SolutionTechniqueEnum;
    protected abstract readonly size: number;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const groupUnits = context.getUnits().filter(unit => unit.type === 'group');

        for (const groupUnit of groupUnits) {
            for (const value of context.getValues()) {
                const cells = groupUnit.cells.filter(cell => context.getCandidates(cell).includes(value));

                if (cells.length === this.size) {
                    const rowEliminations = this.getLineEliminations(context, cells, value, 'row');
                    const columnEliminations = this.getLineEliminations(context, cells, value, 'column');

                    results.push(...this.createEliminationResults(context, this.technique, rowEliminations, cells));
                    results.push(...this.createEliminationResults(context, this.technique, columnEliminations, cells));
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
}
