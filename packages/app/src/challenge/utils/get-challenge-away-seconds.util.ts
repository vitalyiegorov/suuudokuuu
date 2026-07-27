import type { ChallengeAwayRangeInterface } from '../interfaces/challenge-away-range.interface';

export const getChallengeAwaySeconds = (ranges: ChallengeAwayRangeInterface[]): number =>
    ranges.reduce((total, range) => total + range.durationSeconds, 0);
