import { isDefined } from '@rnw-community/shared';

import { getContextUnitValueIndex } from '../utils/context-scan-state.util';
import { forEachCombination } from '../utils/get-combinations.util';
import { getSearchScope } from '../utils/get-search-scope.util';

import { AbstractSizedTechnique } from './abstract-sized-technique';

import type { CandidateContext } from './candidate-context/candidate-context';
import type { UnitValueIndex } from './unit-value-index/unit-value-index';
import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { SizedTechniqueDescriptorInterface } from '../interfaces/sized-technique-descriptor.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../interfaces/technique-search-target.interface';
import type { UnitValueEntryInterface } from '../interfaces/unit-value-entry.interface';
import type { FishBaseType } from '../types/fish-base.type';
import type { LineType } from '../types/line.type';
import type { CellInterface } from '@suuudokuuu/generator';

const noLineIndex = -1;

type FishBaseTypeScanType = {
    readonly baseType: LineType;
    readonly values: number[];
    readonly targetCell?: CellInterface;
};

type CoverEliminationScanType = {
    readonly index: UnitValueIndex;
    readonly coverIndexes: readonly number[];
    readonly coverType: LineType;
    readonly baseType: LineType;
    readonly baseIndexes: readonly number[];
    readonly value: number;
    readonly isEligibleCell?: (cell: CellInterface) => boolean;
};

export abstract class AbstractFishTechnique<
    TDescriptor extends SizedTechniqueDescriptorInterface = SizedTechniqueDescriptorInterface
> extends AbstractSizedTechnique<TDescriptor> {
    find(context: CandidateContext, target?: TechniqueSearchTargetInterface): TechniqueResultInterface[] {
        const { eliminationValues, directTarget } = getSearchScope(context, target);
        const index = getContextUnitValueIndex(context);
        const targetCell = directTarget?.cell;

        return [
            ...this.findByBaseType(index, { baseType: 'row', values: eliminationValues, targetCell }),
            ...this.findByBaseType(index, { baseType: 'column', values: eliminationValues, targetCell })
        ];
    }

    protected isCandidateUnit(entry: UnitValueEntryInterface): boolean {
        return entry.cells.length > 0;
    }

    protected getCellIndexByLineType(cell: CellInterface, lineType: LineType): number {
        return lineType === 'row' ? cell.y : cell.x;
    }

    protected getDistinctCoverIndexes(index: UnitValueIndex, base: FishBaseType): number[] {
        const distinctCoverIndexes: number[] = [];

        for (const unitPosition of base.unitPositions) {
            for (const position of index.getUnitValueEntry(unitPosition, base.value).positions) {
                if (!distinctCoverIndexes.includes(position)) {
                    distinctCoverIndexes.push(position);
                }
            }
        }

        return distinctCoverIndexes.sort((firstIndex, secondIndex) => firstIndex - secondIndex);
    }

    protected getBaseIndexes(index: UnitValueIndex, base: FishBaseType): number[] {
        return base.unitPositions.map(unitPosition => index.units[unitPosition].index);
    }

    protected getBaseCells(index: UnitValueIndex, base: FishBaseType): CellInterface[] {
        const baseCells: CellInterface[] = [];

        for (const unitPosition of base.unitPositions) {
            baseCells.push(...index.getUnitValueEntry(unitPosition, base.value).cells);
        }

        return baseCells;
    }

    protected getCoverEliminations(scan: CoverEliminationScanType): CandidateEliminationInterface[] {
        const { index, coverIndexes, coverType, baseType, baseIndexes, value, isEligibleCell } = scan;
        const eliminations: CandidateEliminationInterface[] = [];

        for (const coverIndex of coverIndexes) {
            const coverUnitPosition = index.getLineUnitPosition(coverType, coverIndex);

            for (const cell of index.getUnitValueEntry(coverUnitPosition, value).cells) {
                const baseIndex = this.getCellIndexByLineType(cell, baseType);
                const isEligible = isEligibleCell?.(cell) ?? true;

                if (!baseIndexes.includes(baseIndex) && isEligible) {
                    eliminations.push({ cell, value });
                }
            }
        }

        return eliminations;
    }

    private findByBaseType(index: UnitValueIndex, scan: FishBaseTypeScanType): TechniqueResultInterface[] {
        const { baseType, values, targetCell } = scan;
        const results: TechniqueResultInterface[] = [];
        const baseUnitPositions = index.getLineUnitPositions(baseType);
        const coverType: LineType = baseType === 'row' ? 'column' : 'row';
        const targetBaseIndex = isDefined(targetCell) ? this.getCellIndexByLineType(targetCell, baseType) : noLineIndex;

        for (const value of values) {
            const candidateUnitPositions = this.getCandidateUnitPositions(index, baseUnitPositions, value, targetBaseIndex);

            forEachCombination(candidateUnitPositions, this.size, unitPositions => {
                results.push(...this.findInUnits(index, { unitPositions, baseType, coverType, value }, targetCell));
            });
        }

        return results;
    }

    private getCandidateUnitPositions(
        index: UnitValueIndex,
        baseUnitPositions: readonly number[],
        value: number,
        targetBaseIndex: number
    ): number[] {
        const candidateUnitPositions: number[] = [];

        for (const unitPosition of baseUnitPositions) {
            const entry = index.getUnitValueEntry(unitPosition, value);

            if (index.units[unitPosition].index !== targetBaseIndex && this.isCandidateUnit(entry)) {
                candidateUnitPositions.push(unitPosition);
            }
        }

        return candidateUnitPositions;
    }

    protected abstract findInUnits(index: UnitValueIndex, base: FishBaseType, targetCell?: CellInterface): TechniqueResultInterface[];
}
