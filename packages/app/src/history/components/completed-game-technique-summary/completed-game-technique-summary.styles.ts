import { StyleSheet } from 'react-native-unistyles';

export const CompletedGameTechniqueSummaryStyles = StyleSheet.create(theme => ({
    help: {
        fontSize: theme.typography.size.xs,
        fontWeight: '700',
        lineHeight: 16,
        textAlign: 'left'
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
        width: '100%'
    }
}));
