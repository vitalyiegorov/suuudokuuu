import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { SolutionTechniqueEnum } from '@suuudokuuu/solver';
import { render, screen } from '@testing-library/react-native';

import { I18nTestWrapper } from '../../../@generic/mocks/i18n-test-wrapper.mock';
import { ChallengeAwayBandsSelectors } from '../challenge-away-bands/challenge-away-bands.selectors';
import { ChallengeIntegrityBadgeSelectors } from '../challenge-integrity-badge/challenge-integrity-badge.selectors';
import { ChallengeRecordingStatsSelectors } from '../challenge-recording-stats/challenge-recording-stats.selectors';
import { ChallengeTechniqueArsenalSelectors } from '../challenge-technique-arsenal/challenge-technique-arsenal.selectors';

import { ChallengeRecordingSummary } from './challenge-recording-summary';
import { ChallengeRecordingSummarySelectors } from './challenge-recording-summary.selectors';

import type { GameTimelineEventInterface } from '../../../game/interface/game-timeline-event.interface';
const placement = (ts: number, technique: SolutionTechniqueEnum): GameTimelineEventInterface => ({
    kind: TimelineEventKindEnum.Cell,
    cellIndex: 0,
    value: 1,
    ts,
    technique
});

const cleanRunEvents: GameTimelineEventInterface[] = [
    placement(20, SolutionTechniqueEnum.NakedSingle),
    placement(20, SolutionTechniqueEnum.XWing)
];

const interruptedRunEvents: GameTimelineEventInterface[] = [
    placement(10, SolutionTechniqueEnum.NakedSingle),
    { kind: TimelineEventKindEnum.Pencil, cellIndex: 4, value: 6, ts: 5 },
    { kind: TimelineEventKindEnum.Away, ts: 5 },
    { kind: TimelineEventKindEnum.Return, ts: 20 },
    placement(20, SolutionTechniqueEnum.HiddenSingle)
];

describe('ChallengeRecordingSummary', () => {
    it('should present the recorded run of a finished challenge', async () => {
        await render(<ChallengeRecordingSummary elapsedTime={40} timelineEvents={cleanRunEvents} />, { wrapper: I18nTestWrapper });

        expect(screen.getByTestId(ChallengeRecordingSummarySelectors.Root)).toBeTruthy();
    });

    it('should label the creator timeline and technique breakdown as their own run', async () => {
        await render(<ChallengeRecordingSummary elapsedTime={40} timelineEvents={cleanRunEvents} />, { wrapper: I18nTestWrapper });

        expect(screen.getByText('Your recording')).toBeTruthy();
        expect(screen.getByText('Your playbook')).toBeTruthy();
    });

    it('should break the recorded techniques down into arsenal cards', async () => {
        await render(<ChallengeRecordingSummary elapsedTime={40} timelineEvents={cleanRunEvents} />, { wrapper: I18nTestWrapper });

        expect(screen.getByTestId(ChallengeTechniqueArsenalSelectors.Root)).toBeTruthy();
    });

    it('should not show a standalone uninterrupted run badge for a clean run', async () => {
        await render(<ChallengeRecordingSummary elapsedTime={40} timelineEvents={cleanRunEvents} />, { wrapper: I18nTestWrapper });

        expect(screen.queryByTestId(ChallengeIntegrityBadgeSelectors.Root)).toBeNull();
        expect(screen.queryByText('Uninterrupted run')).toBeNull();
    });

    it('should not show an exit statistic or away bands for a clean run', async () => {
        await render(<ChallengeRecordingSummary elapsedTime={40} timelineEvents={cleanRunEvents} />, { wrapper: I18nTestWrapper });

        expect(screen.queryByTestId(ChallengeRecordingStatsSelectors.ExitsValue)).toBeNull();
        expect(screen.queryByTestId(ChallengeAwayBandsSelectors.Root)).toBeNull();
    });

    it('should report exits with their total away time', async () => {
        await render(<ChallengeRecordingSummary elapsedTime={60} timelineEvents={interruptedRunEvents} />, { wrapper: I18nTestWrapper });

        expect(screen.getByTestId(ChallengeRecordingStatsSelectors.ExitsValue)).toHaveTextContent('1 exit · 20s away');
    });

    it('should align away bands with the recorded timeline', async () => {
        await render(<ChallengeRecordingSummary elapsedTime={60} timelineEvents={interruptedRunEvents} />, { wrapper: I18nTestWrapper });

        expect(screen.getByTestId(ChallengeAwayBandsSelectors.Root)).toBeTruthy();
    });

    it('should report the pencil actions of the recorded run', async () => {
        await render(<ChallengeRecordingSummary elapsedTime={60} timelineEvents={interruptedRunEvents} />, { wrapper: I18nTestWrapper });

        expect(screen.getByTestId(ChallengeRecordingStatsSelectors.PencilValue)).toHaveTextContent('1 pencil action');
    });
});
