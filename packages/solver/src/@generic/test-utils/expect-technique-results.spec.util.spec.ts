import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

import { createCandidateContextFromMap } from './create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from './expect-technique-results.spec.util';

import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';

describe('expectTechniqueResults', () => {
    it('matches complete normalized elimination results regardless of collection order', () => {
        const context = createCandidateContextFromMap([2, 3, [4, 5]], [2, 4, [4, 6]], [1, 3, [4, 7]]);
        const [firstReasonCell] = context.getRowCells(1).slice(3, 4);
        const [cell, secondCell] = context.getRowCells(2).slice(3, 5);
        const eliminations = [
            { cell: secondCell, value: 4 },
            { cell, value: 4 }
        ];
        const reasonCells = [secondCell, firstReasonCell];
        const results: TechniqueResultInterface[] = [
            {
                technique: SolutionTechniqueEnum.XWing,
                cell: secondCell,
                value: 6,
                kind: 'elimination',
                eliminations,
                reasonCells
            },
            {
                technique: SolutionTechniqueEnum.XWing,
                cell,
                value: 5,
                kind: 'elimination',
                eliminations,
                reasonCells
            }
        ];

        expectTechniqueResults(results, {
            technique: SolutionTechniqueEnum.XWing,
            results: [
                [2, 3, 5],
                [2, 4, 6]
            ],
            eliminations: [
                [2, 3, 4],
                [2, 4, 4]
            ]
        });
    });

    it('rejects an unexpected elimination', () => {
        const context = createCandidateContextFromMap([2, 3, [4, 5]], [2, 4, [4, 6]]);
        const [cell, unexpectedCell] = context.getRowCells(2).slice(3, 5);
        const results: TechniqueResultInterface[] = [
            {
                technique: SolutionTechniqueEnum.XWing,
                cell,
                value: 4,
                kind: 'elimination',
                eliminations: [
                    { cell, value: 4 },
                    { cell: unexpectedCell, value: 4 }
                ],
                reasonCells: []
            }
        ];

        expect(() => {
            expectTechniqueResults(results, {
                technique: SolutionTechniqueEnum.XWing,
                results: [[2, 3, 4]],
                eliminations: [[2, 3, 4]]
            });
        }).toThrow();
    });

    it('rejects an unexpected result', () => {
        const context = createCandidateContextFromMap([2, 3, [4, 5]], [2, 4, [4, 6]]);
        const [cell, unexpectedCell] = context.getRowCells(2).slice(3, 5);
        const eliminations = [{ cell, value: 4 }];
        const results: TechniqueResultInterface[] = [
            {
                technique: SolutionTechniqueEnum.XWing,
                cell,
                value: 4,
                kind: 'elimination',
                eliminations,
                reasonCells: []
            },
            {
                technique: SolutionTechniqueEnum.XWing,
                cell: unexpectedCell,
                value: 6,
                kind: 'elimination',
                eliminations,
                reasonCells: []
            }
        ];

        expect(() => {
            expectTechniqueResults(results, {
                technique: SolutionTechniqueEnum.XWing,
                results: [[2, 3, 4]],
                eliminations: [[2, 3, 4]]
            });
        }).toThrow();
    });
});
