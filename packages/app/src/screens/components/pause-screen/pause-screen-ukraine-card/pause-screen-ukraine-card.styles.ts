import { StyleSheet } from 'react-native-unistyles';

export const PauseScreenUkraineCardStyles = StyleSheet.create(theme => ({
    button: {
        marginTop: 14,
        width: '100%'
    },
    buttonText: {
        fontSize: 17,
        lineHeight: 22
    },
    container: {
        width: '100%'
    },
    description: {
        fontSize: theme.typography.size.sm,
        fontWeight: '700',
        lineHeight: 20,
        marginTop: theme.spacing.md
    },
    flag: {
        marginLeft: 0,
        marginRight: 10
    },
    title: {
        flexShrink: 1,
        fontSize: 17,
        fontWeight: '900',
        lineHeight: 22
    },
    titleRow: {
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%'
    }
}));
