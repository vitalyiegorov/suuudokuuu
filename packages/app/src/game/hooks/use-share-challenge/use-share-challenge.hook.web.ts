import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import { gameStateToString } from '@suuudokuuu/progress';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

import type { CurrentRunType } from '@suuudokuuu/progress';

export const useShareChallenge = (gameState: CurrentRunType) => async () => {
    if (await Sharing.isAvailableAsync()) {
        await Share.share({ url: `${window.location.origin}/shared/${gameStateToString(gameState, SharedPayloadKindEnum.Challenge)}` });
    }
};
