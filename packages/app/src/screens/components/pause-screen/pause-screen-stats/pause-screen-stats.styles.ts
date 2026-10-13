import { StyleSheet } from 'react-native-unistyles';

export const PauseScreenStatsStyles = StyleSheet.create(() => ({
    item: {
        flex: 1,
        gap: 3
    },
    label: {
        fontSize: 9,
        letterSpacing: 0.9,
        lineHeight: 11
    },
    separator: {
        marginHorizontal: 1
    },
    strip: {
        paddingHorizontal: 0,
        paddingVertical: 6,
        width: '100%'
    },
    value: {
        fontSize: 19,
        lineHeight: 22
    }
}));
