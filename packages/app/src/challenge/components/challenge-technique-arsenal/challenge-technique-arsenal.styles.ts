import { StyleSheet } from 'react-native';

export const ChallengeTechniqueArsenalStyles = StyleSheet.create({
    card: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: 18,
        borderWidth: 1.5,
        flex: 1,
        gap: 10,
        overflow: 'hidden',
        paddingBottom: 12,
        paddingHorizontal: 8,
        paddingTop: 16,
        position: 'relative'
    },
    count: {
        borderRadius: 999,
        fontFamily: 'Inter_700Bold',
        fontSize: 10,
        lineHeight: 14,
        overflow: 'hidden',
        paddingHorizontal: 6,
        paddingVertical: 2,
        position: 'absolute',
        right: 8,
        top: 7
    },
    glyphBox: {
        alignItems: 'center',
        borderRadius: 12,
        height: 42,
        justifyContent: 'center',
        width: 42
    },
    grid: {
        gap: 9,
        width: '100%'
    },
    name: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        letterSpacing: -0.1,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        gap: 9
    },
    spacer: {
        flex: 1
    }
});
