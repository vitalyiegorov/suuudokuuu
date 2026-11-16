import { StyleSheet } from 'react-native-unistyles';

export const ImportEntryKindStyles = StyleSheet.create(theme => ({
    group: { flexDirection: 'row', gap: theme.spacing.sm, width: '100%' },
    disabled: { opacity: 0.42 }
}));
