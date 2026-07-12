import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../test-utils/create-candidate-context-from-map.spec.util';

import { canSee } from './can-see.util';
import { createEliminationResults } from './create-elimination-results.util';
import { createPlacementResult } from './create-placement-result.util';
import { getBivalueCells } from './get-bivalue-cells.util';
import { getCombinations } from './get-combinations.util';
import { getCommonPeerEliminations } from './get-common-peer-eliminations.util';
import { getUniqueCells } from './get-unique-cells.util';
import { getUniqueValues } from './get-unique-values.util';
import { hasSameCandidates } from './has-same-candidates.util';
import { hasStrongLinkBetween } from './has-strong-link-between.util';
import { isSameCell } from './is-same-cell.util';

describe('technique helpers', () => {
    it('creates placement and elimination results', () => {
        expect.assertions(2);

        const context = createCandidateContextFromMap([0, 0, [1, 2]]);
        const [cell] = context.getRowCells(0);

        expect(createPlacementResult(SolutionTechniqueEnum.NakedSingle, cell, 1, [cell])).toEqual({
            technique: SolutionTechniqueEnum.NakedSingle,
            cell,
            value: 1,
            kind: 'placement',
            eliminations: [],
            reasonCells: [cell]
        });
        expect(createEliminationResults(SolutionTechniqueEnum.NakedPair, [{ cell, value: 2 }], [cell])).toEqual([
            {
                technique: SolutionTechniqueEnum.NakedPair,
                cell,
                value: 2,
                kind: 'elimination',
                eliminations: [{ cell, value: 2 }],
                reasonCells: [cell]
            }
        ]);
    });

    it('finds combinations, unique values, and unique cells', () => {
        expect.assertions(3);

        const context = createCandidateContextFromMap([0, 0, [1]], [0, 1, [2]]);
        const cells = [context.getRowCells(0)[0], context.getRowCells(0)[1], context.getRowCells(0)[0]];

        expect(getCombinations([1, 2, 3], 2)).toEqual([
            [1, 2],
            [1, 3],
            [2, 3]
        ]);
        expect(getUniqueValues([3, 1, 3, 2])).toEqual([1, 2, 3]);
        expect(getUniqueCells(cells).map(cell => `${cell.y}:${cell.x}`)).toEqual(['0:0', '0:1']);
    });

    it('answers peer, candidate, and link questions', () => {
        expect.assertions(6);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [0, 1, [1, 3]], [1, 0, [1, 4]], [4, 4, [5]]);
        const [firstCell, secondCell] = context.getRowCells(0);
        const [thirdCell] = context.getRowCells(1);
        const [, , , , distantCell] = context.getRowCells(4);
        const [firstColumnCell] = context.getColumnCells(0);

        expect(isSameCell(firstCell, firstColumnCell)).toBe(true);
        expect(canSee(context, firstCell, secondCell)).toBe(true);
        expect(canSee(context, firstCell, distantCell)).toBe(false);
        expect(hasSameCandidates([1, 2], [2, 1])).toBe(true);
        expect(hasStrongLinkBetween(context, firstCell, thirdCell, 1)).toBe(true);
        expect(getBivalueCells(context)).toEqual([firstCell, secondCell, thirdCell]);
    });

    it('finds common peer eliminations', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [1, 1, [1, 3]], [0, 1, [1, 4]]);
        const [firstCell, eliminationCell] = context.getRowCells(0);
        const [, secondCell] = context.getRowCells(1);

        expect(getCommonPeerEliminations(context, [firstCell, secondCell], 1, [firstCell, secondCell])).toEqual([
            { cell: eliminationCell, value: 1 }
        ]);
    });
});
