import { StyleSheet } from 'react-native-unistyles';

export const PauseScreenHeaderStyles = StyleSheet.create(theme => ({
    chip: {
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: theme.radius.pill,
        maxWidth: '100%',
        paddingHorizontal: 14,
        paddingVertical: 7
    },
    chipText: {
        fontSize: 12.5,
        fontWeight: '700',
        textAlign: 'center'
    },
    header: {
        alignItems: 'center',
        gap: theme.spacing.md,
        width: '100%'
    },
    medallion: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: 22,
        height: 72,
        justifyContent: 'center',
        width: 72
    },
    title: {
        fontSize: theme.typography.size.xxl,
        fontWeight: '900',
        letterSpacing: -0.8,
        lineHeight: 34,
        textAlign: 'center'
    }
}));
