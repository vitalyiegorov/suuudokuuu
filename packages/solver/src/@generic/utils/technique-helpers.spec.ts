import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../test-utils/create-candidate-context-from-map.spec.util';

import { canSee } from './can-see.util';
import { createEliminationResults } from './create-elimination-results.util';
import { createPlacementResult } from './create-placement-result.util';
import { getBivalueCells } from './get-bivalue-cells.util';
import { getCombinations } from './get-combinations.util';
import { getCommonPeerEliminations } from './get-common-peer-eliminations.util';
import { getSearchEliminationValues } from './get-search-elimination-values.util';
import { getSearchScope } from './get-search-scope.util';
import { getUniqueCells } from './get-unique-cells.util';
import { getUniqueValues } from './get-unique-values.util';
import { hasSameCandidates } from './has-same-candidates.util';
import { hasStrongLinkBetween } from './has-strong-link-between.util';
import { isForcedPlacement } from './is-forced-placement.util';
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

    it('recognizes naked and hidden forced placements', () => {
        expect.assertions(4);

        const nakedContext = createCandidateContextFromMap([0, 0, [7]]);
        const hiddenContext = createCandidateContextFromMap([0, 0, [7, 8]], [0, 1, [8, 9]], [1, 0, [8, 9]]);
        const [nakedCell] = nakedContext.getRowCells(0);
        const [hiddenCell] = hiddenContext.getRowCells(0);

        expect(isForcedPlacement(nakedContext, nakedCell, 7)).toBe(true);
        expect(isForcedPlacement(nakedContext, nakedCell, 8)).toBe(false);
        expect(isForcedPlacement(hiddenContext, hiddenCell, 7)).toBe(true);
        expect(isForcedPlacement(hiddenContext, hiddenCell, 8)).toBe(false);
    });

    it('narrows the search by the requested intent', () => {
        expect.assertions(5);

        const context = createCandidateContextFromMap([0, 0, [1, 2, 3]]);
        const [cell] = context.getRowCells(0);
        const directTarget = { cell, value: 2, intent: 'direct' } as const;
        const enablingTarget = { cell, value: 2, intent: 'enabling' } as const;

        expect(getSearchEliminationValues(context, directTarget)).toEqual([1, 3]);
        expect(getSearchEliminationValues(context, enablingTarget)).toEqual([2]);
        expect(getSearchEliminationValues(context)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(getSearchScope(context, directTarget)).toEqual({ eliminationValues: [1, 3], directTarget });
        expect(getSearchScope(context, enablingTarget)).toEqual({ eliminationValues: [2] });
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
