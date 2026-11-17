import { StyleSheet } from 'react-native-unistyles';

export const ImportControlsStyles = StyleSheet.create(theme => ({
    controls: { width: '100%' },
    keys: { gap: theme.spacing.sm },
    legend: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: theme.spacing.sm }
}));
