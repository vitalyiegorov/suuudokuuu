import { ASSUMPTION_REASON, NAKED_SINGLE_REASON } from '../../constants/hypothesis-reason.constant';
import { getMaskValues } from '../../utils/get-mask-values.util';
import { getValueBit } from '../../utils/get-value-bit.util';
import { hasMaskValue } from '../../utils/has-mask-value.util';

import type { HypothesisBoardInterface } from '../../interfaces/hypothesis-board.interface';
import type { HypothesisPlacementsInterface } from '../../interfaces/hypothesis-placements.interface';
import type { IndexedCandidateInterface } from '../../interfaces/indexed-candidate.interface';

const NO_CELL = -1;
const NO_LOCKED_ORDER = -1;

export class HypothesisPathTracer {
    private readonly replayMasks: Uint16Array;
    private readonly replayValues: Int8Array;

    constructor(
        private readonly board: HypothesisBoardInterface,
        private readonly placements: HypothesisPlacementsInterface
    ) {
        this.replayMasks = new Uint16Array(board.cells.length);
        this.replayValues = new Int8Array(board.cells.length);
    }

    getEmptyCellEliminations(cellIndex: number): IndexedCandidateInterface[] {
        return this.getNakedSingleEliminations(cellIndex, 0);
    }

    getNoPositionEliminations(unitIndex: number, value: number): IndexedCandidateInterface[] {
        return this.getHiddenSingleEliminations(unitIndex, NO_CELL, value);
    }

    getConflictEliminations(cellIndex: number, value: number, reason: number): IndexedCandidateInterface[] {
        return [{ cellIndex, value }, ...this.getAssignmentEliminations(cellIndex, value, reason)];
    }

    getEliminationPath(eliminations: IndexedCandidateInterface[]): number[] {
        const bound = this.placements.placedCellIndexes.length;
        const causes = eliminations.map(elimination => this.getEliminationCause(elimination, bound));

        return this.getMinimalPath(this.getAncestorOrders(causes), eliminations, NO_LOCKED_ORDER);
    }

    getPlacementPath(cellIndex: number): number[] {
        const order = this.placements.placementOrders[cellIndex] - 1;

        return this.getMinimalPath(this.getAncestorOrders([order]), [], order);
    }

    private getAncestorOrders(causes: number[]): number[] {
        const isNeededByOrder = new Uint8Array(this.placements.placedCellIndexes.length);
        const pendingOrders = [0, ...causes];

        for (let pendingIndex = 0; pendingIndex < pendingOrders.length; pendingIndex += 1) {
            const order = pendingOrders[pendingIndex];

            if (isNeededByOrder[order] === 0) {
                isNeededByOrder[order] = 1;
                pendingOrders.push(...this.getPlacementCauses(order));
            }
        }

        const neededOrders: number[] = [];

        isNeededByOrder.forEach((isNeeded, order) => {
            if (isNeeded === 1) {
                neededOrders.push(order);
            }
        });

        return neededOrders;
    }

    private getMinimalPath(orders: number[], eliminations: IndexedCandidateInterface[], lockedOrder: number): number[] {
        let keptOrders = orders;

        for (let orderIndex = keptOrders.length - 1; orderIndex > 0; orderIndex -= 1) {
            const reducedOrders = keptOrders.filter((_, keptIndex) => keptIndex !== orderIndex);

            if (keptOrders[orderIndex] !== lockedOrder && this.isValidPath(reducedOrders, eliminations)) {
                keptOrders = reducedOrders;
            }
        }

        return keptOrders.map(order => this.placements.placedCellIndexes[order]);
    }

    private isValidPath(orders: number[], eliminations: IndexedCandidateInterface[]): boolean {
        this.replayMasks.set(this.board.candidateMasks);
        this.replayValues.fill(0);

        for (const [pathIndex, order] of orders.entries()) {
            const cellIndex = this.placements.placedCellIndexes[order];
            const value = this.placements.placedValues[cellIndex];

            if (pathIndex > 0 && !this.isReplayForced(cellIndex, value)) {
                return false;
            }

            this.replayPlacement(cellIndex, value);
        }

        return eliminations.every(
            elimination =>
                this.replayValues[elimination.cellIndex] !== elimination.value &&
                !hasMaskValue(this.replayMasks[elimination.cellIndex], elimination.value)
        );
    }

    private isReplayForced(cellIndex: number, value: number): boolean {
        if (this.replayMasks[cellIndex] === getValueBit(value)) {
            return true;
        }

        return (
            hasMaskValue(this.replayMasks[cellIndex], value) &&
            this.board.cellUnitIndexes[cellIndex].some(unitIndex =>
                this.board.unitCellIndexes[unitIndex].every(
                    unitCellIndex =>
                        unitCellIndex === cellIndex ||
                        (this.replayValues[unitCellIndex] !== value && !hasMaskValue(this.replayMasks[unitCellIndex], value))
                )
            )
        );
    }

    private replayPlacement(cellIndex: number, value: number): void {
        this.replayValues[cellIndex] = value;
        this.replayMasks[cellIndex] = 0;

        for (const peerIndex of this.board.peerIndexes[cellIndex]) {
            if (hasMaskValue(this.replayMasks[peerIndex], value)) {
                this.replayMasks[peerIndex] -= getValueBit(value);
            }
        }
    }

    private getEliminationCause(elimination: IndexedCandidateInterface, bound: number): number {
        const { placedValues, placementOrders } = this.placements;
        const ownOrder = placementOrders[elimination.cellIndex] - 1;
        let cause = placedValues[elimination.cellIndex] > 0 && ownOrder < bound ? ownOrder : bound;

        for (const peerIndex of this.board.peerIndexes[elimination.cellIndex]) {
            const peerOrder = placementOrders[peerIndex] - 1;

            if (placedValues[peerIndex] === elimination.value && peerOrder < cause) {
                cause = peerOrder;
            }
        }

        return cause;
    }

    private getPlacementCauses(order: number): number[] {
        const cellIndex = this.placements.placedCellIndexes[order];
        const value = this.placements.placedValues[cellIndex];

        return this.getAssignmentEliminations(cellIndex, value, this.placements.placementReasons[order]).map(elimination =>
            this.getEliminationCause(elimination, order)
        );
    }

    private getAssignmentEliminations(cellIndex: number, value: number, reason: number): IndexedCandidateInterface[] {
        if (reason === ASSUMPTION_REASON) {
            return [];
        }

        if (reason === NAKED_SINGLE_REASON) {
            return this.getNakedSingleEliminations(cellIndex, value);
        }

        return this.getHiddenSingleEliminations(reason, cellIndex, value);
    }

    private getNakedSingleEliminations(cellIndex: number, value: number): IndexedCandidateInterface[] {
        return getMaskValues(this.board.candidateMasks[cellIndex], this.board.valueCount)
            .filter(candidate => candidate !== value)
            .map(candidate => ({ cellIndex, value: candidate }));
    }

    private getHiddenSingleEliminations(unitIndex: number, placedCellIndex: number, value: number): IndexedCandidateInterface[] {
        return this.board.unitCellIndexes[unitIndex]
            .filter(cellIndex => cellIndex !== placedCellIndex && hasMaskValue(this.board.candidateMasks[cellIndex], value))
            .map(cellIndex => ({ cellIndex, value }));
    }
}
