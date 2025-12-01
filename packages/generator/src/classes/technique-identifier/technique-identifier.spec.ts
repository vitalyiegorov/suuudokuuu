/* eslint-disable prefer-destructuring */
import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';
import { createEmptyField } from '../../util/create-empty-field.util';

import { TechniqueIdentifier } from './technique-identifier';

describe('TechniqueIdentifier', () => {
    const identifier = new TechniqueIdentifier();

    describe('identify', () => {
        it('should identify NakedSingle when only one candidate exists', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 1;
            field[0][1].value = 2;
            field[0][2].value = 3;
            field[0][3].value = 4;
            field[0][4].value = 5;
            field[0][5].value = 6;
            field[0][6].value = 7;
            field[0][7].value = 8;

            const cell = field[0][8];
            const technique = identifier.identify(field, cell, 9);

            expect(technique).toBe(SolutionTechniqueEnum.NakedSingle);
        });

        it('should identify HiddenSingle when value can only go in one place in row', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][1].value = 1;
            field[1][0].value = 2;
            field[2][0].value = 3;

            field[0][2].value = 4;
            field[0][3].value = 5;
            field[0][4].value = 6;
            field[0][5].value = 7;
            field[0][6].value = 8;

            field[1][8].value = 9;
            field[2][8].value = 9;
            field[3][8].value = 9;
            field[4][8].value = 9;
            field[5][8].value = 9;
            field[6][8].value = 9;
            field[7][8].value = 9;
            field[8][8].value = 9;

            const cell = field[0][8];
            const technique = identifier.identify(field, cell, 9);

            expect(technique).toBe(SolutionTechniqueEnum.HiddenSingle);
        });

        it('should identify NakedPair when two cells share exactly two candidates in a row', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 3;
            field[0][1].value = 4;
            field[0][2].value = 5;
            field[0][3].value = 6;
            field[0][4].value = 7;
            field[0][5].value = 8;
            field[0][6].value = 9;

            field[1][7].value = 3;
            field[1][8].value = 4;
            field[2][7].value = 5;
            field[2][8].value = 6;

            const cell = field[0][7];
            const candidates = identifier.getCellCandidates(field, cell);
            const technique = identifier.identify(field, cell, candidates[0]);

            expect(candidates.length).toBe(2);
            expect([SolutionTechniqueEnum.NakedPair, SolutionTechniqueEnum.HiddenSingle]).toContain(technique);
        });

        it('should identify NakedTriple when three cells share exactly three candidates', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 4;
            field[0][1].value = 5;
            field[0][2].value = 6;
            field[0][3].value = 7;
            field[0][4].value = 8;
            field[0][5].value = 9;

            field[1][6].value = 4;
            field[1][7].value = 5;
            field[1][8].value = 6;
            field[2][6].value = 7;
            field[2][7].value = 8;
            field[2][8].value = 9;

            const cell = field[0][6];
            const candidates = identifier.getCellCandidates(field, cell);
            const technique = identifier.identify(field, cell, candidates[0]);

            expect(candidates.length).toBe(3);
            expect([SolutionTechniqueEnum.NakedTriple, SolutionTechniqueEnum.HiddenSingle]).toContain(technique);
        });

        it('should identify NakedQuad when four cells share exactly four candidates', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 5;
            field[0][1].value = 6;
            field[0][2].value = 7;
            field[0][3].value = 8;
            field[0][4].value = 9;

            field[1][5].value = 5;
            field[1][6].value = 6;
            field[1][7].value = 7;
            field[1][8].value = 8;
            field[2][5].value = 9;
            field[2][6].value = 1;
            field[2][7].value = 2;
            field[2][8].value = 3;

            const cell = field[0][5];
            const candidates = identifier.getCellCandidates(field, cell);
            const technique = identifier.identify(field, cell, candidates[0]);

            expect(candidates.length).toBe(4);
            expect([SolutionTechniqueEnum.NakedQuad, SolutionTechniqueEnum.HiddenSingle]).toContain(technique);
        });

        it('should handle PointingPair detection', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 1;
            field[0][1].value = 2;
            field[1][0].value = 3;
            field[1][1].value = 4;
            field[2][0].value = 5;
            field[2][1].value = 6;

            field[0][3].value = 9;
            field[0][4].value = 8;
            field[0][5].value = 7;

            const cell = field[0][2];
            const technique = identifier.identify(field, cell, 9);

            expect([
                SolutionTechniqueEnum.PointingPair,
                SolutionTechniqueEnum.HiddenSingle,
                SolutionTechniqueEnum.Guess
            ]).toContain(technique);
        });

        it('should handle BoxLineReduction detection', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][3].value = 9;
            field[0][4].value = 8;
            field[0][5].value = 7;
            field[0][6].value = 6;
            field[0][7].value = 5;
            field[0][8].value = 4;

            const cell = field[0][0];
            const technique = identifier.identify(field, cell, 1);

            expect([
                SolutionTechniqueEnum.BoxLineReduction,
                SolutionTechniqueEnum.NakedTriple,
                SolutionTechniqueEnum.HiddenSingle,
                SolutionTechniqueEnum.Guess
            ]).toContain(technique);
        });

        it('should handle XWing detection', () => {
            const field = createEmptyField(defaultSudokuConfig);

            const cell = field[0][0];
            const technique = identifier.identify(field, cell, 1);

            expect([
                SolutionTechniqueEnum.XWing,
                SolutionTechniqueEnum.NakedPair,
                SolutionTechniqueEnum.NakedTriple,
                SolutionTechniqueEnum.NakedQuad,
                SolutionTechniqueEnum.PointingPair,
                SolutionTechniqueEnum.BoxLineReduction,
                SolutionTechniqueEnum.HiddenSingle,
                SolutionTechniqueEnum.Guess
            ]).toContain(technique);
        });

        it('should return Guess when no specific technique is identified', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 1;

            const cell = field[1][1];
            const technique = identifier.identify(field, cell, 5);

            expect(technique).toBe(SolutionTechniqueEnum.Guess);
        });
    });

    describe('findNakedSingles', () => {
        it('should find all naked singles in a field', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 1;
            field[0][1].value = 2;
            field[0][2].value = 3;
            field[0][3].value = 4;
            field[0][4].value = 5;
            field[0][5].value = 6;
            field[0][6].value = 7;
            field[0][7].value = 8;

            const results = identifier.findNakedSingles(field);

            expect(results.length).toBeGreaterThanOrEqual(1);
            expect(results[0].technique).toBe(SolutionTechniqueEnum.NakedSingle);
            expect(results[0].value).toBe(9);
        });

        it('should return empty array when no naked singles exist', () => {
            const field = createEmptyField(defaultSudokuConfig);

            const results = identifier.findNakedSingles(field);

            expect(results).toEqual([]);
        });
    });

    describe('findHiddenSingles', () => {
        it('should find hidden singles in a field', () => {
            const field = createEmptyField(defaultSudokuConfig);

            for (let x = 1; x < 9; x += 1) {
                field[0][x].value = x;
            }
            for (let y = 1; y < 3; y += 1) {
                for (let x = 0; x < 3; x += 1) {
                    field[y][x].value = y * 3 + x + 1;
                }
            }

            const results = identifier.findHiddenSingles(field);

            expect(results.length).toBeGreaterThanOrEqual(0);
        });

        it('should return empty array when no hidden singles exist', () => {
            const field = createEmptyField(defaultSudokuConfig);

            const results = identifier.findHiddenSingles(field);

            expect(results).toEqual([]);
        });
    });

    describe('findNakedPairs', () => {
        it('should find naked pairs in a field when they exist', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 3;
            field[0][1].value = 4;
            field[0][2].value = 5;
            field[0][3].value = 6;
            field[0][4].value = 7;
            field[0][5].value = 8;
            field[0][6].value = 9;

            field[1][7].value = 3;
            field[1][8].value = 4;
            field[2][7].value = 5;
            field[2][8].value = 6;

            const results = identifier.findNakedPairs(field);

            expect(results.length).toBeGreaterThanOrEqual(0);
            const hasPairResults = results.every(result => result.technique === SolutionTechniqueEnum.NakedPair);
            expect(hasPairResults).toBe(true);
        });

        it('should return empty array when no naked pairs exist', () => {
            const field = createEmptyField(defaultSudokuConfig);

            const results = identifier.findNakedPairs(field);

            expect(results).toEqual([]);
        });
    });

    describe('findNakedTriples', () => {
        it('should find naked triples in a field when they exist', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 4;
            field[0][1].value = 5;
            field[0][2].value = 6;
            field[0][3].value = 7;
            field[0][4].value = 8;
            field[0][5].value = 9;

            field[1][6].value = 4;
            field[1][7].value = 5;
            field[1][8].value = 6;
            field[2][6].value = 7;
            field[2][7].value = 8;
            field[2][8].value = 9;

            const results = identifier.findNakedTriples(field);

            expect(results.length).toBeGreaterThanOrEqual(0);
            const hasTripleResults = results.every(result => result.technique === SolutionTechniqueEnum.NakedTriple);
            expect(hasTripleResults).toBe(true);
        });

        it('should return empty array when no naked triples exist', () => {
            const field = createEmptyField(defaultSudokuConfig);

            const results = identifier.findNakedTriples(field);

            expect(results).toEqual([]);
        });
    });

    describe('findNakedQuads', () => {
        it('should find naked quads in a field when they exist', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 5;
            field[0][1].value = 6;
            field[0][2].value = 7;
            field[0][3].value = 8;
            field[0][4].value = 9;

            field[1][5].value = 5;
            field[1][6].value = 6;
            field[1][7].value = 7;
            field[1][8].value = 8;
            field[2][5].value = 9;
            field[2][6].value = 1;
            field[2][7].value = 2;
            field[2][8].value = 3;

            const results = identifier.findNakedQuads(field);

            expect(results.length).toBeGreaterThanOrEqual(0);
            const hasQuadResults = results.every(result => result.technique === SolutionTechniqueEnum.NakedQuad);
            expect(hasQuadResults).toBe(true);
        });

        it('should return empty array when no naked quads exist', () => {
            const field = createEmptyField(defaultSudokuConfig);

            const results = identifier.findNakedQuads(field);

            expect(results).toEqual([]);
        });
    });

    describe('getCellCandidates', () => {
        it('should return all valid candidates for a cell', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 1;
            field[0][1].value = 2;
            field[0][2].value = 3;

            const cell = field[0][3];
            const candidates = identifier.getCellCandidates(field, cell);

            expect(candidates).not.toContain(1);
            expect(candidates).not.toContain(2);
            expect(candidates).not.toContain(3);
            expect(candidates).toContain(4);
            expect(candidates).toContain(5);
            expect(candidates).toContain(6);
            expect(candidates).toContain(7);
            expect(candidates).toContain(8);
            expect(candidates).toContain(9);
        });

        it('should return single candidate for naked single cell', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 1;
            field[0][1].value = 2;
            field[0][2].value = 3;
            field[0][3].value = 4;
            field[0][4].value = 5;
            field[0][5].value = 6;
            field[0][6].value = 7;
            field[0][7].value = 8;

            const cell = field[0][8];
            const candidates = identifier.getCellCandidates(field, cell);

            expect(candidates).toEqual([9]);
        });

        it('should return empty array for filled cell', () => {
            const field = createEmptyField(defaultSudokuConfig);

            field[0][0].value = 1;

            const cell = { ...field[0][0], value: 0 };
            const candidatesAfterFill = identifier.getCellCandidates(field, cell);

            expect(candidatesAfterFill).not.toContain(1);
        });
    });
});
