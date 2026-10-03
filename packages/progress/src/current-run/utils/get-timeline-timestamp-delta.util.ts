import type { CurrentRunType } from '../type/current-run.type';

const TimelineTimestampBits = 16;
const MaxTimelineTimestamp = 2 ** TimelineTimestampBits - 1;

export const getTimelineTimestampDelta = (run: CurrentRunType): number => {
    const cumulativeTime = run.timelineEvents.reduce((total, event) => total + event.ts, 0);

    return Math.min(Math.max(run.elapsedTime - cumulativeTime, 0), MaxTimelineTimestamp);
};
