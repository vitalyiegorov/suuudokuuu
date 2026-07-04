import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { CandidateContext } from '../candidate-context/candidate-context';

import { AbstractTechniqueScanner } from './abstract-technique.scanner';

import type { CandidateEliminationInterface } from '../../../interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueScannerInterface } from '../../../interfaces/technique-scanner.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export class SubsetTechniqueScanner extends AbstractTechniqueScanner implements TechniqueScannerInterface {
    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const size of [2, 3, 4]) {
            results.push(...this.findNakedSubsets(context, size));
            results.push(...this.findHiddenSubsets(context, size));
        }

        return results;
    }

    private findNakedSubsets(context: CandidateContext, size: number): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const unit of context.getUnits()) {
            const candidateCells = unit.cells.filter(cell => {
                const candidates = context.getCandidates(cell);

                return candidates.length > 1 && candidates.length <= size;
            });

            for (const cells of this.getCombinations(candidateCells, size)) {
                const values = this.getUniqueValues(cells.flatMap(cell => context.getCandidates(cell)));

                if (values.length === size) {
                    const eliminations = this.getNakedEliminations(context, unit.cells, cells, values);

                    results.push(...this.createEliminationResults(context, this.getNakedTechnique(size), eliminations, cells));
                }
            }
        }

        return results;
    }

    private findHiddenSubsets(context: CandidateContext, size: number): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const unit of context.getUnits()) {
            for (const values of this.getCombinations(context.getValues(), size)) {
                const cells = this.getCellsForValues(context, unit.cells, values);

                if (cells.length === size && this.hasEveryValue(context, cells, values)) {
                    const eliminations = this.getHiddenEliminations(context, cells, values);

                    results.push(...this.createEliminationResults(context, this.getHiddenTechnique(size), eliminations, cells));
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

    private getNakedEliminations(
        context: CandidateContext,
        unitCells: CellInterface[],
        subsetCells: CellInterface[],
        values: number[]
    ): CandidateEliminationInterface[] {
        const eliminations: CandidateEliminationInterface[] = [];

        for (const cell of unitCells) {
            const isSubsetCell = subsetCells.some(subsetCell => subsetCell.x === cell.x && subsetCell.y === cell.y);

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

    private getNakedTechnique(size: number): SolutionTechniqueEnum {
        if (size === 2) {
            return SolutionTechniqueEnum.NakedPair;
        }

        if (size === 3) {
            return SolutionTechniqueEnum.NakedTriple;
        }

        return SolutionTechniqueEnum.NakedQuad;
    }

    private getHiddenTechnique(size: number): SolutionTechniqueEnum {
        if (size === 2) {
            return SolutionTechniqueEnum.HiddenPair;
        }

        if (size === 3) {
            return SolutionTechniqueEnum.HiddenTriple;
        }

        return SolutionTechniqueEnum.HiddenQuad;
    }
}
