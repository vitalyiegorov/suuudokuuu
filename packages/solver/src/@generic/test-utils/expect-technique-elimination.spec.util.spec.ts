import { describe, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

import { createCandidateContextFromMap } from './create-candidate-context-from-map.spec.util';
import { expectTechniqueElimination } from './expect-technique-elimination.spec.util';

import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';

describe('expectTechniqueElimination', () => {
    it('matches an elimination by technique, row, column, and value', () => {
        const context = createCandidateContextFromMap([2, 3, [4, 5]]);
        const [cell] = context.getRowCells(2).slice(3, 4);
        const results: TechniqueResultInterface[] = [
            {
                technique: SolutionTechniqueEnum.XWing,
                cell,
                value: 4,
                kind: 'elimination',
                eliminations: [{ cell, value: 4 }],
                reasonCells: []
            }
        ];

        expectTechniqueElimination(results, { technique: SolutionTechniqueEnum.XWing, rowIndex: 2, columnIndex: 3, value: 4 });
    });
});
