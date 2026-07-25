import { StyleSheet } from 'react-native';

export const ChallengeResultRivalTimeCardStyles = StyleSheet.create({
    card: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        paddingVertical: 8,
        width: '100%'
    },
    iconWrap: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: 16,
        height: 52,
        justifyContent: 'center',
        width: 52
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
        fontSize: 44,
        fontVariant: ['tabular-nums'],
        letterSpacing: -1.4
    }
});
