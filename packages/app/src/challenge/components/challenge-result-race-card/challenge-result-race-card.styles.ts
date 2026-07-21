import { StyleSheet } from 'react-native';

export const ChallengeResultRaceCardStyles = StyleSheet.create({
    avatar: {
        alignItems: 'center',
        borderRadius: 20,
        height: 40,
        justifyContent: 'center',
        marginBottom: 9,
        width: 40
    },
    caption: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        marginTop: -8,
        paddingBottom: 14,
        textAlign: 'center'
    },
    card: {
        borderCurve: 'continuous',
        borderRadius: 22,
        overflow: 'hidden',
        position: 'relative',
        width: '100%'
    },
    fill: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 0
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 10,
        letterSpacing: 0.7,
        textTransform: 'uppercase'
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 14,
        paddingVertical: 18
    },
    side: {
        alignItems: 'center',
        flex: 1,
        gap: 2
    },
    time: {
        fontFamily: 'Inter_700Bold',
        fontSize: 24,
        fontVariant: ['tabular-nums'],
        letterSpacing: -0.6,
        marginTop: 2
    },
    versusBadge: {
        alignItems: 'center',
        borderRadius: 17,
        height: 34,
        justifyContent: 'center',
        marginHorizontal: 6,
        width: 34
    },
    versusText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 12
    }
});
