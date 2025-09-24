import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameStateToUrl } from '../store/game.state';

export const useShare = () => {
    const state = useAppSelector(({ game }) => game);

    return async () => {
        if (await Sharing.isAvailableAsync()) {
            await Share.share({ message: `${window.location.origin}/shared?${gameStateToUrl(state)}` });
        }
    };
};
