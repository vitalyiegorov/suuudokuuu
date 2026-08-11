import { StyleSheet } from 'react-native-unistyles';

const TrackHeight = 48;

export const HistoryRatingBandSegmentStyles = StyleSheet.create(() => ({
    count: {
        fontSize: 11,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        height: 14,
        textAlign: 'center'
    },
    fill: {
        borderRadius: 4,
        width: '100%'
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
        flex: 1,
        gap: 2
    },
    track: {
        alignItems: 'center',
        height: TrackHeight,
        justifyContent: 'flex-end',
        width: '55%'
    }
}));
