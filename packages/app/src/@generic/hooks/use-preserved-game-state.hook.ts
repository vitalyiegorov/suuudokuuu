import { useRef } from 'react';

import { useAppSelector } from './use-app-selector.hook';

import type { GameState } from '../../game/store/game.state';

export const usePreservedGameState = () => {
    const currentGameState = useAppSelector(({ game }) => game);
    const preservedGameState = useRef<GameState>(currentGameState);

    const { current } = preservedGameState;

    // eslint-disable-next-line react-hooks/refs
    return current;
};
