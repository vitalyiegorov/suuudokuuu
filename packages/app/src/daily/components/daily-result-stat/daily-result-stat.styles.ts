import { StyleSheet } from 'react-native-unistyles';

export const DailyResultStatStyles = StyleSheet.create(() => ({
    label: {
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 14,
        textAlign: 'left'
    },
    root: {
        flex: 1,
        gap: 3
    },
    value: {
        fontSize: 24,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        letterSpacing: -0.6,
        lineHeight: 28,
        textAlign: 'left'
    }
}));
