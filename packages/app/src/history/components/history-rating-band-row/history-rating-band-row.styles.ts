import { StyleSheet } from 'react-native-unistyles';

export const HistoryRatingBandRowStyles = StyleSheet.create(() => ({
    count: {
        fontSize: 13,
        fontVariant: ['tabular-nums'],
        fontWeight: '700',
        textAlign: 'right',
        width: 28
    },
    fill: {
        borderRadius: 6,
        height: '100%'
    },
    label: {
        fontSize: 13,
        fontVariant: ['tabular-nums'],
        fontWeight: '700',
        width: 68
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        width: '100%'
    },
    track: {
        borderRadius: 6,
        flex: 1,
        height: 12,
        overflow: 'hidden'
    }
}));
