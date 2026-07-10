import { StyleSheet } from 'react-native-unistyles';

export const HistorySegmentedControlStyles = StyleSheet.create(theme => ({
    container: {
        borderRadius: 18,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: theme.spacing.xs,
        padding: theme.spacing.xs,
        width: '100%'
    },
    label: {
        fontSize: theme.typography.size.sm,
        fontWeight: '800',
        lineHeight: 18,
        textAlign: 'center'
    },
    tab: {
        alignItems: 'center',
        borderRadius: 14,
        flex: 1,
        justifyContent: 'center',
        minHeight: 42,
        paddingHorizontal: theme.spacing.md
    }
}));
