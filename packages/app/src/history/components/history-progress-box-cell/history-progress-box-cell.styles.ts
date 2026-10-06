import { StyleSheet } from 'react-native-unistyles';

export const HistoryProgressBoxCellStyles = StyleSheet.create(theme => ({
    bottomLine: {
        borderBottomColor: theme.colors.surface.border,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    cell: {
        flexBasis: '30%',
        flexGrow: 1,
        height: 74,
        justifyContent: 'space-between',
        paddingBottom: 10,
        paddingHorizontal: 12,
        paddingTop: 11
    },
    label: {
        color: theme.colors.text.hint,
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 15,
        textAlign: 'left'
    },
    rightLine: {
        borderRightColor: theme.colors.surface.border,
        borderRightWidth: StyleSheet.hairlineWidth
    },
    selectedCell: {
        backgroundColor: theme.colors.ink
    },
    selectedLabel: {
        color: theme.colors.inkText,
        opacity: 0.6
    },
    selectedValue: {
        color: theme.colors.inkText
    },
    value: {
        color: theme.colors.text.primary,
        fontSize: 26,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        letterSpacing: -0.8,
        lineHeight: 30,
        textAlign: 'left'
    }
}));
