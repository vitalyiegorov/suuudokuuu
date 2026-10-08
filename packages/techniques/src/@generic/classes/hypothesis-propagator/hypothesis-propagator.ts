import { isDefined } from '@rnw-community/shared';

import { ForcingImplicationKindEnum } from '../../enums/forcing-implication-kind.enum';
import { createCandidateMask } from '../../utils/create-candidate-mask.util';
import { getPropagationKey } from '../../utils/get-propagation-key.util';
import { getSingleMaskValue } from '../../utils/get-single-mask-value.util';
import { hasMaskValue } from '../../utils/has-mask-value.util';
import { CandidateContext } from '../candidate-context/candidate-context';

import { HypothesisPropagationState } from './hypothesis-propagation-state';

import type { HypothesisBoardInterface } from '../../interfaces/hypothesis-board.interface';
import type { HypothesisPropagationInterface } from '../../interfaces/hypothesis-propagation.interface';

const NO_HIDDEN_SINGLE_POSITION = -1;
const CONTRADICTION_POSITION = -2;

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

    explain(cellIndex: number, value: number): HypothesisPropagationInterface {
        return this.runPropagation(cellIndex, value, true);
    }

    private runPropagation(cellIndex: number, value: number, recordImplications = false): HypothesisPropagationInterface {
        const state = new HypothesisPropagationState(this.board, cellIndex, value, recordImplications);
        let isProgressing = true;

        while (isProgressing) {
            isProgressing =
                state.drain((pendingCellIndex, pendingValue, reasonIndex) => {
                    this.assign(state, pendingCellIndex, pendingValue, reasonIndex);
                }) && this.queueHiddenSingles(state);
        }

        return state.toPropagation();
    }

    private assign(state: HypothesisPropagationState, cellIndex: number, value: number, reasonIndex: number): void {
        if (state.placedValues[cellIndex] === value) {
            return;
        }

        if (!hasMaskValue(state.masks[cellIndex], value)) {
            state.failAssignment(cellIndex, value, reasonIndex);

            return;
        }

        if (state.isRecording()) {
            state.record({
                kind: ForcingImplicationKindEnum.ASSIGNMENT,
                cell: this.board.cells[cellIndex],
                value,
                ...(reasonIndex >= 0 && { reasonIndex })
            });
        }
        state.place(cellIndex, value);

        for (const peerIndex of this.board.peerIndexes[cellIndex]) {
            if (!this.removePeerCandidate(state, cellIndex, peerIndex, value)) {
                return;
            }
        }
    }

    private removePeerCandidate(state: HypothesisPropagationState, sourceIndex: number, peerIndex: number, value: number): boolean {
        if (!hasMaskValue(state.masks[peerIndex], value)) {
            return true;
        }

        state.removeCandidate(peerIndex, value);
        if (state.isRecording()) {
            state.record({
                kind: ForcingImplicationKindEnum.PEER_REMOVAL,
                cell: this.board.cells[peerIndex],
                value,
                source: { cell: this.board.cells[sourceIndex], value }
            });
        }

        if (state.masks[peerIndex] === 0) {
            state.failEmptyCell(peerIndex);

            return false;
        }

        const singleValue = getSingleMaskValue(state.masks[peerIndex]);

        if (singleValue > 0) {
            state.queueSingle(ForcingImplicationKindEnum.NAKED_SINGLE, peerIndex, singleValue, [peerIndex]);
        }

        return true;
    }

    private queueHiddenSingles(state: HypothesisPropagationState): boolean {
        const { unitCellIndexes, valueCount } = this.board;
        let hasQueuedAssignments = false;

        for (const cellIndexes of unitCellIndexes) {
            for (let value = 1; value <= valueCount; value += 1) {
                hasQueuedAssignments = this.queueUnitHiddenSingle(state, cellIndexes, value) || hasQueuedAssignments;

                if (state.hasContradiction) {
                    return hasQueuedAssignments;
                }
            }
        }

        return hasQueuedAssignments;
    }

    private queueUnitHiddenSingle(state: HypothesisPropagationState, unitCellIndexes: number[], value: number): boolean {
        const positionIndex = this.getUnitHiddenSinglePosition(state, unitCellIndexes, value);

        if (positionIndex === CONTRADICTION_POSITION) {
            state.failNoPosition(unitCellIndexes, value);

            return false;
        }

        if (positionIndex === NO_HIDDEN_SINGLE_POSITION) {
            return false;
        }

        state.queueSingle(ForcingImplicationKindEnum.HIDDEN_SINGLE, positionIndex, value, unitCellIndexes);

        return true;
    }

    private getUnitHiddenSinglePosition(state: HypothesisPropagationState, unitCellIndexes: number[], value: number): number {
        const { cellValues } = this.board;
        const { masks, placedValues } = state;
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
