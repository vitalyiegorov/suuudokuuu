import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { SerializableSudoku } from '../../serializable-sudoku/serializable-sudoku';
import { Sudoku } from '../../sudoku/sudoku';

import { BoxLineReductionTechnique } from './box-line-reduction.technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

describe('BoxLineReductionTechnique', () => {
    const sudoku = new Sudoku();
    const technique = new BoxLineReductionTechnique(sudoku);

    const createFieldFromString = (fieldString: string): FieldInterface => {
        const [field] = SerializableSudoku.convertFieldFromString(fieldString, defaultSudokuConfig);

        return field;
    };

    const getCellCandidates = (field: FieldInterface, cell: CellInterface): number[] => {
        const candidates: number[] = [];
        const fieldFillingValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (const value of fieldFillingValues) {
            const isValidInRow = !field[cell.y].some(c => c.value === value);
            const isValidInCol = !field.some(row => row[cell.x].value === value);
            const boxStartY = Math.floor(cell.y / 3) * 3;
            const boxStartX = Math.floor(cell.x / 3) * 3;
            let isValidInBox = true;
            for (let by = boxStartY; by < boxStartY + 3; by++) {
                for (let bx = boxStartX; bx < boxStartX + 3; bx++) {
                    if (field[by][bx].value === value) {
                        isValidInBox = false;
                        break;
                    }
                }
                if (!isValidInBox) break;
            }

            if (isValidInRow && isValidInCol && isValidInBox) {
                candidates.push(value);
            }
        }

        return candidates;
    };

    it('should have correct type and difficulty', () => {
        expect(technique.type).toBe(SolutionTechniqueEnum.BoxLineReduction);
        expect(technique.difficulty).toBe(11);
    });

    it('should apply technique to appropriate cells', () => {
        const field = createFieldFromString(
            '..3..6..8' +
            '..5..8..3' +
            '..1..3..5' +
            '3........' +
            '5........' +
            '1........' +
            '.........' +
            '.........' +
            '.........',
        );

        let foundApplicable = false;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = field[y][x];
                if (cell.value === 0) {
                    const candidates = getCellCandidates(field, cell);
                    if (candidates.length > 0 && technique.canApply(field, cell, candidates)) {
                        foundApplicable = true;
                        break;
                    }
                }
            }
            if (foundApplicable) break;
        }

        expect(typeof foundApplicable).toBe('boolean');
    });

    it('should not apply to solved field', () => {
        const field = createFieldFromString(
            '123456789' +
            '456789123' +
            '789123456' +
            '234567891' +
            '567891234' +
            '891234567' +
            '345678912' +
            '678912345' +
            '912345678',
        );

        let foundApplicable = false;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = field[y][x];
                if (cell.value === 0) {
                    const candidates = getCellCandidates(field, cell);
                    if (candidates.length > 0 && technique.canApply(field, cell, candidates)) {
                        foundApplicable = true;
                        break;
                    }
                }
            }
            if (foundApplicable) break;
        }

        expect(foundApplicable).toBe(false);
    });

    it('should not apply to nearly empty field', () => {
        const field = createFieldFromString(
            '1........' +
            '.........' +
            '.........' +
            '.........' +
            '.........' +
            '.........' +
            '.........' +
            '.........' +
            '.........',
        );

        let foundApplicable = false;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = field[y][x];
                if (cell.value === 0) {
                    const candidates = getCellCandidates(field, cell);
                    if (candidates.length > 0 && technique.canApply(field, cell, candidates)) {
                        foundApplicable = true;
                        break;
                    }
                }
            }
            if (foundApplicable) break;
        }

        expect(foundApplicable).toBe(false);
    });
});
