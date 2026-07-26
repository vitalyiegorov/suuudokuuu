import { StyleSheet } from 'react-native-unistyles';

export const PauseScreenProgressCardStyles = StyleSheet.create(theme => ({
    board: {
        alignSelf: 'center',
        flexShrink: 0
    },
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md,
        minHeight: 112
    },
    content: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        lineHeight: 15,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    meta: {
        fontSize: 12.5,
        fontWeight: '700',
        lineHeight: 16,
        marginTop: 7,
        textAlign: 'center'
    },
    progress: {
        marginTop: 10,
        width: '100%'
    },
    value: {
        fontSize: 34,
        fontVariant: ['tabular-nums'],
        fontWeight: '900',
        letterSpacing: -1,
        lineHeight: 38,
        marginTop: 3,
        textAlign: 'center'
    }
}));
