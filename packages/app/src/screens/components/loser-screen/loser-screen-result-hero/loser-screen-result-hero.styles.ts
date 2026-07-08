import { StyleSheet } from 'react-native';

export const LoserScreenResultHeroStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 14,
        width: '100%'
    },
    detailsPill: {
        borderCurve: 'continuous',
        borderRadius: 999,
        maxWidth: '100%',
        paddingHorizontal: 18,
        paddingVertical: 8
    },
    detailsText: {
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
    iconTile: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: 26,
        height: 96,
        justifyContent: 'center',
        width: 96
    },
    percent: {
        fontSize: 72,
        fontWeight: '900',
        lineHeight: 78,
        textAlign: 'center'
    },
    reasonPill: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: 999,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    reasonText: {
        fontSize: 15,
        fontWeight: '900',
        lineHeight: 20
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        lineHeight: 39,
        textAlign: 'center'
    }
});
