import { StyleSheet } from 'react-native-unistyles';

export const ImportCellPadStyles = StyleSheet.create(theme => ({
    button: {
        flexBasis: 0,
        flexGrow: 1,
        minWidth: 0,
        paddingHorizontal: 0
    },
    pad: {
        flexDirection: 'row',
        gap: theme.spacing.xs,
        width: '100%'
    }
}));
