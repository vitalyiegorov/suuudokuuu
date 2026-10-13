import { describe, expect, it } from 'vitest';

import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';

import { createCandidateContextFromMap } from './create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from './expect-technique-results.spec.util';

import type { TechniqueResultInterface } from '../../../src/@generic/interfaces/technique-result.interface';
import type { TechniqueResultExpectationInterface } from '../interfaces/technique-result-expectation.spec.interface';

const context = createCandidateContextFromMap([1, 3, [4, 7]], [2, 3, [4, 5]], [2, 4, [4, 6]]);
const [cell, reasonCell] = context.getRowCells(2).slice(3, 5);
const [otherReasonCell] = context.getRowCells(1).slice(3, 4);
const result: TechniqueResultInterface = {
    technique: SolutionTechniqueEnum.XWing,
    cell,
    value: 5,
    kind: 'elimination',
    eliminations: [{ cell, value: 5 }],
    reasonCells: [reasonCell]
};
const expectation: TechniqueResultExpectationInterface = {
    technique: SolutionTechniqueEnum.XWing,
    kind: 'elimination',
    result: [2, 3, 5],
    eliminations: [[2, 3, 5]],
    reasonCells: [[2, 4]]
};

describe('expectTechniqueResults', () => {
    it('preserves result-to-elimination pairing regardless of order', () => {
        const secondResult: TechniqueResultInterface = {
            ...result,
            cell: reasonCell,
            value: 6,
            eliminations: [{ cell: reasonCell, value: 6 }],
            reasonCells: [cell]
        };
        const secondExpectation: TechniqueResultExpectationInterface = {
            ...expectation,
            result: [2, 4, 6],
            eliminations: [[2, 4, 6]],
            reasonCells: [[2, 3]]
        };

        expect(() => void expectTechniqueResults(context, [secondResult, result], [expectation, secondExpectation])).not.toThrow();
        expect(
            () =>
                void expectTechniqueResults(
                    context,
                    [
                        { ...result, eliminations: secondResult.eliminations },
                        { ...secondResult, eliminations: result.eliminations }
                    ],
                    [expectation, secondExpectation]
                )
        ).toThrow();
    });

    it('rejects extra or wrong reason cells', () => {
        expect(() => void expectTechniqueResults(context, [{ ...result, reasonCells: [cell, reasonCell] }], [expectation])).toThrow();
    });

    it('rejects duplicate results even when expectations repeat them', () => {
        expect(() => void expectTechniqueResults(context, [result, result], [expectation, expectation])).toThrow();
    });

    it('rejects duplicate eliminations even when expectations repeat them', () => {
        const duplicateResult = { ...result, eliminations: [...result.eliminations, ...result.eliminations] };

        expect(() => void expectTechniqueResults(context, [duplicateResult], [expectation])).toThrow();
        expect(
            () =>
                void expectTechniqueResults(
                    context,
                    [duplicateResult],
                    [{ ...expectation, eliminations: [...expectation.eliminations, ...expectation.eliminations] }]
                )
        ).toThrow();
    });

    it('allows distinct reason paths and sorts same-primary deductions by full content', () => {
        const otherResult = { ...result, reasonCells: [otherReasonCell] };
        const otherExpectation: TechniqueResultExpectationInterface = { ...expectation, reasonCells: [[1, 3]] };

        expect(() => void expectTechniqueResults(context, [otherResult, result], [expectation, otherExpectation])).not.toThrow();
    });

    it('asserts exact placement semantics', () => {
        const placement: TechniqueResultInterface = {
            ...result,
            technique: SolutionTechniqueEnum.NakedSingle,
            kind: 'placement',
            eliminations: [],
            reasonCells: [cell]
        };
        const placementExpectation: TechniqueResultExpectationInterface = {
            ...expectation,
            technique: SolutionTechniqueEnum.NakedSingle,
            kind: 'placement',
            eliminations: [],
            reasonCells: [[2, 3]]
        };

        expect(() => void expectTechniqueResults(context, [placement], [placementExpectation])).not.toThrow();
    });
});
