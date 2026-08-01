import { isNotEmptyString } from '@rnw-community/shared';

import type { GameState } from '../../game/store/game.state';

export const isChallengeRecording = (gameState: Pick<GameState, 'challengeState' | 'isChallengeRun'>): boolean =>
    gameState.isChallengeRun && !isNotEmptyString(gameState.challengeState);
