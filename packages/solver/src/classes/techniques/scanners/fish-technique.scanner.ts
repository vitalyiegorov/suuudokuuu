import { isDefined } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';

import { AbstractTechniqueScanner } from './abstract-technique.scanner';

import type { CandidateEliminationInterface } from '../../../interfaces/candidate-elimination.interface';
import type { CandidateUnitInterface } from '../../../interfaces/candidate-unit.interface';
import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { TechniqueScannerInterface } from '../../../interfaces/technique-scanner.interface';
import type { CandidateContext } from '../candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

type FishLineType = 'row' | 'column';

type FinnedFishBaseType = {
    readonly units: CandidateUnitInterface[];
    readonly baseType: FishLineType;
    readonly coverType: FishLineType;
};

type FinnedFishScanType = FinnedFishBaseType & {
    readonly bodyCells: CellInterface[];
    readonly coverIndexes: number[];
    readonly finCells: CellInterface[];
    readonly value: number;
};

export class FishTechniqueScanner extends AbstractTechniqueScanner implements TechniqueScannerInterface {
    find(context: CandidateContext): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const size of [2, 3, 4]) {
            results.push(...this.findBasicFish(context, size, 'row'));
            results.push(...this.findBasicFish(context, size, 'column'));
        }

        for (const size of [2, 3]) {
            results.push(...this.findFinnedFish(context, size, 'row'));
            results.push(...this.findFinnedFish(context, size, 'column'));
        }

        return results;
    }

    private findBasicFish(context: CandidateContext, size: number, baseType: FishLineType): TechniqueResultInterface[] {
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

    private findFinnedFish(context: CandidateContext, size: number, baseType: FishLineType): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const baseUnits = context.getUnits().filter(unit => unit.type === baseType);
        const coverType = baseType === 'row' ? 'column' : 'row';

        for (const value of context.getValues()) {
            const candidateUnits = baseUnits.filter(unit => unit.cells.some(cell => context.getCandidates(cell).includes(value)));

            for (const units of this.getCombinations(candidateUnits, size)) {
                results.push(...this.findFinnedFishInUnits(context, size, value, { units, baseType, coverType }));
            }
        }

        return results;
    }

    private findFinnedFishInUnits(
        context: CandidateContext,
        size: number,
        value: number,
        base: FinnedFishBaseType
    ): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const candidateCells = base.units.flatMap(unit => unit.cells.filter(cell => context.getCandidates(cell).includes(value)));
        const possibleCoverIndexes = this.getUniqueValues(candidateCells.map(cell => this.getCellCoverIndex(cell, base.coverType)));

        for (const coverIndexes of this.getCombinations(possibleCoverIndexes, size)) {
            const scan = this.createFinnedFishScan(candidateCells, coverIndexes, value, base);

            if (this.isFinnedFish(scan)) {
                const eliminations = this.getFinnedFishEliminations(context, scan);
                const isSashimiFish = this.isSashimiFish(scan);

                results.push(
                    ...this.createEliminationResults(context, this.getFinnedTechnique(size, isSashimiFish), eliminations, [
                        ...scan.bodyCells,
                        ...scan.finCells
                    ])
                );
            }
        }

        return results;
    }

    private createFinnedFishScan(
        candidateCells: CellInterface[],
        coverIndexes: number[],
        value: number,
        base: FinnedFishBaseType
    ): FinnedFishScanType {
        const bodyCells = candidateCells.filter(cell => coverIndexes.includes(this.getCellCoverIndex(cell, base.coverType)));
        const finCells = candidateCells.filter(cell => !coverIndexes.includes(this.getCellCoverIndex(cell, base.coverType)));

        return { ...base, bodyCells, coverIndexes, finCells, value };
    }

    private getCoverIndexes(context: CandidateContext, unit: CandidateUnitInterface, value: number, coverType: FishLineType): number[] {
        return this.getUniqueValues(
            unit.cells.filter(cell => context.getCandidates(cell).includes(value)).map(cell => (coverType === 'row' ? cell.y : cell.x))
        );
    }

    private getFishEliminations(
        context: CandidateContext,
        baseUnits: CandidateUnitInterface[],
        value: number,
        coverType: FishLineType
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

    private getFinnedFishEliminations(context: CandidateContext, scan: FinnedFishScanType): CandidateEliminationInterface[] {
        const [finGroup] = this.getUniqueValues(scan.finCells.map(cell => cell.group));
        const baseIndexes = scan.units.map(unit => unit.index);
        const eliminations: CandidateEliminationInterface[] = [];

        if (scan.finCells.length === 0 || !isDefined(finGroup)) {
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
            scan.finCells.length > 0 &&
            finGroups.length === 1 &&
            scan.coverIndexes.every(coverIndex =>
                scan.bodyCells.some(cell => this.getCellCoverIndex(cell, scan.coverType) === coverIndex)
            ) &&
            scan.units.every(unit => scan.bodyCells.some(cell => this.getCellBaseIndex(cell, scan.baseType) === unit.index))
        );
    }

    private isSashimiFish(scan: FinnedFishScanType): boolean {
        return scan.units.some(
            unit => scan.bodyCells.filter(cell => this.getCellBaseIndex(cell, scan.baseType) === unit.index).length === 1
        );
    }

    private getCellBaseIndex(cell: CellInterface, baseType: FishLineType): number {
        return baseType === 'row' ? cell.y : cell.x;
    }

    private getCellCoverIndex(cell: CellInterface, coverType: FishLineType): number {
        return coverType === 'row' ? cell.y : cell.x;
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

    private getFinnedTechnique(size: number, isSashimiFish: boolean): SolutionTechniqueEnum {
        if (size === 2) {
            return isSashimiFish ? SolutionTechniqueEnum.SashimiXWing : SolutionTechniqueEnum.FinnedXWing;
        }

        return isSashimiFish ? SolutionTechniqueEnum.SashimiSwordfish : SolutionTechniqueEnum.FinnedSwordfish;
    }
}
