import { isDefined } from '@rnw-community/shared';

import { createCandidateMask } from '../../utils/create-candidate-mask.util';
import { getEliminatedMask } from '../../utils/get-eliminated-mask.util';
import { getPropagationKey } from '../../utils/get-propagation-key.util';
import { getSingleMaskValue } from '../../utils/get-single-mask-value.util';
import { hasMaskValue } from '../../utils/has-mask-value.util';
import { removeMaskValue } from '../../utils/remove-mask-value.util';
import { CandidateContext } from '../candidate-context/candidate-context';

import type { HypothesisBoardInterface } from '../../interfaces/hypothesis-board.interface';
import type { HypothesisPropagationStateInterface } from '../../interfaces/hypothesis-propagation-state.interface';
import type { HypothesisPropagationInterface } from '../../interfaces/hypothesis-propagation.interface';

export class HypothesisPropagator {
    private readonly propagations = new Map<number, HypothesisPropagationInterface>();

    constructor(private readonly board: HypothesisBoardInterface) {}

    getBoard(): HypothesisBoardInterface {
        return this.board;
    }

    getPropagationCount(): number {
        return this.propagations.size;
    }

    propagate(cellIndex: number, value: number): HypothesisPropagationInterface {
        const propagationKey = getPropagationKey(this.board, cellIndex, value);
        const cachedPropagation = this.propagations.get(propagationKey);

        if (isDefined(cachedPropagation)) {
            return cachedPropagation;
        }

        const propagation = this.runPropagation(cellIndex, value);

        this.propagations.set(propagationKey, propagation);

        return propagation;
    }

    private createPropagationState(cellIndex: number, value: number): HypothesisPropagationStateInterface {
        return {
            masks: Uint16Array.from(this.board.candidateMasks),
            placedValues: new Int8Array(this.board.cells.length),
            placedCellIndexes: [],
            pendingCellIndexes: [cellIndex],
            pendingValues: [value],
            hasContradiction: false
        };
    }

    private runPropagation(cellIndex: number, value: number): HypothesisPropagationInterface {
        const state = this.createPropagationState(cellIndex, value);
        let isProgressing = true;

        while (isProgressing) {
            isProgressing = this.drainPendingAssignments(state) && this.queueHiddenSingles(state);
        }

        return this.createPropagation(state);
    }

    private drainPendingAssignments(state: HypothesisPropagationStateInterface): boolean {
        let pendingIndex = 0;

        while (pendingIndex < state.pendingCellIndexes.length && !state.hasContradiction) {
            this.assign(state, state.pendingCellIndexes[pendingIndex], state.pendingValues[pendingIndex]);
            pendingIndex += 1;
        }

        state.pendingCellIndexes = [];
        state.pendingValues = [];

        return !state.hasContradiction;
    }

    private assign(state: HypothesisPropagationStateInterface, cellIndex: number, value: number): void {
        if (state.placedValues[cellIndex] === value) {
            return;
        }

        if (!hasMaskValue(state.masks[cellIndex], value)) {
            state.hasContradiction = true;

            return;
        }

        state.placedValues[cellIndex] = value;
        state.placedCellIndexes.push(cellIndex);
        state.masks[cellIndex] = 0;

        for (const peerIndex of this.board.peerIndexes[cellIndex]) {
            if (!this.removePeerCandidate(state, peerIndex, value)) {
                return;
            }
        }
    }

    private removePeerCandidate(state: HypothesisPropagationStateInterface, peerIndex: number, value: number): boolean {
        if (!hasMaskValue(state.masks[peerIndex], value)) {
            return true;
        }

        state.masks[peerIndex] = removeMaskValue(state.masks[peerIndex], value);

        if (state.masks[peerIndex] === 0) {
            state.hasContradiction = true;

            return false;
        }

        const singleValue = getSingleMaskValue(state.masks[peerIndex]);

        if (singleValue > 0) {
            state.pendingCellIndexes.push(peerIndex);
            state.pendingValues.push(singleValue);
        }

        return true;
    }

    private queueHiddenSingles(state: HypothesisPropagationStateInterface): boolean {
        let hasQueuedAssignments = false;

        for (const unitCellIndexes of this.board.unitCellIndexes) {
            for (let value = 1; value <= this.board.valueCount; value += 1) {
                hasQueuedAssignments = this.queueUnitHiddenSingle(state, unitCellIndexes, value) || hasQueuedAssignments;

                if (state.hasContradiction) {
                    return hasQueuedAssignments;
                }
            }
        }

        return hasQueuedAssignments;
    }

    private queueUnitHiddenSingle(state: HypothesisPropagationStateInterface, unitCellIndexes: number[], value: number): boolean {
        if (this.hasUnitValue(state, unitCellIndexes, value)) {
            return false;
        }

        const positionIndexes = unitCellIndexes.filter(cellIndex => hasMaskValue(state.masks[cellIndex], value));
        const [firstPositionIndex] = positionIndexes;

        if (positionIndexes.length === 0) {
            state.hasContradiction = true;

            return false;
        }

        if (positionIndexes.length > 1) {
            return false;
        }

        state.pendingCellIndexes.push(firstPositionIndex);
        state.pendingValues.push(value);

        return true;
    }

    private hasUnitValue(state: HypothesisPropagationStateInterface, unitCellIndexes: number[], value: number): boolean {
        return unitCellIndexes.some(cellIndex => this.board.cellValues[cellIndex] === value || state.placedValues[cellIndex] === value);
    }

    private createPropagation(state: HypothesisPropagationStateInterface): HypothesisPropagationInterface {
        const eliminatedMasks = new Uint16Array(this.board.cells.length);

        for (let cellIndex = 0; cellIndex < eliminatedMasks.length; cellIndex += 1) {
            eliminatedMasks[cellIndex] = getEliminatedMask(
                this.board.candidateMasks[cellIndex],
                state.masks[cellIndex],
                state.placedValues[cellIndex]
            );
        }

        return {
            hasContradiction: state.hasContradiction,
            placedValues: state.placedValues,
            placedCellIndexes: state.placedCellIndexes,
            eliminatedMasks
        };
    }

    static fromContext(context: CandidateContext): HypothesisPropagator {
        const cells = context.getCells();
        const cellIndexByKey: Record<string, number> = {};

        cells.forEach((cell, cellIndex) => {
            cellIndexByKey[CandidateContext.getCellKey(cell)] = cellIndex;
        });

        return new HypothesisPropagator({
            cells,
            cellValues: cells.map(cell => (context.isBlankCell(cell) ? 0 : cell.value)),
            candidateMasks: Uint16Array.from(cells, cell => createCandidateMask(context.getCandidates(cell))),
            peerIndexes: cells.map(cell => context.getPeers(cell).map(peer => cellIndexByKey[CandidateContext.getCellKey(peer)])),
            unitCellIndexes: context
                .getUnits()
                .map(unit => unit.cells.map(unitCell => cellIndexByKey[CandidateContext.getCellKey(unitCell)])),
            valueCount: context.getValues().length
        });
    }
}
