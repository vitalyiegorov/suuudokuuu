import { StyleSheet } from 'react-native-unistyles';

export const LoserScreenUkraineCardStyles = StyleSheet.create(theme => ({
    button: {
        flexShrink: 0
    },
    container: {
        width: '100%'
    },
    content: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 14
    },
    description: {
        fontSize: theme.typography.size.sm,
        fontWeight: '800',
        lineHeight: 19,
        marginTop: 2
    },
    flag: {
        flexShrink: 0
    },
    textColumn: {
        flex: 1
    },
    title: {
        fontSize: 18,
        fontWeight: '900',
        lineHeight: 24
    }
}));
