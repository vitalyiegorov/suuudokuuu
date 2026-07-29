import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/solver';
import { render, screen } from '@testing-library/react-native';

import { I18nTestWrapper } from '../../../@generic/mocks/i18n-test-wrapper.mock';
import { ChallengeTechniqueTierEnum } from '../../enums/challenge-technique-tier.enum';

import { ChallengeTechniqueBreakdown } from './challenge-technique-breakdown';

import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';
const basicEvent: ChallengeTechniqueEventInterface = {
    cumulativeTime: 10,
    technique: SolutionTechniqueEnum.NakedSingle,
    tier: ChallengeTechniqueTierEnum.Basic
};
const sharpEvent: ChallengeTechniqueEventInterface = {
    cumulativeTime: 20,
    technique: SolutionTechniqueEnum.XWing,
    tier: ChallengeTechniqueTierEnum.Advanced
};

const basicRunEvents: ChallengeTechniqueEventInterface[] = [basicEvent];

const sharpRunEvents: ChallengeTechniqueEventInterface[] = [basicEvent, sharpEvent];

const noEvents: ChallengeTechniqueEventInterface[] = [];

describe('ChallengeTechniqueBreakdown', () => {
    it('should render the label of the run it describes', async () => {
        await render(<ChallengeTechniqueBreakdown events={basicRunEvents} label="Your playbook" />, { wrapper: I18nTestWrapper });

        expect(screen.getByText('Your playbook')).toBeTruthy();
    });

    it('should headline the sharp techniques of the run', async () => {
        await render(<ChallengeTechniqueBreakdown events={sharpRunEvents} label="Your playbook" />, { wrapper: I18nTestWrapper });

        expect(screen.getByText('1 sharp technique')).toBeTruthy();
    });

    it('should headline a fundamentals only run without a zero count', async () => {
        await render(<ChallengeTechniqueBreakdown events={basicRunEvents} label="Your playbook" />, { wrapper: I18nTestWrapper });

        expect(screen.getByText('Solved with the fundamentals')).toBeTruthy();
    });

    it('should render nothing when no technique was recorded', async () => {
        await render(<ChallengeTechniqueBreakdown events={noEvents} label="Your playbook" />, { wrapper: I18nTestWrapper });

        expect(screen.queryByText('Your playbook')).toBeNull();
    });
});
