import { AbstractSizedTechnique } from '../../@generic/classes/abstract-sized-technique';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCombinations } from '../../@generic/utils/get-combinations.util';
import { getUniqueValues } from '../../@generic/utils/get-unique-values.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { CandidateEliminationInterface } from '../../@generic/interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class NakedSubsetTechnique extends AbstractSizedTechnique {
    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const unit of context.getUnits()) {
            const candidateCells = unit.cells.filter(cell => {
                const candidates = context.getCandidates(cell);

                return candidates.length > 1 && candidates.length <= this.size;
            });

            for (const cells of getCombinations(candidateCells, this.size)) {
                const values = getUniqueValues(cells.flatMap(cell => context.getCandidates(cell)));

                if (values.length === this.size) {
                    const eliminations = this.getNakedEliminations(context, unit.cells, cells, values);

                    results.push(...createEliminationResults(this.technique, eliminations, cells));
                }
            }
        }

        return results;
    }

    private getNakedEliminations(
        context: CandidateContext,
        unitCells: CellInterface[],
        subsetCells: CellInterface[],
        values: number[]
    ): CandidateEliminationInterface[] {
        const eliminations: CandidateEliminationInterface[] = [];

        for (const cell of unitCells) {
            const isSubsetCell = subsetCells.some(subsetCell => isSameCell(subsetCell, cell));

            if (!isSubsetCell) {
                for (const value of values) {
                    if (context.getCandidates(cell).includes(value)) {
                        eliminations.push({ cell, value });
                    }
                }
            }
        }

        return eliminations;
    }
}
