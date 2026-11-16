import { StyleSheet } from 'react-native-unistyles';

export const ImportCellPadStyles = StyleSheet.create(theme => ({
    label: { textAlign: 'center', color: theme.colors.surface.subtleText, fontSize: theme.typography.size.md, fontWeight: '700' },
    button: {
        flexBasis: '17%',
        flexGrow: 1,
        minWidth: 44,
        paddingHorizontal: 0
    },
    disabled: { opacity: 0.42 },
    pad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        width: '100%'
    }
}));
