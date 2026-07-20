import { StyleSheet } from 'react-native';

export const LoserScreenResultHeroStyles = StyleSheet.create({
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
    }
});
