import { StyleSheet } from 'react-native-unistyles';

export const DailyNextPuzzleBarStyles = StyleSheet.create(theme => ({
    countdown: {
        fontSize: 15,
        fontVariant: ['tabular-nums'],
        fontWeight: '600',
        lineHeight: 18,
        textAlign: 'left'
    },
    root: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 10,
        minHeight: 56,
        paddingStart: 18,
        paddingEnd: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        width: '100%'
    },
    texts: {
        flex: 1,
        gap: 1
    },
    tomorrow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6
    },
    tomorrowText: {
        fontSize: 12.5,
        fontWeight: '500',
        lineHeight: 15,
        textAlign: 'left'
    }
}));
