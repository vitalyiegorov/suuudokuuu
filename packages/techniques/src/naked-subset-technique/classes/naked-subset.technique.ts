import { AbstractSizedTechnique } from '../../@generic/classes/abstract-sized-technique';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { forEachCombination } from '../../@generic/utils/get-combinations.util';
import { getMaskValues } from '../../@generic/utils/get-mask-values.util';
import { getValueBit } from '../../@generic/utils/get-value-bit.util';
import { hasMaskValue } from '../../@generic/utils/has-mask-value.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { CandidateEliminationInterface } from '../../@generic/interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class NakedSubsetTechnique extends AbstractSizedTechnique {
    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const valueCount = context.getValues().length;

        for (const unit of context.getUnits()) {
            const candidateCells = unit.cells.filter(cell => {
                const candidates = context.getCandidates(cell);

                return candidates.length > 1 && candidates.length <= this.size;
            });

            forEachCombination(candidateCells, this.size, cells => {
                const values = this.getSubsetValues(context, cells, valueCount);

                if (values.length === this.size) {
                    const eliminations = this.getNakedEliminations(context, unit.cells, cells, values);

                    results.push(
                        ...createEliminationResults(this.technique, eliminations, [...cells]).map(result => ({
                            ...result,
                            patternCandidates: cells.flatMap(cell => context.getCandidates(cell).map(value => ({ cell, value })))
                        }))
                    );
                }
            });
        }

        return results;
    }

    private getSubsetValues(context: CandidateContext, cells: readonly CellInterface[], valueCount: number): number[] {
        let candidateMask = 0;

        for (const cell of cells) {
            for (const value of context.getCandidates(cell)) {
                if (!hasMaskValue(candidateMask, value)) {
                    candidateMask += getValueBit(value);
                }
            }
        }

        return getMaskValues(candidateMask, valueCount);
    }

    private getNakedEliminations(
        context: CandidateContext,
        unitCells: CellInterface[],
        subsetCells: readonly CellInterface[],
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
