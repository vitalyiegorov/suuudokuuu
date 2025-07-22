import { describe, expect, it } from '@jest/globals';

import { emptyScoredCells, isEmptyScoredCells } from './scored-cells.interface';

import type { ScoredCellsInterface } from './scored-cells.interface';

describe('scored-cells.interface', () => {
    describe('isEmptyScoredCells', () => {
        it('should return true for empty scored cells', () => {
            expect.assertions(1);
            
            expect(isEmptyScoredCells(emptyScoredCells)).toBe(true);
        });

        it('should return false when isWon differs', () => {
            expect.assertions(1);
            
            const scoredCells: ScoredCellsInterface = { ...emptyScoredCells, isWon: true };
            
            expect(isEmptyScoredCells(scoredCells)).toBe(false);
        });

        it('should return false when x differs', () => {
            expect.assertions(1);
            
            const scoredCells: ScoredCellsInterface = { ...emptyScoredCells, x: 5 };
            
            expect(isEmptyScoredCells(scoredCells)).toBe(false);
        });

        it('should return false when y differs', () => {
            expect.assertions(1);
            
            const scoredCells: ScoredCellsInterface = { ...emptyScoredCells, y: 3 };
            
            expect(isEmptyScoredCells(scoredCells)).toBe(false);
        });

        it('should return false when group differs', () => {
            expect.assertions(1);
            
            const scoredCells: ScoredCellsInterface = { ...emptyScoredCells, group: 2 };
            
            expect(isEmptyScoredCells(scoredCells)).toBe(false);
        });

        it('should return false when values array has elements', () => {
            expect.assertions(1);
            
            const scoredCells: ScoredCellsInterface = { ...emptyScoredCells, values: [1, 2] };
            
            expect(isEmptyScoredCells(scoredCells)).toBe(false);
        });

        it('should return true when all fields match empty state even with empty values array', () => {
            expect.assertions(1);
            
            const scoredCells: ScoredCellsInterface = {
                x: -1,
                y: -1, 
                group: -1,
                values: [],
                isWon: false
            };
            
            expect(isEmptyScoredCells(scoredCells)).toBe(true);
        });
    });
});