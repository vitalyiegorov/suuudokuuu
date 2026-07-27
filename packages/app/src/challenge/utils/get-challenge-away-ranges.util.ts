import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { isDefined, isPositiveNumber } from '@rnw-community/shared';

import type { GameTimelineEventInterface } from '../../game/interface/game-timeline-event.interface';
import type { ChallengeAwayRangeInterface } from '../interfaces/challenge-away-range.interface';

const FullPercent = 100;

const getRange = (startSeconds: number, endSeconds: number, totalTime: number): ChallengeAwayRangeInterface => ({
    durationSeconds: Math.max(0, endSeconds - startSeconds),
    endPercent: Math.min(FullPercent, (endSeconds / totalTime) * FullPercent),
    startPercent: Math.min(FullPercent, (startSeconds / totalTime) * FullPercent)
});

interface AwayScanInterface {
    awayStartSeconds: number | null;
    cumulativeTime: number;
    ranges: ChallengeAwayRangeInterface[];
}

const scanEvent = (scan: AwayScanInterface, event: GameTimelineEventInterface, totalTime: number): AwayScanInterface => {
    const cumulativeTime = scan.cumulativeTime + event.ts;
    const { awayStartSeconds, ranges } = scan;

    if (event.kind === TimelineEventKindEnum.Away) {
        return { awayStartSeconds: cumulativeTime, cumulativeTime, ranges };
    }

    if (event.kind === TimelineEventKindEnum.Return && isDefined(awayStartSeconds)) {
        return { awayStartSeconds: null, cumulativeTime, ranges: [...ranges, getRange(awayStartSeconds, cumulativeTime, totalTime)] };
    }

    return { awayStartSeconds, cumulativeTime, ranges };
};

export const getChallengeAwayRanges = (events: GameTimelineEventInterface[], totalTime: number): ChallengeAwayRangeInterface[] => {
    if (!isPositiveNumber(totalTime)) {
        return [];
    }

    const scan = events.reduce<AwayScanInterface>((currentScan, event) => scanEvent(currentScan, event, totalTime), {
        awayStartSeconds: null,
        cumulativeTime: 0,
        ranges: []
    });

    if (isDefined(scan.awayStartSeconds)) {
        return [...scan.ranges, getRange(scan.awayStartSeconds, totalTime, totalTime)];
    }

    return scan.ranges;
};
