import { StyleSheet } from 'react-native-unistyles';

export const LoserScreenResultHeroStyles = StyleSheet.create(theme => ({
    reasonPill: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.pill,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: theme.spacing.sm,
        paddingHorizontal: 16,
        paddingVertical: theme.spacing.sm
    },
    reasonText: {
        fontSize: 15,
        fontWeight: '900',
        lineHeight: 20
    }
}));
