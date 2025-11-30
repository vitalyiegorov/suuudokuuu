import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameSelector } from '../store/game.selectors';
import { GameState, gameStateToUrl } from '../store/game.state';

export const useShare = (initialGameState?: GameState) => {
    const currentState = useAppSelector(gameSelector);

    const isChallenge = isDefined(initialGameState);
    const state = isChallenge ? initialGameState : currentState;

    return async () => {
        if (await Sharing.isAvailableAsync()) {
            const shareUrl = `${window.location.origin}/shared?${gameStateToUrl(state, isChallenge)}`;

            await Share.share({ url: shareUrl });
        }
    };
};
