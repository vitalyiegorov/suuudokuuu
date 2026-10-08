import { ForcingImplicationKindEnum } from '../../enums/forcing-implication-kind.enum';
import { ForcingOutcomeKindEnum } from '../../enums/forcing-outcome-kind.enum';
import { getEliminatedMask } from '../../utils/get-eliminated-mask.util';
import { removeMaskValue } from '../../utils/remove-mask-value.util';

import type { HypothesisBoardInterface } from '../../interfaces/hypothesis-board.interface';
import type { HypothesisPropagationInterface } from '../../interfaces/hypothesis-propagation.interface';
import type { ForcingImplicationType } from '../../types/forcing-implication.type';
import type { ForcingContradictionType } from '../../types/forcing-outcome.type';

export class HypothesisPropagationState {
    readonly masks: Uint16Array;
    readonly placedValues: Int8Array;
    readonly placedCellIndexes: number[] = [];
    private contradicted = false;
    private pendingCellIndexes: number[];
    private pendingValues: number[];
    private pendingReasonIndexes: number[];
    private readonly implications?: ForcingImplicationType[];
    private contradiction?: ForcingContradictionType;

    constructor(
        private readonly board: HypothesisBoardInterface,
        private readonly assumptionCellIndex: number,
        private readonly assumptionValue: number,
        recordImplications: boolean
    ) {
        this.masks = Uint16Array.from(board.candidateMasks);
        this.placedValues = new Int8Array(board.cells.length);
        this.pendingCellIndexes = [assumptionCellIndex];
        this.pendingValues = [assumptionValue];
        this.pendingReasonIndexes = [-1];
        if (recordImplications) {
            this.implications = [];
        }
    }

    get hasContradiction(): boolean {
        return this.contradicted;
    }

    isRecording(): boolean {
        return Boolean(this.implications);
    }

    getImplicationCount(): number {
        return this.implications?.length ?? 0;
    }

    drain(assign: (cellIndex: number, value: number, reasonIndex: number) => void): boolean {
        let pendingIndex = 0;

        while (pendingIndex < this.pendingCellIndexes.length && !this.hasContradiction) {
            assign(this.pendingCellIndexes[pendingIndex], this.pendingValues[pendingIndex], this.pendingReasonIndexes[pendingIndex]);
            pendingIndex += 1;
        }

        this.pendingCellIndexes = [];
        this.pendingValues = [];
        this.pendingReasonIndexes = [];

        return !this.hasContradiction;
    }

    place(cellIndex: number, value: number): void {
        this.placedValues[cellIndex] = value;
        this.placedCellIndexes.push(cellIndex);
        this.masks[cellIndex] = 0;
    }

    removeCandidate(cellIndex: number, value: number): void {
        this.masks[cellIndex] = removeMaskValue(this.masks[cellIndex], value);
    }

    record(implication: ForcingImplicationType): number {
        if (!this.implications) {
            return -1;
        }

        const implicationIndex = this.implications.length;
        this.implications.push(implication);

        return implicationIndex;
    }

    queueSingle(
        kind: ForcingImplicationKindEnum.NAKED_SINGLE | ForcingImplicationKindEnum.HIDDEN_SINGLE,
        cellIndex: number,
        value: number,
        supportCellIndexes: readonly number[]
    ): void {
        let reasonIndex = -1;

        if (this.implications) {
            reasonIndex = this.record({
                kind,
                cell: this.board.cells[cellIndex],
                value,
                supportCells: supportCellIndexes.map(index => this.board.cells[index]),
                prefixLength: this.getImplicationCount()
            });
        }

        this.pendingCellIndexes.push(cellIndex);
        this.pendingValues.push(value);
        this.pendingReasonIndexes.push(reasonIndex);
    }

    failAssignment(cellIndex: number, value: number, reasonIndex: number): void {
        this.contradicted = true;
        if (this.implications) {
            this.contradiction = {
                kind: ForcingOutcomeKindEnum.ASSIGNMENT_CONFLICT,
                cell: this.board.cells[cellIndex],
                value,
                reasonIndex,
                implicationPrefixLength: this.getImplicationCount()
            };
        }
    }

    failEmptyCell(cellIndex: number): void {
        this.contradicted = true;
        if (this.implications) {
            this.contradiction = {
                kind: ForcingOutcomeKindEnum.EMPTY_CELL,
                cell: this.board.cells[cellIndex],
                implicationPrefixLength: this.getImplicationCount()
            };
        }
    }

    failNoPosition(unitCellIndexes: number[], value: number): void {
        this.contradicted = true;
        if (this.implications) {
            this.contradiction = {
                kind: ForcingOutcomeKindEnum.NO_POSITION,
                unitCells: unitCellIndexes.map(cellIndex => this.board.cells[cellIndex]),
                value,
                implicationPrefixLength: this.getImplicationCount()
            };
        }
    }

    toPropagation(): HypothesisPropagationInterface {
        const eliminatedMasks = new Uint16Array(this.board.cells.length);

        for (let cellIndex = 0; cellIndex < eliminatedMasks.length; cellIndex += 1) {
            eliminatedMasks[cellIndex] = getEliminatedMask(
                this.board.candidateMasks[cellIndex],
                this.masks[cellIndex],
                this.placedValues[cellIndex]
            );
        }

        return {
            assumptionCellIndex: this.assumptionCellIndex,
            assumptionValue: this.assumptionValue,
            hasContradiction: this.hasContradiction,
            placedValues: this.placedValues,
            placedCellIndexes: this.placedCellIndexes,
            eliminatedMasks,
            ...(this.implications && { implications: this.implications }),
            ...(this.contradiction && { contradiction: this.contradiction })
        };
    }
}
