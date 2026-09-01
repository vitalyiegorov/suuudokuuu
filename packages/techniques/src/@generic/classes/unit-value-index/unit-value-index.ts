import { isDefined } from '@rnw-community/shared';

import type { CandidateUnitInterface } from '../../interfaces/candidate-unit.interface';
import type { UnitValueEntryInterface } from '../../interfaces/unit-value-entry.interface';
import type { LineType } from '../../types/line.type';
import type { CandidateContext } from '../candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

type MutableUnitValueEntryType = {
    readonly cells: CellInterface[];
    readonly positions: number[];
};

type UnitValueEntriesType = (MutableUnitValueEntryType | undefined)[];

const emptyUnitValueEntry: UnitValueEntryInterface = Object.freeze({
    cells: Object.freeze([]),
    positions: Object.freeze([])
});

const addCellToEntries = (entries: UnitValueEntriesType, slot: number, cell: CellInterface, position: number): void => {
    const entry = entries[slot];

    if (isDefined(entry)) {
        entry.cells.push(cell);
        entry.positions.push(position);
    } else {
        entries[slot] = { cells: [cell], positions: [position] };
    }
};

const createUnitValueEntries = (
    context: CandidateContext,
    units: readonly CandidateUnitInterface[],
    valueSlotCount: number
): UnitValueEntriesType => {
    const entries: UnitValueEntriesType = new Array<MutableUnitValueEntryType | undefined>(units.length * valueSlotCount);

    for (let unitPosition = 0; unitPosition < units.length; unitPosition += 1) {
        const unitCells = units[unitPosition].cells;

        for (let position = 0; position < unitCells.length; position += 1) {
            const cell = unitCells[position];

            for (const value of context.getCandidates(cell)) {
                addCellToEntries(entries, unitPosition * valueSlotCount + value, cell, position);
            }
        }
    }

    return entries;
};

const createLineUnitPositions = (units: readonly CandidateUnitInterface[], lineType: LineType): number[] => {
    const lineUnitPositions: number[] = [];

    for (let unitPosition = 0; unitPosition < units.length; unitPosition += 1) {
        if (units[unitPosition].type === lineType) {
            lineUnitPositions.push(unitPosition);
        }
    }

    return lineUnitPositions;
};

export class UnitValueIndex {
    readonly units: readonly CandidateUnitInterface[];

    private readonly valueSlotCount: number;
    private readonly entriesByUnitValue: readonly (MutableUnitValueEntryType | undefined)[];
    private readonly rowUnitPositions: readonly number[];
    private readonly columnUnitPositions: readonly number[];

    constructor(context: CandidateContext) {
        const units = context.getUnits();
        const valueSlotCount = context.getValues().length + 1;

        this.units = units;
        this.valueSlotCount = valueSlotCount;
        this.entriesByUnitValue = createUnitValueEntries(context, units, valueSlotCount);
        this.rowUnitPositions = createLineUnitPositions(units, 'row');
        this.columnUnitPositions = createLineUnitPositions(units, 'column');
    }

    getUnitValueEntry(unitPosition: number, value: number): UnitValueEntryInterface {
        return this.entriesByUnitValue[unitPosition * this.valueSlotCount + value] ?? emptyUnitValueEntry;
    }

    getLineUnitPositions(lineType: LineType): readonly number[] {
        return lineType === 'row' ? this.rowUnitPositions : this.columnUnitPositions;
    }

    getLineUnitPosition(lineType: LineType, lineIndex: number): number {
        return this.getLineUnitPositions(lineType)[lineIndex];
    }
}
