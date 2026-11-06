import { StyleSheet } from 'react-native-unistyles';

export const ImportCellPadStyles = StyleSheet.create(theme => ({
    label: { textAlign: 'center', color: theme.colors.surface.subtleText, fontSize: theme.typography.size.md, fontWeight: '700' },
    wrapper: { width: '100%', gap: theme.spacing.sm },
    button: {
        flexBasis: '17%',
        flexGrow: 1,
        minWidth: 44,
        paddingHorizontal: 0
    },
    pad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        width: '100%'
    }
}));
