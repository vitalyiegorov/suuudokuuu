import { StyleSheet } from 'react-native-unistyles';

export const HistoryMetricStyles = StyleSheet.create(() => ({
    item: {
        flex: 1,
        gap: 3,
        paddingHorizontal: 2
    },
    label: {
        fontSize: 10,
        letterSpacing: 0.9
    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 20
    }
}));
