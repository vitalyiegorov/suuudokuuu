import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { render, screen } from '@testing-library/react-native';

import { I18nTestWrapper } from '../../../@generic/mocks/i18n-test-wrapper.mock';
import { getChallengeRecordingSummary } from '../../utils/get-challenge-recording-summary.util';
import { ChallengeAwayBandsSelectors } from '../challenge-away-bands/challenge-away-bands.selectors';
import { ChallengeRunStatsSelectors } from '../challenge-run-stats/challenge-run-stats.selectors';

import { ChallengeRunSummary } from './challenge-run-summary';
import { ChallengeRunSummarySelectors } from './challenge-run-summary.selectors';

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

const capturedRunEvents: GameTimelineEventInterface[] = [
    placement(10, SolutionTechniqueEnum.NakedSingle),
    { kind: TimelineEventKindEnum.Screenshot, ts: 5 },
    { kind: TimelineEventKindEnum.Screenshot, ts: 5 },
    placement(20, SolutionTechniqueEnum.HiddenSingle)
];

const renderRecordedRun = async (events: GameTimelineEventInterface[], totalTime: number) =>
    render(<ChallengeRunSummary label="Your recording" summary={getChallengeRecordingSummary(events, totalTime)} totalTime={totalTime} />, {
        wrapper: I18nTestWrapper
    });

describe('ChallengeRunSummary', () => {
    it('should present the recorded run of a finished challenge', async () => {
        await renderRecordedRun(cleanRunEvents, 40);

        expect(screen.getByTestId(ChallengeRunSummarySelectors.Root)).toBeTruthy();
    });

    it('should label the run timeline with the given label', async () => {
        await renderRecordedRun(cleanRunEvents, 40);

        expect(screen.getByText('Your recording')).toBeTruthy();
    });

    it('should render the run statistics grid', async () => {
        await renderRecordedRun(cleanRunEvents, 40);

        expect(screen.getByTestId(ChallengeRunStatsSelectors.Root)).toBeTruthy();
    });

    it('should show a clean run tile instead of a standalone uninterrupted run badge', async () => {
        await renderRecordedRun(cleanRunEvents, 40);

        expect(screen.getByTestId(ChallengeRunStatsSelectors.CleanRunTile)).toBeTruthy();
        expect(screen.queryByText('Uninterrupted run')).toBeNull();
    });

    it('should not show an exit tile or away bands for a clean run', async () => {
        await renderRecordedRun(cleanRunEvents, 40);

        expect(screen.queryByTestId(ChallengeRunStatsSelectors.ExitsTile)).toBeNull();
        expect(screen.queryByTestId(ChallengeAwayBandsSelectors.Root)).toBeNull();
    });

    it('should report exits with their total away time and drop the clean run tile', async () => {
        await renderRecordedRun(interruptedRunEvents, 60);

        expect(screen.getByTestId(ChallengeRunStatsSelectors.ExitsTile)).toHaveTextContent(/20s away/u);
        expect(screen.queryByTestId(ChallengeRunStatsSelectors.CleanRunTile)).toBeNull();
    });

    it('should align away bands with the recorded timeline', async () => {
        await renderRecordedRun(interruptedRunEvents, 60);

        expect(screen.getByTestId(ChallengeAwayBandsSelectors.Root)).toBeTruthy();
    });

    it('should report the pencil marks of the recorded run', async () => {
        await renderRecordedRun(interruptedRunEvents, 60);

        expect(screen.getByTestId(`${ChallengeRunStatsSelectors.PencilTile}.Count`)).toHaveTextContent('1');
    });

    it('should spell out a run solved without a single pencil mark', async () => {
        await renderRecordedRun(cleanRunEvents, 40);

        expect(screen.getByTestId(`${ChallengeRunStatsSelectors.PencilTile}.Count`)).toHaveTextContent('0');
    });

    it('should report screenshots taken during the run', async () => {
        await renderRecordedRun(capturedRunEvents, 40);

        expect(screen.getByTestId(ChallengeRunStatsSelectors.ScreenshotsTile)).toHaveTextContent(/Screenshots/u);
    });

    it('should treat a screenshotted run as not clean', async () => {
        await renderRecordedRun(capturedRunEvents, 40);

        expect(screen.queryByTestId(ChallengeRunStatsSelectors.CleanRunTile)).toBeNull();
    });

    it('should omit the screenshot tile when no screenshot was taken', async () => {
        await renderRecordedRun(cleanRunEvents, 40);

        expect(screen.queryByTestId(ChallengeRunStatsSelectors.ScreenshotsTile)).toBeNull();
    });
});
