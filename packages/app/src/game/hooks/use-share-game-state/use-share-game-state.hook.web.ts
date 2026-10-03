import { gameStateToString } from '@suuudokuuu/progress';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

import type { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import type { CurrentRunType } from '@suuudokuuu/progress';

export const useShareGameState = (kind: SharedPayloadKindEnum, gameState: CurrentRunType) => async () => {
    if (await Sharing.isAvailableAsync()) {
        const shareUrl = `${window.location.origin}/shared/${gameStateToString(gameState, kind)}`;

        await Share.share({ url: shareUrl });
    }
};
