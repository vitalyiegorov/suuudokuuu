import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { AbstractFishTechnique } from '../../@generic/classes/abstract-fish-technique';
import { createEliminationResults } from '../../@generic/utils/create-elimination-results.util';
import { forEachCombination } from '../../@generic/utils/get-combinations.util';
import { isSameCell } from '../../@generic/utils/is-same-cell.util';

import type { UnitValueIndex } from '../../@generic/classes/unit-value-index/unit-value-index';
import type { FinnedFishTechniqueDescriptorInterface } from '../../@generic/interfaces/finned-fish-technique-descriptor.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueStrategyInterface } from '../../@generic/interfaces/technique-strategy.interface';
import type { UnitValueEntryInterface } from '../../@generic/interfaces/unit-value-entry.interface';
import type { FishBaseType } from '../../@generic/types/fish-base.type';
import type { CellInterface } from '@suuudokuuu/generator';

const noLineIndex = -1;
const noGroup = -1;

export class FinnedFishTechnique
    extends AbstractFishTechnique<FinnedFishTechniqueDescriptorInterface>
    implements TechniqueStrategyInterface
{
    private get sashimi(): boolean {
        return this.descriptor.sashimi;
    }

    protected override isCandidateUnit(entry: UnitValueEntryInterface): boolean {
        const candidateCellCount = entry.cells.length;

        return candidateCellCount > 0 && candidateCellCount - this.getLargestGroupCellCount(entry) <= this.size;
    }

    protected findInUnits(index: UnitValueIndex, base: FishBaseType, targetCell?: CellInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const possibleCoverIndexes = this.getDistinctCoverIndexes(index, base);
        const targetCoverIndex = isDefined(targetCell) ? this.getCellIndexByLineType(targetCell, base.coverType) : noLineIndex;
        const targetGroup = isDefined(targetCell) ? targetCell.group : noGroup;
        const baseIndexes = this.getBaseIndexes(index, base);

        forEachCombination(possibleCoverIndexes, this.size, coverIndexes => {
            const canEliminateTarget = targetCoverIndex === noLineIndex || coverIndexes.includes(targetCoverIndex);
            const finGroup = canEliminateTarget ? this.getScanFinGroup(index, base, coverIndexes) : noGroup;
            const isTargetedScan = targetGroup === noGroup || finGroup === targetGroup;

            if (finGroup !== noGroup && isTargetedScan && this.isFinnedFishScan(index, base, coverIndexes)) {
                const eliminations = this.getCoverEliminations({
                    index,
                    coverIndexes,
                    coverType: base.coverType,
                    baseType: base.baseType,
                    baseIndexes,
                    value: base.value,
                    isEligibleCell: cell => cell.group === finGroup
                }).filter(elimination => !isDefined(targetCell) || isSameCell(elimination.cell, targetCell));

                if (isNotEmptyArray(eliminations)) {
                    results.push(...createEliminationResults(this.technique, eliminations, this.getScanCells(index, base, coverIndexes)));
                }
            }
        });

        return results;
    }

    private getLargestGroupCellCount(entry: UnitValueEntryInterface): number {
        let largestGroupCellCount = 0;

        for (const cell of entry.cells) {
            let groupCellCount = 0;

            for (const otherCell of entry.cells) {
                if (otherCell.group === cell.group) {
                    groupCellCount += 1;
                }
            }

            largestGroupCellCount = Math.max(largestGroupCellCount, groupCellCount);
        }

        return largestGroupCellCount;
    }

    private getScanFinGroup(index: UnitValueIndex, base: FishBaseType, coverIndexes: readonly number[]): number {
        let finGroup = noGroup;

        for (const unitPosition of base.unitPositions) {
            const entry = index.getUnitValueEntry(unitPosition, base.value);
            let bodyCellCount = 0;

            for (let cellSlot = 0; cellSlot < entry.positions.length; cellSlot += 1) {
                if (coverIndexes.includes(entry.positions[cellSlot])) {
                    bodyCellCount += 1;
                } else if (finGroup === noGroup) {
                    finGroup = entry.cells[cellSlot].group;
                } else if (finGroup !== entry.cells[cellSlot].group) {
                    return noGroup;
                }
            }

            if (bodyCellCount === 0) {
                return noGroup;
            }
        }

        return finGroup;
    }

    private isFinnedFishScan(index: UnitValueIndex, base: FishBaseType, coverIndexes: readonly number[]): boolean {
        return this.sashimi === this.isSashimiScan(index, base, coverIndexes) && this.hasBodyCellPerCoverIndex(index, base, coverIndexes);
    }

    private isSashimiScan(index: UnitValueIndex, base: FishBaseType, coverIndexes: readonly number[]): boolean {
        for (const unitPosition of base.unitPositions) {
            const entry = index.getUnitValueEntry(unitPosition, base.value);
            let bodyCellCount = 0;

            for (const position of entry.positions) {
                if (coverIndexes.includes(position)) {
                    bodyCellCount += 1;
                }
            }

            if (bodyCellCount === 1) {
                return true;
            }
        }

        return false;
    }

    private hasBodyCellPerCoverIndex(index: UnitValueIndex, base: FishBaseType, coverIndexes: readonly number[]): boolean {
        for (const coverIndex of coverIndexes) {
            let hasBodyCell = false;

            for (const unitPosition of base.unitPositions) {
                hasBodyCell ||= index.getUnitValueEntry(unitPosition, base.value).positions.includes(coverIndex);
            }

            if (!hasBodyCell) {
                return false;
            }
        }

        return true;
    }

    private getScanCells(index: UnitValueIndex, base: FishBaseType, coverIndexes: readonly number[]): CellInterface[] {
        const bodyCells: CellInterface[] = [];
        const finCells: CellInterface[] = [];

        for (const unitPosition of base.unitPositions) {
            const entry = index.getUnitValueEntry(unitPosition, base.value);

            for (let cellSlot = 0; cellSlot < entry.positions.length; cellSlot += 1) {
                if (coverIndexes.includes(entry.positions[cellSlot])) {
                    bodyCells.push(entry.cells[cellSlot]);
                } else {
                    finCells.push(entry.cells[cellSlot]);
                }
            }
        }

        return [...bodyCells, ...finCells];
    }
}
