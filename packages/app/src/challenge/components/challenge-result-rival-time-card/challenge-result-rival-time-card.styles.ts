import { StyleSheet } from 'react-native';

export const ChallengeResultRivalTimeCardStyles = StyleSheet.create({
    card: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
        width: '100%'
    },
    iconWrap: {
        alignItems: 'center',
        borderRadius: 14,
        height: 44,
        justifyContent: 'center',
        width: 44
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    textColumn: {
        flex: 1,
        gap: 4
    },
    value: {
        fontFamily: 'Inter_700Bold',
        fontSize: 34,
        fontVariant: ['tabular-nums'],
        letterSpacing: -1
    }
});
