import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { createPlacementResult } from '../../../src/@generic/utils/create-placement-result.util';
import { getCanonicalTechniqueResults } from '../../../src/@generic/utils/get-canonical-technique-results.util';

import type { TechniqueResultInterface } from '../../../src/@generic/interfaces/technique-result.interface';

const field = Sudoku.fromString('.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize), defaultSudokuConfig).Field;
const [firstCell, secondCell, thirdCell] = field[0].slice(0, 3);

const createResult = (reasonCells: TechniqueResultInterface['reasonCells']): TechniqueResultInterface => ({
    technique: SolutionTechniqueEnum.AIC,
    cell: thirdCell,
    value: 1,
    kind: 'elimination',
    eliminations: [{ cell: thirdCell, value: 1 }],
    reasonCells
});

describe('getCanonicalTechniqueResults', () => {
    it('preserves distinct placement cells and values while deduplicating equivalent placements', () => {
        expect.assertions(1);

        const firstPlacement = createPlacementResult(SolutionTechniqueEnum.CellForcingChain, firstCell, 1, [firstCell]);
        const secondPlacement = createPlacementResult(SolutionTechniqueEnum.CellForcingChain, secondCell, 1, [secondCell]);
        const otherValuePlacement = createPlacementResult(SolutionTechniqueEnum.CellForcingChain, firstCell, 2, [firstCell]);
        const elimination = { ...createResult([firstCell]), technique: SolutionTechniqueEnum.CellForcingChain };

        expect(getCanonicalTechniqueResults([elimination, secondPlacement, otherValuePlacement, firstPlacement, firstPlacement])).toEqual([
            firstPlacement,
            otherValuePlacement,
            secondPlacement,
            elimination
        ]);
    });

    it('keeps the shortest reason path for equivalent deductions', () => {
        expect.assertions(1);

        expect(getCanonicalTechniqueResults([createResult([firstCell, secondCell]), createResult([firstCell])])).toEqual([
            createResult([firstCell])
        ]);
    });

    it('uses lexical reason-cell order when equivalent paths have the same length', () => {
        expect.assertions(1);

        expect(getCanonicalTechniqueResults([createResult([secondCell]), createResult([firstCell])])).toEqual([createResult([firstCell])]);
    });
});
