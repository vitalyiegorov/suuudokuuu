import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

import { getCanonicalTechniqueResults } from './get-canonical-technique-results.util';

import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';

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
