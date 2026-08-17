import { GameStateSerializer } from '@suuudokuuu/encoder';

import { withTimelineCellTechniques } from '../../game/utils/with-timeline-cell-techniques.util';

import { getChallengeAwayRanges } from './get-challenge-away-ranges.util';
import { getChallengeAwaySeconds } from './get-challenge-away-seconds.util';
import { getRunTechniqueEvents } from './get-run-technique-events.util';

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
            techniqueEvents: getRunTechniqueEvents(withTimelineCellTechniques(decoded.timelineEvents, decoded.techniques), decoded.field)
        };
    } catch {
        return emptyChallengeRunSummary;
    }
};
