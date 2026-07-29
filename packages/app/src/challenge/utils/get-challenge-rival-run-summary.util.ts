import { GameStateSerializer } from '@suuudokuuu/encoder';

import { getTimelineCellSteps } from '../../game/utils/get-timeline-cell-steps.util';

import { getChallengeAwayRanges } from './get-challenge-away-ranges.util';
import { getChallengeAwaySeconds } from './get-challenge-away-seconds.util';
import { getChallengeTechniqueEvents } from './get-challenge-technique-events.util';

import type { ChallengeRunSummaryInterface } from '../interfaces/challenge-run-summary.interface';

const serializer = new GameStateSerializer();

const emptyChallengeRunSummary: ChallengeRunSummaryInterface = {
    awayRanges: [],
    awaySeconds: 0,
    exitCount: 0,
    pencilCount: null,
    screenshotCount: null,
    techniqueEvents: []
};

export const getChallengeRivalRunSummary = (challengeState: string, totalTime: number): ChallengeRunSummaryInterface => {
    try {
        const decoded = serializer.decodeState(challengeState);
        const awayRanges = getChallengeAwayRanges(decoded.timelineEvents, totalTime);

        return {
            awayRanges,
            awaySeconds: Math.round(getChallengeAwaySeconds(awayRanges)),
            exitCount: awayRanges.length,
            pencilCount: decoded.pencilCount,
            screenshotCount: decoded.screenshotCount,
            techniqueEvents: getChallengeTechniqueEvents(decoded.field, getTimelineCellSteps(decoded.timelineEvents))
        };
    } catch {
        return emptyChallengeRunSummary;
    }
};
