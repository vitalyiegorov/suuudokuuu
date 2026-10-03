import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { getChallengeAwayRanges } from './get-challenge-away-ranges.util';
import { getChallengeAwaySeconds } from './get-challenge-away-seconds.util';
import { getTapeTechniqueEvents } from './get-tape-technique-events.util';

import type { ChallengeRunSummaryInterface } from '../interfaces/challenge-run-summary.interface';
import type { TimelineEventType } from '@suuudokuuu/progress';

const countEventsOfKind = (events: readonly TimelineEventType[], kind: TimelineEventKindEnum): number =>
    events.filter(event => event.kind === kind).length;

export const getChallengeRecordingSummary = (events: readonly TimelineEventType[], totalTime: number): ChallengeRunSummaryInterface => {
    const awayRanges = getChallengeAwayRanges(events, totalTime);

    return {
        awayRanges,
        awaySeconds: Math.round(getChallengeAwaySeconds(awayRanges)),
        exitCount: awayRanges.length,
        pencilCount: countEventsOfKind(events, TimelineEventKindEnum.Pencil),
        screenshotCount: countEventsOfKind(events, TimelineEventKindEnum.Screenshot),
        techniqueEvents: getTapeTechniqueEvents(events)
    };
};
