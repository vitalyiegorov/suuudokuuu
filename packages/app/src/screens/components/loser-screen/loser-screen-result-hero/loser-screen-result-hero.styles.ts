import { StyleSheet } from 'react-native-unistyles';

export const LoserScreenResultHeroStyles = StyleSheet.create(theme => ({
    container: {
        alignItems: 'center',
        gap: 14,
        width: '100%'
    },
    detailsPill: {
        borderCurve: 'continuous',
        borderRadius: theme.radius.pill,
        maxWidth: '100%',
        paddingHorizontal: 18,
        paddingVertical: theme.spacing.sm
    },
    detailsText: {
        fontSize: 15,
        fontWeight: '900',
        lineHeight: 20,
        textAlign: 'center'
    },
    eyebrow: {
        fontSize: theme.typography.size.sm,
        fontWeight: '900',
        lineHeight: 18,
        marginTop: theme.spacing.sm,
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
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        lineHeight: 39,
        textAlign: 'center'
    }
}));
