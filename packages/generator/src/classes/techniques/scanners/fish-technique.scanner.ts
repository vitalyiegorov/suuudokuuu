import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';

import { AbstractTechniqueScanner } from './abstract-technique.scanner';

import type { CandidateEliminationInterface } from '../../../interfaces/candidate-elimination.interface';
import type { CandidateUnitInterface } from '../../../interfaces/candidate-unit.interface';
import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueScannerInterface } from '../../../interfaces/technique-scanner.interface';
import type { CandidateContext } from '../candidate-context/candidate-context';

export class FishTechniqueScanner extends AbstractTechniqueScanner implements TechniqueScannerInterface {
    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const size of [2, 3, 4]) {
            results.push(...this.findBasicFish(context, size, 'row'));
            results.push(...this.findBasicFish(context, size, 'column'));
        }

        return results;
    }

    private findBasicFish(context: CandidateContext, size: number, baseType: 'row' | 'column'): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const baseUnits = context.getUnits().filter(unit => unit.type === baseType);
        const coverType = baseType === 'row' ? 'column' : 'row';

        for (const value of context.getValues()) {
            const candidateUnits = baseUnits.filter(unit => {
                const coverIndexes = this.getCoverIndexes(context, unit, value, coverType);

                return coverIndexes.length >= 2 && coverIndexes.length <= size;
            });

            for (const units of this.getCombinations(candidateUnits, size)) {
                const coverIndexes = this.getUniqueValues(units.flatMap(unit => this.getCoverIndexes(context, unit, value, coverType)));

                if (coverIndexes.length === size) {
                    const eliminations = this.getFishEliminations(context, units, value, coverType);

                    results.push(
                        ...this.createEliminationResults(
                            context,
                            this.getTechnique(size),
                            eliminations,
                            units.flatMap(unit => unit.cells)
                        )
                    );
                }
            }
        }

        return results;
    }

    private getCoverIndexes(context: CandidateContext, unit: CandidateUnitInterface, value: number, coverType: 'row' | 'column'): number[] {
        return this.getUniqueValues(
            unit.cells.filter(cell => context.getCandidates(cell).includes(value)).map(cell => (coverType === 'row' ? cell.y : cell.x))
        );
    }

    private getFishEliminations(
        context: CandidateContext,
        baseUnits: CandidateUnitInterface[],
        value: number,
        coverType: 'row' | 'column'
    ): CandidateEliminationInterface[] {
        const baseIndexes = baseUnits.map(unit => unit.index);
        const coverIndexes = this.getUniqueValues(baseUnits.flatMap(unit => this.getCoverIndexes(context, unit, value, coverType)));
        const eliminations: CandidateEliminationInterface[] = [];

        for (const coverIndex of coverIndexes) {
            const coverCells = coverType === 'row' ? context.getRowCells(coverIndex) : context.getColumnCells(coverIndex);

            for (const cell of coverCells) {
                const baseIndex = coverType === 'row' ? cell.x : cell.y;

                if (!baseIndexes.includes(baseIndex) && context.getCandidates(cell).includes(value)) {
                    eliminations.push({ cell, value });
                }
            }
        }

        return eliminations;
    }

    private getTechnique(size: number): SolutionTechniqueEnum {
        if (size === 2) {
            return SolutionTechniqueEnum.XWing;
        }

        if (size === 3) {
            return SolutionTechniqueEnum.Swordfish;
        }

        return SolutionTechniqueEnum.Jellyfish;
    }
}
