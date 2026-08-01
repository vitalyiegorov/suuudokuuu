import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { render, screen } from '@testing-library/react-native';

import { I18nTestWrapper } from '../../../@generic/mocks/i18n-test-wrapper.mock';
import { ChallengeTechniqueTierEnum } from '../../enums/challenge-technique-tier.enum';

import { ChallengeRunTape } from './challenge-run-tape';

import type { ChallengeAwayRangeInterface } from '../../interfaces/challenge-away-range.interface';
import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';

const noAwayRanges: ChallengeAwayRangeInterface[] = [];

const events: ChallengeTechniqueEventInterface[] = [
    { cumulativeTime: 10, technique: SolutionTechniqueEnum.NakedSingle, tier: ChallengeTechniqueTierEnum.Basic }
];

describe('ChallengeRunTape', () => {
    it('should render the run label above the timeline', async () => {
        await render(<ChallengeRunTape awayRanges={noAwayRanges} events={events} label="Your recording" totalTime={40} />, {
            wrapper: I18nTestWrapper
        });

        expect(screen.getByText('Your recording')).toBeTruthy();
    });

    it('should render the technique legend without a key move count', async () => {
        await render(<ChallengeRunTape awayRanges={noAwayRanges} events={events} label="Your run" totalTime={40} />, {
            wrapper: I18nTestWrapper
        });

        expect(screen.getByText('Taller marks = sharper techniques')).toBeTruthy();
        expect(screen.queryByText(/key move/u)).toBeNull();
    });
});
