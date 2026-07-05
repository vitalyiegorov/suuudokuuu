import { AbstractTechnique } from './abstract-technique';
import { CandidateContext } from './candidate-context/candidate-context';

import type { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import type { CandidateEliminationInterface } from '../../interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export abstract class AbstractHiddenSubsetTechnique extends AbstractTechnique {
    abstract readonly technique: SolutionTechniqueEnum;
    protected abstract readonly size: number;

    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const unit of context.getUnits()) {
            for (const values of this.getCombinations(context.getValues(), this.size)) {
                const cells = this.getCellsForValues(context, unit.cells, values);

                if (cells.length === this.size && this.hasEveryValue(context, cells, values)) {
                    const eliminations = this.getHiddenEliminations(context, cells, values);

                    results.push(...this.createEliminationResults(context, this.technique, eliminations, cells));
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
