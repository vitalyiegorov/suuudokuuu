import { AbstractTechnique } from './abstract-technique';

import type { CandidateContext } from './candidate-context/candidate-context';
import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export abstract class AbstractNakedSubsetTechnique extends AbstractTechnique {
    abstract readonly technique: SolutionTechniqueEnum;
    protected abstract readonly size: number;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const unit of context.getUnits()) {
            const candidateCells = unit.cells.filter(cell => {
                const candidates = context.getCandidates(cell);

                return candidates.length > 1 && candidates.length <= this.size;
            });

            for (const cells of this.getCombinations(candidateCells, this.size)) {
                const values = this.getUniqueValues(cells.flatMap(cell => context.getCandidates(cell)));

                if (values.length === this.size) {
                    const eliminations = this.getNakedEliminations(context, unit.cells, cells, values);

                    results.push(...this.createEliminationResults(context, this.technique, eliminations, cells));
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
            const isSubsetCell = subsetCells.some(subsetCell => this.isSameCell(subsetCell, cell));

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
