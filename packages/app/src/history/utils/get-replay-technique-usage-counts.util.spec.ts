import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { ChallengeTechniqueTierEnum } from '../../challenge/enums/challenge-technique-tier.enum';

import { getReplayTechniqueUsageCounts } from './get-replay-technique-usage-counts.util';

import type { ChallengeTechniqueEventInterface } from '../../challenge/interfaces/challenge-technique-event.interface';

const buildEvent = (technique: SolutionTechniqueEnum): ChallengeTechniqueEventInterface => ({
    cumulativeTime: 1,
    technique,
    tier: ChallengeTechniqueTierEnum.Basic
});

describe('getReplayTechniqueUsageCounts', () => {
    it('should return an empty map for no events', () => {
        expect.assertions(1);

        expect(getReplayTechniqueUsageCounts([])).toStrictEqual({});
    });

    it('should count occurrences per technique', () => {
        expect.assertions(1);

        const events = [
            buildEvent(SolutionTechniqueEnum.NakedSingle),
            buildEvent(SolutionTechniqueEnum.NakedSingle),
            buildEvent(SolutionTechniqueEnum.HiddenPair)
        ];

        expect(getReplayTechniqueUsageCounts(events)).toStrictEqual({
            [SolutionTechniqueEnum.NakedSingle]: 2,
            [SolutionTechniqueEnum.HiddenPair]: 1
        });
    });
});
