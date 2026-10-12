import { isDefined } from '@rnw-community/shared';

import { ForcingOutcomeKindEnum } from '../../enums/forcing-outcome-kind.enum';
import { getPropagationKey } from '../../utils/get-propagation-key.util';
import { getValueBit } from '../../utils/get-value-bit.util';
import { hasMaskValue } from '../../utils/has-mask-value.util';
import { CandidateContext } from '../candidate-context/candidate-context';

import type { HypothesisBoardInterface } from '../../interfaces/hypothesis-board.interface';
import type { HypothesisPropagationInterface } from '../../interfaces/hypothesis-propagation.interface';
import type { ForcingContradictionType } from '../../types/forcing-outcome.type';

const NO_HIDDEN_SINGLE_POSITION = -1;
const CONTRADICTION_POSITION = -2;
const INTEGER_BIT_WIDTH = 32;

export class HypothesisPropagator {
    private readonly propagations = new Map<number, HypothesisPropagationInterface>();
    private masks = new Uint16Array();
    private placedValues = new Int8Array();
    private placedCellIndexes: number[] = [];
    private pendingCellIndexes: number[] = [];
    private pendingValues: number[] = [];
    private contradiction: ForcingContradictionType | null = null;

    constructor(private readonly board: HypothesisBoardInterface) {}

    getBoard(): HypothesisBoardInterface {
        return this.board;
    }

    propagate(cellIndex: number, value: number): HypothesisPropagationInterface {
        const propagationKey = getPropagationKey(this.board, cellIndex, value);
        const cachedPropagation = this.propagations.get(propagationKey);

        if (isDefined(cachedPropagation)) {
            return cachedPropagation;
        }

        this.resetPropagation(cellIndex, value);

        let isProgressing = true;

        while (isProgressing) {
            isProgressing = this.drainPendingAssignments() && this.queueHiddenSingles();
        }

        const propagation = this.createPropagation();

        this.propagations.set(propagationKey, propagation);

        return propagation;
    }

    private resetPropagation(cellIndex: number, value: number): void {
        this.masks = Uint16Array.from(this.board.candidateMasks);
        this.placedValues = new Int8Array(this.board.cells.length);
        this.placedCellIndexes = [];
        this.pendingCellIndexes = [cellIndex];
        this.pendingValues = [value];
        this.contradiction = null;
    }

    private drainPendingAssignments(): boolean {
        let pendingIndex = 0;

        while (pendingIndex < this.pendingCellIndexes.length && !isDefined(this.contradiction)) {
            this.assign(this.pendingCellIndexes[pendingIndex], this.pendingValues[pendingIndex]);
            pendingIndex += 1;
        }

        this.pendingCellIndexes = [];
        this.pendingValues = [];

        return !isDefined(this.contradiction);
    }

    private assign(cellIndex: number, value: number): void {
        if (this.placedValues[cellIndex] === value) {
            return;
        }

        if (!hasMaskValue(this.masks[cellIndex], value)) {
            this.contradiction = { kind: ForcingOutcomeKindEnum.ASSIGNMENT_CONFLICT, cell: this.board.cells[cellIndex], value };

            return;
        }

        this.placedValues[cellIndex] = value;
        this.placedCellIndexes.push(cellIndex);
        this.masks[cellIndex] = 0;

        for (const peerIndex of this.board.peerIndexes[cellIndex]) {
            if (!this.removePeerCandidate(peerIndex, value)) {
                return;
            }
        }
    }

    private removePeerCandidate(peerIndex: number, value: number): boolean {
        if (!hasMaskValue(this.masks[peerIndex], value)) {
            return true;
        }

        this.masks[peerIndex] -= getValueBit(value);

        if (this.masks[peerIndex] === 0) {
            this.contradiction = { kind: ForcingOutcomeKindEnum.EMPTY_CELL, cell: this.board.cells[peerIndex] };

            return false;
        }

        const singleValue = INTEGER_BIT_WIDTH - Math.clz32(this.masks[peerIndex]);

        if (this.masks[peerIndex] === getValueBit(singleValue)) {
            this.pendingCellIndexes.push(peerIndex);
            this.pendingValues.push(singleValue);
        }

        return true;
    }

