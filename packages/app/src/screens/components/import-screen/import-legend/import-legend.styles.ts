import { StyleSheet } from 'react-native-unistyles';

export const ImportLegendStyles = StyleSheet.create(theme => ({
    legend: {
        alignItems: 'center',
        columnGap: theme.spacing.lg,
        flexDirection: 'row',
        flexShrink: 0,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: theme.spacing.sm,
        rowGap: theme.spacing.xs
    }
}));
