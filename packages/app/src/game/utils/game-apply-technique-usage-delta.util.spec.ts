import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { gameApplyTechniqueUsageDelta } from './game-apply-technique-usage-delta.util';

describe('gameApplyTechniqueUsageDelta', () => {
    it('starts a count for a technique that was never used', () => {
        expect.assertions(1);

        const counts = {};

        gameApplyTechniqueUsageDelta(counts, SolutionTechniqueEnum.NakedSingle, 1);

        expect(counts).toStrictEqual({ [SolutionTechniqueEnum.NakedSingle]: 1 });
    });

    it('increments an existing count', () => {
        expect.assertions(1);

        const counts = { [SolutionTechniqueEnum.HiddenSingle]: 2 };

        gameApplyTechniqueUsageDelta(counts, SolutionTechniqueEnum.HiddenSingle, 1);

        expect(counts).toStrictEqual({ [SolutionTechniqueEnum.HiddenSingle]: 3 });
    });

    it('removes the entry once the count reaches zero', () => {
        expect.assertions(1);

        const counts = { [SolutionTechniqueEnum.HiddenSingle]: 1 };

        gameApplyTechniqueUsageDelta(counts, SolutionTechniqueEnum.HiddenSingle, -1);

        expect(counts).toStrictEqual({});
    });
});
