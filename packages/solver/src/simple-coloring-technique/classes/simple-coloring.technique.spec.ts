import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { SimpleColoringTechnique } from './simple-coloring.technique';

describe('SimpleColoringTechnique', () => {
    it('uses a color trap to eliminate a candidate that sees both colors', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [4, 0, [1, 5]],
            [0, 0, [2, 5]],
            [1, 1, [3, 5]],
            [1, 4, [4, 5]],
            [4, 4, [5, 6]],
            [4, 8, [5, 7]],
            [8, 4, [5, 8]]
        );

        expectTechniqueResults(context, new SimpleColoringTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.SimpleColoring,
                kind: 'elimination',
                result: [4, 4, 5],
                eliminations: [[4, 4, 5]],
                reasonCells: [
                    [0, 0],
                    [1, 1],
                    [1, 4],
                    [4, 0]
                ]
            }
        ]);
    });

    it('uses a color wrap to eliminate every candidate with the contradictory color', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 5]], [0, 2, [2, 5]], [2, 2, [3, 5]], [1, 1, [4, 5]]);
        expectTechniqueResults(context, new SimpleColoringTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.SimpleColoring,
                kind: 'elimination',
                result: [0, 0, 5],
                eliminations: [
                    [0, 0, 5],
                    [2, 2, 5]
                ],
                reasonCells: [
                    [0, 0],
                    [0, 2],
                    [2, 2]
                ]
            },
            {
                technique: SolutionTechniqueEnum.SimpleColoring,
                kind: 'elimination',
                result: [1, 1, 5],
                eliminations: [[1, 1, 5]],
                reasonCells: [
                    [0, 0],
                    [0, 2],
                    [2, 2]
                ]
            }
        ]);
    });

    it('does not use a color trap after a conjugate link gains a third candidate', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [4, 0, [1, 5]],
            [0, 0, [2, 5]],
            [1, 1, [3, 5]],
            [1, 4, [4, 5]],
            [4, 4, [5, 6]],
            [4, 8, [5, 7]],
            [8, 4, [5, 8]],
            [8, 0, [5, 9]]
        );

        expect(new SimpleColoringTechnique().find(context)).toEqual([]);
    });

    it('does not use a color wrap after a conjugate link gains a third candidate', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 5]], [0, 2, [2, 5]], [2, 2, [3, 5]], [1, 1, [4, 5]], [0, 8, [5, 6]]);
        const hasInvalidatedWrap = new SimpleColoringTechnique().find(context).some(result => {
            const eliminations = result.eliminations.map(elimination => [elimination.cell.y, elimination.cell.x, elimination.value]);

            return eliminations.some(([rowIndex, columnIndex, value]) => rowIndex === 2 && columnIndex === 2 && value === 5);
        });

        expect(hasInvalidatedWrap).toBe(false);
    });
});
