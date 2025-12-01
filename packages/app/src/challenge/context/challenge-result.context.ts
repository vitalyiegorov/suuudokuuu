import { createContext } from 'react';

import { initialGameState } from '../../game/store/game.state';

import type { GameState } from '../../game/store/game.state';

export const ChallengeResultContext = createContext<GameState>(initialGameState);
