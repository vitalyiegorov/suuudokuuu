import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { I18nTestWrapper } from '../../../@generic/mocks/i18n-test-wrapper.mock';

import { ChallengeRecordingStats } from './challenge-recording-stats';
import { ChallengeRecordingStatsSelectors } from './challenge-recording-stats.selectors';

describe('ChallengeRecordingStats', () => {
    it('should hide the exit statistic for an uninterrupted run', async () => {
        await render(<ChallengeRecordingStats awaySeconds={0} exitCount={0} pencilCount={0} />, { wrapper: I18nTestWrapper });

        expect(screen.queryByTestId(ChallengeRecordingStatsSelectors.ExitsValue)).toBeNull();
    });

    it('should show a single exit with its away duration', async () => {
        await render(<ChallengeRecordingStats awaySeconds={46} exitCount={1} pencilCount={0} />, { wrapper: I18nTestWrapper });

        expect(screen.getByTestId(ChallengeRecordingStatsSelectors.ExitsValue)).toHaveTextContent('1 exit · 46s away');
    });

    it('should pluralize many exits', async () => {
        await render(<ChallengeRecordingStats awaySeconds={12} exitCount={3} pencilCount={0} />, { wrapper: I18nTestWrapper });

        expect(screen.getByTestId(ChallengeRecordingStatsSelectors.ExitsValue)).toHaveTextContent('3 exits · 12s away');
    });

    it('should always report the pencil usage of the run', async () => {
        await render(<ChallengeRecordingStats awaySeconds={0} exitCount={0} pencilCount={0} />, { wrapper: I18nTestWrapper });

        expect(screen.getByTestId(ChallengeRecordingStatsSelectors.PencilValue)).toHaveTextContent('0 pencil actions');
    });

    it('should pluralize a single pencil action', async () => {
        await render(<ChallengeRecordingStats awaySeconds={0} exitCount={0} pencilCount={1} />, { wrapper: I18nTestWrapper });

        expect(screen.getByTestId(ChallengeRecordingStatsSelectors.PencilValue)).toHaveTextContent('1 pencil action');
    });

    it('should pluralize many pencil actions', async () => {
        await render(<ChallengeRecordingStats awaySeconds={0} exitCount={0} pencilCount={9} />, { wrapper: I18nTestWrapper });

        expect(screen.getByTestId(ChallengeRecordingStatsSelectors.PencilValue)).toHaveTextContent('9 pencil actions');
    });
});
