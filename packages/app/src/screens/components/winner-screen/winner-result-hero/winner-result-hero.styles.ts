import { StyleSheet } from 'react-native-unistyles';

export const WinnerResultHeroStyles = StyleSheet.create(theme => ({
    personalBestCard: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md
    },
    personalBestText: {
        flexShrink: 1,
        fontSize: 15,
        fontWeight: '900',
        lineHeight: 20
    }
}));
