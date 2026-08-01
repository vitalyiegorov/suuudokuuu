import { StyleSheet } from 'react-native';

export const ThemeEditorColorSheetStyles = StyleSheet.create({
    backdrop: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 24 },
    card: { borderRadius: 16, gap: 16, maxWidth: 420, padding: 20, width: '100%' },
    title: { fontSize: 16, fontWeight: '700' },
    picker: { gap: 12 },
    actions: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' }
});
