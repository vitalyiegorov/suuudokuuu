import { StyleSheet } from 'react-native';

export const ChallengeTechniqueArsenalCardStyles = StyleSheet.create({
    column: {
        alignItems: 'center',
        flex: 1,
        gap: 10
    },
    name: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        letterSpacing: -0.1,
        lineHeight: 14,
        minHeight: 28,
        textAlign: 'center'
    },
    tile: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: 16,
        height: 62,
        justifyContent: 'center',
        width: 62
    }
});
