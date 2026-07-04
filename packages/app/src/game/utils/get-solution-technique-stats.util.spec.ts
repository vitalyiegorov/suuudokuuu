/* eslint-disable lingui/no-unlocalized-strings */
import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/generator';

import { getSolutionTechniqueStats } from './get-solution-technique-stats.util';

import type { TechniqueResultInterface } from '@suuudokuuu/generator';

describe('getSolutionTechniqueStats', () => {
    it('should aggregate technique counts and guess-like moves', () => {
        expect.assertions(1);

        const firstCell = { x: 0, y: 0, group: 0, value: 1 };
        const secondCell = { x: 1, y: 0, group: 0, value: 2 };
        const thirdCell = { x: 2, y: 0, group: 0, value: 3 };
        const results: TechniqueResultInterface[] = [
            {
                technique: SolutionTechniqueEnum.Guess,
                cell: firstCell,
                value: 1,
                kind: 'guess',
                eliminations: [],
                reasonCells: [firstCell]
            },
            {
                technique: SolutionTechniqueEnum.HiddenSingle,
                cell: secondCell,
                value: 2,
                kind: 'placement',
                eliminations: [],
                reasonCells: [secondCell]
            },
            {
                technique: SolutionTechniqueEnum.HiddenSingle,
                cell: thirdCell,
                value: 3,
                kind: 'placement',
                eliminations: [],
                reasonCells: [thirdCell]
            }
        ];

        expect(getSolutionTechniqueStats(results)).toEqual({
            countsByTechnique: {
                [SolutionTechniqueEnum.Guess]: 1,
                [SolutionTechniqueEnum.HiddenSingle]: 2
            },
            totalMoves: 3,
            logicalMoves: 2,
            guessLikeMoves: 1,
            hardestTechnique: SolutionTechniqueEnum.HiddenSingle
        });
    });
});
