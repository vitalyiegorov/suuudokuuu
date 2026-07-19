import { StyleSheet } from 'react-native';

import { GameResultFooterBottomSpacing } from '../game-result-page/constant/game-result-page.constant';

export const GameResultActionsLayoutStyles = StyleSheet.create({
    actions: {
        alignItems: 'center',
        gap: 10,
        paddingBottom: GameResultFooterBottomSpacing,
        paddingHorizontal: 18,
        paddingTop: 12,
        width: '100%'
    }
});
