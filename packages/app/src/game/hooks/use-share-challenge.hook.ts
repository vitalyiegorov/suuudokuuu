import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

import { usePreservedGameState } from '../../@generic/hooks/use-preserved-game-state.hook';
import { gameStateToUrl } from '../store/game.state';

export const useShareChallenge = () => {
    const state = usePreservedGameState();

    return async () => {
        if (await Sharing.isAvailableAsync()) {
            const shareUrl = `${window.location.origin}/shared?${gameStateToUrl(state, true)}`;

            await Share.share({ url: shareUrl });
        }
    };
};
