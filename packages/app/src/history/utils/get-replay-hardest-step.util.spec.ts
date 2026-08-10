import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { ChallengeTechniqueTierEnum } from '../../challenge/enums/challenge-technique-tier.enum';

import { getReplayHardestStep } from './get-replay-hardest-step.util';

import type { ChallengeTechniqueEventInterface } from '../../challenge/interfaces/challenge-technique-event.interface';

const buildEvent = (technique: SolutionTechniqueEnum): ChallengeTechniqueEventInterface => ({
    cumulativeTime: 1,
    technique,
    tier: ChallengeTechniqueTierEnum.Basic
});

describe('getReplayHardestStep', () => {
    it('should return null for an empty run', () => {
        expect.assertions(1);

        expect(getReplayHardestStep([])).toBeNull();
    });

    it('should find the step with the highest SE rating and map it to a one-based step number', () => {
        expect.assertions(1);

        const events = [
            buildEvent(SolutionTechniqueEnum.NakedSingle),
            buildEvent(SolutionTechniqueEnum.XWing),
            buildEvent(SolutionTechniqueEnum.HiddenSingle)
        ];

        expect(getReplayHardestStep(events)).toStrictEqual({ stepNumber: 2, technique: SolutionTechniqueEnum.XWing });
    });

    it('should keep the earliest occurrence when multiple steps share the highest rating', () => {
        expect.assertions(1);

        const events = [buildEvent(SolutionTechniqueEnum.XWing), buildEvent(SolutionTechniqueEnum.XWing)];

        expect(getReplayHardestStep(events)).toStrictEqual({ stepNumber: 1, technique: SolutionTechniqueEnum.XWing });
    });
});
