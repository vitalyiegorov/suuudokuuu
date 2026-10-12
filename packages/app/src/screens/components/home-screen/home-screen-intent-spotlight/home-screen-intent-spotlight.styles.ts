import { StyleSheet } from 'react-native-unistyles';

const StaticStyles = {
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
    },
    chips: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6
    }
} as const;

export const HomeScreenIntentSpotlightStyles = StyleSheet.create(theme => ({
    ...StaticStyles,
    glyph: {
        alignItems: 'center',
        backgroundColor: theme.colors.accent,
        borderRadius: 10,
        height: 32,
        justifyContent: 'center',
        width: 32
    },
    body: {
        color: theme.colors.text.hint,
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'left'
    },
    card: {
        backgroundColor: theme.colors.surface.raised,
        borderColor: theme.colors.surface.border,
        borderCurve: 'continuous',
        borderRadius: 20,
        borderWidth: 1,
        gap: 8,
        padding: 14,
        width: '100%'
    },
    chip: {
        backgroundColor: theme.colors.surface.group,
        borderColor: theme.colors.surface.border,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4
    },
    chipLabel: {
        color: theme.colors.text.primary,
        fontSize: 11,
        fontWeight: '700',
        lineHeight: 15
    },
    dismiss: {
        alignItems: 'center',
        borderRadius: theme.radius.pill,
        height: 44,
        justifyContent: 'center',
        marginEnd: -8,
        marginVertical: -6,
        width: 44,
        _web: {
            cursor: 'pointer',
            _hover: { backgroundColor: theme.colors.surface.group }
        }
    },
    link: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        gap: 4,
        minHeight: 32,
        _web: {
            cursor: 'pointer',
            _hover: { opacity: 0.75 }
        }
    },
    linkLabel: {
        color: theme.colors.text.primary,
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 17,
        textAlign: 'left'
    },
    title: {
        color: theme.colors.text.primary,
        flex: 1,
        fontSize: 17,
        fontWeight: '800',
        lineHeight: 22,
        textAlign: 'left'
    }
}));
