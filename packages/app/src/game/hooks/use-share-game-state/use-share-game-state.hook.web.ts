import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

import { gameStateToString } from '../../utils/game-state-to-string.util';

import type { GameState } from '../../store/game.state';
import type { SharedPayloadKindEnum } from '@suuudokuuu/encoder';

export const useShareGameState = (kind: SharedPayloadKindEnum, gameState: GameState) => async () => {
    if (await Sharing.isAvailableAsync()) {
        const shareUrl = `${window.location.origin}/shared/${gameStateToString(gameState, kind)}`;

        await Share.share({ url: shareUrl });
    }
};
