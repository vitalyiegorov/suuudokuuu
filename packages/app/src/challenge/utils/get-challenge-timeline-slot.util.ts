export const getChallengeTimelineSlot = (time: number, totalTime: number, tickCount: number): number =>
    Math.min(tickCount - 1, Math.max(0, Math.floor((time / totalTime) * tickCount)));
