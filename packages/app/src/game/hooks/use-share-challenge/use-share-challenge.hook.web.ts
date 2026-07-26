import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

import { GameState } from '../../store/game.state';
import { gameStateToString } from '../../utils/game-state-to-string.util';

export const useShareChallenge = (gameState: GameState) => async () => {
    if (await Sharing.isAvailableAsync()) {
        await Share.share({ url: `${window.location.origin}/shared/${gameStateToString(gameState, SharedPayloadKindEnum.Challenge)}` });
    }
};
