import type { GameTimelineEventInterface } from '../interface/game-timeline-event.interface';

const TimelineTimestampBits = 16;
const MaxTimelineTimestamp = 2 ** TimelineTimestampBits - 1;

export const getTimelineTimestampDelta = (events: GameTimelineEventInterface[], elapsedTime: number): number => {
    const cumulativeTime = events.reduce((total, event) => total + event.ts, 0);

    return Math.min(Math.max(elapsedTime - cumulativeTime, 0), MaxTimelineTimestamp);
};
