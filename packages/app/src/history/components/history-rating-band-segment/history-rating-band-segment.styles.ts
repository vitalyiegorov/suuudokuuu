import { StyleSheet } from 'react-native-unistyles';

const BarBlockHeight = 64;

export const HistoryRatingBandSegmentStyles = StyleSheet.create(() => ({
    bar: {
        borderRadius: 3,
        width: 22
    },
    barBlock: {
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2,
        height: BarBlockHeight,
        justifyContent: 'flex-end',
        width: '100%'
    },
    count: {
        fontSize: 11,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        textAlign: 'center'
    },
    label: {
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.4,
        marginTop: 6,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    segment: {
        alignItems: 'center',
        flex: 1
    }
}));
