import { AbstractSizedTechnique } from '../../@generic/classes/abstract-sized-technique';
import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCombinations } from '../../@generic/utils/get-combinations.util';

import type { CandidateEliminationInterface } from '../../@generic/interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class HiddenSubsetTechnique extends AbstractSizedTechnique {
    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const unit of context.getUnits()) {
            for (const values of getCombinations(context.getValues(), this.size)) {
                const cells = this.getCellsForValues(context, unit.cells, values);

                if (cells.length === this.size && this.hasEveryValue(context, cells, values)) {
                    const eliminations = this.getHiddenEliminations(context, cells, values);

                    results.push(...createEliminationResults(context, this.technique, eliminations, cells));
                }
            }
        }

        return results;
    }

    private getCellsForValues(context: CandidateContext, unitCells: CellInterface[], values: number[]): CellInterface[] {
        const cellMap: Record<string, CellInterface> = {};

        for (const cell of unitCells) {
            const candidates = context.getCandidates(cell);

            if (values.some(value => candidates.includes(value))) {
                cellMap[CandidateContext.getCellKey(cell)] = cell;
            }
        }

        return Object.values(cellMap);
    }

    private hasEveryValue(context: CandidateContext, cells: CellInterface[], values: number[]): boolean {
        return values.every(value => cells.some(cell => context.getCandidates(cell).includes(value)));
    }

    private getHiddenEliminations(context: CandidateContext, cells: CellInterface[], values: number[]): CandidateEliminationInterface[] {
        const eliminations: CandidateEliminationInterface[] = [];

        for (const cell of cells) {
            for (const candidate of context.getCandidates(cell)) {
                if (!values.includes(candidate)) {
                    eliminations.push({ cell, value: candidate });
                }
            }
        }

        return eliminations;
    }
}
