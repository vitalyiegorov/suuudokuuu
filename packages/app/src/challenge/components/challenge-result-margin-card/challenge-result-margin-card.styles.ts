import { StyleSheet } from 'react-native';

export const ChallengeResultMarginCardStyles = StyleSheet.create({
    caption: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12.5,
        marginTop: 2
    },
    card: {
        gap: 12,
        width: '100%'
    },
    divider: {
        height: 1,
        opacity: 0.35,
        width: '100%'
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
        width: '100%'
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    textColumn: {
        flex: 1,
        gap: 3
    },
    timeLabel: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    timeSide: {
        gap: 2
    },
    timeSideEnd: {
        alignItems: 'flex-end',
        gap: 2
    },
    timesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    timeValue: {
        fontFamily: 'Inter_700Bold',
        fontSize: 20,
        fontVariant: ['tabular-nums'],
        letterSpacing: -0.5
    },
    value: {
        fontFamily: 'Inter_700Bold',
        fontSize: 22,
        letterSpacing: -0.6
    }
});
