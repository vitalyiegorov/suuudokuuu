import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

import { usePreservedGameState } from '../../@generic/hooks/use-preserved-game-state.hook';
import { gameStateToChallengeUrl } from '../store/game.state';

export const useShareChallenge = () => {
    const state = usePreservedGameState();

    return async () => {
        if (await Sharing.isAvailableAsync()) {
            await Share.share({ message: `${window.location.origin}/shared?${gameStateToChallengeUrl(state)}` });
        }
    };
};
