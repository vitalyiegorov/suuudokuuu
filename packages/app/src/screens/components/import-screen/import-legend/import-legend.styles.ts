import { StyleSheet } from 'react-native-unistyles';

export const ImportLegendStyles = StyleSheet.create(theme => ({
    legend: { alignItems: 'center', gap: theme.spacing.md },
    samples: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: theme.spacing.lg, rowGap: theme.spacing.sm },
    line: { color: theme.colors.text.hint, fontSize: theme.typography.size.sm, textAlign: 'center' }
}));
