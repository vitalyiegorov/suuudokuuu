import { StyleSheet } from 'react-native';

export const HistoryMetricStyles = StyleSheet.create({
    container: {
        borderRadius: 14,
        borderWidth: StyleSheet.hairlineWidth,
        flex: 1,
        gap: 2,
        minHeight: 58,
        paddingHorizontal: 12,
        paddingVertical: 9
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        lineHeight: 15,
        textAlign: 'left'
    },
    value: {
        fontSize: 18,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        lineHeight: 22,
        textAlign: 'left'
    }
});
