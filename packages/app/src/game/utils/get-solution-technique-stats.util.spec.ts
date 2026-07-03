/* eslint-disable lingui/no-unlocalized-strings */
import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/generator';

import { getSolutionTechniqueStats } from './get-solution-technique-stats.util';

import type { SolutionStepInterface } from '@suuudokuuu/encoder';

describe('getSolutionTechniqueStats', () => {
    it('should aggregate technique counts and guess-like moves', () => {
        expect.assertions(1);

        const steps: SolutionStepInterface[] = [
            { cellIndex: 0, value: 1, ts: 10, technique: SolutionTechniqueEnum.Guess, isGuessLike: true },
            { cellIndex: 1, value: 2, ts: 20, technique: SolutionTechniqueEnum.HiddenSingle, isGuessLike: false },
            { cellIndex: 2, value: 3, ts: 30, technique: SolutionTechniqueEnum.HiddenSingle, isGuessLike: false }
        ];

        expect(getSolutionTechniqueStats(steps)).toEqual({
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
