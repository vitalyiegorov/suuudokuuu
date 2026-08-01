import { StyleSheet } from 'react-native-unistyles';

import { HomeScreenStartButtonEmberGlowRestOpacity } from './constant/home-screen-start-button-ember.constant';

export const HomeScreenStartButtonEmberStyles = StyleSheet.create(theme => ({
    emberButton: {
        borderColor: theme.colors.ink,
        borderWidth: 2
    },
    emberGlow: {
        elevation: 10,
        shadowColor: theme.colors.danger,
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 16
    },
    emberStaticGlow: {
        shadowOpacity: HomeScreenStartButtonEmberGlowRestOpacity
    },
    emberWrapper: {
        borderRadius: 999,
        width: '100%'
    }
}));
