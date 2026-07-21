import { StyleSheet } from 'react-native';

export const ChallengeResultMarginCardStyles = StyleSheet.create({
    card: {
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
    value: {
        fontFamily: 'Inter_700Bold',
        fontSize: 22,
        letterSpacing: -0.6
    }
});
