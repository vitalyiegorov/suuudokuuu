import { StyleSheet } from 'react-native-unistyles';

export const PauseScreenStatsStyles = StyleSheet.create(() => ({
    item: {
        flex: 1,
        gap: 3
    },
    label: {
        fontSize: 9,
        letterSpacing: 0.9,
        lineHeight: 11,
        opacity: 0.55,
        textTransform: 'uppercase'
    },
    separator: {
        height: 28,
        marginHorizontal: 1
    },
    strip: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 6,
        width: '100%'
    },
    value: {
        fontSize: 19,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        letterSpacing: -0.2,
        lineHeight: 22
    }
}));
