import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameSelector } from '../../store/game.selectors';
import { gameStateToString } from '../../utils/game-state-to-string.util';

import type { SharedPayloadKindEnum } from '@suuudokuuu/encoder';

export const useShareGameState = (kind: SharedPayloadKindEnum) => {
    const state = useAppSelector(gameSelector);

    return async () => {
        if (await Sharing.isAvailableAsync()) {
            const shareUrl = `${window.location.origin}/shared/${gameStateToString(state, kind)}`;

            await Share.share({ url: shareUrl });
        }
    };
};
