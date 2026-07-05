import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { AbstractTechnique } from '../abstract-technique';

import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../../interfaces/technique-strategy.interface';
import type { CandidateContext } from '../candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

export class BoxLineReductionTechnique extends AbstractTechnique implements TechniqueStrategyInterface {
    readonly technique = SolutionTechniqueEnum.BoxLineReduction;

    find(context: CandidateContext): TechniqueResultInterface[] {
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

                    results.push(...this.createEliminationResults(context, this.technique, eliminations, cells));
                }
            }
        }

        return results;
    }

    private hasCell(cells: CellInterface[], cell: CellInterface): boolean {
        return cells.some(currentCell => this.isSameCell(currentCell, cell));
    }
}
