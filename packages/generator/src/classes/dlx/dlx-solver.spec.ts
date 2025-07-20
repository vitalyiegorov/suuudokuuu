import { describe, expect, it } from '@jest/globals';

import { SerializableSudoku } from '../serializable-sudoku/serializable-sudoku';

import { DLXSolver } from './dlx-solver';

// eslint-disable-next-line max-lines-per-function
describe('DLXSolver', () => {
    it('solves a standard easy puzzle', () => {
        const { Field, FullField } = SerializableSudoku.fromString(
            '534678912672195348198342567859761423426853791713924856961537284287419635345286179|53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'
        );

        const solver = new DLXSolver();

        expect(solver.solve(Field)).toStrictEqual(FullField);
    });

    it('returns the same grid when already solved', () => {
        const { FullField } = SerializableSudoku.fromString(
            '534678912672195348198342567859761423426853791713924856961537284287419635345286179|53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'
        );

        const solver = new DLXSolver();

        expect(solver.solve(FullField)).toStrictEqual(FullField);
    });

    it('returns null for an unsolvable grid', () => {
        const { FullField } = SerializableSudoku.fromString(
            '134678912672195348198342567859761423426853791713924856961537284287419635345286179|13..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'
        );

        const solver = new DLXSolver();

        expect(solver.solve(FullField)).toBeNull();
    });

    it('counts solutions for a standard easy puzzle', () => {
        const { Field } = SerializableSudoku.fromString(
            '534678912672195348198342567859761423426853791713924856961537284287419635345286179|53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'
        );

        const solver = new DLXSolver();

        expect(solver.count(Field)).toBe(1);
    });

    it('should count multiple solutions for a grid with multiple valid configurations', () => {
        const { Field } = SerializableSudoku.fromString(
            '534672918678195342192348567859761423426853791713924856961537284287419635345286179|.........................678597614234268537917139248569615372842874196.5345286179'
        );

        const solver = new DLXSolver();

        expect(solver.count(Field)).toBe(20);
    });
});
