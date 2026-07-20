import { StyleSheet } from 'react-native';

export const ChallengeResultRaceCardStyles = StyleSheet.create({
    container: {
        gap: 8,
        width: '100%'
    },
    finishLine: {
        borderTopWidth: 1,
        marginTop: 0,
        width: '100%'
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        letterSpacing: 1.2,
        opacity: 0.68,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    time: {
        fontFamily: 'Inter_700Bold',
        fontSize: 20,
        fontVariant: ['tabular-nums'],
        letterSpacing: -0.6,
        lineHeight: 24,
        marginTop: 0,
        textAlign: 'center'
    },
    timeColumn: {
        flex: 1,
        gap: 2
    },
    timesRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%'
    }
});
