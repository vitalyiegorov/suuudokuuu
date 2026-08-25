import { describe, expect, it } from '@jest/globals';

import { buildFieldCellView } from './build-field-cell-view.util';

import type { FieldCellViewContextInterface } from '../interfaces/field-cell-view-context.interface';

const createCell = (y: number, x: number, value = 0) => ({ x, y, value, group: Math.floor(y / 3) * 3 + Math.floor(x / 3) });

const emptyStepState = {
    patternCellKeys: new Set<string>(),
    targetCellKey: null,
    revealedCandidates: new Map<string, number[]>(),
    eliminatedCandidates: new Map<string, number[]>(),
    placedValues: new Map<string, number>()
};

const createContext = (context: Partial<FieldCellViewContextInterface>): FieldCellViewContextInterface => ({
    givenCellKeys: new Set<string>(),
    stepState: emptyStepState,
    ...context
});

describe('buildFieldCellView', () => {
    it('marks the selected cell without highlighting it as a peer', () => {
        const cell = createCell(4, 4, 7);
        const view = buildFieldCellView(cell, [], createContext({ selectedCell: cell }));

        expect(view.key).toBe('4-4');
        expect(view.isSelected).toBe(true);
        expect(view.isHighlighted).toBe(false);
        expect(view.isSameValue).toBe(false);
    });

    it('highlights cells sharing a row, column or group with the selection', () => {
        const selectedCell = createCell(4, 4, 7);
        const rowView = buildFieldCellView(createCell(4, 0), [], createContext({ selectedCell }));
        const columnView = buildFieldCellView(createCell(0, 4), [], createContext({ selectedCell }));
        const groupView = buildFieldCellView(createCell(3, 3), [], createContext({ selectedCell }));
        const unrelatedView = buildFieldCellView(createCell(0, 0), [], createContext({ selectedCell }));

        expect(rowView.isHighlighted).toBe(true);
        expect(columnView.isHighlighted).toBe(true);
        expect(groupView.isHighlighted).toBe(true);
        expect(unrelatedView.isHighlighted).toBe(false);
    });

    it('marks cells carrying the selected value', () => {
        const selectedCell = createCell(4, 4, 7);
        const view = buildFieldCellView(createCell(0, 0, 7), [], createContext({ selectedCell }));
        const blankView = buildFieldCellView(createCell(0, 1), [], createContext({ selectedCell }));

        expect(view.isSameValue).toBe(true);
        expect(blankView.isSameValue).toBe(false);
    });

    it('marks given cells and the mistake cell', () => {
        const cell = createCell(1, 1, 4);
        const view = buildFieldCellView(cell, [], createContext({ givenCellKeys: new Set(['1-1']), mistakeCell: cell }));

        expect(view.isGiven).toBe(true);
        expect(view.isWrong).toBe(true);
    });

    it('merges revealed step candidates with the stored notes', () => {
        const cell = createCell(0, 0);
        const stepState = {
            ...emptyStepState,
            patternCellKeys: new Set(['0-0']),
            targetCellKey: '0-0',
            revealedCandidates: new Map([['0-0', [3, 7]]]),
            eliminatedCandidates: new Map([['0-0', [7]]]),
            placedValues: new Map([['0-0', 3]])
        };
        const view = buildFieldCellView(cell, [9], createContext({ stepState }));

        expect(view.candidates).toEqual([3, 7, 9]);
        expect(view.eliminatedCandidates).toEqual([7]);
        expect(view.placedValue).toBe(3);
        expect(view.isPatternCell).toBe(true);
        expect(view.isTargetCell).toBe(true);
    });
});
