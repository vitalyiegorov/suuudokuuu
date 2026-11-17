import { StyleSheet } from 'react-native-unistyles';

export const ImportControlsStyles = StyleSheet.create(theme => ({
    controls: { width: '100%', flexGrow: 1, justifyContent: 'flex-end' },
    keys: { width: '100%', paddingBottom: theme.spacing.xs }
}));
