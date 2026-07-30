import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import { getLatestChallengeTechniqueEvent } from './get-latest-challenge-technique-event.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

const buildEvent = (cumulativeTime: number, technique: SolutionTechniqueEnum): ChallengeTechniqueEventInterface => ({
    cumulativeTime,
    technique,
    tier: ChallengeTechniqueTierEnum.Basic
});

const ElapsedInsideWindow = 12;

const events: ChallengeTechniqueEventInterface[] = [
    buildEvent(5, SolutionTechniqueEnum.NakedSingle),
    buildEvent(10, SolutionTechniqueEnum.HiddenSingle),
    buildEvent(40, SolutionTechniqueEnum.HiddenPair)
];

describe('getLatestChallengeTechniqueEvent', () => {
    it('returns nothing before the opponent has passed any event', () => {
        expect(getLatestChallengeTechniqueEvent(events, 3)).toBeNull();
    });

    it('returns the most recent event the opponent has passed', () => {
        const latest = getLatestChallengeTechniqueEvent(events, ElapsedInsideWindow);

        expect(latest?.index).toBe(1);
        expect(latest?.event.technique).toBe(SolutionTechniqueEnum.HiddenSingle);
    });

    it('hides an event once it falls outside the recency window', () => {
        expect(getLatestChallengeTechniqueEvent(events, 20)).toBeNull();
    });

    it('returns nothing for an empty event list', () => {
        expect(getLatestChallengeTechniqueEvent([], 100)).toBeNull();
    });
});
