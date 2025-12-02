import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

import { GameState } from '../../store/game.state';
import { gameStateToString } from '../../utils/game-state-to-string.util';

export const useShareChallenge = (state: GameState) => async () => {
    if (await Sharing.isAvailableAsync()) {
        await Share.share({ url: `${window.location.origin}/shared/${gameStateToString(state, true)}` });
    }
};
