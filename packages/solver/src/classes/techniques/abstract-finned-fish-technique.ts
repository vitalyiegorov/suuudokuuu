import { isDefined, isEmptyArray, isNotEmptyArray } from '@rnw-community/shared';

import { AbstractTechnique } from './abstract-technique';

import type { CandidateContext } from './candidate-context/candidate-context';
import type { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import type { CandidateEliminationInterface } from '../../interfaces/candidate-elimination.interface';
import type { TechniqueResultInterface } from '../../interfaces/technique-result.interface';
import type { FinnedFishBaseType } from '../../types/finned-fish-base.type';
import type { FinnedFishScanType } from '../../types/finned-fish-scan.type';
import type { LineType } from '../../types/line.type';
import type { CellInterface } from '@suuudokuuu/generator';

export abstract class AbstractFinnedFishTechnique extends AbstractTechnique {
    abstract readonly technique: SolutionTechniqueEnum;
    protected abstract readonly size: number;

    find(context: CandidateContext): TechniqueResultInterface[] {
        return [...this.findByBaseType(context, 'row'), ...this.findByBaseType(context, 'column')];
    }

    protected isSashimiFish(scan: FinnedFishScanType): boolean {
        return scan.units.some(
            unit => scan.bodyCells.filter(cell => this.getCellBaseIndex(cell, scan.baseType) === unit.index).length === 1
        );
    }

    private findByBaseType(context: CandidateContext, baseType: LineType): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const baseUnits = context.getUnits().filter(unit => unit.type === baseType);
        const coverType = baseType === 'row' ? 'column' : 'row';

        for (const value of context.getValues()) {
            const candidateUnits = baseUnits.filter(unit => unit.cells.some(cell => context.getCandidates(cell).includes(value)));

            for (const units of this.getCombinations(candidateUnits, this.size)) {
                results.push(...this.findInUnits(context, value, { units, baseType, coverType }));
            }
        }

        return results;
    }

    private findInUnits(context: CandidateContext, value: number, base: FinnedFishBaseType): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const candidateCells = base.units.flatMap(unit => unit.cells.filter(cell => context.getCandidates(cell).includes(value)));
        const possibleCoverIndexes = this.getUniqueValues(candidateCells.map(cell => this.getCellCoverIndex(cell, base.coverType)));

        for (const coverIndexes of this.getCombinations(possibleCoverIndexes, this.size)) {
            const scan = this.createScan(candidateCells, coverIndexes, value, base);

            if (this.isFinnedFish(scan) && this.isMatchingScan(scan)) {
                const eliminations = this.getFinnedFishEliminations(context, scan);

                results.push(
                    ...this.createEliminationResults(context, this.technique, eliminations, [...scan.bodyCells, ...scan.finCells])
                );
            }
        }

        return results;
    }

    private createScan(
        candidateCells: CellInterface[],
        coverIndexes: number[],
        value: number,
        base: FinnedFishBaseType
    ): FinnedFishScanType {
        const bodyCells = candidateCells.filter(cell => coverIndexes.includes(this.getCellCoverIndex(cell, base.coverType)));
        const finCells = candidateCells.filter(cell => !coverIndexes.includes(this.getCellCoverIndex(cell, base.coverType)));

        return { ...base, bodyCells, coverIndexes, finCells, value };
    }

    private getFinnedFishEliminations(context: CandidateContext, scan: FinnedFishScanType): CandidateEliminationInterface[] {
        const [finGroup] = this.getUniqueValues(scan.finCells.map(cell => cell.group));
        const baseIndexes = scan.units.map(unit => unit.index);
        const eliminations: CandidateEliminationInterface[] = [];

        if (isEmptyArray(scan.finCells) || !isDefined(finGroup)) {
            return [];
        }

        for (const coverIndex of scan.coverIndexes) {
            const coverCells = scan.coverType === 'row' ? context.getRowCells(coverIndex) : context.getColumnCells(coverIndex);

            for (const cell of coverCells) {
                const baseIndex = this.getCellBaseIndex(cell, scan.baseType);

                if (!baseIndexes.includes(baseIndex) && cell.group === finGroup && context.getCandidates(cell).includes(scan.value)) {
                    eliminations.push({ cell, value: scan.value });
                }
            }
        }

        return eliminations;
    }

    private isFinnedFish(scan: FinnedFishScanType): boolean {
        const finGroups = this.getUniqueValues(scan.finCells.map(cell => cell.group));

        return (
            isNotEmptyArray(scan.finCells) &&
            finGroups.length === 1 &&
            scan.coverIndexes.every(coverIndex =>
                scan.bodyCells.some(cell => this.getCellCoverIndex(cell, scan.coverType) === coverIndex)
            ) &&
            scan.units.every(unit => scan.bodyCells.some(cell => this.getCellBaseIndex(cell, scan.baseType) === unit.index))
        );
    }

    private getCellBaseIndex(cell: CellInterface, baseType: LineType): number {
        return baseType === 'row' ? cell.y : cell.x;
    }

    private getCellCoverIndex(cell: CellInterface, coverType: LineType): number {
        return coverType === 'row' ? cell.y : cell.x;
    }

    protected abstract isMatchingScan(scan: FinnedFishScanType): boolean;
}
