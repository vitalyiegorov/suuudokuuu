import { isDefined, isEmptyArray, isNotEmptyArray } from '@rnw-community/shared';

import { AbstractFishTechnique } from '../../@generic/classes/abstract-fish-technique';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { getCombinations } from '../../@generic/utils/get-combinations.util';
import { getUniqueValues } from '../../@generic/utils/get-unique-values.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { CandidateEliminationInterface } from '../../@generic/interfaces/candidate-elimination.interface';
import type { FinnedFishTechniqueDescriptorInterface } from '../../@generic/interfaces/finned-fish-technique-descriptor.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { FinnedFishBaseType } from '../../@generic/types/finned-fish-base.type';
import type { FinnedFishScanType } from '../../@generic/types/finned-fish-scan.type';
import type { LineType } from '../../@generic/types/line.type';
import type { CellInterface } from '@suuudokuuu/generator';

export class FinnedFishTechnique
    extends AbstractFishTechnique<FinnedFishTechniqueDescriptorInterface>
    implements TechniqueStrategyInterface
{
    private get sashimi(): boolean {
        return this.descriptor.sashimi;
    }

    protected findInUnits(
        context: CandidateContext,
        value: number,
        base: FinnedFishBaseType,
        targetCell?: CellInterface
    ): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const candidateCells = base.units.flatMap(unit => unit.cells.filter(cell => context.getCandidates(cell).includes(value)));
        const possibleCoverIndexes = getUniqueValues(candidateCells.map(cell => this.getCellCoverIndex(cell, base.coverType)));
        const targetCoverIndex = isDefined(targetCell) ? this.getCellCoverIndex(targetCell, base.coverType) : null;

        for (const coverIndexes of getCombinations(possibleCoverIndexes, this.size)) {
            const canEliminateTarget = !isDefined(targetCoverIndex) || coverIndexes.includes(targetCoverIndex);

            if (canEliminateTarget) {
                const scan = this.createScan(candidateCells, coverIndexes, value, base);

                if (this.isTargetedScan(scan, targetCell) && this.isFinnedFish(scan) && this.isMatchingScan(scan)) {
                    const eliminations = this.getFinnedFishEliminations(context, scan).filter(
                        elimination => !isDefined(targetCell) || isSameCell(elimination.cell, targetCell)
                    );

                    results.push(...createEliminationResults(this.technique, eliminations, [...scan.bodyCells, ...scan.finCells]));
                }
            }
        }

        return results;
    }

    private isTargetedScan(scan: FinnedFishScanType, targetCell?: CellInterface): boolean {
        return !isDefined(targetCell) || scan.finCells.every(cell => cell.group === targetCell.group);
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
        const [finGroup] = getUniqueValues(scan.finCells.map(cell => cell.group));
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
        const finGroups = getUniqueValues(scan.finCells.map(cell => cell.group));

        return (
            isNotEmptyArray(scan.finCells) &&
            finGroups.length === 1 &&
            scan.coverIndexes.every(coverIndex =>
                scan.bodyCells.some(cell => this.getCellCoverIndex(cell, scan.coverType) === coverIndex)
            ) &&
            scan.units.every(unit => scan.bodyCells.some(cell => this.getCellBaseIndex(cell, scan.baseType) === unit.index))
        );
    }

    private isMatchingScan(scan: FinnedFishScanType): boolean {
        return this.sashimi === this.isSashimiFish(scan);
    }

    private isSashimiFish(scan: FinnedFishScanType): boolean {
        return scan.units.some(
            unit => scan.bodyCells.filter(cell => this.getCellBaseIndex(cell, scan.baseType) === unit.index).length === 1
        );
    }

    private getCellBaseIndex(cell: CellInterface, baseType: LineType): number {
        return baseType === 'row' ? cell.y : cell.x;
    }

    private getCellCoverIndex(cell: CellInterface, coverType: LineType): number {
        return coverType === 'row' ? cell.y : cell.x;
    }
}
