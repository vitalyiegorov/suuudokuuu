import { describe, expect, it } from 'vitest';

import { FieldHistory } from '../../../src/field-engine/classes/field-history';

const initialState = { sudokuString: 'initial', candidates: {}, eliminatedCandidates: {} };
const firstState = { ...initialState, sudokuString: 'first' };
const secondState = { ...initialState, sudokuString: 'second' };

describe('FieldHistory', () => {
    it('walks consecutive states in both directions', () => {
        const history = new FieldHistory();

        expect(history.undo()).toBeNull();
        expect(history.redo()).toBeNull();
        history.push({ previous: initialState, next: firstState });
        history.push({ previous: firstState, next: secondState });
        expect(history.undo()).toEqual(firstState);
        expect(history.undo()).toEqual(initialState);
        expect(history.undo()).toBeNull();
        expect(history.redo()).toEqual(firstState);
        expect(history.redo()).toEqual(secondState);
        expect(history.redo()).toBeNull();
    });

    it('discards only the redo states when branching', () => {
        const history = new FieldHistory();

        history.push({ previous: initialState, next: firstState });
        history.push({ previous: firstState, next: secondState });
        history.undo();
        history.push({ previous: firstState, next: initialState });
        expect(history.CanRedo).toBe(false);
        expect(history.undo()).toEqual(firstState);
        expect(history.undo()).toEqual(initialState);
        expect(history.redo()).toEqual(firstState);
        expect(history.redo()).toEqual(initialState);
    });
});
