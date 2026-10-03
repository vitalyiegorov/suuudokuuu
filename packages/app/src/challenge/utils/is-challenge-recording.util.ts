import { isNotEmptyString } from '@rnw-community/shared';

import type { CurrentRunType } from '@suuudokuuu/progress';

export const isChallengeRecording = (gameState: Pick<CurrentRunType, 'challengeState' | 'isChallengeRun'>): boolean =>
    gameState.isChallengeRun && !isNotEmptyString(gameState.challengeState);
