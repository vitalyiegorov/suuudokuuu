import { StyleSheet } from 'react-native-unistyles';

export const DailyRecentSolveResultStyles = StyleSheet.create(() => ({
    points: {
        fontSize: 12.5,
        fontVariant: ['tabular-nums'],
        fontWeight: '500',
        lineHeight: 15,
        textAlign: 'right'
    },
    root: {
        alignItems: 'flex-end',
        gap: 2
    },
    time: {
        fontSize: 15.5,
        fontVariant: ['tabular-nums'],
        fontWeight: '700',
        lineHeight: 19,
        textAlign: 'right'
    }
}));