    private queueHiddenSingles(): boolean {
        const { unitCellIndexes, valueCount } = this.board;
        let hasQueuedAssignments = false;

        for (const cellIndexes of unitCellIndexes) {
            for (let value = 1; value <= valueCount; value += 1) {
                hasQueuedAssignments = this.queueUnitHiddenSingle(cellIndexes, value) || hasQueuedAssignments;

                if (isDefined(this.contradiction)) {
                    return hasQueuedAssignments;
                }
            }
        }

        return hasQueuedAssignments;
    }

    private queueUnitHiddenSingle(unitCellIndexes: readonly number[], value: number): boolean {
        const positionIndex = this.getUnitHiddenSinglePosition(unitCellIndexes, value);

        if (positionIndex === CONTRADICTION_POSITION) {
            this.contradiction = {
                kind: ForcingOutcomeKindEnum.NO_POSITION,
                unitCells: unitCellIndexes.map(cellIndex => this.board.cells[cellIndex]),
                value
            };

            return false;
        }

        if (positionIndex === NO_HIDDEN_SINGLE_POSITION) {
            return false;
        }

        this.pendingCellIndexes.push(positionIndex);
        this.pendingValues.push(value);

        return true;
    }

    private getUnitHiddenSinglePosition(unitCellIndexes: readonly number[], value: number): number {
        const { cellValues } = this.board;
        const { masks, placedValues } = this;
        let singlePositionIndex = CONTRADICTION_POSITION;

        for (const cellIndex of unitCellIndexes) {
            if (cellValues[cellIndex] === value || placedValues[cellIndex] === value) {
                return NO_HIDDEN_SINGLE_POSITION;
            }

            if (hasMaskValue(masks[cellIndex], value)) {
                if (singlePositionIndex !== CONTRADICTION_POSITION) {
                    return NO_HIDDEN_SINGLE_POSITION;
                }

                singlePositionIndex = cellIndex;
            }
        }

        return singlePositionIndex;
    }

    private createPropagation(): HypothesisPropagationInterface {
        const eliminatedMasks = new Uint16Array(this.board.cells.length);

        for (let cellIndex = 0; cellIndex < eliminatedMasks.length; cellIndex += 1) {
            const placedValue = this.placedValues[cellIndex];

            eliminatedMasks[cellIndex] =
                this.board.candidateMasks[cellIndex] - this.masks[cellIndex] - (placedValue > 0 ? getValueBit(placedValue) : 0);
        }

        return {
            hasContradiction: isDefined(this.contradiction),
            placedValues: this.placedValues,
            placedCellIndexes: this.placedCellIndexes,
            eliminatedMasks,
            ...(isDefined(this.contradiction) && { contradiction: this.contradiction })
        };
    }

    static fromContext(context: CandidateContext): HypothesisPropagator {
        const cells = context.getCells();
        const valueCount = context.getValues().length;

        return new HypothesisPropagator({
            cells,
            cellValues: cells.map(cell => (context.isBlankCell(cell) ? 0 : cell.value)),
            candidateMasks: Uint16Array.from(cells, cell =>
                context
                    .getCandidates(cell)
                    .reduce((mask, candidate) => (hasMaskValue(mask, candidate) ? mask : mask + getValueBit(candidate)), 0)
            ),
            peerIndexes: cells.map(cell => context.getPeers(cell).map(peer => peer.y * valueCount + peer.x)),
            unitCellIndexes: context.getUnits().map(unit => unit.cells.map(unitCell => unitCell.y * valueCount + unitCell.x)),
            valueCount
        });
    }
}
