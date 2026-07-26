import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/solver';

import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import { getChallengeTechniqueSummary } from './get-challenge-technique-summary.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

const buildEvent = (technique: SolutionTechniqueEnum, tier: ChallengeTechniqueTierEnum): ChallengeTechniqueEventInterface => ({
    cumulativeTime: 1,
    positionPercent: 1,
    technique,
    tier
});

describe('getChallengeTechniqueSummary', () => {
    it('counts occurrences per technique', () => {
        const events = [
            buildEvent(SolutionTechniqueEnum.NakedSingle, ChallengeTechniqueTierEnum.Basic),
            buildEvent(SolutionTechniqueEnum.NakedSingle, ChallengeTechniqueTierEnum.Basic),
            buildEvent(SolutionTechniqueEnum.HiddenPair, ChallengeTechniqueTierEnum.Clever)
        ];

        const summary = getChallengeTechniqueSummary(events);
        const nakedSingle = summary.find(item => item.technique === SolutionTechniqueEnum.NakedSingle);

        expect(nakedSingle?.count).toBe(2);
    });

    it('orders more advanced tiers before easier ones', () => {
        const events = [
            buildEvent(SolutionTechniqueEnum.NakedSingle, ChallengeTechniqueTierEnum.Basic),
            buildEvent(SolutionTechniqueEnum.NakedSingle, ChallengeTechniqueTierEnum.Basic),
            buildEvent(SolutionTechniqueEnum.XWing, ChallengeTechniqueTierEnum.Advanced)
        ];

        const [first] = getChallengeTechniqueSummary(events);

        expect(first.technique).toBe(SolutionTechniqueEnum.XWing);
    });

    it('returns an empty summary for no events', () => {
        expect(getChallengeTechniqueSummary([])).toEqual([]);
    });

    it('orders the more frequent technique first when two share a tier', () => {
        expect.assertions(2);

        const events = [
            buildEvent(SolutionTechniqueEnum.HiddenPair, ChallengeTechniqueTierEnum.Clever),
            buildEvent(SolutionTechniqueEnum.NakedPair, ChallengeTechniqueTierEnum.Clever),
            buildEvent(SolutionTechniqueEnum.NakedPair, ChallengeTechniqueTierEnum.Clever)
        ];

        const [first, second] = getChallengeTechniqueSummary(events);

        expect(first.technique).toBe(SolutionTechniqueEnum.NakedPair);
        expect(second.technique).toBe(SolutionTechniqueEnum.HiddenPair);
    });
});
