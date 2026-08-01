import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

import { createCandidateContextFromMap } from './create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from './expect-technique-results.spec.util';

import type { TechniqueResultExpectationInterface } from '../interfaces/technique-result-expectation.spec.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';

describe('expectTechniqueResults', () => {
    it('preserves result-to-elimination pairing', () => {
        const context = createCandidateContextFromMap([2, 3, [4, 5]], [2, 4, [4, 6]], [1, 3, [4, 7]]);
        const [firstCell, secondCell] = context.getRowCells(2).slice(3, 5);
        const results: TechniqueResultInterface[] = [
            {
                technique: SolutionTechniqueEnum.XWing,
                cell: secondCell,
                value: 6,
                kind: 'elimination',
                eliminations: [{ cell: secondCell, value: 6 }],
                reasonCells: [firstCell]
            },
            {
                technique: SolutionTechniqueEnum.XWing,
                cell: firstCell,
                value: 5,
                kind: 'elimination',
                eliminations: [{ cell: firstCell, value: 5 }],
                reasonCells: [secondCell]
            }
        ];

        expect(
            () =>
                void expectTechniqueResults(context, results, [
                    {
                        technique: SolutionTechniqueEnum.XWing,
                        kind: 'elimination',
                        result: [2, 4, 6],
                        eliminations: [[2, 4, 6]],
                        reasonCells: [[2, 3]]
                    },
                    {
                        technique: SolutionTechniqueEnum.XWing,
                        kind: 'elimination',
                        result: [2, 3, 5],
                        eliminations: [[2, 3, 5]],
                        reasonCells: [[2, 4]]
                    }
                ])
        ).not.toThrow();
    });

    it('rejects swapped result and elimination pairing', () => {
        const context = createCandidateContextFromMap([2, 3, [4, 5]], [2, 4, [4, 6]]);
        const [firstCell, secondCell] = context.getRowCells(2).slice(3, 5);
        const results: TechniqueResultInterface[] = [
            {
                technique: SolutionTechniqueEnum.XWing,
                cell: firstCell,
                value: 5,
                kind: 'elimination',
                eliminations: [{ cell: secondCell, value: 6 }],
                reasonCells: [secondCell]
            },
            {
                technique: SolutionTechniqueEnum.XWing,
                cell: secondCell,
                value: 6,
                kind: 'elimination',
                eliminations: [{ cell: firstCell, value: 5 }],
                reasonCells: [firstCell]
            }
        ];

        expect(
            () =>
                void expectTechniqueResults(context, results, [
                    {
                        technique: SolutionTechniqueEnum.XWing,
                        kind: 'elimination',
                        result: [2, 3, 5],
                        eliminations: [[2, 3, 5]],
                        reasonCells: [[2, 4]]
                    },
                    {
                        technique: SolutionTechniqueEnum.XWing,
                        kind: 'elimination',
                        result: [2, 4, 6],
                        eliminations: [[2, 4, 6]],
                        reasonCells: [[2, 3]]
                    }
                ])
        ).toThrow();
    });

    it('rejects extra or wrong reason cells', () => {
        const context = createCandidateContextFromMap([2, 3, [4, 5]], [2, 4, [4, 6]]);
        const [cell, otherCell] = context.getRowCells(2).slice(3, 5);
        const results: TechniqueResultInterface[] = [
            {
                technique: SolutionTechniqueEnum.XWing,
                cell,
                value: 5,
                kind: 'elimination',
                eliminations: [{ cell, value: 5 }],
                reasonCells: [cell, otherCell]
            }
        ];

        expect(
            () =>
                void expectTechniqueResults(context, results, [
                    {
                        technique: SolutionTechniqueEnum.XWing,
                        kind: 'elimination',
                        result: [2, 3, 5],
                        eliminations: [[2, 3, 5]],
                        reasonCells: [[2, 4]]
                    }
                ])
        ).toThrow();
    });

    it('rejects duplicate results and eliminations', () => {
        const context = createCandidateContextFromMap([2, 3, [4, 5]], [2, 4, [4, 6]]);
        const [cell, otherCell] = context.getRowCells(2).slice(3, 5);
        const results: TechniqueResultInterface[] = [
            {
                technique: SolutionTechniqueEnum.XWing,
                cell,
                value: 5,
                kind: 'elimination',
                eliminations: [
                    { cell, value: 5 },
                    { cell, value: 5 }
                ],
                reasonCells: [otherCell]
            }
        ];

        expect(
            () =>
                void expectTechniqueResults(context, results, [
                    {
                        technique: SolutionTechniqueEnum.XWing,
                        kind: 'elimination',
                        result: [2, 3, 5],
                        eliminations: [[2, 3, 5]],
                        reasonCells: [[2, 4]]
                    }
                ])
        ).toThrow();
    });

    it('rejects duplicate complete results when expectations repeat them', () => {
        const context = createCandidateContextFromMap([2, 3, [4, 5]], [2, 4, [4, 6]]);
        const [cell, reasonCell] = context.getRowCells(2).slice(3, 5);
        const result: TechniqueResultInterface = {
            technique: SolutionTechniqueEnum.XWing,
            cell,
            value: 5,
            kind: 'elimination',
            eliminations: [{ cell, value: 5 }],
            reasonCells: [reasonCell]
        };
        const expectations: TechniqueResultExpectationInterface[] = [
            {
                technique: SolutionTechniqueEnum.XWing,
                kind: 'elimination',
                result: [2, 3, 5],
                eliminations: [[2, 3, 5]],
                reasonCells: [[2, 4]]
            },
            {
                technique: SolutionTechniqueEnum.XWing,
                kind: 'elimination',
                result: [2, 3, 5],
                eliminations: [[2, 3, 5]],
                reasonCells: [[2, 4]]
            }
        ];

        expect(() => void expectTechniqueResults(context, [result, result], expectations)).toThrow();
    });

    it('rejects duplicate eliminations when expectations repeat them', () => {
        const context = createCandidateContextFromMap([2, 3, [4, 5]], [2, 4, [4, 6]]);
        const [cell, reasonCell] = context.getRowCells(2).slice(3, 5);
        const result: TechniqueResultInterface = {
            technique: SolutionTechniqueEnum.XWing,
            cell,
            value: 5,
            kind: 'elimination',
            eliminations: [
                { cell, value: 5 },
                { cell, value: 5 }
            ],
            reasonCells: [reasonCell]
        };

        expect(
            () =>
                void expectTechniqueResults(
                    context,
                    [result],
                    [
                        {
                            technique: SolutionTechniqueEnum.XWing,
                            kind: 'elimination',
                            result: [2, 3, 5],
                            eliminations: [
                                [2, 3, 5],
                                [2, 3, 5]
                            ],
                            reasonCells: [[2, 4]]
                        }
                    ]
                )
        ).toThrow();
    });

    it('allows the same deduction with different reason paths', () => {
        const context = createCandidateContextFromMap([1, 3, [4, 7]], [2, 3, [4, 5]], [2, 4, [4, 6]]);
        const [firstReasonCell] = context.getRowCells(1).slice(3, 4);
        const [cell, secondReasonCell] = context.getRowCells(2).slice(3, 5);
        const firstResult: TechniqueResultInterface = {
            technique: SolutionTechniqueEnum.XWing,
            cell,
            value: 5,
            kind: 'elimination',
            eliminations: [{ cell, value: 5 }],
            reasonCells: [firstReasonCell]
        };
        const secondResult: TechniqueResultInterface = { ...firstResult, reasonCells: [secondReasonCell] };

        expect(
            () =>
                void expectTechniqueResults(
                    context,
                    [firstResult, secondResult],
                    [
                        {
                            technique: SolutionTechniqueEnum.XWing,
                            kind: 'elimination',
                            result: [2, 3, 5],
                            eliminations: [[2, 3, 5]],
                            reasonCells: [[1, 3]]
                        },
                        {
                            technique: SolutionTechniqueEnum.XWing,
                            kind: 'elimination',
                            result: [2, 3, 5],
                            eliminations: [[2, 3, 5]],
                            reasonCells: [[2, 4]]
                        }
                    ]
                )
        ).not.toThrow();
    });

    it('sorts same-primary deductions by their full normalized content', () => {
        const context = createCandidateContextFromMap([1, 3, [4, 7]], [2, 3, [4, 5]], [2, 4, [4, 6]]);
        const [firstReasonCell] = context.getRowCells(1).slice(3, 4);
        const [cell, secondReasonCell] = context.getRowCells(2).slice(3, 5);
        const firstResult: TechniqueResultInterface = {
            technique: SolutionTechniqueEnum.XWing,
            cell,
            value: 5,
            kind: 'elimination',
            eliminations: [{ cell, value: 5 }],
            reasonCells: [firstReasonCell]
        };
        const secondResult: TechniqueResultInterface = { ...firstResult, reasonCells: [secondReasonCell] };

        expect(
            () =>
                void expectTechniqueResults(
                    context,
                    [firstResult, secondResult],
                    [
                        {
                            technique: SolutionTechniqueEnum.XWing,
                            kind: 'elimination',
                            result: [2, 3, 5],
                            eliminations: [[2, 3, 5]],
                            reasonCells: [[2, 4]]
                        },
                        {
                            technique: SolutionTechniqueEnum.XWing,
                            kind: 'elimination',
                            result: [2, 3, 5],
                            eliminations: [[2, 3, 5]],
                            reasonCells: [[1, 3]]
                        }
                    ]
                )
        ).not.toThrow();
    });

    it('asserts exact placement semantics', () => {
        const context = createCandidateContextFromMap([2, 3, [5]]);
        const [cell] = context.getRowCells(2).slice(3, 4);
        const result: TechniqueResultInterface = {
            technique: SolutionTechniqueEnum.NakedSingle,
            cell,
            value: 5,
            kind: 'placement',
            eliminations: [],
            reasonCells: [cell]
        };

        expect(
            () =>
                void expectTechniqueResults(
                    context,
                    [result],
                    [
                        {
                            technique: SolutionTechniqueEnum.NakedSingle,
                            kind: 'placement',
                            result: [2, 3, 5],
                            eliminations: [],
                            reasonCells: [[2, 3]]
                        }
                    ]
                )
        ).not.toThrow();
    });
});
