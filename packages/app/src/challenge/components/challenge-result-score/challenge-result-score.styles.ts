import { StyleSheet } from 'react-native';

export const ChallengeResultScoreStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderLeftWidth: 1,
        gap: 1,
        paddingLeft: 14
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 10,
        letterSpacing: 1,
        opacity: 0.68,
        textAlign: 'right',
        textTransform: 'uppercase'
    },
    value: {
        fontFamily: 'Inter_700Bold',
        fontSize: 22,
        fontVariant: ['tabular-nums'],
        letterSpacing: -0.6,
        lineHeight: 25
    }
});
