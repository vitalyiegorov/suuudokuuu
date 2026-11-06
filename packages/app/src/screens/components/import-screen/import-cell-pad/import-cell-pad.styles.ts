import { StyleSheet } from 'react-native-unistyles';

export const ImportCellPadStyles = StyleSheet.create(theme => ({
    wrapper: { width: '100%' },
    button: {
        flexBasis: 0,
        flexGrow: 1,
        minWidth: 32,
        paddingHorizontal: 0
    },
    pad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
        width: '100%'
    }
}));
