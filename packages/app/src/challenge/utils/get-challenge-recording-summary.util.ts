import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { getChallengeAwayRanges } from './get-challenge-away-ranges.util';
import { getChallengeAwaySeconds } from './get-challenge-away-seconds.util';
import { getTapeTechniqueEvents } from './get-tape-technique-events.util';

import type { GameTimelineEventInterface } from '../../game/interface/game-timeline-event.interface';
import type { ChallengeRecordingSummaryInterface } from '../interfaces/challenge-recording-summary.interface';

export const getChallengeRecordingSummary = (
    events: GameTimelineEventInterface[],
    totalTime: number
): ChallengeRecordingSummaryInterface => {
    const awayRanges = getChallengeAwayRanges(events, totalTime);

    return {
        awayRanges,
        awaySeconds: Math.round(getChallengeAwaySeconds(awayRanges)),
        exitCount: awayRanges.length,
        pencilCount: events.filter(event => event.kind === TimelineEventKindEnum.Pencil).length,
        techniqueEvents: getTapeTechniqueEvents(events)
    };
};
