import { StyleSheet } from 'react-native';

export const GameResultHeroStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 14,
        width: '100%'
    },
    descriptorPill: {
        backgroundColor: 'transparent',
        borderCurve: 'continuous',
        borderRadius: 999,
        borderWidth: 1,
        maxWidth: '100%',
        paddingHorizontal: 18,
        paddingVertical: 8
    },
    descriptorRow: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        maxWidth: '100%'
    },
    descriptorText: {
        fontSize: 15,
        fontWeight: '900',
        lineHeight: 20,
        textAlign: 'center'
    },
    eyebrow: {
        fontSize: 14,
        fontWeight: '900',
        lineHeight: 18,
        marginTop: 8,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        lineHeight: 39,
        textAlign: 'center'
    },
    value: {
        fontSize: 72,
        fontVariant: ['tabular-nums'],
        fontWeight: '900',
        lineHeight: 78,
        textAlign: 'center'
    }
});
