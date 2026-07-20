import { ChallengeResult } from '../interfaces/challenge-result.interface';

import type { ChallengeResult as ChallengeResultType } from '../interfaces/challenge-result.interface';

export const getChallengeResult = (playerTimeInSeconds: number, opponentTimeInSeconds: number): ChallengeResultType => {
    if (playerTimeInSeconds < opponentTimeInSeconds) {
        return ChallengeResult.Won;
    }

    if (playerTimeInSeconds > opponentTimeInSeconds) {
        return ChallengeResult.Lost;
    }

    return ChallengeResult.Tied;
};
