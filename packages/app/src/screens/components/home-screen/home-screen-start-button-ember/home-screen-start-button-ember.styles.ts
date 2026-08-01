import { StyleSheet } from 'react-native-unistyles';

import {
    HomeScreenStartButtonEmberGlowRestOpacity,
    HomeScreenStartButtonEmberSheenWidthRatio
} from './constant/home-screen-start-button-ember.constant';

export const HomeScreenStartButtonEmberStyles = StyleSheet.create(theme => ({
    emberButton: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.ink,
        borderWidth: 2
    },
    emberFill: {
        borderRadius: 999,
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },
    emberGlow: {
        elevation: 12,
        shadowColor: theme.colors.danger,
        shadowOffset: { height: 4, width: 0 },
        shadowRadius: 10
    },
    emberSheen: {
        bottom: 0,
        position: 'absolute',
        top: 0,
        width: `${HomeScreenStartButtonEmberSheenWidthRatio * 100}%`
    },
    emberStaticGlow: {
        shadowOpacity: HomeScreenStartButtonEmberGlowRestOpacity
    },
    emberSurface: {
        borderRadius: 999,
        bottom: 0,
        left: 0,
        overflow: 'hidden',
        position: 'absolute',
        right: 0,
        top: 0
    },
    emberWrapper: {
        borderRadius: 999,
        width: '100%'
    }
}));
